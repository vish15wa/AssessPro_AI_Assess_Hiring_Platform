
import { User, Job, Application, AssessmentResult } from '../types';

const STORAGE_KEYS = {
  USERS: 'ap_users',
  JOBS: 'ap_jobs',
  APPLICATIONS: 'ap_applications',
  SESSION: 'ap_session'
};

export const MockDb = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUser: (user: User) => {
    const users = MockDb.getUsers();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
  },
  findUserByEmail: (email: string) => MockDb.getUsers().find(u => u.email === email),
  
  getJobs: (): Job[] => {
    const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || '[]');
    const now = new Date();
    // Filter out expired jobs (after 11:59 PM of deadline date)
    return jobs.filter((j: Job) => {
      const deadlineDate = new Date(j.deadline);
      deadlineDate.setHours(23, 59, 59, 999);
      return now <= deadlineDate;
    });
  },
  getJobById: (id: string) => MockDb.getJobs().find(j => j.id === id),
  saveJob: (job: Job) => {
    const jobs = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || '[]');
    const index = jobs.findIndex((j: any) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  getApplications: (): Application[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]'),
  saveApplication: (app: Application) => {
    const apps = MockDb.getApplications();
    const index = apps.findIndex(a => a.id === app.id);
    if (index >= 0) apps[index] = app;
    else apps.push(app);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  },
  
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user)),
};
