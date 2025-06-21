document.addEventListener("DOMContentLoaded", () => {
    const scheduleListContainer = document.getElementById("daily-schedule-list");
    const mcMonthYear = document.getElementById("mc-month-year");
    const mcDaysGrid = document.getElementById("mc-days-grid");
    const mcPrevBtn = document.getElementById("mc-prev-month-btn");
    const mcNextBtn = document.getElementById("mc-next-month-btn");

    const scheduleData = {};
    // Pastikan variabel allData ada sebelum memproses
    if (typeof allData !== 'undefined') {
        allData.forEach(task => {
            // Kita proses semua data, tapi bisa juga difilter jika perlu
            const date = task.date;
            if (!scheduleData[date]) {
                scheduleData[date] = [];
            }
            scheduleData[date].push(task);
        });
    }

    let selectedDate = new Date("2025-06-21");
    let calendarDisplayDate = new Date(selectedDate);

    function toLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const renderDailySchedule = () => {
        const dateStr = toLocalDateString(selectedDate);
        const events = scheduleData[dateStr] || [];
        scheduleListContainer.innerHTML = "";

        if (events.length === 0) {
            scheduleListContainer.innerHTML = `<div class="empty-message">No schedule for this day.</div>`;
            return;
        }

        events.forEach(event => {
            const itemEl = document.createElement("div");
            itemEl.className = "schedule-item";

            // Karena data schedule lebih detail, kita cek apakah ada 'details'
            let detailsHTML = "";
            if(event.details) {
                event.details.forEach(detail => {
                    detailsHTML += `<li><span class="icon">${detail.icon}</span>${detail.text}</li>`;
                });
            }

            let statusTagHTML = (event.status === "done")
                ? `<div class="item-status-tag finished">Finished</div>`
                : `<div class="item-status-tag unfinished">Unfinished</div>`;

            itemEl.innerHTML = `
                <div class="item-date">
                    <span class="day-name">${selectedDate.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span class="day-number">${selectedDate.getDate()}</span>
                </div>
                <div class="item-content">
                    <div class="item-main-details">
                        <div class="course-code">${event.courseCode || event.course}</div>
                        <div class="course-name">${event.courseName || event.title}</div>
                        <div class="details-title">${event.detailsTitle || ''}</div>
                        <ul class="item-details-list">${detailsHTML}</ul>
                    </div>
                    <div class="item-tags-container">
                        <div class="item-tag ${event.tagClass || 'online'}">${event.type || 'Task'}</div>
                        ${statusTagHTML}
                    </div>
                </div>
            `;
            scheduleListContainer.appendChild(itemEl);
        });
    };

    const renderMiniCalendar = () => {
        const year = calendarDisplayDate.getFullYear();
        const month = calendarDisplayDate.getMonth();
        mcMonthYear.textContent = calendarDisplayDate.toLocaleString("en-US", { month: "long", year: "numeric" });
        mcDaysGrid.innerHTML = "";
        const firstDay = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDay; i++) { mcDaysGrid.appendChild(document.createElement('div')); }

        const lastDate = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= lastDate; day++) {
            const dayEl = document.createElement("div");
            dayEl.className = "mc-day";
            dayEl.textContent = day;
            const currentDayDate = new Date(year, month, day);
            const dateStr = toLocalDateString(currentDayDate);

            if (scheduleData[dateStr]) {
                dayEl.classList.add("has-task");
                const allDone = scheduleData[dateStr].every(e => e.status === "done");
                dayEl.classList.add(allDone ? "done" : "not-done");
            }

            if (toLocalDateString(currentDayDate) === toLocalDateString(selectedDate)) {
                dayEl.classList.add("selected");
            }

            dayEl.addEventListener("click", () => {
                selectedDate = currentDayDate;
                renderDailySchedule();
                renderMiniCalendar();
            });
            mcDaysGrid.appendChild(dayEl);
        }
    };

    mcPrevBtn.addEventListener("click", () => {
        calendarDisplayDate.setMonth(calendarDisplayDate.getMonth() - 1);
        renderMiniCalendar();
    });
    mcNextBtn.addEventListener("click", () => {
        calendarDisplayDate.setMonth(calendarDisplayDate.getMonth() + 1);
        renderMiniCalendar();
    });
    
    renderDailySchedule();
    renderMiniCalendar();
});