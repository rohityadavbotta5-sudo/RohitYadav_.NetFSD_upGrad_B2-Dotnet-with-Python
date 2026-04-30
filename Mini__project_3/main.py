import json
from models.incident import Incident
from utils.classifier import detect_type, detect_severity
from services import jira, servicenow, azure_boards
from models.report import ReportGenerator


def load_data():
    try:
        with open("data/incidents.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return []


def process():
    data = load_data()

    if not data:
        print("⚠ No data found. Exiting.")
        return

    incidents = []

    for inc in data:
        try:
            incident = Incident(
                inc["id"],
                inc["title"],
                inc["description"],
                inc["reported_by"],
                inc["timestamp"],
                inc["assigned_team"]
            )

            # -------- Classification --------
            text = f"{incident.title} {incident.description}".lower()

            incident.set_severity(detect_severity(text))
            incident.type = detect_type(text)

            print(f"\n▶ {incident.id} → {incident.type} | {incident.severity}")

            # -------- Jira --------
            try:
                ticket = jira.create_ticket(incident)
                incident.ticket_ids["jira"] = ticket
                print(f"✅ Jira ticket: {ticket}")
            except Exception as e:
                print(f"❌ Jira failed for {incident.id}: {e}")
                incident.ticket_ids["jira"] = "FAILED"

            # -------- ServiceNow --------
            try:
                ticket = servicenow.create_ticket(incident)
                incident.ticket_ids["snow"] = ticket
                print(f"✅ ServiceNow ticket: {ticket}")
            except Exception as e:
                print(f"❌ ServiceNow failed for {incident.id}: {e}")
                incident.ticket_ids["snow"] = "FAILED"

            # -------- Azure Boards --------
            try:
                ticket = azure_boards.create_ticket(incident)
                incident.ticket_ids["azure"] = ticket
                print(f"✅ Azure ticket: {ticket}")
            except Exception as e:
                print(f"❌ Azure failed for {incident.id}: {e}")
                incident.ticket_ids["azure"] = "FAILED"

            incidents.append(incident)

        except Exception as e:
            print(f"❌ Error processing record: {e}")

    if not incidents:
        print("⚠ No incidents processed.")
        return

    # -------- Generate Report --------
    try:
        report = ReportGenerator()
        report.generate_html(incidents)
        print("\n✅ Report generated: output/report.html")
    except Exception as e:
        print(f"❌ Report generation failed: {e}")


if __name__ == "__main__":
    process()