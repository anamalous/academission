[![Academission CI/CD](https://github.com/anamalous/academission/actions/workflows/main.yml/badge.svg)](https://github.com/anamalous/academission/actions/workflows/main.yml)

# Academission 🎓
A containerized academic social network and writing platform.

## 🚀 Quick Start (Docker)

1. **Clone the repo:**
   `git clone https://github.com/YOUR_USERNAME/academission.git`

2. **Setup Environment:**
   Create a `.env` file in the root using `.env.example`.

3. **Launch the stack:**
   `docker-compose up --build`

## 🏗️ Tech Stack
- **Frontend:** React
- **Backend:** Node.js / Express
- **Database:** MongoDB Atlas (Cloud)
- **DevOps:** Docker, GitHub Actions (CI/CD)

## 🤖 CI/CD Workflow
Every push to `main` triggers a GitHub Action that:
1. Builds the Docker images for Frontend and Backend.
2. Pushes the images to **Docker Hub**.
3. Verifies the integrity of the build.