# Frontend-Backend Integration Guide

## Project Overview

This is an integrated hiring assessment platform with:
- **Frontend**: React + TypeScript + Vite (Port 3000)
- **Backend**: FastAPI Python (Port 8000)

The frontend communicates with the backend via REST APIs to handle:
- Job creation and management
- Question generation via AI
- Candidate registration
- Test submission and evaluation
- Leaderboard and analytics

## Prerequisites

### Frontend
- Node.js v16+ (recommended v18+)
- npm or yarn

### Backend
- Python 3.9+
- pip
- Ollama (optional, for local AI models)

## Setup Instructions

### Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd ai_hiring_platform_2/ai_hiring_platform
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Set up environment variables:
```bash
cp .env.example .env  # If available
```

5. Start the backend server:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/api/docs`

### Step 2: Frontend Setup

1. Navigate to the frontend directory:
```bash
cd assesspro_ai_hiring-assessment-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env.local
# Update .env.local if needed (usually defaults are fine)
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Step 3: Verify Integration

1. Open `http://localhost:3000` in your browser
2. Navigate to the dashboard and test the following flows:
   - **Create Job**: Creates assessment and generates questions via backend
   - **Take Assessment**: Fetches questions and submits answers via backend
   - **View Leaderboard**: Shows ranked candidates via backend
   - **View Report**: Displays detailed evaluation results

## API Endpoints

### Jobs API
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{job_id}` - Get job details
- `POST /api/jobs/create` - Create new job
- `GET /api/jobs/{job_id}/questions` - Get questions for a job
- `GET /api/jobs/{job_id}/analytics` - Get job analytics

### Candidates API
- `POST /api/candidates/register` - Register candidate for assessment
- `GET /api/candidates/{candidate_id}/questions` - Get assessment questions
- `POST /api/candidates/submit` - Submit test answers
- `GET /api/candidates/{candidate_id}/analytics` - Get candidate results
- `GET /api/candidates/job/{job_id}/leaderboard` - Get leaderboard

## Configuration

### Frontend Configuration

**Vite Proxy** (in `vite.config.ts`):
- Automatically proxies `/api/*` requests to `http://localhost:8000/api`
- This enables frontend to call backend during development

**Environment Variables** (in `.env.local`):
```
VITE_API_BASE=http://localhost:8000/api
GEMINI_API_KEY=your_key_here  # Optional for frontend-based evaluation
```

### Backend Configuration

**CORS Settings** (in `app/main.py`):
- Currently allows all origins: `allow_origins=["*"]`
- For production, update to specify exact frontend URL:
```python
allow_origins=["https://yourdomain.com"]
```

**Database**:
- Uses SQLite by default (file: `hiring_platform.db`)
- For production, configure PostgreSQL in `.env`

## Features

### Assessment Flow
1. **Recruiter** creates a job and specifies:
   - Job title and description
   - Duration (minutes)
   - Difficulty level (easy/medium/hard)
   - Pass threshold percentage

2. **AI Backend** automatically:
   - Analyzes job description
   - Extracts required skills
   - Creates assessment blueprint
   - Generates diverse questions (MCQ, Coding, Subjective, etc.)

3. **Candidate** takes assessment:
   - Fetches questions from backend
   - Answers questions with timer
   - Submits all answers at once

4. **Backend Evaluation**:
   - AI-evaluates all answers
   - Runs fraud detection (plagiarism, bot behavior, consistency)
   - Calculates skill breakdown
   - Generates detailed report
   - Ranks candidates

5. **Results**:
   - Individual detailed report with AI insights
   - Global leaderboard with fraud risk indicators
   - Recruiter analytics and candidate metrics

## Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify vite proxy configuration
- Try: `curl http://localhost:8000/api/docs`

### Backend connection refused
```bash
# Check if port 8000 is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Questions not loading
- Verify backend health: `curl http://localhost:8000/api/health`
- Check if Ollama is running (if using local AI models)
- Review backend logs for AI model errors

### Database errors
- Delete `hiring_platform.db` and restart backend to reset
- Check database permissions
- Verify SQLAlchemy connection string in `.env`

## Development Notes

### Adding New Endpoints

1. Create API in backend (`app/routes/`)
2. Add corresponding function in frontend (`services/backendApiService.ts`)
3. Use in frontend component
4. Test with backend running

### Switching Between MockDb and Backend

The frontend gracefully falls back to MockDb if backend is unavailable:
- Creates question generation data is stored in MockDb
- If backend fails, frontend uses cached data
- This allows continued testing without backend

### Production Deployment

1. **Backend**:
   - Set `DEBUG=False` in uvicorn config
   - Use PostgreSQL instead of SQLite
   - Set specific CORS origins
   - Configure proper logging
   - Use HTTPS and authentication

2. **Frontend**:
   - Build: `npm run build`
   - Deploy `dist/` folder
   - Configure API_BASE to production backend URL
   - Set up environment variables

## Security Considerations

- Backend validates all inputs via Pydantic models
- AI evaluation prevents answer copying via plagiarism detection
- Fraud detection flags suspicious patterns:
  - Speed anomalies (too fast/slow)
  - Consistency analysis
  - Resume-skill mismatches
  - Bot behavior detection
  - Code plagiarism

## Support

For issues or questions:
1. Check the API docs at `http://localhost:8000/api/docs`
2. Review console logs on both frontend and backend
3. Verify all prerequisites are installed
4. Ensure ports 3000 and 8000 are available

## Next Steps

1. Customize assessment questions and AI prompts
2. Integrate with real user authentication
3. Configure email notifications
4. Add interview scheduling
5. Implement recruiter dashboard analytics
6. Deploy to production infrastructure
