var _a;
// Declare the global variables
var scheduleList = [];
var scheduleContainer = document.getElementById('scheduleContainer');
var timetableForm = document.getElementById('timetableForm');
var timetableOutput = document.getElementById('timetableOutput');
var pdfButton = document.getElementById('downloadPdf');
var schoolLogoSrc = ''; // To hold the school logo source
// Update CSS variables based on user input
function updateCSSVariables(fontColor, bgColor, tableHeaderColor, fontFamily) {
    var style = document.createElement('style');
    style.innerHTML = "\n        #timetableOutput {\n            color: ".concat(fontColor, ";\n            background-color: ").concat(bgColor, ";\n            font-family: ").concat(fontFamily, "; /* Apply selected font to the timetable */\n        }\n        #timetableOutput th {\n            background-color: ").concat(tableHeaderColor, ";\n        }\n        #timetableOutput, #timetableOutput th, #timetableOutput td {\n            font-family: ").concat(fontFamily, "; /* Apply selected font to table headers, rows, and the entire timetable */\n        }\n    ");
    document.head.appendChild(style);
}
// Function to create new schedule input fields
function createScheduleFields(index) {
    var scheduleDiv = document.createElement('div');
    scheduleDiv.classList.add('scheduleEntry');
    scheduleDiv.setAttribute('data-index', index.toString());
    scheduleDiv.innerHTML = "\n        <label for=\"date-".concat(index, "\">Date:</label>\n        <input type=\"date\" id=\"date-").concat(index, "\">\n\n        <label for=\"teacherName-").concat(index, "\">Teacher:</label>\n        <input type=\"text\" id=\"teacherName-").concat(index, "\" placeholder=\"Enter teacher name\" required>\n\n        <label for=\"subjectName-").concat(index, "\">Subject:</label>\n        <input type=\"text\" id=\"subjectName-").concat(index, "\" placeholder=\"Enter subject\" required>\n\n        <label for=\"day-").concat(index, "\">Day:</label>\n        <select id=\"day-").concat(index, "\" required>\n            <option value=\"Monday\">Monday</option>\n            <option value=\"Tuesday\">Tuesday</option>\n            <option value=\"Wednesday\">Wednesday</option>\n            <option value=\"Thursday\">Thursday</option>\n            <option value=\"Friday\">Friday</option>\n            <option value=\"Saturday\">Saturday</option>\n            <option value=\"Full Week\">Full Week</option>\n        </select>\n\n        <label for=\"startTime-").concat(index, "\">Start Time:</label>\n        <input type=\"time\" id=\"startTime-").concat(index, "\" required>\n\n        <label for=\"endTime-").concat(index, "\">End Time:</label>\n        <input type=\"time\" id=\"endTime-").concat(index, "\" required>\n\n        <button type=\"button\" class=\"removeScheduleBtn\">Remove</button>\n    ");
    // Append new schedule fields to the container
    scheduleContainer.appendChild(scheduleDiv);
}
// Event listener to add new schedule inputs
(_a = document.getElementById('addScheduleBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    var currentIndex = scheduleContainer.children.length;
    createScheduleFields(currentIndex);
});
// Remove schedule entry
scheduleContainer.addEventListener('click', function (e) {
    var target = e.target;
    if (target.classList.contains('removeScheduleBtn')) {
        var scheduleDiv = target.closest('.scheduleEntry');
        if (scheduleDiv) {
            scheduleContainer.removeChild(scheduleDiv);
        }
    }
});
// Handle form submission to create the timetable
timetableForm.onsubmit = function (e) {
    var _a;
    e.preventDefault();
    var schoolName = document.getElementById('schoolName').value;
    var className = document.getElementById('className').value;
    var fontColor = document.getElementById('fontColor').value;
    var bgColor = document.getElementById('bgColor').value;
    var tableHeaderColor = document.getElementById('tableHeaderColor').value;
    var fontFamily = document.getElementById('fontFamily').value;
    var schoolLogoInput = document.getElementById('schoolLogo');
    if (!schoolName || !className || scheduleContainer.children.length === 0 || !((_a = schoolLogoInput.files) === null || _a === void 0 ? void 0 : _a.length)) {
        alert("Please fill in all fields, add at least one schedule, and upload a logo.");
        return;
    }
    // Update CSS variables with user-selected colors and font
    updateCSSVariables(fontColor, bgColor, tableHeaderColor, fontFamily);
    // Read the logo file
    var file = schoolLogoInput.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        schoolLogoSrc = event.target.result; // Set the logo source
        // Generate timetable output after logo is loaded
        generateTimetable(schoolName, className);
    };
    reader.readAsDataURL(file); // Read the logo file as a data URL
};
// Function to generate the timetable
function generateTimetable(schoolName, className) {
    scheduleList = []; // Clear previous schedule entries
    var hasDate = false; // Flag to check if any date is provided
    for (var i = 0; i < scheduleContainer.children.length; i++) {
        var date = document.getElementById("date-".concat(i)).value; // Get the date value
        var teacherName = document.getElementById("teacherName-".concat(i)).value;
        var subjectName = document.getElementById("subjectName-".concat(i)).value;
        var day = document.getElementById("day-".concat(i)).value;
        var startTime = document.getElementById("startTime-".concat(i)).value;
        var endTime = document.getElementById("endTime-".concat(i)).value;
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
    var timetableOutputHTML = "\n        <div style=\"display: flex; align-items: center; justify-content: center; margin-bottom: -40px;\">\n            <img src=\"".concat(schoolLogoSrc, "\" alt=\"School Logo\" style=\"width: 100px; height: 100px; margin-right: 10px; border-radius: 50%;\">\n            <h2 style=\"font-size:30px; font-family: 'Playfair Display', serif; margin:0px 55px 0px -10px;\">").concat(schoolName, "</h2> <!-- Use Playfair Display for the school name -->\n        </div>\n        <h3 style=\"font-size:20px; text-align: center; font-family: 'Playfair Display', serif;\">Class: <span style=\"color: red; font-size: 20px;\">").concat(className, "</span></h3>\n        <table style=\"width: 80%; margin: 0 auto; font-size: 14px;\"> <!-- Decreased width and font size -->\n            <thead>\n                <tr>\n    ");
    // Conditionally add the Date header
    if (hasDate) {
        timetableOutputHTML += "<th>Date</th>";
    }
    timetableOutputHTML += "\n                    <th>Day</th>\n                    <th>Teacher</th>\n                    <th>Subject</th>\n                    <th>Start Time</th>\n                    <th>End Time</th>\n                </tr>\n            </thead>\n            <tbody>\n    ";
    scheduleList.forEach(function (schedule) {
        timetableOutputHTML += "\n            <tr>\n        ";
        // Conditionally add the Date cell
        if (schedule.date) {
            timetableOutputHTML += "<td style=" padding:12px;">".concat(schedule.date, "</td>");
        }
        timetableOutputHTML += "\n                <td>".concat(schedule.day, "</td>\n                <td>").concat(schedule.teacher, "</td>\n                <td>").concat(schedule.subject, "</td>\n                <td>").concat(schedule.startTime, "</td>\n                <td>").concat(schedule.endTime, "</td>\n            </tr>\n        ");
    });
    timetableOutputHTML += "\n            </tbody>\n        </table>\n        <p style=\"text-align: center; margin-top: 20px; font-family: serif; font-size: 18px; font-weight: 700\">Prepared By <span style=\"color: red; font-size: 18px;\">Afaq Ul Islam</span></p>\n    ";
    timetableOutput.innerHTML = timetableOutputHTML;
    pdfButton.style.display = 'block'; // Show the download button
}
// Function to download the timetable as a PDF
pdfButton.onclick = function () {
    var element = document.getElementById('timetableOutput');
    var opt = {
        margin: 0.5,
        filename: 'Timetable.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Use html2pdf to generate the PDF
    html2pdf().from(element).set(opt).save();
};
