// Declare the html2pdf function
var html2pdf;

// Declare the schedule interface
// In JavaScript, we don't need to declare interfaces

// Declare the global variables
let scheduleList = [];
const scheduleContainer = document.getElementById('scheduleContainer');
const timetableForm = document.getElementById('timetableForm');
const timetableOutput = document.getElementById('timetableOutput');
const pdfButton = document.getElementById('downloadPdf');
let schoolLogoSrc = ''; // To hold the school logo source

// Update CSS variables based on user input
function updateCSSVariables(fontColor, bgColor, tableHeaderColor, fontFamily) {
    const style = document.createElement('style');
    style.innerHTML = `
        #timetableOutput {
            color: ${fontColor};
            background-color: ${bgColor};
            font-family: ${fontFamily}; /* Apply selected font to the timetable */
        }
        #timetableOutput th {
            background-color: ${tableHeaderColor};
        }
        #timetableOutput, #timetableOutput th, #timetableOutput td {
            font-family: ${fontFamily}; /* Apply selected font to table headers, rows, and the entire timetable */
        }
    `;
    document.head.appendChild(style);
}

// Function to create new schedule input fields
function createScheduleFields(index) {
    const scheduleDiv = document.createElement('div');
    scheduleDiv.classList.add('scheduleEntry');
    scheduleDiv.setAttribute('data-index', index.toString());

    scheduleDiv.innerHTML = `
        <label for="date-${index}">Date:</label>
        <input type="date" id="date-${index}" >

        <label for="teacherName-${index}">Teacher:</label>
        <input type="text" id="teacherName-${index}" placeholder="Enter teacher name" required>

        <label for="subjectName-${index}">Subject:</label>
        <input type="text" id="subjectName-${index}" placeholder="Enter subject" required>

        <label for="day-${index}">Day:</label>
        <select id="day-${index}" required>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Full Week">Full Week</option>
        </select>

        <label for="startTime-${index}">Start Time:</label>
        <input type="time" id="startTime-${index}" required>

        <label for="endTime-${index}">End Time:</label>
        <input type="time" id="endTime-${index}" required>

        <button type="button" class="removeScheduleBtn">Remove</button>
    `;

    // Append new schedule fields to the container
    scheduleContainer.appendChild(scheduleDiv);
}

// Event listener to add new schedule inputs
document.getElementById('addScheduleBtn')?.addEventListener('click', () => {
    const currentIndex = scheduleContainer.children.length;
    createScheduleFields(currentIndex);
});

// Remove schedule entry
scheduleContainer.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('removeScheduleBtn')) {
        const scheduleDiv = target.closest('.scheduleEntry');
        if (scheduleDiv) {
            scheduleContainer.removeChild(scheduleDiv);
        }
    }
});

// Handle form submission to create the timetable
timetableForm.onsubmit = function (e) {
    e.preventDefault();

    const schoolName = document.getElementById('schoolName').value;
    const className = document.getElementById('className').value;
    const title = document.getElementById('title').value;
    const fontColor = document.getElementById('fontColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const tableHeaderColor = document.getElementById('tableHeaderColor').value;
    const fontFamily = document.getElementById('fontFamily').value;
    const schoolLogoInput = document.getElementById('schoolLogo');

    if (!schoolName || !className || !title || scheduleContainer.children.length === 0 || !schoolLogoInput.files.length) {
        alert("Please fill in all fields, add at least one schedule, and upload a logo.");
        return;
    }

    // Update CSS variables with user-selected colors and font
    updateCSSVariables(fontColor, bgColor, tableHeaderColor, fontFamily);

    // Read the logo file
    const file = schoolLogoInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        schoolLogoSrc = event.target.result; // Set the logo source

        // Generate timetable output after logo is loaded
        generateTimetable(schoolName, title, className);
    };
    reader.readAsDataURL(file); // Read the logo file as a data URL
};

// Function to generate the timetable
function generateTimetable(schoolName, title, className) {
    scheduleList = []; // Clear previous schedule entries
    let hasDate = false; // Flag to check if any date is provided

    for (let i = 0; i < scheduleContainer.children.length; i++) {
        const date = document.getElementById(`date-${i}`).value; // Get the date value
        const teacherName = document.getElementById(`teacherName-${i}`).value;
        const subjectName = document.getElementById(`subjectName-${i}`).value;
        const day = document.getElementById(`day-${i}`).value;
        const startTime = document.getElementById(`startTime-${i}`).value;
        const endTime = document.getElementById(`endTime-${i}`).value;

        // Only alert if teacher, subject, start time, or end time is missing
        if (!teacherName || !subjectName || !startTime || !endTime) {
            alert("Please fill in all fields for each schedule except Date.");
            return;
        }

        if (date) {
            hasDate = true; // Set flag if a date is provided
        }

        scheduleList.push({
            date: date || undefined, // Include the date if it exists
            teacher: teacherName,
            subject: subjectName,
            day: day,
            startTime: startTime,
            endTime: endTime
        });
    }

    // Generate timetable output with logo, school name, and custom styles
    let timetableOutputHTML = `
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: -40px;">
            <img src="${schoolLogoSrc}" alt="School Logo" style="width: 100px; height: 100px; margin-right: 5px; ">
            <h2 style="font-size:30px; font-family: 'Playfair Display', serif;  margin: 0 55px 0px 10px;">${schoolName}</h2> <!-- Use Playfair Display for the school name -->
        </div>
        <h3 style="font-size:20px; text-align: center; font-family: 'Playfair Display', serif;"> <span style="color: red; font-size: 20px;">${title}</span></h3>
        <h3 style="font-size:20px; text-align: center; font-family: 'Playfair Display', serif;">Class: <span style="color: red; font-size: 20px;">${className}</span></h3>
        <table style="width: 80%; margin: 0 auto; font-size: 14px;"> <!-- Decreased width and font size -->
            <thead>
                <tr>
    `;

    // Conditionally add the Date header
    if (hasDate) {
        timetableOutputHTML += `<th>Date</th>`;
    }

    timetableOutputHTML += `
                    <th>Day</th>
                    <th>Teacher</th>
                    <th>Subject</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                </tr>
            </thead>
            <tbody>
    `;

    scheduleList.forEach((schedule) => {
        timetableOutputHTML += `
            <tr>
        `;

        // Conditionally add the Date cell
        if (schedule.date) {
            timetableOutputHTML += `<td style="padding: 12px;">${schedule.date}</td>`;
        }

        timetableOutputHTML += `
                <td>${schedule.day}</td>
                <td>${schedule.teacher}</td>
                <td>${schedule.subject}</td>
                <td>${schedule.startTime}</td>
                <td>${schedule.endTime}</td>
            </tr>
        `;
    });

    timetableOutputHTML += `
            </tbody>
        </table>
        <p style="text-align: center; margin-top: 20px; font-family: serif; font-size: 18px; font-weight: 700">Prepared By <span style="color: red; font-size: 18px;">Afaq Ul Islam</span></p>
    `;

    timetableOutput.innerHTML = timetableOutputHTML;
    pdfButton.style.display = 'block'; // Show the download button
}

// Function to download the timetable as a PDF
pdfButton.onclick = function () {
    const element = document.getElementById('timetableOutput');
    const opt = {
        margin: 0.5,
        filename: 'Timetable.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to generate the PDF
    html2pdf().from(element).set(opt).save();
};

