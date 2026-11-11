# Component Usage Reference

## How to Import and Use Components

### In App.jsx
```javascript
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StudentIdForm } from './components/StudentIdForm';
import { ClassList } from './components/ClassList';
import { MyApplications } from './components/MyApplications';
import { Footer } from './components/Footer';
import { useAuthStore } from './stores/authStore';
```

---

## Component Usage Examples

### Header Component
```javascript
<Header />
```
**No props required**
- Automatically gets studentId from Zustand store
- Renders logout button when logged in

---

### HeroSection Component
```javascript
<HeroSection onGetStarted={() => setCurrentPage('classes')} />
```
**Props**:
- `onGetStarted` (function) - Called when user clicks "Get Started"

---

### StudentIdForm Component
```javascript
<StudentIdForm onSubmit={(id) => {
  // ID is already stored in Zustand
  setCurrentPage('classes');
}} />
```
**Props**:
- `onSubmit` (function) - Called after successful form submission

**Handles**:
- Input validation (17 digits, numeric only)
- Error display
- Zustand store update
- localStorage persistence

---

### ClassList Component
```javascript
<ClassList />
```
**No props required**
- Fetches classes on component mount
- Displays loading spinner while fetching
- Shows error if API fails
- Renders grid of class cards

---

### MyApplications Component
```javascript
<MyApplications />
```
**No props required**
- Fetches student's holds on component mount
- Displays loading spinner while fetching
- Shows error if API fails
- Renders list of application cards
- Handles confirm and cancel actions

---

### Footer Component
```javascript
<Footer />
```
**No props required**
- Simple footer with copyright info

---

## State Management (Zustand Store)

### Import the Store
```javascript
import { useAuthStore } from './stores/authStore';
```

### Use in Component
```javascript
function MyComponent() {
  const { studentId, setStudentId, clearStudentId } = useAuthStore();

  return (
	<div>
	  {studentId && <p>Logged in as: {studentId}</p>}
	  <button onClick={() => setStudentId('12345678901234567')}>
		Set Student ID
	  </button>
	  <button onClick={clearStudentId}>Logout</button>
	</div>
  );
}
```

### Store Methods
- `setStudentId(id)` - Set and persist student ID
- `clearStudentId()` - Clear and remove from storage
- `studentId` - Get current student ID (or null)

---

## API Usage

### Import Endpoints
```javascript
import { classApi, holdApi } from '../api/endpoints';
```

### Class API
```javascript
// Get all classes
const response = await classApi.getAll();
const classes = response.data.data;

// Get specific class
const response = await classApi.getById('c_123');
const classInfo = response.data.data;

// Create class (admin)
const response = await classApi.create({ name: 'Class A', totalSeats: 30 });
```

### Hold API
```javascript
// Apply for class
const response = await holdApi.create('c_123');
const hold = response.data.data;

// Get hold details
const response = await holdApi.getById('h_123');
const holdInfo = response.data.data;

// Get all student holds
const response = await holdApi.getStudentHolds();
const holds = response.data.data;

// Confirm admission
const response = await holdApi.confirm('h_123');

// Cancel application
await holdApi.cancel('h_123');
```

---

## Response Format

All API responses follow this format:
```javascript
{
  data: {...},        // The actual data
  message: "...",     // Optional message
  success: true       // Success flag
}
```

Access data with: `response.data.data`

---

## Error Handling

### API Errors
```javascript
try {
  const response = await classApi.getAll();
  // Handle success
} catch (error) {
  console.error(error.message);
  // Handle error - show to user
}
```

### Form Errors
```javascript
const [error, setError] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();

  if (!value) {
	setError('Field is required');
	return;
  }

  setError('');
  // Process form
};
```

---

## Styling Patterns

