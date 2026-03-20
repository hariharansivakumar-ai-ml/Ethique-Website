import psycopg2
try:
    conn = psycopg2.connect("dbname='blogdb' user='postgres' host='localhost' password='password'")
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
