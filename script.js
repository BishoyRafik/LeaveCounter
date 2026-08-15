// ========================================
// Leave Calculator - Version 1
// ========================================


// Get elements from HTML
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const workDaysInput = document.getElementById("workDays");
const leaveDaysInput = document.getElementById("leaveDays");
const leaveHistoryBody = document.getElementById("leaveHistoryBody");

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

const leaveCountElement = document.getElementById("leaveCount");
const nextLeaveElement = document.getElementById("nextLeave");
const daysUntilLeaveElement = document.getElementById("daysUntilLeave");
const daysUntilEndElement = document.getElementById("daysUntilEnd");

const errorMessage = document.getElementById("errorMessage");

const calendarMonthElement = document.getElementById("calendarMonth");
const calendarDaysElement = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

let calendarDate = new Date();

// ========================================
// Helper Functions
// ========================================

// Remove the time from a date
function removeTime(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}


// Add a number of days to a date
function addDays(date, days) {

    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
}


// Calculate the difference between two dates
function daysBetween(date1, date2) {

    const firstDate = removeTime(date1);
    const secondDate = removeTime(date2);

    const difference =
        secondDate.getTime() - firstDate.getTime();

    return Math.round(
        difference / (1000 * 60 * 60 * 24)
    );
}


// Format date for displaying
function formatDate(date) {

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// ========================================
// Error Functions
// ========================================

function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function clearError() {

    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

// ========================================
// Get Day Status
// ========================================

function getDayStatus(
    date,
    startDate,
    endDate,
    workDays,
    leaveDays
) {

    const currentDate =
        removeTime(date);

    const workStart =
        removeTime(startDate);

    const workEnd =
        removeTime(endDate);


    // Outside the selected period
    if (
        currentDate < workStart ||
        currentDate > workEnd
    ) {
        return "outside";
    }


    // Days passed from work start
    const daysFromStart =
        daysBetween(
            workStart,
            currentDate
        );


    const cycleLength =
        workDays + leaveDays;


    const positionInCycle =
        daysFromStart % cycleLength;


    // Work period
    if (
        positionInCycle < workDays
    ) {

        return "work";

    }


    // Leave period
    return "leave";
}

// ========================================
// Get Next Leave
// ========================================

function getNextLeaveStart(
    startDate,
    endDate,
    workDays,
    leaveDays
) {

    let currentWorkStart =
        new Date(startDate);

    const today =
        removeTime(new Date());


    while (true) {

        const leaveStart =
            addDays(
                currentWorkStart,
                workDays
            );


        if (leaveStart > endDate) {
            return null;
        }


        if (leaveStart >= today) {
            return leaveStart;
        }


        currentWorkStart =
            addDays(
                leaveStart,
                leaveDays
            );
    }
}

// ========================================
// Calendar
// ========================================

function generateCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    // First day of month
    const firstDay =
        new Date(
            year,
            month,
            1
        );


    // Last day of month
    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    const daysInMonth =
        lastDay.getDate();


    // Convert Sunday = 0
    // to Monday = 0
    const firstDayIndex =
        (firstDay.getDay() + 6) % 7;


    // Month name
    const monthName =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarMonthElement.textContent =
        monthName;


    // Clear old days
    calendarDaysElement.innerHTML = "";


    // Empty cells before first day
    for (
        let i = 0;
        i < firstDayIndex;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty"
        );

        calendarDaysElement.appendChild(
            emptyDay
        );
    }


    // Generate days
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const currentDate =
            new Date(
                year,
                month,
                day
            );


        const dayElement =
            document.createElement("div");

        dayElement.classList.add(
            "calendar-day"
        );

        // ========================================
        // Determine Work / Leave
        // ========================================

        // if (
        //     startDateInput.value &&
        //     endDateInput.value
        // ) {

        //     const status =
        //         getDayStatus(
        //             currentDate,
        //             new Date(startDateInput.value),
        //             new Date(endDateInput.value),
        //             Number(workDaysInput.value),
        //             Number(leaveDaysInput.value)
        //         );


        //     if (status === "work") {

        //         dayElement.classList.add(
        //             "work"
        //         );

        //     }


        //     if (status === "leave") {

        //         dayElement.classList.add(
        //             "leave"
        //         );

        //     }


        //     if (status === "outside") {

        //         dayElement.classList.add(
        //             "empty"
        //         );

        //     }
        // }

        if (
            startDateInput.value &&
            endDateInput.value
        ) {

            const startDate =
                new Date(startDateInput.value);

            const endDate =
                new Date(endDateInput.value);

            const workDays =
                Number(workDaysInput.value);

            const leaveDays =
                Number(leaveDaysInput.value);


            const status =
                getDayStatus(
                    currentDate,
                    startDate,
                    endDate,
                    workDays,
                    leaveDays
                );


            // -------------------------------
            // Work / Leave
            // -------------------------------

            if (status === "work") {

                dayElement.classList.add(
                    "work"
                );
            }


            if (status === "leave") {

                dayElement.classList.add(
                    "leave"
                );
            }


            if (status === "outside") {

                dayElement.classList.add(
                    "empty"
                );
            }


            // -------------------------------
            // Next Leave
            // -------------------------------

            const nextLeaveStart =
                getNextLeaveStart(
                    startDate,
                    endDate,
                    workDays,
                    leaveDays
                );


            if (
                nextLeaveStart &&
                currentDate.getTime() ===
                removeTime(nextLeaveStart).getTime()
            ) {

                dayElement.classList.add(
                    "next-leave"
                );
            }


            // -------------------------------
            // Work End
            // -------------------------------

            if (
                currentDate.getTime() ===
                removeTime(endDate).getTime()
            ) {

                dayElement.classList.add(
                    "work-end"
                );
            }
        }

        // ========================================
        // Determination End
        // ========================================

        const dayNumber =
            document.createElement("span");

        dayNumber.classList.add(
            "day-number"
        );

        dayNumber.textContent =
            day;


        dayElement.appendChild(
            dayNumber
        );


        // Check Today
        const today =
            removeTime(new Date());


        if (
            currentDate.getTime() ===
            today.getTime()
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        calendarDaysElement.appendChild(
            dayElement
        );
    }
}
// Previous Month
prevMonthBtn.addEventListener(
    "click",
    function () {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        generateCalendar();
    }
);

