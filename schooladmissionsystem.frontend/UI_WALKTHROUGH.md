# UI Walkthrough - Visual Guide

## User Journey

### Step 1: Application Launch
```
┌─────────────────────────────────────────────────┐
│ Header: "School Admission System"               │
├─────────────────────────────────────────────────┤
│                                                 │
│          Enter Your Student ID                  │
│          (17-digit birth registration)          │
│                                                 │
│          [____________________]                 │
│          (Input field)                          │
│                                                 │
│          [  Continue Button  ]                  │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer: "School Admission System v1.0"          │
└─────────────────────────────────────────────────┘

User enters 17-digit Student ID
Validation ensures numeric and correct length
Click Continue → Stores in localStorage
```

---

### Step 2: Hero Section
```
┌─────────────────────────────────────────────────┐
│ Header: "School Admission" [StudentID] [Logout] │
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│  Secure Your School Seat Today                  │
│                                                 │
│  Apply for admission, manage your               │
│  applications, and get instant confirmation.   │
│  Simple, fast, and secure.                     │
│                                                 │
│                                                 │
│             [  Get Started  ]                   │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer: "School Admission System v1.0"          │
└─────────────────────────────────────────────────┘

User clicks Get Started → Loads ClassList
```

---

### Step 3: Available Classes
```
┌─────────────────────────────────────────────────┐
│ Header: "School Admission" [StudentID] [Logout] │
├─────────────────────────────────────────────────┤
│                                                 │
│              Available Classes                  │
│                                                 │
│  ┌──────────────────┐ ┌──────────────────┐      │
│  │ Class 6-A        │ │ Class 6-B        │      │
│  │ [Available]      │ │ [Available]      │      │
│  │ Section: A       │ │ Section: B       │      │
│  │                  │ │                  │      │
│  │ Total: 30        │ │ Total: 30        │      │
│  │ Available: 8     │ │ Available: 0     │      │
│  │                  │ │                  │      │
│  │ 27% available    │ │ 0% available     │      │
│  │ ████░░░░░░░░░░░│ │ ░░░░░░░░░░░░░░░│      │
│  │                  │ │                  │      │
│  │ [  Apply Now  ]  │ │ [ Class Full  ]  │      │
│  └──────────────────┘ └──────────────────┘      │
│                                                 │
│  ┌──────────────────┐                          │
│  │ Class 6-C        │                          │
│  │ [Available]      │                          │
│  │ Section: C       │                          │
│  │                  │                          │
│  │ Total: 35        │                          │
│  │ Available: 12    │                          │
│  │                  │                          │
│  │ 34% available    │                          │
│  │ ██████░░░░░░░░░│                          │
│  │                  │                          │
│  │ [  Apply Now  ]  │                          │
│  └──────────────────┘                          │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer: "School Admission System v1.0"          │
└─────────────────────────────────────────────────┘

User sees all available classes
Can click "Apply Now" on any available class
Classes with no seats show "Class Full"
```

---

### Step 4: After Applying
```
┌─────────────────────────────────────────────────┐
│ Header: "School Admission" [StudentID] [Logout] │
├─────────────────────────────────────────────────┤
│                                                 │
│                My Applications                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Application h_a1b2c3d4                  │   │
│  │ Class ID: c_class001                    │   │
│  │                       [Pending]         │   │
│  ├─────────────────────────────────────────┤   │
│  │ Created: 12/20/2024 2:30 PM             │   │
│  │ Expires: 12/27/2024 2:30 PM             │   │
│  │                                         │   │
│  │ Time Remaining: 5h                      │   │
│  │ (Yellow alert box)                      │   │
│  ├─────────────────────────────────────────┤   │
│  │ [ Confirm Admission ]  [ Cancel ]       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Application h_e5f6g7h8                  │   │
│  │ Class ID: c_class002                    │   │
│  │                     [Confirmed]         │   │
│  ├─────────────────────────────────────────┤   │
│  │ Created: 12/15/2024 10:00 AM            │   │
│  │ Expires: 12/22/2024 10:00 AM            │   │
│  │ Confirmed: 12/20/2024 2:45 PM           │   │
│  ├─────────────────────────────────────────┤   │
│  │ [ Cancel ]                              │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│ Footer: "School Admission System v1.0"          │
└─────────────────────────────────────────────────┘

User can see all their applications
Each shows current status with color badge
Can confirm (pay fee) or cancel application
Time remaining updates in real-time
```

---

## Status Badge Colors

| Status | Color | Badge Look |
|--------|-------|-----------|
| Pending | [Yellow] | Pending |
| Confirmed | [Green] | Confirmed |
| Expired | [Gray] | Expired |
| Cancelled | [Red] | Cancelled |

---

## Interactive Elements

### Buttons
```
Normal State:
┌─────────────────────┐
│  Apply Now          │  ← Blue background
│                     │
└─────────────────────┘

Hover State:
┌─────────────────────┐
│  Apply Now          │  ← Darker blue
│                     │
└─────────────────────┘

Disabled State:
┌─────────────────────┐
│  Class Full         │  ← Faded, cursor not-allowed
│                     │
└─────────────────────┘
```

