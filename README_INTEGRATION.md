# AssessPro - Integrated Hiring Assessment Platform

A comprehensive AI-powered assessment platform with integrated frontend and backend services.

## 🏗️ Project Structure

```
├── assesspro_ai_hiring-assessment-platform/     (Frontend - React/TypeScript)
│   ├── components/                              (React components)
│   ├── pages/                                   (Page components)
│   ├── services/                                (API services)
│   │   ├── backendApiService.ts                (Backend API calls)
│   │   ├── geminiService.ts                    (Gemini API integration)
│   │   └── mockDb.ts                           (Fallback mock database)
│   ├── App.tsx                                 (Main app component)
│   ├── vite.config.ts                          (Vite configuration with API proxy)
│   └── package.json
│
└── ai_hiring_platform_2/ai_hiring_platform/    (Backend - FastAPI/Python)
    ├── app/
    │   ├── main.py                             (FastAPI app & CORS setup)
    │   ├── database.py                         (SQLAlchemy database)
    │   ├── models/                             (SQLAlchemy models)
    │   ├── schemas/                            (Pydantic schemas)
    │   ├── routes/                             (API endpoints)
    │   │   ├── jobs.py                         (Job management)
    │   │   ├── candidates.py                   (Assessment & evaluation)
    │   │   └── results.py                      (Results endpoint)
    │   └── services/                           (Business logic)
    ├── requirements.txt                        (Python dependencies)
    └── .env                                    (Backend configuration)
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ (Frontend)
- Python 3.9+ (Backend)
- npm (Frontend package manager)

### 1. Start Backend
```bash
cd ai_hiring_platform_2/ai_hiring_platform
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API: http://localhost:8000
API Docs: http://localhost:8000/api/docs

### 2. Start Frontend
```bash
cd assesspro_ai_hiring-assessment-platform
npm install
npm run dev
```
Frontend: http://localhost:3000

## 📡 Integration Points

### API Communication
- Frontend makes requests to `/api/*` endpoints
- Vite development proxy routes to `http://localhost:8000`
- Production: Update `VITE_API_BASE` environment variable

### Data Flow
1. **Job Creation**
   - Frontend → Backend creates job
   - Backend generates AI questions
   - Frontend displays created job

2. **Assessment Taking**
   - Frontend fetches questions from backend
   - Candidate answers displayed in frontend
   - Frontend submits answers to backend
   - Backend evaluates and returns results
   - Frontend displays results

3. **Leaderboard**
   - Frontend fetches ranked candidates from backend
   - Shows fraud detection flags
   - Displays skill breakdown

## 🔌 Key API Endpoints

### Jobs
```
POST /api/jobs/create          - Create assessment
GET  /api/jobs/                - List jobs
GET  /api/jobs/{id}            - Get job details
GET  /api/jobs/{id}/questions  - Get assessment questions
GET  /api/jobs/{id}/analytics  - Get job analytics
```

### Candidates & Assessment
```
POST /api/candidates/register           - Register for assessment
GET  /api/candidates/{id}/questions     - Get questions
POST /api/candidates/submit             - Submit answers
GET  /api/candidates/{id}/analytics     - Get results
GET  /api/candidates/job/{id}/leaderboard - Get ranked list
```

## 🤖 Key Features

### Frontend
- ✅ Responsive React UI
- ✅ Real-time assessment interface with timer
- ✅ Multiple question types (MCQ, Coding, Subjective)
- ✅ Global leaderboard
- ✅ Detailed result reports
- ✅ Graceful fallback to MockDb

### Backend
- ✅ FastAPI REST API
- ✅ AI-powered question generation
- ✅ Comprehensive answer evaluation
- ✅ 5-layer fraud detection
- ✅ Skill gap analysis
- ✅ Real-time leaderboard
- ✅ Analytics and reporting

## 🔒 Security Features

- **Fraud Detection**: Speed anomalies, consistency checks, plagiarism detection
- **CORS Configuration**: Configurable origin allowlist
- **Input Validation**: Pydantic models for all API inputs
- **Rate Limiting**: Can be added via middleware
- **Authentication**: Ready for JWT integration

## 📊 Database

- **Default**: SQLite (`hiring_platform.db`)
- **Production**: PostgreSQL (configurable via `.env`)

Models include:
- Job (assessment configuration)
- Question (assessment questions)
- Candidate (applicant data)
- Answer (submitted responses)
- CandidateMetrics (evaluation results)
- ApplicationLog (audit trail)

## 🛠️ Development

### Adding New Features

1. **New API Endpoint**:
   - Add route in `app/routes/`
   - Add schema in `app/schemas/schemas.py`
   - Add model if needed in `app/models/models.py`

2. **Frontend Integration**:
   - Add function in `services/backendApiService.ts`
   - Use in component
   - Test with backend running

### Testing

- Backend: Use Swagger UI at `http://localhost:8000/api/docs`
- Frontend: Open browser console for API call logs

## 📈 Performance

- Vite for fast frontend development
- FastAPI for quick API responses
- SQLAlchemy ORM with optimized queries
- Async/await for concurrent operations

## 🚢 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to web server
```

### Backend
```python
# Update settings in app/main.py:
# - Set debug=False
# - Update CORS origins
# - Configure production database
# - Use production ASGI server: gunicorn, uvicorn with workers
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS is configured for frontend URL
- Check browser console for specific error
- Verify backend is running

### Missing Questions
- Check backend logs for AI model errors
- Verify Ollama is running (if using local models)
- Ensure database is properly initialized

### Connection Issues
- Backend: `curl http://localhost:8000/api/health`
- Frontend: Check browser DevTools Network tab
- Verify ports 3000 and 8000 are available

## 📚 Documentation

- **Frontend Setup**: See `INTEGRATION_GUIDE.md`
- **Backend Docs**: Visit `http://localhost:8000/api/docs`
- **API Reference**: Check individual route files in `app/routes/`

## 🎯 Next Steps

1. ✅ Integrated frontend and backend
2. ✅ API endpoints connected
3. ✅ Fallback to MockDb when needed
4. Next: Add user authentication
5. Next: Email notifications
6. Next: Interview scheduling
7. Next: Advanced analytics dashboard

## 📝 Notes

- Frontend gracefully degrades if backend is unavailable
- MockDb provides local storage for testing
- All timestamps are UTC
- Scores are normalized to 0-100 range
- Assessment duration is in minutes

## 📞 Support

For issues:
1. Check API documentation at `/api/docs`
2. Review console logs
3. Verify all services are running
4. Check environment variables
5. Review Integration Guide for detailed setup

---

**Version**: 2.0.0  
**Last Updated**: 2026-02-07  
**Status**: Production Ready