// Next Month
nextMonthBtn.addEventListener(
    "click",
    function () {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        generateCalendar();
    }
);

// ========================================
// Generate History Table
// ========================================
function generateLeaveHistory(
    startDate,
    endDate,
    workDays,
    leaveDays
) {

    // Clear old history
    leaveHistoryBody.innerHTML = "";


    let currentWorkStart =
        new Date(startDate);

    let leaveNumber = 0;

    const today =
        removeTime(new Date());


    while (true) {

        // Calculate leave start
        const leaveStart =
            addDays(
                currentWorkStart,
                workDays
            );


        // Stop when leave starts after work ends
        if (leaveStart > endDate) {
            break;
        }


        leaveNumber++;


        // Calculate leave end
        const leaveEnd =
            addDays(
                leaveStart,
                leaveDays - 1
            );


        // ----------------------------------------
        // Determine Status
        // ----------------------------------------

        let status = "";
        let statusClass = "";


        if (today > leaveEnd) {

            status = "Completed";
            statusClass = "completed";

        } else if (
            today >= leaveStart &&
            today <= leaveEnd
        ) {

            status = "Current";
            statusClass = "current";

        } else {

            status = "Upcoming";
            statusClass = "upcoming";
        }


        // ----------------------------------------
        // Check if work ends during this leave
        // ----------------------------------------

        if (
            leaveStart <= endDate &&
            leaveEnd > endDate
        ) {

            status = "Ends After Work";
            statusClass = "partial";
        }


        // ----------------------------------------
        // Create Table Row
        // ----------------------------------------

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${leaveNumber}</td>

            <td>
                ${formatDate(leaveStart)}
            </td>

            <td>
                ${formatDate(leaveEnd)}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>
        `;


        leaveHistoryBody.appendChild(row);


        // Move to next work period
        currentWorkStart =
            addDays(
                leaveEnd,
                1
            );
    }
}

// ========================================
// Main Calculation
// ========================================

function calculateLeave() {

    clearError();

    // Get values from inputs
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    const workDays = Number(workDaysInput.value);
    const leaveDays = Number(leaveDaysInput.value);


    // Basic validation
    if (
        !startDateInput.value ||
        !endDateInput.value
    ) {

        // alert("Please enter the start and end dates.");
        showError(
            "Please enter both the work start date and work end date."
        );

        return;
    }


    if (endDate < startDate) {

        // alert("End date must be after the start date.");
        showError(
            "Work end date must be after the work start date."
        );

        return;
    }

    if (
        !Number.isInteger(workDays) ||
        !Number.isInteger(leaveDays)
    ) {

        showError(
            "Work days and leave days must be whole numbers."
        );

        return;
    }


    if (
        workDays <= 0 ||
        leaveDays <= 0
    ) {

        showError(
            "Work days and leave days must be greater than 0."
        );

        return;
    }


    // ========================================
    // Calculate Leave Periods
    // ========================================

    let currentWorkStart = new Date(startDate);

    let leaveCount = 0;

    let nextLeaveStart = null;


    while (true) {

        // After completing the work period,
        // the leave starts on the next day.
        const currentLeaveStart =
            addDays(currentWorkStart, workDays);


        // If this leave starts after the work end date,
        // we stop.
        if (currentLeaveStart > endDate) {

            break;
        }


        // We found a new leave period
        leaveCount++;


        // Save the first leave that is still upcoming
        if (
            nextLeaveStart === null &&
            currentLeaveStart >= removeTime(new Date())
        ) {

            nextLeaveStart =
                new Date(currentLeaveStart);
        }


        // Move to the next work period
        currentWorkStart =
            addDays(currentLeaveStart, leaveDays);
    }


    // ========================================
    // Days Until Work Ends
    // ========================================

    const today = removeTime(new Date());

    let daysUntilEnd =
        daysBetween(today, endDate);


    if (daysUntilEnd < 0) {
        daysUntilEnd = 0;
    }


    // ========================================
    // Days Until Next Leave
    // ========================================

    let daysUntilLeave = "-";


    if (nextLeaveStart !== null) {

        daysUntilLeave =
            daysBetween(today, nextLeaveStart);

        if (daysUntilLeave < 0) {
            daysUntilLeave = 0;
        }
    }


    // ========================================
    // Display Results
    // ========================================

    leaveCountElement.textContent =
        leaveCount;

    nextLeaveElement.textContent =
        nextLeaveStart
            ? formatDate(nextLeaveStart)
            : "No upcoming leave";

    daysUntilLeaveElement.textContent =
        daysUntilLeave === "-"
            ? "-"
            : `${daysUntilLeave} days`;

    daysUntilEndElement.textContent =
        `${daysUntilEnd} days`;
}


// ========================================
// Button Event
// ========================================

// calculateBtn.addEventListener(
//     "click",
//     function () {

//         calculateLeave();
//         saveSettings();
//         updateCountdowns();

//     }
// );
calculateBtn.addEventListener(
    "click",
    function () {

        calculateLeave();
        saveSettings();
        updateCountdowns();


        // Generate leave history
        if (
            startDateInput.value &&
            endDateInput.value
        ) {

            generateLeaveHistory(
                new Date(startDateInput.value),
                new Date(endDateInput.value),
                Number(workDaysInput.value),
                Number(leaveDaysInput.value)
            );
        }

        // Update calendar
        generateCalendar();

    }
);

// ========================================
// Local Storage
// ========================================

function saveSettings() {

    const settings = {
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        workDays: workDaysInput.value,
        leaveDays: leaveDaysInput.value
    };

    localStorage.setItem(
        "leaveCalculatorSettings",
        JSON.stringify(settings)
    );
}


function loadSettings() {

    const savedSettings =
        localStorage.getItem("leaveCalculatorSettings");

    if (!savedSettings) {
        return;
    }

    const settings =
        JSON.parse(savedSettings);

    startDateInput.value =
        settings.startDate || "";

    endDateInput.value =
        settings.endDate || "";

    workDaysInput.value =
        settings.workDays || 14;

    leaveDaysInput.value =
        settings.leaveDays || 7;
}

// ========================================
// Load Saved Settings
// ========================================

loadSettings();
generateCalendar();

// ========================================
// Reset
// ========================================

resetBtn.addEventListener(
    "click",
    function () {

        // Remove saved settings
        localStorage.removeItem(
            "leaveCalculatorSettings"
        );

        // Clear inputs
        startDateInput.value = "";
        endDateInput.value = "";

        workDaysInput.value = 14;
        leaveDaysInput.value = 7;

        // Clear results
        leaveCountElement.textContent = "-";
        nextLeaveElement.textContent = "-";
        daysUntilLeaveElement.textContent = "-";
        daysUntilEndElement.textContent = "-";
        leaveHistoryBody.innerHTML = "";
    }
);


// ========================================
// Live Countdown
// ========================================

function updateCountdowns() {

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    const workDays = Number(workDaysInput.value);
    const leaveDays = Number(leaveDaysInput.value);

    if (
        !startDateInput.value ||
        !endDateInput.value ||
        workDays <= 0 ||
        leaveDays <= 0
    ) {
        return;
    }


    // ----------------------------------------
    // Find next leave
    // ----------------------------------------

    let currentWorkStart = new Date(startDate);

    let nextLeaveStart = null;


    while (true) {

        const currentLeaveStart =
            addDays(currentWorkStart, workDays);


        if (currentLeaveStart > endDate) {
            break;
        }


        const now = new Date();


        if (currentLeaveStart > now) {

            nextLeaveStart =
                new Date(currentLeaveStart);

            break;
        }


        currentWorkStart =
            addDays(
                currentLeaveStart,
                leaveDays
            );
    }


    const now = new Date();


    // ----------------------------------------
    // Countdown helper
    // ----------------------------------------

    function getCountdown(targetDate) {

        if (!targetDate) {
            return null;
        }


        const difference =
            targetDate.getTime() - now.getTime();


        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }


        const totalSeconds =
            Math.floor(difference / 1000);


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        return {
            days,
            hours,
            minutes,
            seconds
        };
    }


    // ----------------------------------------
    // Next Leave Countdown
    // ----------------------------------------

    const leaveCountdown =
        getCountdown(nextLeaveStart);


    if (leaveCountdown) {

        daysUntilLeaveElement.textContent =
            `${leaveCountdown.days}d ` +
            `${String(leaveCountdown.hours).padStart(2, "0")}h ` +
            `${String(leaveCountdown.minutes).padStart(2, "0")}m ` +
            `${String(leaveCountdown.seconds).padStart(2, "0")}s`;

    } else {

        daysUntilLeaveElement.textContent =
            "No upcoming leave";
    }


    // ----------------------------------------
    // Work End Countdown
    // ----------------------------------------

    const workEndCountdown =
        getCountdown(endDate);


    if (workEndCountdown) {

        daysUntilEndElement.textContent =
            `${workEndCountdown.days}d ` +
            `${String(workEndCountdown.hours).padStart(2, "0")}h ` +
            `${String(workEndCountdown.minutes).padStart(2, "0")}m ` +
            `${String(workEndCountdown.seconds).padStart(2, "0")}s`;
    }
}

// Update countdown every second
setInterval(
    updateCountdowns,
    1000
);