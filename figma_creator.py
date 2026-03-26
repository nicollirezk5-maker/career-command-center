import requests

$env:FIGMA_TOKEN="figd_pBgRsH8wVwWLkO7g3KGnH567mxqo059tPNlsvjW2I"

headers = {
    "X-Figma-Token": FIGMA_TOKEN
}

def get_file(file_key):

    url = f"https://api.figma.com/v1/files/{file_key}"

    response = requests.get(url, headers=headers)

    return response.json()