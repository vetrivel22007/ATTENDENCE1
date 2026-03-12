// Data Storage
let students = [];
let attendance = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    setDateDisplay();
    setupTabNavigation();
    setDefaultDate();
    updateDashboard();
    renderStudentsList();
    renderAttendanceTable();
    populateReportSelect();
});

// Load data from localStorage
function loadDataFromStorage() {
    const savedStudents = localStorage.getItem('students');
    const savedAttendance = localStorage.getItem('attendance');
    
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }
    if (savedAttendance) {
        attendance = JSON.parse(savedAttendance);
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('attendance', JSON.stringify(attendance));
}

// Set current date display
function setDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('dateDisplay').textContent = today;
}

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Refresh report when reports tab is clicked
            if (tabName === 'reports') {
                generateReport();
            }
        });
    });
}

// Set default date to today
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
}

// Add student
function addStudent() {
    const nameInput = document.getElementById('studentName');
    const rollInput = document.getElementById('rollNo');
    const name = nameInput.value.trim();
    const rollNo = rollInput.value.trim();

    if (!name || !rollNo) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    if (students.some(s => s.rollNo === rollNo)) {
        showNotification('Roll number already exists', 'error');
        return;
    }

    const newStudent = {
        id: Date.now(),
        name: name,
        rollNo: rollNo,
        dateAdded: new Date().toLocaleDateString()
    };

    students.push(newStudent);
    saveDataToStorage();
    
    nameInput.value = '';
    rollInput.value = '';
    
    renderStudentsList();
    renderAttendanceTable();
    populateReportSelect();
    updateDashboard();
    showNotification('Student added successfully', 'success');
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        attendance = attendance.filter(a => a.studentId !== id);
        saveDataToStorage();
        renderStudentsList();
        renderAttendanceTable();
        populateReportSelect();
        updateDashboard();
        showNotification('Student deleted successfully', 'success');
    }
}

