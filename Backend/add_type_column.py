from Backend.database import engine
from sqlalchemy import text

def run_migration():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE media ADD COLUMN type VARCHAR(10) DEFAULT 'image' NOT NULL;"))
            conn.commit()
            print("Successfully added 'type' column to media table.")
        except Exception as e:
            print(f"Migration error (column might already exist): {e}")

if __name__ == "__main__":
    run_migration()
