# DevOps Task Tracker
# DevOps Task Tracker 🚀

A full-stack Task Tracker application built as a hands-on DevOps project. The project demonstrates the complete application lifecycle, including development, containerization, CI/CD, cloud deployment, monitoring, logging, and security.

## 🌐 Live Demo

🚀 **Application:**  
https://devops-task-tracker-frontend.onrender.com

💻 **GitHub Repository:**  
https://github.com/MlindoMLabs/devops-task-tracker

---

## 📌 Project Overview

The DevOps Task Tracker is a web-based application that allows users to create, view, update, and delete tasks.

The main goal of this project was to gain practical experience implementing a complete DevOps workflow from application development through to production deployment and security.

### Application Features

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Task status management
- Task priority management
- REST API
- Supabase database integration
- React frontend
- Node.js/Express backend

---

## 🏗️ Architecture

```text
                    ┌─────────────────┐
                    │     GitHub      │
                    │  Source Code    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ GitHub Actions  │
                    │   CI/CD Pipeline│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Docker      │
                    │    Images       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Render      │
                    │   Deployment    │
                    └───────┬─────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
     ┌─────────────────┐         ┌─────────────────┐
     │ React Frontend  │         │ Node.js Backend │
     │     Vite        │────────▶│    Express.js   │
     └─────────────────┘         └────────┬────────┘
                                          │
                                          ▼
                                  ┌─────────────────┐
                                  │     Supabase    │
                                  │    PostgreSQL   │
                                  └─────────────────┘