// Render students list
function renderStudentsList() {
    const tableBody = document.getElementById('studentsTableBody');
    const noMsg = document.getElementById('noStudentsListMsg');
    const table = document.getElementById('studentsTable');

    tableBody.innerHTML = '';

    if (students.length === 0) {
        table.style.display = 'none';
        noMsg.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noMsg.style.display = 'none';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>${student.dateAdded}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteStudent(${student.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Render attendance table
function renderAttendanceTable() {
    const tableBody = document.getElementById('attendanceTableBody');
    const noMsg = document.getElementById('noStudentsMsg');
    const table = document.getElementById('attendanceTable');

    tableBody.innerHTML = '';

    if (students.length === 0) {
        table.style.display = 'none';
        noMsg.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    noMsg.style.display = 'none';

    const selectedDate = document.getElementById('attendanceDate').value;

    students.forEach(student => {
        const attendanceRecord = attendance.find(a => 
            a.studentId === student.id && a.date === selectedDate
        );
        const status = attendanceRecord ? attendanceRecord.status : 'unmarked';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>
                <select class="status-select" id="status-${student.id}">
                    <option value="unmarked" ${status === 'unmarked' ? 'selected' : ''}>Unmarked</option>
                    <option value="present" ${status === 'present' ? 'selected' : ''}>Present</option>
                    <option value="absent" ${status === 'absent' ? 'selected' : ''}>Absent</option>
                </select>
            </td>
            <td>
                <button class="btn btn-primary btn-small" onclick="markIndividual(${student.id})">Update</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Mark individual attendance
function markIndividual(studentId) {
    const selectedDate = document.getElementById('attendanceDate').value;
    const status = document.getElementById(`status-${studentId}`).value;

    if (status === 'unmarked') {
        showNotification('Please select a status', 'error');
        return;
    }

    const existingRecord = attendance.find(a => 
        a.studentId === studentId && a.date === selectedDate
    );

    if (existingRecord) {
        existingRecord.status = status;
    } else {
        attendance.push({
            id: Date.now(),
            studentId: studentId,
            date: selectedDate,
            status: status
        });
    }

    saveDataToStorage();
    updateDashboard();
    showNotification('Attendance updated successfully', 'success');
}

// Mark all present
function markAllPresent() {
    const selectedDate = document.getElementById('attendanceDate').value;
    
    students.forEach(student => {
        const existingRecord = attendance.find(a => 
            a.studentId === student.id && a.date === selectedDate
        );

        if (existingRecord) {
            existingRecord.status = 'present';
        } else {
            attendance.push({
                id: Date.now() + Math.random(),
                studentId: student.id,
                date: selectedDate,
                status: 'present'
            });
        }
    });

    saveDataToStorage();
    renderAttendanceTable();
    updateDashboard();
    showNotification('All students marked present', 'success');
}

// Mark all absent
function markAllAbsent() {
    const selectedDate = document.getElementById('attendanceDate').value;
    
    students.forEach(student => {
        const existingRecord = attendance.find(a => 
            a.studentId === student.id && a.date === selectedDate
        );

        if (existingRecord) {
            existingRecord.status = 'absent';
        } else {
            attendance.push({
                id: Date.now() + Math.random(),
                studentId: student.id,
                date: selectedDate,
                status: 'absent'
            });
        }
    });

    saveDataToStorage();
    renderAttendanceTable();
    updateDashboard();
    showNotification('All students marked absent', 'success');
}

// Save attendance (same as update in this case)
function saveAttendance() {
    saveDataToStorage();
    showNotification('Attendance saved successfully', 'success');
}

// Update dashboard
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    
    const totalStudents = students.length;
    const presentToday = attendance.filter(a => 
        a.date === today && a.status === 'present'
    ).length;
    const absentToday = attendance.filter(a => 
        a.date === today && a.status === 'absent'
    ).length;
    
    const attendanceRate = totalStudents > 0 
        ? Math.round((presentToday / totalStudents) * 100) 
        : 0;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('presentToday').textContent = presentToday;
    document.getElementById('absentToday').textContent = absentToday;
    document.getElementById('attendanceRate').textContent = attendanceRate + '%';

    // Update chart
    updateChart(presentToday, absentToday, totalStudents - presentToday - absentToday);
}

// Update chart
function updateChart(present, absent, unmarked) {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = '';

    const maxValue = Math.max(present, absent, unmarked, 1);
    
    const data = [
        { label: 'Present', value: present, color: '#2ecc71' },
        { label: 'Absent', value: absent, color: '#e74c3c' },
        { label: 'Unmarked', value: unmarked, color: '#95a5a6' }
    ];

    data.forEach(item => {
        const percentage = (item.value / maxValue) * 100;
        const barHtml = `
            <div class="chart-bar">
                <div class="bar" style="height: ${percentage}%; background: ${item.color};"></div>
                <div class="bar-label">${item.label}</div>
                <div class="bar-value">${item.value}</div>
            </div>
        `;
        chartContainer.innerHTML += barHtml;
    });
}

// Populate report select
function populateReportSelect() {
    const select = document.getElementById('reportStudent');
    const currentValue = select.value;

    const options = '<option value="">All Students</option>';
    const studentOptions = students.map(s => 
        `<option value="${s.id}">${s.name} (${s.rollNo})</option>`
    ).join('');

    select.innerHTML = options + studentOptions;
    select.value = currentValue;
}

// Generate report
function generateReport() {
    const selectedStudentId = document.getElementById('reportStudent').value;
    const reportTableBody = document.getElementById('reportTableBody');
    const noReportMsg = document.getElementById('noReportDataMsg');
    const reportTable = document.getElementById('reportTable');

    reportTableBody.innerHTML = '';

    let filteredAttendance = [...attendance];

    if (selectedStudentId) {
        filteredAttendance = filteredAttendance.filter(a => 
            a.studentId === parseInt(selectedStudentId)
        );
    }

    // Sort by date
    filteredAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredAttendance.length === 0) {
        reportTable.style.display = 'none';
        noReportMsg.style.display = 'block';
        return;
    }

    reportTable.style.display = 'table';
    noReportMsg.style.display = 'none';

    filteredAttendance.forEach(record => {
        const student = students.find(s => s.id === record.studentId);
        if (student) {
            const statusClass = `status-${record.status}`;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNo}</td>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                </td>
            `;
            reportTableBody.appendChild(row);
        }
    });
}

// Export report to CSV
function exportReportCSV() {
    if (attendance.length === 0) {
        showNotification('No attendance data to export', 'error');
        return;
    }

    const selectedStudentId = document.getElementById('reportStudent').value;
    let filteredAttendance = [...attendance];

    if (selectedStudentId) {
        filteredAttendance = filteredAttendance.filter(a => 
            a.studentId === parseInt(selectedStudentId)
        );
    }

    if (filteredAttendance.length === 0) {
        showNotification('No data to export for selected student', 'error');
        return;
    }

    let csv = 'Student Name,Roll No,Date,Status\n';

    filteredAttendance.forEach(record => {
        const student = students.find(s => s.id === record.studentId);
        if (student) {
            csv += `${student.name},${student.rollNo},${new Date(record.date).toLocaleDateString()},${record.status}\n`;
        }
    });

    downloadCSV(csv, 'attendance_report.csv');
    showNotification('Report exported successfully', 'success');
}

// Download CSV
function downloadCSV(csv, filename) {
    const link = document.createElement('a');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Event listeners
document.getElementById('attendanceDate').addEventListener('change', function() {
    renderAttendanceTable();
    updateDashboard();
});
