import os
FIGMA_TOKEN = os.getenv("FIGMA_TOKEN", "your_figma_token_here")


def create_wireframe(app_name):

    url = "https://api.figma.com/v1/files"

    headers = {
        "X-Figma-Token": FIGMA_TOKEN
    }

    wireframe = {
        "app": app_name,
        "screens": [
            "Login Screen",
            "Home Screen",
            "Profile Screen"
        ]
    }

    return wireframe