import json

def generate_ui(app_name):

    ui = {
        "app": app_name,
        "screens": [
            {
                "name": "Home / Hero",
                "components": [
                    "Navigation Menu",
                    "Headline & Subheadline",
                    "Hero Image / Illustration"
                ]
            },
            {
                "name": "Projects Showcase",
                "components": [
                    "Project Filter",
                    "Project Grid",
                    "Project Detail Modal"
                ]
            },
            {
                "name": "About & Skills",
                "components": [
                    "Bio Section",
                    "Skill Tags",
                    "Education Timeline"
                ]
            },
            {
                "name": "Contact",
                "components": [
                    "Contact Form",
                    "Social Links",
                    "Email/Phone Info"
                ]
            }
        ]
    }

    return json.dumps(ui, indent=2)