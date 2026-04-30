import requests
from config import MOCK_API, SERVICENOW
from utils.decorators import log_call, retry


@log_call
@retry(times=3)
def create_ticket(incident):

    if MOCK_API:
        print("MOCK MODE")
        return "MOCK-SNOW"

    # ✅ FIXED (use correct key: url)
    url = SERVICENOW["url"] + "/api/now/table/incident"

    payload = {
        "short_description": incident.title,
        "description": incident.description,
        "urgency": "1"
    }

    response = requests.post(
        url,
        auth=(SERVICENOW["username"], SERVICENOW["password"]),
        json=payload
    )

    print("🔍 SERVICENOW RESPONSE:", response.status_code, response.text)

    response.raise_for_status()

    data = response.json()
    ticket_id = data["result"]["sys_id"]

    incident.ticket_ids["snow"] = ticket_id
    return ticket_id