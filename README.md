# Attendance Management System

A simple, responsive web-based attendance tracking application built with HTML, CSS, and JavaScript.

## Features

✅ **Dashboard** - View real-time attendance statistics
- Total students count
- Present/Absent count for today
- Attendance percentage
- Visual chart representation

✅ **Mark Attendance** - Easily mark attendance for students
- Select date to mark attendance
- Mark students as present/absent individually
- Bulk operations (mark all present/absent)
- Save attendance records

✅ **Manage Students** - Add and manage student database
- Add new students with roll number
- View all registered students
- Delete students from the system
- Track date when student was added

✅ **Reports** - Generate and analyze attendance records
- View complete attendance history
- Filter by individual student or view all students
- Export attendance data to CSV file
- Sort records by date

## How to Use

### 1. Getting Started
- Open `index.html` in any modern web browser
- No installation or server required

### 2. Adding Students
1. Go to the **"Manage Students"** tab
2. Enter student name and roll number
3. Click **"Add Student"** button
4. Student appears in the list

### 3. Marking Attendance
1. Go to the **"Mark Attendance"** tab
2. Select the date (defaults to today)
3. Mark each student as:
   - **Present** - Student is here
   - **Absent** - Student is not here
   - **Unmarked** - No mark yet
4. Use buttons to:
   - **Mark All Present** - Quick attendance for all
   - **Mark All Absent** - Quick absence for all
5. Click **"Save Attendance"** to store

### 4. Viewing Dashboard
- Go to the **"Dashboard"** tab
- See today's attendance statistics
- View attendance rate and bar chart
- Real-time updates when data changes

### 5. Generating Reports
1. Go to the **"Reports"** tab
2. Optional: Select a specific student to filter
3. Click **"Generate Report"** to view
4. Click **"Export as CSV"** to download

## Data Storage

- All data is stored in browser's **localStorage**
- Data persists even after closing the browser
- Clear browser data will delete all records
- Each browser/device has separate data

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge
- Any modern browser with localStorage support

## File Structure

```
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Features for Each Tab

### Dashboard
- Real-time statistics
- Visual chart representation
- Quick overview of attendance status

### Mark Attendance
- Date selector
- Student list with status dropdown
- Individual update buttons
- Bulk mark operations
- Save all changes

### Manage Students
- Add new students
- Delete students
- View added date
- Student count

### Reports
- Filter by student
- View attendance history
- Export to CSV format
- Complete attendance records

## Tips & Tricks

1. **Use Bulk Operations**: Use "Mark All Present" or "Mark All Absent" for faster attendance marking
2. **Export Data**: Export reports regularly for backup
3. **Date Navigation**: Switch dates in Mark Attendance tab to view/edit past attendance
4. **Roll Numbers**: Use unique roll numbers for easy identification
5. **Clear History**: Manage Reports tab to review attendance patterns

## Keyboard Shortcuts

- Press Tab to navigate between fields
- Press Enter in forms to submit

## Support

For issues or suggestions:
1. Check if JavaScript is enabled in your browser
2. Try clearing browser cache
3. Use the latest version of your browser
4. Ensure localStorage is not disabled

## Version

Version 1.0.0 - March 2026

---

**Made with ❤️ for easy attendance tracking**
