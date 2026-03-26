import requests
import os

zip_path = r"c:\Users\loja\Desktop\career-ai\food-delivery\deploy.zip"

with open(zip_path, "rb") as f:
    headers = {"Content-Type": "application/zip"}
    r = requests.post("https://api.netlify.com/api/v1/sites", headers=headers, data=f)

if r.status_code in [200, 201]:
    data = r.json()
    url = data.get("ssl_url", data.get("url", ""))
    name = data.get("name", "")
    site_id = data.get("id", "")
    print(f"DEPLOYED SUCCESSFULLY!")
    print(f"URL: {url}")
    print(f"Name: {name}")
    print(f"Site ID: {site_id}")
else:
    print(f"Error {r.status_code}: {r.text[:500]}")
