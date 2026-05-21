import sys
import os
import uvicorn

if __name__ == "__main__":
    # Ensure the parent directory and Backend directory are in sys.path
    base_dir = os.path.abspath(os.path.dirname(__file__))
    sys.path.insert(0, base_dir)
    sys.path.insert(0, os.path.join(base_dir, "Backend"))
    uvicorn.run("Backend.main:app", host="127.0.0.1", port=8000, reload=True)
 