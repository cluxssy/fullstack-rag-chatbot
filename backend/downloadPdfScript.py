import os
import requests


DOWNLOAD_DIR = "data"

URL_FILE = "booksURL.txt"


if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)
    print(f"Created directory: {DOWNLOAD_DIR}")


try:
    with open(URL_FILE, 'r') as f:
        
        urls_to_download = [line.strip() for line in f if line.strip()]
    print(f"Found {len(urls_to_download)} URLs in {URL_FILE}")
except FileNotFoundError:
    print(f"Error: The file '{URL_FILE}' was not found. Please create it and add your URLs.")
    exit()


for url in urls_to_download:
    try:
        
        filename = url.split('/')[-1]
        filepath = os.path.join(DOWNLOAD_DIR, filename)

        print(f"Downloading {filename}...")

        
        response = requests.get(url, stream=True)
        response.raise_for_status()  

        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"Successfully saved to {filepath}")

    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")

print("\nDownload process finished.")