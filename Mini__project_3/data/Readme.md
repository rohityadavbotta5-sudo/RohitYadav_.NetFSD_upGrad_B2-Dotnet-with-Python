IT Support Ticket Automation System
 Overview

The IT Support Ticket Automation System is a backend-based application designed to automate the process of handling IT support issues. It replaces manual methods like emails and phone calls with a structured, trackable system.

The system integrates with tools like ServiceNow, Jira, and Azure Boards to ensure smooth coordination between IT support teams and developers.

 Problem Statement

Traditional IT support systems face several challenges:

Tickets are not properly tracked
No clear visibility of issue status
Developers don’t know which bugs to prioritize
Lack of coordination between IT and development teams
🎯 Objective

The goal of this system is to:

Accept user issues
Automatically create tickets
Track development work
Update ticket status after resolution
🏗️ Technology Stack
Python – Backend API development
ServiceNow – Incident management
Jira – Bug tracking for developers
Azure Boards – Work tracking and sprint management
Database – MySQL / SQLite / PostgreSQL
⚙️ Features
Submit IT support tickets
Store tickets in a database
Automatically create ServiceNow incidents
Identify bug-related issues
Create Jira tasks for bugs
Track ticket lifecycle
Update status after resolution
🔄 Workflow
User reports an issue
Python backend receives the request
Ticket is stored in the database
Incident is created in ServiceNow
If it is a bug → Jira task is created
Developer fixes the issue
Ticket is marked as resolved
💡 Example

Input:

System not logging in

Process:

Ticket stored in database
ServiceNow incident created
Jira task created (if bug detected)
Developer resolves issue
Ticket status updated
📂 Project Structure
IT-Ticket-System/
│
├── app.py
├── models/
│   ├── ticket.py
│   └── incident.py
│
├── services/
│   ├── servicenow.py
│   ├── jira.py
│   └── azure_boards.py
│
├── utils/
│   └── classifier.py
│
├── database/
│   └── db.py
│
├── data/
│   └── incidents.json
│
└── README.md
🔌 API Endpoints
Create Ticket
POST /api/tickets

Request:

{
  "title": "System not logging in",
  "description": "Unable to access system",
  "user": "Rohit"
}

Response:

{
  "ticket_id": "123",
  "status": "Created"
}
Get Ticket Status
GET /api/tickets/{id}
🧠 Business Logic
Detect issue type (bug / request / incident)
Assign severity level
Automate ticket creation across platforms
Sync status between systems
📈 Expected Outcome
Better ticket tracking
Faster issue resolution
Clear communication between teams
Improved productivity
🚀 Future Enhancements
Web-based dashboard
AI-based issue classification
Email/SMS notifications
Role-based access control
Real-time tracking
🧪 Testing
Unit testing for APIs
Mock APIs for integrations
Integration testing
🛠️ Setup Instructions
git clone https://github.com/your-repo/it-ticket-system.git
cd it-ticket-system
pip install -r requirements.txt
python app.py
🤝 Contribution

Feel free to fork this repository and submit pull requests.

📜 License

This project is licensed under the MIT License.