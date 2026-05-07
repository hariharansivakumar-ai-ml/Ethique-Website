import sqlite3

def migrate():
    conn = sqlite3.connect('d:/React/Sri_Ponni/Backend/sql_app.db')
    cursor = conn.cursor()
    
    columns_to_add = [
        ('map_url', 'TEXT'),
        ('hours', 'TEXT'),
        ('address', 'TEXT'),
        ('host_name', 'TEXT')
    ]
    
    for col_name, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE events ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError:
            print(f"Column {col_name} already exists or error occurred")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
