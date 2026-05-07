import os
import io
from PIL import Image

def convert_to_webp(directory):
    print(f"Scanning directory: {directory}")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                base_name = os.path.splitext(file_path)[0]
                webp_path = f"{base_name}.webp"
                
                try:
                    print(f"Converting: {file}...")
                    with Image.open(file_path) as img:
                        # Convert to RGBA if transparency exists, RGB otherwise
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGBA")
                        else:
                            img = img.convert("RGB")
                            
                        img.save(webp_path, format="WEBP", quality=85, method=6)
                    
                    print(f"Saved: {os.path.basename(webp_path)}")
                    
                    # Delete the original file
                    os.remove(file_path)
                    print(f"Deleted original: {file}")
                    
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

if __name__ == "__main__":
    assets_dir = os.path.join("Frontend", "src", "assets")
    if os.path.exists(assets_dir):
        convert_to_webp(assets_dir)
    else:
        print(f"Directory not found: {assets_dir}")
