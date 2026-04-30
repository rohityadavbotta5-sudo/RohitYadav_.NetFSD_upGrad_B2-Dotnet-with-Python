import requests
import base64
from config import MOCK_API, AZURE
from utils.decorators import log_call, retry


# ✅ FIXED: Always use "Task" (your project supports this)
def map_work_item_type(incident_type):
    return "Task"


@log_call
@retry(times=3)
def create_ticket(incident):

    if MOCK_API:
        print("MOCK MODE")
        return "MOCK-AZURE"

    work_item_type = map_work_item_type(getattr(incident, "type", "general"))

    # ✅ Correct URL (now using Task)
    url = f"https://dev.azure.com/{AZURE['organization']}/{AZURE['project']}/_apis/wit/workitems/${work_item_type}?api-version=7.0"

    # 🔐 PAT authentication (Azure requires base64 with empty username)
    auth = base64.b64encode(f":{AZURE['pat']}".encode()).decode()

    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json-patch+json"
    }

    # ✅ Correct JSON Patch format
    payload = [
        {
            "op": "add",
            "path": "/fields/System.Title",
            "value": incident.title
        },
        {
            "op": "add",
            "path": "/fields/System.Description",
            "value": incident.description
        },
        {
            "op": "add",
            "path": "/fields/System.Tags",
            "value": incident.type or "general"
        }
    ]

    response = requests.post(url, headers=headers, json=payload)

    print("🔍 AZURE RESPONSE:", response.status_code, response.text)

    response.raise_for_status()

    data = response.json()
    ticket_id = data["id"]

    incident.ticket_ids["azure"] = ticket_id

    return ticket_id