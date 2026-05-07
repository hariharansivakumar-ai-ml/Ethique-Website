import sqlite3
import os

def migrate():
    # Identify potential database paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    db_paths = [
        os.path.join(current_dir, "sql_app.db"), # In Backend folder
        os.path.join(os.path.dirname(current_dir), "sql_app.db"), # In Root folder
        "sql_app.db" # Current working directory
    ]
    
    unique_paths = list(set(db_paths))
    
    for path in unique_paths:
        if os.path.exists(path):
            print(f"Examining database at: {path}")
            conn = sqlite3.connect(path)
            cursor = conn.cursor()
            try:
                # Add the 'status' column if it doesn't exist
                cursor.execute("ALTER TABLE subscriptions ADD COLUMN status VARCHAR DEFAULT 'pending'")
                conn.commit()
                print(f"Successfully added 'status' column to {path}")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e).lower():
                    print(f"Column 'status' already exists in {path}")
                else:
                    print(f"Unexpected error migrating {path}: {e}")
            finally:
                conn.close()
        else:
            print(f"Database not found at: {path}")

if __name__ == "__main__":
    migrate()
