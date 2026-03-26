print("MAIN CERTO")

from orchestrator import orchestrator

while True:
    task = input("What do you want to do? ")

    result = orchestrator(task)

    print(result)
    