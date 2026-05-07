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
    print(f"Syncing Database: {database_url.split('@')[-1] if '@' in database_url else database_url}")
    
    engine = create_engine(database_url)
    inspector = inspect(engine)
    
    # Define required columns for each table
    required_schema = {
        "events": [
            ("map_url", "TEXT"),
            ("hours", "TEXT"),
            ("address", "TEXT"),
            ("host_name", "TEXT"),
            ("contact_number", "TEXT"),
            ("slug", "TEXT"),
            ("sort_date", "DATE")
        ],
        "blogs": [
            ("image_alt", "TEXT"),
            ("focus_keyword", "TEXT")
        ]
    }
    
    with engine.connect() as conn:
        for table_name, columns in required_schema.items():
            if not inspector.has_table(table_name):
                print(f"Table {table_name} does not exist yet. It will be created on server start.")
                continue
            
            existing_columns = [c["name"] for c in inspector.get_columns(table_name)]
            
            for col_name, col_type in columns:
                if col_name not in existing_columns:
                    print(f"Adding missing column '{col_name}' to table '{table_name}'...")
                    try:
                        # PostgreSQL and SQLite share this ALTER TABLE syntax
                        conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}"))
                        conn.commit()
                        print(f"Successfully added '{col_name}'.")
                    except Exception as e:
                        print(f"Failed to add '{col_name}': {e}")
                else:
                    print(f"Column '{col_name}' already exists in table '{table_name}'.")

    print("\nDatabase sync complete!")

if __name__ == "__main__":
    sync_db()
