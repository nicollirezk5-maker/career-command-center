print("Importing os...")
import os
print("Importing re...")
import re
print("Importing Flask...")
from flask import Flask
print("Importing agents...")
print("  Importing job_agent...")
try:
    from job_agent import job_agent
    print("    job_agent OK")
except Exception as e:
    print(f"    job_agent FAILED: {e}")

print("  Importing figma_agent...")
try:
    from figma_agent import create_wireframe
    print("    figma_agent OK")
except Exception as e:
    print(f"    figma_agent FAILED: {e}")

print("  Importing design_agent...")
try:
    from design_agent import generate_ui
    print("    design_agent OK")
except Exception as e:
    print(f"    design_agent FAILED: {e}")

print("  Importing code_agent...")
try:
    from code_agent import generate_app_code
    print("    code_agent OK")
except Exception as e:
    print(f"    code_agent FAILED: {e}")

print("Importing orchestrator...")
try:
    from orchestrator import orchestrator
    print("orchestrator OK")
except Exception as e:
    print(f"orchestrator FAILED: {e}")

print("All imports finished.")
