# UI Layout & Design Reference

## Color Palette

```
Primary:  #2563eb (Blue - Accent)
Success:  #10b981 (Green)
Warning:  #f59e0b (Amber)
Error:    #ef4444 (Red)
Text:     #4b5563 (Dark Gray)
Bg:       #ffffff (White)
Bg-2nd:   #f8f9fb (Light Gray)
Border:   #e8eaed (Border Gray)
```

## Typography

```
h1: 48px, font-weight 600
h2: 32px, font-weight 600
h3: 20px, font-weight 600
Body: 16px, font-weight 400
Small: 14px, font-weight 400
Label: 12px, font-weight 500
```

## Component Heights & Spacing

```
Header: 64px
Hero: 80px padding top/bottom
Card padding: 20px
Gap between elements: 16-24px
Border radius: 8-12px
Shadow: 0 4px 12px rgba(0,0,0,0.08)
```

## Layout Structure

```
┌─────────────────────────────────────────┐
│ Header (sticky)                         │
├─────────────────────────────────────────┤
│                                         │
│ Main Content (flex: 1)                  │
│ - HeroSection OR ClassList OR MyApps   │
│                                         │
├─────────────────────────────────────────┤
│ Footer (sticky bottom)                  │
└─────────────────────────────────────────┘
```

## Page Flows

### 1. Authentication Flow
```
App Start
  ↓
Check if studentId exists
  ├─ NO: Show StudentIdForm
  │        ↓
  │    User enters 17-digit ID
  │        ↓
  │    Store in Zustand + localStorage
  │        ↓
  └─→ YES/After form: Show HeroSection
```

### 2. Main Navigation Flow
```
HeroSection
  ↓
[Get Started] → ClassList
  ↓
[Apply Now] → navigate to MyApplications
  ↓
[Confirm] → Update status (confirm API)
[Cancel]  → Remove from list (delete API)
```

### 3. Component Tree
```
App
├── Header
│   ├── Logo
│   ├── Student ID (if logged in)
│   └── Logout button
├── Main Content (conditional)
│   ├── StudentIdForm (if no studentId)
│   ├── HeroSection (default view)
│   ├── ClassList (classes view)
│   └── MyApplications (applications view)
└── Footer
```

## ClassList Card Design

```
┌─────────────────────────────────┐
│ Class Name        [Badge]       │  ← Header
├─────────────────────────────────┤
│ Section: A                      │
│                                 │
│ Total Seats: 30    Available: 5 │
│                                 │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← Progress Bar
│ 17% available                   │
├─────────────────────────────────┤
│ [    Apply Now    ]             │  ← Button
└─────────────────────────────────┘
```

## MyApplications Card Design

```
┌──────────────────────────────────────┐
│ Application h_xxxxx... [Badge]       │  ← Header
│ Class ID: c_yyyyyyy                  │
├──────────────────────────────────────┤
│ Created:  12/20/2024 2:30 PM        │
│ Expires:  12/27/2024 2:30 PM        │
│ Time Remaining: 5h                   │
├──────────────────────────────────────┤
│ [  Confirm Admission  ] [  Cancel  ] │  ← Actions
└──────────────────────────────────────┘
```

## Responsive Breakpoints

```
Desktop: 1200px (max-width)
Tablet:  768px (single column)
Mobile:  320px+
```

## Grid Layouts

### ClassList Grid
- Desktop: 3 columns (auto-fill, minmax 320px)
- Tablet: 2 columns
- Mobile: 1 column

### MyApplications List
- Single column, 100% width
- Stacks vertically

## Interaction States

### Buttons
- Normal: var(--accent), white text
- Hover: #1d4ed8 (darker blue)
- Disabled: opacity 0.5, cursor not-allowed
- Transition: 0.2s ease

### Inputs
- Border: 1px solid var(--border)
- Focus: outline blue
- Transition: 0.2s ease

### Links
- Color: var(--accent)
- Hover: opacity 0.8

## Status Badge Colors

| Status | Color | Background |
|--------|-------|------------|
| Pending (Held) | #f59e0b | #fef3c7 |
| Confirmed | #10b981 | #d1fae5 |
| Expired | #6b7280 | #f3f4f6 |
| Cancelled | #ef4444 | #fee2e2 |
| Available | #2563eb | #dbeafe |

## Loading & Empty States

### Loading Spinner
```
  ↻ (rotating)
  12px border, 3px top border colored
  40px × 40px size
```

### Empty State
- Centered message
- Light text color
- Min 60vh height

### Error State
- Red text color
- Descriptive message
- Min 60vh height

## Animation Details

### Spinner
```css
animation: spin 1s linear infinite;
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Transitions
```css
transition: all 0.2s ease;      /* Quick feedback */
transition: all 0.3s ease;      /* Smooth animations */
```

## Accessibility Features

- Clear focus indicators
- Semantic HTML buttons
- ARIA labels where needed
- Keyboard navigation support
- Color contrast: 4.5:1 minimum

## Performance Considerations

- Inline CSS prevents FOUC
- Lazy component loading
- Optimized re-renders (hooks)
- Minimal state updates (Zustand)
- Request/response caching (axios)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
