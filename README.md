README — IT Incident Auto-Triage & Tracker
📌 Overview

This project is a Python-based CLI application that automatically classifies IT incidents and creates mock tickets across multiple platforms like ServiceNow, Jira, and Azure Boards.

The system reads incidents from a JSON file, detects the incident type and severity using regex, and generates an HTML report after processing.

🚀 Features
Auto incident classification
Severity detection using regex
Mock ticket creation
HTML report generation
Modular Python architecture
Retry and logging decorators
🛠️ Tech Stack
Python 3
Regex
JSON
HTML
Requests Library
📂 Modules
models/ → Incident classes
services/ → Mock API integrations
utils/ → Classifier, decorators, helpers
data/ → Input incidents
output/ → Generated report
▶️ Run the Project
pip install requests
python main.py
📊 Output

Generates:

Classified incidents
Mock ticket IDs
HTML report (output/report.html)
📌 Key Learning

This project helped me understand:

OOP concepts
Regex pattern matching
API integration flow
Decorators & iterators
File handling in Python

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
README — Employee Management System
📌 Overview

This project is a full-stack Employee Management System built using .NET 8 Web API, SQL Server, and JavaScript.

It supports employee CRUD operations, JWT authentication, role-based access, server-side pagination, filtering, and dashboard analytics.

🚀 Features
Employee CRUD operations
JWT Authentication
Role-based access (Admin / Viewer)
Server-side search & pagination
Dashboard summary API
Swagger API documentation
SQL Server integration
🛠️ Tech Stack
Backend
.NET 8 Web API
Entity Framework Core
SQL Server 2022
JWT Authentication
BCrypt Password Hashing
Frontend
HTML5
CSS3
Bootstrap 5
JavaScript (ES6)
jQuery
📂 Architecture
Controllers/ → API endpoints
Services/ → Business logic
Repository/ → Data access layer
Models/ → Database entities
DTOs/ → Request & response models
frontend/js/ → UI service modules
▶️ Run the Project
Backend
dotnet restore
dotnet ef database update
dotnet run
Frontend

Open index.html using Live Server.

🔐 Default Login
Admin
Username: admin
Password: admin123
Viewer
Username: viewer
Password: viewer123
📌 Key Learning

This project helped me understand:

REST API development
Entity Framework Core
JWT authentication
Repository pattern
Full-stack integration
Role-based authorization
