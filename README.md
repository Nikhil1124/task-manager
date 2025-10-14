# Task Manager Project

A full-stack Task Manager application with role-based access (admin & normal users), built with **NestJS (Backend)** and **React.js (Frontend)**.

---

## Deliverables

### 1. Backend Project

- **Repository**: Hosted on GitHub [here](https://github.com/Nikhil1124/task-manager)
- **Project Setup**:
  ```bash
  # Navigate to backend folder
  cd backend

  # Install dependencies
  npm install

  # Run in development mode
  npm run start:dev

  # Run in production mode
  npm run start:prod

# Task Manager Project

A full-stack Task Manager application with role-based access (admin & normal users), built with **NestJS (Backend)** and **React.js (Frontend)**.

---

## Deliverables

### 1. Backend Project

- **Repository**: Hosted on GitHub [here](https://github.com/Nikhil1124/task-manager)
- **Project Setup**:
  ```bash
  # Navigate to backend folder
  cd backend

  # Install dependencies
  npm install

  # Run in development mode
  npm run start:dev

  # Run in production mode
  npm run start:prod


2. Frontend UI
Technology: React.js + Tailwind CSS
Setup:
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
Features:
Login & Registration
Dashboard:
Normal users: View, update, delete, and create their own tasks
Admin users: View all tasks, assign tasks to users, delete any task
Inline task editing (title, description, status, priority)
Hosted in the same repository under /frontend.


## API Documentation

All backend API endpoints are documented in a Postman collection.

- File: [postman/TaskManager.postman_collection.json](postman/TaskManager.postman_collection.json)
- You can import this file into [Postman](https://www.postman.com/) to view and test all endpoints (authentication, tasks CRUD).

### 4. Scalability Note
This project can scale in multiple ways:

- **Microservices**: Split tasks, users, and authentication into separate services.
- **Caching**: Use Redis or in-memory caching to reduce DB queries for frequently accessed data.
- **Load Balancing**: Deploy multiple backend instances behind a load balancer (e.g., Nginx or AWS ELB) for high availability.
- **Database Optimization**: Use indexes and optimized queries to improve performance for large datasets.
- **Asynchronous Tasks**: Use message queues (e.g., RabbitMQ, Kafka) for background jobs such as sending notifications or emails.