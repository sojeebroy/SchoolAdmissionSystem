# Frontend Components Documentation

## Component Overview

### Header.jsx
**Purpose**: Sticky navigation header with user info

**Props**: None

**State**: Uses `useAuthStore` to get `studentId` and `clearStudentId`

**Features**:
- Displays app title
- Shows student ID when logged in
- Logout button
- Sticky positioning

**Styling**:
```
- Height: 64px
- Background: var(--bg)
- Border bottom: 1px solid var(--border)
- Box shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
- Flex: space-between alignment
```

---

### HeroSection.jsx
**Purpose**: Welcome landing section

**Props**: 
- `onGetStarted` (function) - Callback when user clicks "Get Started"

**State**: None

**Features**:
- Centered content
- Main title and subtitle
- Call-to-action button
- Light background

**Styling**:
```
- Padding: 80px vertical
- Background: var(--bg-secondary)
- Max-width: 700px centered
- Button: Blue accent with hover effect
```

---

### StudentIdForm.jsx
**Purpose**: Student ID entry and validation

**Props**:
- `onSubmit` (function) - Callback after form submission

**State**:
- `studentId` - Input value
- `error` - Error message
- Uses `useAuthStore` to persist ID

**Features**:
- Input field (max 17 digits)
- Form validation:
  - Checks if empty
  - Validates 17-digit length
  - Validates numeric only
- Error display
- Help text
- Clear styling

**Styling**:
```
- Max-width: 420px
- Centered container
- Form padding: 40px
- Border: 1px solid var(--border)
- Border radius: 12px
- Box shadow: var(--shadow)
```

---

### ClassList.jsx
**Purpose**: Display available classes in grid

**Props**: None

**State**:
- `classes` - Array of class objects
- `loading` - Loading state
- `error` - Error message

**API Calls**:
- `classApi.getAll()` - Fetch all classes

**Features**:
- Responsive grid layout
- Class cards with:
  - Name and section
  - Total/available seats
  - Progress bar
  - Status badge
  - Apply button (disabled if full)
- Loading spinner
- Error message
- Empty state

**Card Layout**:
```
┌─ Card Header ─────────────────┐
│ Name          [Status Badge]  │
├─────────────────────────────  │
│ Section: A                    │
│                               │
│ Total: 30  Available: 5       │
│                               │
│ [Progress Bar]                │
│ 17% available                 │
│                               │
│ [   Apply Now Button   ]       │
└───────────────────────────────┘
```

**Styling**:
```
- Grid: repeat(auto-fill, minmax(320px, 1fr))
- Gap: 24px
- Card border: 1px solid var(--border)
- Card radius: 12px
- Progress bar: 6px height, 3px radius
```

---

### MyApplications.jsx
**Purpose**: Display and manage student applications

**Props**: None

**State**:
- `holds` - Array of hold objects
- `loading` - Loading state
- `error` - Error message

**API Calls**:
- `holdApi.getStudentHolds()` - Fetch all holds
- `holdApi.confirm(holdId)` - Confirm admission
- `holdApi.cancel(holdId)` - Cancel application

**Features**:
- List view of all applications
- Hold cards with:
  - Application ID (truncated)
  - Status badge with color coding
  - Created and expiry dates
  - Time remaining countdown
  - Action buttons (Confirm/Cancel)
- Real-time status updates
- Confirmation dialogs
- Loading spinner
- Error message
- Empty state

**Hold Card Layout**:
```
┌─ Card Header ─────────────────────┐
│ Application h_xxxxx [Status]      │
│ Class ID: c_yyyyy                 │
├────────────────────────────────── │
│ Created: 12/20/2024 2:30 PM       │
│ Expires: 12/27/2024 2:30 PM       │
│                                   │
│ Time Remaining: 5h                │
├────────────────────────────────── │
│ [Confirm Admission]  [Cancel]     │
└───────────────────────────────────┘
```

**Status Badge Colors**:
```
Held (Pending): #f59e0b (amber) - Yellow bg
Confirmed: #10b981 (green) - Green bg
Expired: #6b7280 (gray) - Gray bg
Cancelled: #ef4444 (red) - Red bg
```

