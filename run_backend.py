import sys
import os
import uvicorn

if __name__ == "__main__":
    # Ensure the parent directory is in sys.path
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    uvicorn.run("Backend.main:app", host="127.0.0.1", port=8000, reload=True)
 