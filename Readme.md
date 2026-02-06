# Repository Overview

This repository is a sample project for learning Server-Sent Events (SSE).
The backend is built using Spring Boot, and the frontend is a static application using HTML, CSS, and JavaScript.

## Backend

The backend consists of two main parts:

### 1. SSE Stream Endpoints

Three different implementations of SSE are provided for comparison and learning:

1. `/stream1`  
   - Implemented using `HttpServletResponse`
   - Manually writes data and flushes the response
   - Sets `Content-Type` to `text/event-stream`

2. `/stream2`  
   - Implemented using Spring’s `SseEmitter`

3. `/stream3`  
   - Implemented using a reactive `Flux` (Project Reactor)

### 2. Simple Chat Application

A basic chat application where:
- Users join a chat using `userId` and `chatId`
- Messages can be sent and received in real time using SSE

## Frontend

The frontend consists of two pages:

- `/stream.html`  
  Used to test the three SSE stream implementations:
  - `HttpServletResponse`-based stream
  - `SseEmitter`-based stream
  - `Flux`-based stream

- `/` (root page)  
  A simple real-time chat interface where users join using `userId` and `chatId`, and exchange messages via SSE.
## How to Run

### Step 1: Clone the repository
```bash
git clone https://github.com/KrishnaChaitanya20/sse-demo.git
cd sse-demo
```

### Option 1: Run using Docker (recommended)

Prerequisite: Docker and Docker Compose installed.
```bash
docker compose up -d
```
This will start both the backend and frontend services.
access the chat interface at `http://localhost:8080/` and the SSE stream test page at `http://localhost:8080/stream.html`.

### Option 2: Run locally
#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start a simple HTTP server (e.g., using Python):
   ```bash
   python -m http.server 8080
   ```
Now you can access the frontend at `http://localhost:8080/` and test the SSE streams at `http://localhost:8080/stream.html`.