### Input Fields
```
Normal State:
┌─────────────────────────────────┐
│ Enter your 17-digit ID          │  ← Gray border
└─────────────────────────────────┘

Focus State:
┌─────────────────────────────────┐
│ Enter your 17-digit ID          │  ← Blue border, slight shadow
└─────────────────────────────────┘

Error State:
┌─────────────────────────────────┐
│ 1234567890123456                │
└─────────────────────────────────┘
✗ Student ID must be 17 digits    ← Red error text
```

---

## Loading States

### Loading Spinner
```
While fetching data:
		  ↻
	  (rotating)
	Loading classes...
```

### Empty State
```
No applications yet
(centered message)
```

### Error State
```
Failed to load classes
(centered error message in red)
```

---

## Responsive Design

### Desktop (1200px+)
```
┌────────────────────────────────────────────┐
│ Header                                     │
├────────────────────────────────────────────┤
│                                            │
│  [Card] [Card] [Card] [Card]               │
│  [Card] [Card] [Card]                      │
│                                            │
├────────────────────────────────────────────┤
│ Footer                                     │
└────────────────────────────────────────────┘

Grid: 4 columns (auto-fill)
```

### Tablet (768px - 1199px)
```
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│                          │
│  [Card]    [Card]        │
│  [Card]    [Card]        │
│  [Card]    [Card]        │
│                          │
├──────────────────────────┤
│ Footer                   │
└──────────────────────────┘

Grid: 2 columns
```

### Mobile (< 768px)
```
┌──────────────┐
│ Header       │
├──────────────┤
│              │
│ [Card]       │
│ [Card]       │
│ [Card]       │
│              │
├──────────────┤
│ Footer       │
└──────────────┘

Grid: 1 column
Full width
```

---

## Navigation Flow Diagram

```
┌──────────────────┐
│  App Start       │
└────────┬─────────┘
		 │
		 ▼
┌──────────────────┐
│ Has StudentId?   │
└────┬─────────┬───┘
	 │ NO      │ YES
	 ▼         ▼
┌──────────┐ ┌──────────┐
│  Form    │ │ HeroSec  │
└────┬─────┘ └─────┬────┘
	 │             │
	 │    ┌────────┘
	 │    ▼
	 │ ┌──────────┐
	 │ │ClassList │
	 │ └────┬─────┘
	 │      │
	 │    [Apply Now]
	 │      │
	 │      ▼
	 │  ┌──────────────┐
	 │  │ MyApplic...  │
	 │  └────┬─────────┘
	 │       │
	 │    [Confirm/Cancel]
	 │       │
	 └───────┘
		 │
		 ▼
	  Update Status
```

---

## Data Display Patterns

### Class Card Content
```
┌─────────────────────────────┐
│ Title     Section: A        │  ← Header
│                             │
│ Total: 30  Available: 5     │  ← Stats
│                             │
│ ██░░░░░░░░░░░░░░░░░░░░░░  │  ← Progress
│ 17% available               │
│                             │
│ [ Apply Now ]               │  ← Action
└─────────────────────────────┘
```

### Application Card Content
```
┌─────────────────────────────┐
│ ID: h_xxx    Status: Pending│  ← Header
│ Class: c_yyy                │
│                             │
│ Created: 12/20 2:30 PM      │  ← Dates
│ Expires: 12/27 2:30 PM      │
│                             │
│ Time Left: 5h               │  ← Countdown
│                             │
│ [Confirm] [Cancel]          │  ← Actions
└─────────────────────────────┘
```

---

## Color Usage in Context

```
Blue (#2563eb):
- Primary buttons
- Links
- Active elements
- Progress indication

Green (#10b981):
- Success messages
- Available seats
- Confirmed status
- Progress bars

Yellow (#f59e0b):
- Warning messages
- Pending status
- Alert boxes

Red (#ef4444):
- Errors
- Cancelled status
- Destructive actions

Gray (#4b5563):
- Body text
- Normal state

Dark Gray (#1a1f2e):
- Headings
- High emphasis text

Light Gray (#f8f9fb):
- Secondary backgrounds
- Subtle separators

Border Gray (#e8eaed):
- Card borders
- Dividers
- Input borders
```

---

## Animation Sequences

### Button Hover
```
Starts: #2563eb
Hover: #1d4ed8 (darker)
Duration: 0.2s
Type: ease
```

### Page Load
```
Content: Fade in over 0.5s
Cards: Slide up on load
Spinner: Continuous rotation
```

### Status Update
```
Card updates: Smooth transition
Status badge: Color change
Time countdown: Real-time update
```

---

## Accessibility Features

### Keyboard Navigation
- Tab through buttons and inputs
- Enter to submit forms
- Tab to navigate buttons
- Escape to close modals (if any)

### Focus Indicators
- Blue outline on focus
- 2px width
- 2px offset

### Color Independence
- Not relying on color alone
- Status text + badge
- Icons + labels
- Success checkmarks

### Text Alternatives
- All images have alt text
- Icons have aria-labels
- Form inputs have associated labels
- Error messages are text-based

---

## Summary of Screens

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| StudentIdForm | Authentication | Input, validation, submit |
| HeroSection | Welcome | Title, subtitle, CTA button |
| ClassList | Browse | Grid, cards, availability, apply button |
| MyApplications | Manage | List, status, dates, actions |
| Header | Navigation | Logo, student info, logout |
| Footer | Info | Copyright, version |

---

This walkthrough shows the complete user journey through the School Admission System UI. All screens are clean, minimal, and focus on the core functionality needed for students to apply and manage their admissions.
