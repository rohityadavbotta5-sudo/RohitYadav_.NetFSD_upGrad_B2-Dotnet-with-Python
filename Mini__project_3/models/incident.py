from datetime import datetime

SEVERITY_ORDER = {
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 3
}


class Incident:
    def __init__(self, id, title, description, reported_by, timestamp, assigned_team):
        self.id = id
        self.title = title
        self.description = description
        self.reported_by = reported_by
        self.timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        self.assigned_team = assigned_team
        self._severity = None
        self.ticket_ids = {}

    def classify(self):
        raise NotImplementedError("Subclasses must implement classify()")

    def set_severity(self, severity):
        self._severity = severity

    @property
    def severity(self):
        return self._severity

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "severity": self.severity,
            "team": self.assigned_team,
            "tickets": self.ticket_ids
        }

    def __lt__(self, other):
        return SEVERITY_ORDER[self.severity] < SEVERITY_ORDER[other.severity]