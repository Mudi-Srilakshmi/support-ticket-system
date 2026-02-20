# Support Ticket System

A full-stack Support Ticket Management System built using **Django REST Framework** and **React**, with **AI-based ticket classification** and **Dockerized deployment**.

---

## Features

* Create, update, delete support tickets
* Search and filter tickets by category, priority, and status
* Ticket analytics dashboard (stats API)
* AI-powered ticket classification (OpenAI)
* Dockerized backend with PostgreSQL
* REST APIs using Django REST Framework
* React frontend for user interface

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* PostgreSQL
* OpenAI API
* Docker

### Frontend

* React.js
* Axios
* Bootstrap

---

## Project Structure

```
support_ticket_system/
│
├── backend/           # Django project
├── tickets/           # App for ticket management
├── frontend/          # React frontend
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md
```

---

## Setup Instructions

### Clone Repository

```
git clone https://github.com/YOUR_USERNAME/support-ticket-system.git
cd support-ticket-system
```

---

### Environment Variables

Create a `.env` file in the root directory:

```
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=support_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

OPENAI_API_KEY=your_openai_key
```

---

## Run with Docker (Recommended)

### Start Containers

```
docker compose up --build
```

---

### Run Migrations

```
docker compose run backend python manage.py migrate
```

---

### Collect Static Files

```
docker compose run backend python manage.py collectstatic
```

---

### Access Application

* Backend API: http://localhost:8000
* Admin Panel: http://localhost:8000/admin

---

## Run Without Docker

### Backend

```
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

---

### Frontend

```
cd frontend
npm install
npm start
```

---

## API Endpoints

### Ticket APIs

| Method | Endpoint           | Description     |
| ------ | ------------------ | --------------- |
| GET    | /api/tickets/      | Get all tickets |
| POST   | /api/tickets/      | Create ticket   |
| GET    | /api/tickets/{id}/ | Get ticket      |
| PUT    | /api/tickets/{id}/ | Update ticket   |
| DELETE | /api/tickets/{id}/ | Delete ticket   |

---

### AI Classification

```
POST /api/tickets/classify/
```

Request:

```
{
  "description": "My account is not working"
}
```

Response:

```
{
  "suggested_category": "account",
  "suggested_priority": "high"
}
```

---

### Stats API

```
GET /api/tickets/stats/
```

Returns:

* Total tickets
* Open tickets
* Average tickets per day
* Category & priority breakdown

---

## AI Integration

* Uses OpenAI GPT model for ticket classification
* Automatically suggests category and priority

---

## Docker Services

* **backend** → Django app
* **db** → PostgreSQL database

---

## Future Improvements

* User authentication (JWT)
* Role-based access
* Email notifications
* Deployment on AWS / Render
* CI/CD pipeline

---

## Author

**Mudi Sri Lakshmi**

---

## Acknowledgements

* Django Documentation
* React Documentation
* OpenAI API

---

## License

This project is open-source and free to use.
