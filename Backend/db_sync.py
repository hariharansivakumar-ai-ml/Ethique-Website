import sys
import os
from sqlalchemy import create_engine, inspect, text
from dotenv import load_dotenv

# Load directory for absolute imports
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(CURRENT_DIR)

# Load .env
load_dotenv(os.path.join(CURRENT_DIR, ".env"))

def sync_db():
    database_url = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db")
    if database_url.startswith("sqlite:///"):
        db_path = database_url.replace("sqlite:///", "", 1)
        if not os.path.isabs(db_path) and not db_path.startswith("/"):
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            abs_db_path = os.path.abspath(os.path.join(backend_dir, db_path))
            abs_db_path = abs_db_path.replace("\\", "/")
            database_url = f"sqlite:///{abs_db_path}"
            
    print(f"Syncing Database: {database_url.split('@')[-1] if '@' in database_url else database_url}")
    
    engine = create_engine(database_url)
    
    # Import Base from models to ensure all models are registered
    from models import Base
    
    # First, let create_all handle any brand new tables
    Base.metadata.create_all(bind=engine)
    
    inspector = inspect(engine)
    
    with engine.connect() as conn:
        for table_name, table in Base.metadata.tables.items():
            if not inspector.has_table(table_name):
                # Should not happen as create_all was just called, but just in case
                continue
            
            existing_columns = [c["name"] for c in inspector.get_columns(table_name)]
            
            for column in table.columns:
                col_name = column.name
                if col_name not in existing_columns:
                    # Compile the column type for the specific dialect (PostgreSQL, SQLite, etc.)
                    col_type = column.type.compile(engine.dialect)
                    print(f"Adding missing column '{col_name}' to table '{table_name}'...")
                    try:
                        # Add the column. Note: For SQLite, some constraints can't be added via ALTER TABLE
                        conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                        print(f"Successfully added '{col_name}'.")
                    except Exception as e:
                        print(f"Failed to add '{col_name}': {e}")
                        conn.rollback()

    print("\nDatabase sync complete!")

if __name__ == "__main__":
    sync_db()
