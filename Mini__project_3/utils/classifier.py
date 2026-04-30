import re

# ---------- TYPE PATTERNS ----------

network_pattern = re.compile(
    r'\b(TCP|UDP|ICMP|VLAN|switch|firewall|router|latency|packet loss|dns)\b',
    re.I
)

ip_pattern = re.compile(
    r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
)

security_pattern = re.compile(
    r'\b(breach|ransomware|phishing|malware|brute[- ]force|unauthorized|ddos)\b',
    re.I
)

app_pattern = re.compile(
    r'\b(exception|NullPointerException|HTTP[- ]?\d{3}|stack trace|crash|failure)\b',
    re.I
)


# ---------- SEVERITY PATTERNS ----------

critical_pattern = re.compile(
    r'\b(outage|down|breach|ransomware|production|data loss)\b',
    re.I
)

high_pattern = re.compile(
    r'\b(timeout|failing|unavailable|unreachable|error rate)\b',
    re.I
)

medium_pattern = re.compile(
    r'\b(slow|warning|degraded|intermittent|latency)\b',
    re.I
)


# ---------- FUNCTIONS ----------

def detect_type(text):
    text = text.lower()

    if security_pattern.search(text):
        return "security"

    # IP alone is not enough → combine with network keywords
    if network_pattern.search(text) or (
        ip_pattern.search(text) and "ping" in text
    ):
        return "network"

    if app_pattern.search(text):
        return "app"

    return "general"


def detect_severity(text):
    text = text.lower()

    if critical_pattern.search(text):
        return "critical"

    if high_pattern.search(text):
        return "high"

    if medium_pattern.search(text):
        return "medium"

    return "low"