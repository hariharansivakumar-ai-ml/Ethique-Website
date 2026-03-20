import urllib.request
import urllib.parse
import urllib.error
import json
import base64

# Login to get token
data = json.dumps({"username": "admin", "password": "ponni123"}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/auth/login', data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        resp_data = json.loads(response.read().decode())
        token = resp_data['access_token']
        print("Logged in!")
except Exception as e:
    print("Login error:", e)
    token = None

if token:
    import builtins
    import urllib.request
    
    # We will upload schemas.py as a text file but say it's an image
    file_bytes = b"fake image content"
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"file\"; filename=\"test.png\"\r\n"
        f"Content-Type: image/png\r\n\r\n".encode('utf-8') +
        file_bytes + b"\r\n" +
        f"--{boundary}--\r\n".encode('utf-8')
    )
    
    req = urllib.request.Request('http://localhost:8000/api/admin/upload', data=body, headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Content-Length': str(len(body))
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            print("Upload Success:", response.read().decode())
    except urllib.error.HTTPError as e:
        print("Upload failed HTTPError:", e.code, e.reason)
        print("Error Body:", e.read().decode())