### Global Variables (index.css)
```css
:root {
  --text: #4b5563;
  --text-h: #1a1f2e;
  --bg: #ffffff;
  --border: #e8eaed;
  --accent: #2563eb;
  --success: #10b981;
  --error: #ef4444;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Use in Components
```javascript
const styles = {
  button: {
	backgroundColor: 'var(--accent)',
	color: '#ffffff',
	border: 'none',
  },
  text: {
	color: 'var(--text)',
  },
};
```

---

## Component Lifecycle

### ClassList Mount
```
1. Component mounts
2. useEffect runs (empty dependency array)
3. Calls classApi.getAll()
4. Sets loading = true
5. API returns data
6. Sets classes, loading = false
7. Component re-renders with classes
```

### MyApplications Mount
```
1. Component mounts
2. useEffect runs (empty dependency array)
3. Calls holdApi.getStudentHolds()
4. Sets loading = true
5. API returns data
6. Sets holds, loading = false
7. Component re-renders with holds
```

### User Action (Apply)
```
1. User clicks "Apply Now"
2. API call: holdApi.create(classId)
3. If successful:
   - Show success message
   - Navigate to MyApplications
4. If error:
   - Show error message
   - Keep user on page
```

---

## Complete App.jsx Example

```javascript
import { useState } from 'react';
import { useAuthStore } from './stores/authStore';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StudentIdForm } from './components/StudentIdForm';
import { ClassList } from './components/ClassList';
import { MyApplications } from './components/MyApplications';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  const { studentId } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('hero');

  const handleGetStarted = () => {
	setCurrentPage('classes');
  };

  return (
	<div style={styles.app}>
	  <Header />

	  {!studentId ? (
		<StudentIdForm onSubmit={() => setCurrentPage('classes')} />
	  ) : (
		<>
		  {currentPage === 'hero' && (
			<HeroSection onGetStarted={handleGetStarted} />
		  )}
		  {currentPage === 'classes' && (
			<ClassList />
		  )}
		  {currentPage === 'applications' && (
			<MyApplications />
		  )}
		</>
	  )}

	  <Footer />
	</div>
  );
}

const styles = {
  app: {
	display: 'flex',
	flexDirection: 'column',
	minHeight: '100vh',
	backgroundColor: 'var(--bg)',
  },
};

export default App;
```

---

## Testing Components

### Test Student ID Form
```javascript
// Enter: 12345678901234567
// Should pass validation
// Should be stored in localStorage
// Should redirect to classes
```

### Test ClassList
```javascript
// Should fetch and display classes
// Should show loading spinner
// Should show error if API fails
// Should disable Apply button if full
// Should show progress bar
```

### Test MyApplications
```javascript
// Should fetch and display holds
// Should show correct status badges
// Should show time remaining
// Should allow confirm/cancel actions
// Should update list after action
```

---

## Performance Tips

1. **Avoid unnecessary re-renders**
   - Use proper dependency arrays in useEffect
   - Memoize expensive computations

2. **Optimize API calls**
   - Don't fetch data on every render
   - Use loading states to prevent double-fetches

3. **Minimize bundle size**
   - Keep components focused
   - Remove unused imports
   - Use code splitting if needed

4. **Cache API responses**
   - Consider adding caching layer
   - Prevent redundant API calls

---

## Debugging Tips

### Check Browser DevTools
- Network tab: Verify API calls
- Console: Check for errors
- Application tab: Check localStorage
- Elements tab: Inspect styling

### React DevTools Extension
- View component tree
- Inspect component props/state
- Check re-render behavior

### Network Tab
- Verify requests have X-Student-Id header
- Check API response format
- Verify status codes (200, 400, 401, etc.)

---

## Component Checklist

When adding or modifying components, ensure:
- ✓ Proper import/export
- ✓ Defined prop types and defaults
- ✓ Error handling implemented
- ✓ Loading states handled
- ✓ Styling follows pattern
- ✓ Accessibility features included
- ✓ Mobile responsive
- ✓ API calls with try/catch
- ✓ Comments for complex logic
- ✓ No console errors/warnings