**Styling**:
```
- List: Single column, full width
- Card border: 1px solid var(--border)
- Card radius: 12px
- Card gap: 16px
- Padding: 20px per section
```

---

### Footer.jsx
**Purpose**: Footer with copyright info

**Props**: None

**State**: None

**Features**:
- Sticky to bottom via flex
- App name and version
- Copyright info
- Light background

**Styling**:
```
- Background: var(--bg-secondary)
- Border top: 1px solid var(--border)
- Padding: 24px vertical
- Margin-top: auto (flex)
- Text alignment: center
```

---

## Component Interaction Flow

```
App.jsx
├── Header
│   └── [Logout clears Zustand store]
│
├── Content (conditional render):
│   │
│   ├── !studentId
│   │   └── StudentIdForm
│   │       └── [Sets studentId in Zustand]
│   │
│   ├── currentPage === 'hero'
│   │   └── HeroSection
│   │       └── [Sets currentPage to 'classes']
│   │
│   ├── currentPage === 'classes'
│   │   └── ClassList
│   │       └── Fetches classes on mount
│   │
│   └── currentPage === 'applications'
│       └── MyApplications
│           └── Fetches holds on mount
│
└── Footer
```

---

## Data Flow

### Class List Flow
```
Component Mount
  ↓
useEffect → classApi.getAll()
  ↓
Set state: classes
  ↓
Map through classes → ClassCard
  ↓
Render grid
```

### Applications Flow
```
Component Mount
  ↓
useEffect → holdApi.getStudentHolds()
  ↓
Set state: holds
  ↓
Map through holds → HoldCard
  ↓
Render list
  ↓
User clicks action → API call
  ↓
Update holds state → Re-render
```

---

## API Integration

### Headers Automatically Added
```
X-Student-Id: {studentId}
Content-Type: application/json
```

### Response Format Expected
```javascript
{
  data: [...],           // Array or single object
  message: "...",        // Optional
  success: true
}
```

---

## State Management

### Zustand Store (authStore.js)
```javascript
{
  studentId: string | null,
  setStudentId: (id: string) => void,
  clearStudentId: () => void
}
```

**Persistence**: Stored in localStorage
**Key**: `auth-store`

---

## Styling Patterns

### Color Variables
```css
--text: #4b5563
--text-h: #1a1f2e
--bg: #ffffff
--bg-secondary: #f8f9fb
--border: #e8eaed
--accent: #2563eb
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
```

### Responsive Design
```
Desktop: Full grid/flex
Tablet: 2-column → 1-column
Mobile: Stacked layout
```

### Hover Effects
```css
transition: all 0.2s ease;
opacity: 0.8 or
background: darker shade
```

---

## Error Handling

### API Errors
```javascript
try {
  const response = await apiCall();
  // Handle success
} catch (err) {
  setError(err.message || 'Default error');
}
```

### Form Validation
```javascript
if (!studentId.trim()) {
  setError('Please enter your Student ID');
}
```

### User Confirmations
```javascript
if (window.confirm('Are you sure?')) {
  // Proceed with action
}
```

---

## Performance Optimizations

1. **Lazy loading**: Components load only when needed
2. **useEffect dependencies**: Proper dependency arrays
3. **State updates**: Only re-render when necessary
4. **API calls**: Debounced and error-handled
5. **CSS**: Inline prevents render-blocking

---

## Accessibility Features

- Semantic HTML buttons and inputs
- Clear focus indicators
- Proper labels and help text
- Keyboard navigation support
- Color contrast compliant
- Loading state announcements

---

## Testing Checklist

- [ ] Form validation works
- [ ] Classes load correctly
- [ ] Apply button functionality
- [ ] Applications display correctly
- [ ] Status badges show right colors
- [ ] Time countdown updates
- [ ] Confirm/Cancel buttons work
- [ ] Logout clears data
- [ ] Error handling works
- [ ] Loading states display
- [ ] Empty states show
- [ ] Responsive on mobile
