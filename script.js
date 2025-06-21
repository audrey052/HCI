document.addEventListener("DOMContentLoaded", () => {
    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.querySelector(".header .mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const mobileOverlay = document.getElementById("mobileOverlay");

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            mobileOverlay.classList.toggle("active");
        });
    }
    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            mobileOverlay.classList.remove("active");
        });
    }

    // --- LOGIKA NOTIFIKASI BARU YANG TERPUSAT ---
    const notificationBtn = document.getElementById("notificationBtn");
    const notificationDropdown = document.getElementById("notificationDropdown");
    const notificationList = document.getElementById("notificationList");

    if (notificationBtn && typeof allData !== 'undefined') {
        
        // --- FUNGSI KALKULASI TANGGAL YANG DIPERBAIKI ---
        function calculateDueDate(dateString) {
            const today = new Date('2025-06-19T00:00:00'); // Menggunakan tanggal hari ini sebagai acuan
            const dueDate = new Date(dateString);
            today.setHours(0, 0, 0, 0);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                return { text: `Overdue by ${-diffDays} days`, class: 'urgent' };
            } else if (diffDays === 0) {
                return { text: 'Due today', class: 'urgent' };
            } else if (diffDays === 1) {
                return { text: 'Due tomorrow', class: 'soon' };
            } else {
                return { text: `Due in ${diffDays} days`, class: 'normal' };
            }
        }

        function showNotifications() {
            const pendingTasks = allData.filter(
                (task) => task.status === 'assigned' || task.status === 'missing' || task.status === 'not-done'
            );
            notificationList.innerHTML = '';

            if (pendingTasks.length === 0) {
                notificationList.innerHTML = '<div class="notification-empty">No pending notifications.</div>';
                return;
            }

            pendingTasks.forEach(task => {
                const dueDateInfo = calculateDueDate(task.date);
                const item = document.createElement('div');
                item.classList.add('notification-item');
                item.onclick = () => {
                    const url = task.page === 'assessment' ? `assessment_details.html?assignmentId=${task.id}` : 'schedule.html';
                    window.location.href = url;
                };
                
                item.innerHTML = `
                    <div class="notification-content">
                        <span class="notification-assignment-title">${task.title}</span>
                        <span class="notification-course-name">${task.course}</span>
                        <span class="notification-due-date ${dueDateInfo.class}">${dueDateInfo.text}</span>
                    </div>
                `;
                notificationList.appendChild(item);
            });
        }

        notificationBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isVisible = notificationDropdown.classList.contains('show');
            if (!isVisible) {
                showNotifications();
            }
            notificationDropdown.classList.toggle("show");
        });
    }

    window.addEventListener("click", (e) => {
        if (notificationDropdown && !notificationDropdown.contains(e.target) && e.target !== notificationBtn) {
            notificationDropdown.classList.remove("show");
        }
    });
});