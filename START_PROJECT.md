# Quick Start: Running the Full Project

## ⚡ 5-Minute Setup

### On Windows

**Terminal 1 - Start Backend:**
```bash
cd ai_hiring_platform_2\ai_hiring_platform
venv\Scripts\activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Start Frontend:**
```bash
cd assesspro_ai_hiring-assessment-platform
npm install  # First time only
npm run dev
```

### On macOS/Linux

**Terminal 1 - Start Backend:**
```bash
cd ai_hiring_platform_2/ai_hiring_platform
source venv/bin/activate  # Create venv first if needed: python -m venv venv
pip install -r requirements.txt  # First time only
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Start Frontend:**
```bash
cd assesspro_ai_hiring-assessment-platform
npm install  # First time only
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/api/docs
- **Backend Health Check**: http://localhost:8000/api/health

## ✅ Verify Everything Works

1. Open http://localhost:3000 in your browser
2. Create a test job (Dashboard → Create Job)
   - Should see "Job created successfully" message
   - This means backend is responding
3. Try taking an assessment
   - Questions should load from backend
4. Check leaderboard
   - Should show submitted assessments

## 🐛 Troubleshooting

### "Can't connect to backend" error
- Check that backend terminal shows "Application startup complete"
- Try: http://localhost:8000/api/docs in browser
- If 404 or connection refused, backend is not running

### Port already in use
**For Windows:**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**For macOS/Linux:**
```bash
lsof -i :8000
kill -9 <PID>
```

### npm dependencies failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend database issues
```bash
# Delete database and restart backend to reinitialize
rm hiring_platform.db
# Restart backend - it will create new database
```

## 📋 Initial Setup (One Time)

### Backend Setup
```bash
cd ai_hiring_platform_2/ai_hiring_platform

# Create virtual environment (if not exists)
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Check .env file is configured
cat .env  # Should show API_HOST, API_PORT, OLLAMA_BASE_URL
```

### Frontend Setup
```bash
cd assesspro_ai_hiring-assessment-platform

# Install dependencies
npm install

# Check .env.local is configured
cat .env.local  # Should show VITE_API_BASE and GEMINI_API_KEY
```

## 🎯 Usage Guide

### Test User Credentials (MockDb)
- **Recruiter**: 
  - Username: recruiter1
  - Password: recruiter123
  
- **Student/Candidate**:
  - Username: student1
  - Password: student123

### Workflow
1. **Login** as recruiter
2. **Create Job** with description and settings
3. **Backend generates questions** automatically
4. **Share job link** with candidates
5. **Candidate registers** and takes assessment
6. **Backend evaluates** answers and generates report
7. **View leaderboard** and detailed analytics

## 📊 API Testing

Use the Swagger UI at http://localhost:8000/api/docs to:
- Create jobs
- Register candidates
- Submit answers
- View leaderboard
- Check analytics

## 🔧 Environment Configuration

### Frontend (.env.local)
```
VITE_API_BASE=http://localhost:8000/api
GEMINI_API_KEY=your_key_here  # Optional
```

### Backend (.env)
```
API_HOST=localhost
API_PORT=8000
OLLAMA_BASE_URL=http://localhost:11434  # If using Ollama
```

## 🚀 Production Deployment

See `INTEGRATION_GUIDE.md` for detailed production setup.

## 💡 Tips

- Both services need to run together for full functionality
- Frontend falls back to MockDb if backend is unavailable
- Check browser DevTools → Network tab for API calls
- Backend logs show AI model performance
- Database is stored in `hiring_platform.db` (SQLite)

## 📞 Support

1. Check http://localhost:8000/api/docs for API details
2. Review browser console (F12) for errors
3. Check backend terminal for server logs
4. Verify both services are running
5. Ensure ports 3000 and 8000 are available

---

**Need help?** Check INTEGRATION_GUIDE.md for detailed documentation.
