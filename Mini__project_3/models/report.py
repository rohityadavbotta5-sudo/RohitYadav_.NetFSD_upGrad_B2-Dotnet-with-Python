import os
from collections import Counter


class ReportGenerator:
    def generate_html(self, incidents):

        os.makedirs("output", exist_ok=True)

        # -------- Counters --------
        severity_count = Counter(i.severity for i in incidents)
        type_count = Counter(getattr(i, "type", "general") for i in incidents)

        html = f"""
        <html>
        <head>
            <title>IT Incident Auto-Triage Report</title>

            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background: #f4f6f9;
                    margin: 0;
                }}

                .header {{
                    background: #1f3a5f;
                    color: white;
                    padding: 15px;
                    font-size: 20px;
                    font-weight: bold;
                }}

                .container {{
                    padding: 20px;
                }}

                .summary {{
                    display: flex;
                    gap: 15px;
                    margin-bottom: 20px;
                }}

                .card {{
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    width: 120px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }}

                .card h2 {{
                    margin: 0;
                    color: #1f3a5f;
                }}

                .section {{
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }}

                table {{
                    width: 100%;
                    border-collapse: collapse;
                }}

                th {{
                    background: #1f3a5f;
                    color: white;
                    padding: 10px;
                }}

                td {{
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    text-align: center;
                }}

                tr:nth-child(even) {{
                    background-color: #f2f2f2;
                }}

                /* Severity colors */
                .critical {{ color: red; font-weight: bold; }}
                .high {{ color: orange; font-weight: bold; }}
                .medium {{ color: goldenrod; font-weight: bold; }}
                .low {{ color: green; font-weight: bold; }}

                /* Type tags */
                .tag {{
                    padding: 4px 8px;
                    border-radius: 5px;
                    font-size: 12px;
                    color: white;
                }}

                .network {{ background: #007bff; }}
                .app {{ background: #6f42c1; }}
                .security {{ background: #dc3545; }}
                .general {{ background: #6c757d; }}

                /* Breakdown */
                .breakdown-row {{
                    margin: 8px 0;
                }}

                .label {{
                    font-weight: bold;
                    margin-right: 10px;
                }}

                .badge {{
                    padding: 4px 8px;
                    border-radius: 5px;
                    color: white;
                    font-size: 12px;
                    margin-right: 5px;
                }}

                .footer {{
                    text-align: center;
                    font-size: 12px;
                    color: gray;
                    margin-top: 20px;
                }}
            </style>
        </head>

        <body>

            <div class="header">
                IT Incident Auto-Triage Report
            </div>

            <div class="container">

                <!-- Summary Cards -->
                <div class="summary">
                    <div class="card">
                        <h2>{len(incidents)}</h2>
                        <p>Total</p>
                    </div>
                    <div class="card">
                        <h2>{severity_count.get('critical', 0)}</h2>
                        <p>Critical</p>
                    </div>
                    <div class="card">
                        <h2>{severity_count.get('high', 0)}</h2>
                        <p>High</p>
                    </div>
                    <div class="card">
                        <h2>{severity_count.get('medium', 0)}</h2>
                        <p>Medium</p>
                    </div>
                    <div class="card">
                        <h2>{severity_count.get('low', 0)}</h2>
                        <p>Low</p>
                    </div>
                </div>

                <!-- Breakdown Section -->
                <div class="section">
                    <h3>Breakdown</h3>

                    <div class="breakdown-row">
                        <span class="label">By Type:</span>
                        <span class="badge network">Network: {type_count.get('network', 0)}</span>
                        <span class="badge app">App: {type_count.get('app', 0)}</span>
                        <span class="badge security">Security: {type_count.get('security', 0)}</span>
                        <span class="badge general">General: {type_count.get('general', 0)}</span>
                    </div>

                    <div class="breakdown-row">
                        <span class="label">By Severity:</span>
                        <span class="badge" style="background:red;">Critical: {severity_count.get('critical', 0)}</span>
                        <span class="badge" style="background:orange;">High: {severity_count.get('high', 0)}</span>
                        <span class="badge" style="background:goldenrod;">Medium: {severity_count.get('medium', 0)}</span>
                        <span class="badge" style="background:green;">Low: {severity_count.get('low', 0)}</span>
                    </div>
                </div>

                <!-- Table -->
                <div class="section">
                    <h3>Incident Details</h3>

                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Severity</th>
                            <th>Team</th>
                            <th>Timestamp</th>
                            <th>Jira</th>
                            <th>ServiceNow</th>
                        </tr>
        """

        for i in incidents:
            html += f"""
            <tr>
                <td>{i.id}</td>
                <td>{i.title}</td>
                <td><span class="tag {getattr(i, 'type', 'general')}">{getattr(i, 'type', 'N/A')}</span></td>
                <td class="{i.severity}">{i.severity.upper()}</td>
                <td>{i.assigned_team}</td>
                <td>{i.timestamp}</td>
                <td>{i.ticket_ids.get('jira', 'N/A')}</td>
                <td>{i.ticket_ids.get('snow', 'N/A')}</td>
            </tr>
            """

        html += """
                    </table>
                </div>

                <div class="footer">
                    Generated by Incident Automation System
                </div>

            </div>
        </body>
        </html>
        """

        with open("output/report.html", "w", encoding="utf-8") as f:
            f.write(html)