# QAENGINE — Team Setup Guide
## By Abitech

---

## Prerequisites (Install these first)

| Tool | Download Link |
|------|--------------|
| Python 3.10+ | https://python.org/downloads |
| Node.js 18+ | https://nodejs.org |
| Git (optional) | https://git-scm.com |

---

## Step 1 — Copy the Project

Copy the `QA Assistant` folder to your Desktop or any location.

---

## Step 2 — Backend Setup

Open **Command Prompt** or **PowerShell** and run these commands one by one:

```bash
# 1. Go to backend folder
cd "C:\Users\YourName\Desktop\QA Assistant\Backend"

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install all dependencies
pip install fastapi==0.109.0
pip install uvicorn==0.27.0
pip install groq==0.11.0
pip install httpx==0.27.0
pip install python-multipart==0.0.7
pip install pandas==2.2.0
pip install openpyxl==3.1.2
pip install python-dotenv==1.0.0
pip install pydantic==2.5.3

# 5. Start the backend server
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete.
```

---

## Step 3 — Frontend Setup

Open a **NEW** Command Prompt window and run:

```bash
# 1. Go to frontend folder
cd "C:\Users\YourName\Desktop\QA Assistant\frontend"

# 2. Install dependencies
npm install

# 3. Start the frontend
npm start
```

Browser will automatically open at **http://localhost:3000**

---

## Step 4 — Verify Everything Works

Open browser and check:
- Frontend: http://localhost:3000
- Backend:  http://127.0.0.1:8000

---

## Daily Usage (After First Setup)

Every day, just run these 2 commands in 2 separate terminals:

**Terminal 1 — Backend:**
```bash
cd "C:\Users\YourName\Desktop\QA Assistant\Backend"
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd "C:\Users\YourName\Desktop\QA Assistant\frontend"
npm start
```

---

## Troubleshooting

### "python is not recognized"
- Install Python from https://python.org
- During install, check ✅ "Add Python to PATH"
- Restart Command Prompt

### "npm is not recognized"
- Install Node.js from https://nodejs.org
- Restart Command Prompt

### "venv\Scripts\activate is not recognized"
Run this instead:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

### Port 8000 already in use
```bash
# Find and kill the process
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### Port 3000 already in use
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### npm install fails
```bash
npm cache clean --force
npm install
```

### Module not found errors
```bash
cd "C:\Users\YourName\Desktop\QA Assistant\Backend"
venv\Scripts\activate
pip install -r requirements.txt
```

---

## Project Structure

```
QA Assistant\
├── Backend\
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── routers\
│       ├── __init__.py
│       ├── testcases.py
│       ├── automation.py
│       └── bugreports.py
│
└── frontend\
    ├── package.json
    ├── public\
    │   └── index.html
    └── src\
        ├── App.jsx
        ├── App.css
        ├── index.js
        ├── components\
        │   └── Sidebar.jsx
        └── pages\
            ├── Dashboard.jsx
            ├── TestCaseGenerator.jsx
            ├── AutomationGenerator.jsx
            └── BugReportGenerator.jsx
```

---

## Quick Install Script (Run this to install everything at once)

Save this as `install.bat` inside the `Backend` folder and double-click it:

```bat
@echo off
echo =============================
echo   QAENGINE - Backend Setup
echo   By Abitech
echo =============================
echo.

cd /d "%~dp0"

echo [1/4] Creating virtual environment...
python -m venv venv

echo [2/4] Activating virtual environment...
call venv\Scripts\activate

echo [3/4] Installing dependencies...
pip install fastapi==0.109.0
pip install uvicorn==0.27.0
pip install groq==0.11.0
pip install httpx==0.27.0
pip install python-multipart==0.0.7
pip install pandas==2.2.0
pip install openpyxl==3.1.2
pip install python-dotenv==1.0.0
pip install pydantic==2.5.3

echo [4/4] Starting backend server...
uvicorn main:app --reload --port 8000

pause
```

---

## One-Click Start Scripts

### start-backend.bat
Save inside `Backend\` folder:
```bat
@echo off
cd /d "%~dp0"
call venv\Scripts\activate
uvicorn main:app --reload --port 8000
pause
```

### start-frontend.bat
Save inside `frontend\` folder:
```bat
@echo off
cd /d "%~dp0"
npm start
pause
```

Double-click both `.bat` files to start the app instantly every day!

