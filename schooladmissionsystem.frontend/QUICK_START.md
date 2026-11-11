# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Install Dependencies
Open Terminal in Visual Studio (Ctrl+`) and run:
```bash
cd schooladmissionsystem.frontend
npm install
```

### Step 2: Setup Environment
Create `.env` file in the frontend folder:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School Admission System
```

### Step 3: Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## What's Available

### Page 1: Student ID Entry
- User enters their 17-digit birth registration number
- Validates format and length
- Stores ID in browser (persists on reload)

### Page 2: Available Classes
- Browse all school classes
- See seat availability
- Progress bar shows how many seats remain
- "Apply Now" button to request admission

### Page 3: My Applications
- View all your applications
- Check current status (Pending, Confirmed, Expired, Cancelled)
- Time remaining until hold expires
- Confirm admission or cancel application

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## File Locations

| Purpose | File |
|---------|------|
| Main App | src/App.jsx |
| Components | src/components/*.jsx |
| API Calls | src/api/endpoints.js |
| Auth State | src/stores/authStore.js |
| Global Styles | src/index.css |
| Component Styles | Inline in each component |

---

## Common Tasks

### Add a New Component
1. Create file in `src/components/MyComponent.jsx`
2. Use inline styles pattern from existing components
3. Export and use in App.jsx

### Connect to Backend API
- API URL in `.env` → `VITE_API_URL`
- Add endpoint to `src/api/endpoints.js`
- Call from component using imported functions

### Style Changes
- Global colors: Edit CSS variables in `src/index.css`
- Component styles: Modify `styles` object in component

### Test API Integration
- Check browser DevTools → Network tab
- Verify `X-Student-Id` header is sent
- Ensure API returns data in expected format

---

## Troubleshooting

### Port Already in Use
Change in vite.config.js or run on different port:
```bash
npm run dev -- --port 5174
```

### API Not Connecting
- Check `.env` has correct API URL
- Ensure backend is running on that URL
- Check CORS settings on backend
- Verify `X-Student-Id` header format

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Style Not Applied
- Check CSS variable names match in `index.css`
- Verify inline styles object is passed to element
- Clear browser cache (Ctrl+Shift+Delete)

---

## Project Architecture

```
App
└── Header
└── [CurrentPage]
	├── HeroSection
	├── StudentIdForm
	├── ClassList
	└── MyApplications
└── Footer
```

**State Management**: Zustand store (`authStore.js`)
- Stores student ID
- Persists to localStorage
- Auto-clears on logout

**API Client**: Axios with interceptors
- Auto adds `X-Student-Id` header
- Handles 401 errors
- Configurable base URL

---

## Default Credentials for Testing

Create a test student ID: Any 17-digit number
Example: `12345678901234567`

---

## Resources

- React Docs: https://react.dev
- Vite Docs: https://vite.dev
- Zustand Docs: https://github.com/pmndrs/zustand
- Axios Docs: https://axios-http.com

---

## Next Steps

1. Ensure backend is running
2. Set correct API URL in `.env`
3. Start frontend dev server
4. Test authentication flow
5. Test applying for classes
6. Test viewing applications

Happy coding!
