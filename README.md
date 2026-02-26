# Visa Management — Frontend

## 📁 Structure
```
visa-frontend/
├── app/
│   ├── admin/
│   │   ├── layout.js          ← Auth guard + Sidebar
│   │   ├── login/page.js      ← Login page
│   │   ├── dashboard/page.js  ← Dashboard (Image 1)
│   │   └── applications/
│   │       ├── page.js        ← All Candidates table (Image 2)
│   │       └── edit/[id]/page.js ← Add/Edit form (Image 3)
│   ├── track/page.js          ← Public visa tracking
│   ├── layout.js
│   ├── globals.css
│   └── page.js               ← Redirects to /admin/login
├── components/admin/
│   ├── Sidebar.js
│   └── StatusBadge.js
├── lib/
│   └── api.js                ← All API calls
├── .env.local
├── next.config.js            ← API proxy config
└── package.json
```

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Dev server start (backend bhi chalna chahiye port 5000 pe)
npm run dev

# Browser: http://localhost:3000
```

## ✅ Features

### Login Page
- Dark gradient background
- Email + password (show/hide toggle)
- Error messages with detail
- Token stored in localStorage + httpOnly cookie

### Dashboard (Image 1)
- 4 stat cards: All Candidate, This Month, All Visa, Deleted Visa
- Monthly breakdown table (Jan–Dec)
- Recent applications table (ID, Name, Country, Status)

### All Candidates (Image 2)
- Search by name/passport/app ID
- Filter by Status dropdown (All, In Progress, Approved, Rejected, etc.)
- Date range display
- Export Data button → Excel file download
- Table: App ID, Name, Passport, Visa Type, Date, Current Stage, Status badge, Processing Days, Actions
- View Details, Edit, Delete (trash icon), Download PDF (if issued)
- Pagination (Previous [1][2] Next)

### Applications Form (Image 3)
- 3-column layout: Applicant Details | Visa Information | Contact Info
- All fields with proper validation
- Current Status & Stage section with status history
- Documents section (upload passport copy, photo, supporting docs)
- Auto PDF generation when status → Issued
- Save Changes / Cancel

### Public Track (/track)
- Search by Application Number or Passport Number + DOB
- Shows status, name, visa type, country, dates
- Download button if visa is issued

## 🔑 First Time Setup

1. Start backend: `cd backend && npm run dev`
2. Create admin (Postman ya curl):
```
POST http://localhost:5000/api/auth/register
{ "email": "admin@example.com", "password": "Admin@123!" }
```
3. Start frontend: `cd frontend && npm run dev`
4. Login: http://localhost:3000/admin/login
