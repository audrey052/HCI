const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");
const courseFilter = document.getElementById("courseFilter");
const mobileFilter = document.getElementById("mobileFilter");
const toggleArrows = document.querySelectorAll(".toggle-arrow");
const statusFilterBtns = document.querySelectorAll(".status-filter-btn");

const assignedSectionsContainer = document.getElementById("assignedSections");
const singleListSection = document.getElementById("singleListSection");
const singleListSectionTitle = document.getElementById(
  "singleListSectionTitle"
);
const singleListGrid = document.getElementById("singleListGrid");
const singleListEmptyState = document.getElementById("singleListEmptyState");
const overallEmptyState = document.getElementById("overallEmptyState");

const assignedBadge = document.querySelector(
  ".status-item[data-status-filter='assigned'] .badge"
);
const missingBadge = document.querySelector(
  ".status-item[data-status-filter='missing'] .badge"
);
const doneBadge = document.querySelector(
  ".status-item[data-status-filter='done'] .badge"
);

let currentCourseFilter = "all";
let currentStatusFilter = "assigned";
function toggleMobileMenu() {
  sidebar.classList.toggle("active");
  mobileOverlay.classList.toggle("active");
  document.body.style.overflow = sidebar.classList.contains("active")
    ? "hidden"
    : "";
}

function closeMobileMenu() {
  sidebar.classList.remove("active");
  mobileOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", toggleMobileMenu);
}

if (mobileOverlay) {
  mobileOverlay.addEventListener("click", closeMobileMenu);
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      closeMobileMenu();
    }
  });
});

function applyFilters() {
  let assignedCount = 0;
  let missingCount = 0;
  let doneCount = 0;

  while (singleListGrid.firstChild) {
    singleListGrid.removeChild(singleListGrid.firstChild);
  }

  const allAssignmentCards = document.querySelectorAll(".assignment-card");

  allAssignmentCards.forEach((card) => {
    const cardCourse = card.getAttribute("data-course");
    const cardStatus = card.getAttribute("data-status");

    if (cardStatus === "assigned") {
      assignedCount++;
    } else if (cardStatus === "missing") {
      missingCount++;
    } else if (cardStatus === "done") {
      doneCount++;
    }

    const courseMatches =
      currentCourseFilter === "all" || cardCourse === currentCourseFilter;

    if (currentStatusFilter === "assigned") {
      assignedSectionsContainer.classList.remove("hidden");
      singleListSection.classList.add("hidden");

      const parentSectionId = card.closest(".assignments-section")?.id;
      const parentContent = card.closest(".section-content");

      if (courseMatches && cardStatus === "assigned") {
        card.style.display = "block";
        card.classList.add("fade-in");
        if (parentContent && parentContent.classList.contains("hidden")) {
          parentContent.classList.remove("hidden");
          const arrow = document.querySelector(
            `#${parentSectionId} .toggle-arrow`
          );
          if (arrow) arrow.textContent = "▲";
        }
      } else {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }
    } else {
      assignedSectionsContainer.classList.add("hidden");
      singleListSection.classList.remove("hidden");

      if (currentStatusFilter === "missing") {
        singleListSectionTitle.textContent = "All Missing Assignments";
        singleListEmptyText.textContent =
          "No missing assignments found for this filter.";
      } else if (currentStatusFilter === "done") {
        singleListSectionTitle.textContent = "All Done Assignments";
        singleListEmptyText.textContent =
          "No done assignments found for this filter.";
      }

      if (courseMatches && cardStatus === currentStatusFilter) {
        const clonedCard = card.cloneNode(true);
        clonedCard.style.display = "block";
        clonedCard.classList.add("fade-in");
        singleListGrid.appendChild(clonedCard);
        card.style.display = "none";
      } else {
        card.style.display = "none";
        card.classList.remove("fade-in");
      }
    }
  });

  if (assignedBadge) assignedBadge.textContent = assignedCount;
  if (missingBadge) missingBadge.textContent = missingCount;

  if (doneBadge) {
    if (doneCount > 0) {
      doneBadge.textContent = doneCount;
      doneBadge.style.display = "inline-block";
    } else {
      doneBadge.textContent = "";
      doneBadge.style.display = "none";
    }
  }

  updateEmptyStates();
}

function updateEmptyStates() {
  let anySectionVisible = false;

  if (currentStatusFilter === "assigned") {
    const sections = document.querySelectorAll(
      "#assignedSections .assignments-section"
    );
    sections.forEach((section) => {
      const sectionContent = section.querySelector(".section-content");
      if (!sectionContent) return;

      const assignmentsGrid = sectionContent.querySelector(".assignments-grid");
      const emptyState = sectionContent.querySelector(".empty-state");

      const visibleCards = assignmentsGrid
        ? sectionContent.querySelectorAll(
            '.assignment-card[style*="display: block"]'
          )
        : [];

      if (visibleCards.length === 0) {
        if (assignmentsGrid) assignmentsGrid.style.display = "none";
        if (emptyState) emptyState.style.display = "flex";
      } else {
        if (assignmentsGrid) assignmentsGrid.style.display = "grid";
        if (emptyState) emptyState.style.display = "none";
        anySectionVisible = true;
      }
    });
  } else {
    const visibleCards = singleListGrid.querySelectorAll(
      '.assignment-card[style*="display: block"]'
    );
    if (visibleCards.length === 0) {
      singleListGrid.style.display = "none";
      singleListEmptyState.style.display = "flex";
    } else {
      singleListGrid.style.display = "grid";
      singleListEmptyState.style.display = "none";
      anySectionVisible = true;
    }
  }

  if (overallEmptyState) {
    if (!anySectionVisible) {
      overallEmptyState.classList.remove("hidden");
    } else {
      overallEmptyState.classList.add("hidden");
    }
  }
}

if (courseFilter) {
  courseFilter.addEventListener("change", (e) => {
    currentCourseFilter = e.target.value;
    if (mobileFilter) mobileFilter.value = currentCourseFilter;
    localStorage.setItem("currentCourseFilter", currentCourseFilter);
    applyFilters();
  });
}

if (mobileFilter) {
  mobileFilter.addEventListener("change", (e) => {
    currentCourseFilter = e.target.value;
    if (courseFilter) courseFilter.value = currentCourseFilter;
    localStorage.setItem("currentCourseFilter", currentCourseFilter);
    applyFilters();
  });
}

statusFilterBtns.forEach((button) => {
  button.addEventListener("click", () => {
    statusFilterBtns.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentStatusFilter = button.dataset.statusFilter;
    localStorage.setItem("currentStatusFilter", currentStatusFilter);

    applyFilters();
  });
});

const notificationBtn = document.querySelector(".notification-btn");
if (notificationBtn) {
  notificationBtn.addEventListener("click", () => {
    console.log("Notifications feature would be implemented here!");
  });
}

const changeBtn = document.querySelector(".change-btn");
if (changeBtn) {
  changeBtn.addEventListener("click", () => {
    console.log("Role change functionality would be implemented here!");
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar && sidebar.classList.contains("active")) {
    closeMobileMenu();
  }
});

let touchStartX = 0;
let touchEndX = 0;

if (sidebar) {
  sidebar.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  sidebar.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const swipeThreshold = 100;
  const swipeDistance = touchStartX - touchEndX;

  if (swipeDistance > swipeThreshold) {
    closeMobileMenu();
  }
}

toggleArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const targetId = arrow.dataset.target;
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.toggle("hidden");
      arrow.textContent = targetContent.classList.contains("hidden")
        ? "▼"
        : "▲";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const storedCourseFilter = localStorage.getItem("currentCourseFilter");
  if (storedCourseFilter) {
    currentCourseFilter = storedCourseFilter;
    if (courseFilter) courseFilter.value = currentCourseFilter;
    if (mobileFilter) mobileFilter.value = currentCourseFilter;
  }

  const storedStatusFilter = localStorage.getItem("currentStatusFilter");
  if (storedStatusFilter) {
    currentStatusFilter = storedStatusFilter;
    statusFilterBtns.forEach((btn) => {
      if (btn.dataset.statusFilter === currentStatusFilter) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  } else {
    currentStatusFilter = "assigned";
    document
      .querySelector(".status-item[data-status-filter='assigned']")
      ?.classList.add("active");
  }

  const submittedAssignmentId = localStorage.getItem("submittedAssignmentId");
  const submittedStatus = localStorage.getItem("submittedStatus");

  if (submittedAssignmentId && submittedStatus) {
    const cardToUpdate = document.getElementById(submittedAssignmentId);
    if (cardToUpdate) {
      cardToUpdate.setAttribute("data-status", submittedStatus);
      if (submittedStatus === "done") {
        cardToUpdate.classList.remove("urgent");
        const dueDateSpan = cardToUpdate.querySelector(".due-date");
        const statusText = cardToUpdate.querySelector(".submission-status");
        if (statusText) {
          statusText.remove();
        }
        if (dueDateSpan) {
          const now = new Date();
          const submittedDate = now.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          dueDateSpan.textContent = `Submitted ${submittedDate}`;
          dueDateSpan.classList.remove("urgent-date");
        }
        const detailsBtn = cardToUpdate.querySelector(".details-btn");
        if (detailsBtn) {
          detailsBtn.textContent = "View submission";
        }
      }
    }
    localStorage.removeItem("submittedAssignmentId");
    localStorage.removeItem("submittedStatus");
  }

  applyFilters();
  document
    .querySelectorAll('.assignment-card[style*="display: block"]')
    .forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("fade-in");
      }, index * 100);
    });

  console.log("BINUSMAYA Dashboard loaded successfully!");
});

document.addEventListener("DOMContentLoaded", () => {
  const uploadWorkBtn = document.getElementById("uploadWorkBtn");
  const resubmitWorkBtn = document.getElementById("resubmitWorkBtn");
  const uploadModalOverlay = document.getElementById("uploadModalOverlay");
  const closeUploadModalBtn = document.getElementById("closeUploadModal");
  const fileUploadInput = document.getElementById("fileUploadInput");
  const selectedFileNameSpan = document.getElementById("selectedFileName");
  const modalSubmitAttemptBtn = document.getElementById(
    "modalSubmitAttemptBtn"
  );
  const fileErrorSpan = document.getElementById("fileError");
  const totalAttemptsSpan = document.getElementById("totalAttempts");

  const confirmationModalOverlay = document.getElementById(
    "confirmationModalOverlay"
  );
  const confirmUploadYesBtn = document.getElementById("confirmUploadYes");
  const confirmUploadNoBtn = document.getElementById("confirmUploadNo");
  const filenameToConfirmSpan = document.getElementById("filenameToConfirm");
  const downloadToReviewBtn = document.getElementById("downloadToReviewBtn");

  const yourWorkSection = document.getElementById("yourWorkSection");
  const uploadedFileLink = document.getElementById("uploadedFileLink");
  const uploadedFileNameSpan = document.getElementById("uploadedFileName");
  const uploadedFileTypeSpan = document.getElementById("uploadedFileType");
  const uploadedFileThumbnail = document.getElementById(
    "uploadedFileThumbnail"
  );
  const turnInStatusSpan = document.getElementById("turnInStatus");
  const lastAttemptNumberSpan = document.getElementById("lastAttemptNumber");

  const successNotification = document.getElementById("successNotification");

  const urlParams = new URLSearchParams(window.location.search);
  const assignmentId = urlParams.get("assignmentId") || "defaultAssignment";

  let currentAttemptKey = `currentAttempt_${assignmentId}`;
  let lastUploadedFileNameKey = `lastUploadedFileName_${assignmentId}`;
  let lastUploadedFileTypeKey = `lastUploadedFileType_${assignmentId}`;

  let currentAttempt = parseInt(localStorage.getItem(currentAttemptKey) || "0");
  const maxAttempts = 3;
  let uploadedFile = null;
  let uploadedFileBlobUrl = null;

  function updateUIBasedOnAttempts() {
    totalAttemptsSpan.textContent = `${currentAttempt} of ${maxAttempts} Attempts`;

    if (currentAttempt < maxAttempts) {
      modalSubmitAttemptBtn.textContent = `Submit Attempt ${
        currentAttempt + 1
      }`;
      modalSubmitAttemptBtn.disabled = false;
    } else {
      modalSubmitAttemptBtn.textContent = `No Attempts Left`;
      modalSubmitAttemptBtn.disabled = true;
    }

    if (currentAttempt > 0) {
      uploadWorkBtn.classList.add("hidden");
      yourWorkSection.classList.remove("hidden");

      if (currentAttempt >= maxAttempts) {
        resubmitWorkBtn.textContent = `Submission Limit Reached: No more attempts available.`;
        resubmitWorkBtn.classList.add("max-attempts-btn");
        resubmitWorkBtn.disabled = true;
      } else {
        resubmitWorkBtn.textContent = `Submit Attempt ${currentAttempt + 1}`;
        resubmitWorkBtn.classList.remove("max-attempts-btn");
        resubmitWorkBtn.disabled = false;
      }

      const now = new Date();
      const turnInDate = now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      turnInStatusSpan.textContent = `Turned in ${turnInDate}`;

      lastAttemptNumberSpan.textContent = `Attempt ${currentAttempt}`;

      const storedFileName = localStorage.getItem(lastUploadedFileNameKey);
      const storedFileType = localStorage.getItem(lastUploadedFileTypeKey);

      if (storedFileName && storedFileType) {
        uploadedFileNameSpan.textContent = storedFileName;
        uploadedFileTypeSpan.textContent = storedFileType;

        let thumbnailSrc = `https://via.placeholder.com/60x60?text=File`;
        if (storedFileType === "PDF") {
          thumbnailSrc = `https://via.placeholder.com/60x60?text=PDF`;
        } else if (storedFileType === "DOC" || storedFileType === "DOCX") {
          thumbnailSrc = `https://via.placeholder.com/60x60?text=DOC`;
        } else if (storedFileType === "ZIP") {
          thumbnailSrc = `https://via.placeholder.com/60x60?text=ZIP`;
        }
        uploadedFileThumbnail.src = thumbnailSrc;
      } else {
        uploadedFileLink.removeAttribute("href");
        uploadedFileNameSpan.textContent = "";
        uploadedFileTypeSpan.textContent = "";
        uploadedFileThumbnail.src =
          "https://via.placeholder.com/60x60?text=File";
      }
    } else {
      uploadWorkBtn.classList.remove("hidden");
      yourWorkSection.classList.add("hidden");
      uploadedFileLink.removeAttribute("href");
      uploadedFileNameSpan.textContent = "";
      uploadedFileTypeSpan.textContent = "";
      uploadedFileThumbnail.src = "https://via.placeholder.com/60x60?text=File";
      lastAttemptNumberSpan.textContent = "";
    }
  }

  updateUIBasedOnAttempts();

  if (uploadWorkBtn) {
    uploadWorkBtn.addEventListener("click", () => {
      fileUploadInput.value = "";
      selectedFileNameSpan.textContent = "No file chosen";
      fileErrorSpan.classList.add("hidden");
      modalSubmitAttemptBtn.disabled = true;
      uploadModalOverlay.classList.remove("hidden");
      document.body.classList.add("modal-open");
    });
  }

  if (resubmitWorkBtn) {
    resubmitWorkBtn.addEventListener("click", () => {
      fileUploadInput.value = "";
      selectedFileNameSpan.textContent = "No file chosen";
      fileErrorSpan.classList.add("hidden");
      modalSubmitAttemptBtn.disabled = true;
      uploadModalOverlay.classList.remove("hidden");
      document.body.classList.add("modal-open");
    });
  }

  if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener("click", () => {
      uploadModalOverlay.classList.add("hidden");
      document.body.classList.remove("modal-open");
      if (uploadedFileBlobUrl) {
        URL.revokeObjectURL(uploadedFileBlobUrl);
        uploadedFileBlobUrl = null;
      }
      uploadedFile = null;
    });
  }

  if (uploadModalOverlay) {
    uploadModalOverlay.addEventListener("click", (e) => {
      if (e.target === uploadModalOverlay) {
        uploadModalOverlay.classList.add("hidden");
        document.body.classList.remove("modal-open");
        if (uploadedFileBlobUrl) {
          URL.revokeObjectURL(uploadedFileBlobUrl);
          uploadedFileBlobUrl = null;
        }
        uploadedFile = null;
      }
    });
  }

  if (fileUploadInput) {
    fileUploadInput.addEventListener("change", () => {
      if (fileUploadInput.files.length > 0) {
        const file = fileUploadInput.files[0];
        const maxFileSize = 5 * 1024 * 1024;
        const allowedExtensions = ["pdf", "doc", "docx", "zip"];
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (file.size > maxFileSize) {
          fileErrorSpan.textContent = "File size exceeds 5MB limit.";
          fileErrorSpan.classList.remove("hidden");
          selectedFileNameSpan.textContent = "No file chosen";
          fileUploadInput.value = "";
          modalSubmitAttemptBtn.disabled = true;
          uploadedFile = null;
          if (uploadedFileBlobUrl) {
            URL.revokeObjectURL(uploadedFileBlobUrl);
            uploadedFileBlobUrl = null;
          }
        } else if (!allowedExtensions.includes(fileExtension)) {
          fileErrorSpan.textContent =
            "Invalid file format. Allowed: .pdf, .doc, .docx, .zip.";
          fileErrorSpan.classList.remove("hidden");
          selectedFileNameSpan.textContent = "No file chosen";
          fileUploadInput.value = "";
          modalSubmitAttemptBtn.disabled = true;
          uploadedFile = null;
          if (uploadedFileBlobUrl) {
            URL.revokeObjectURL(uploadedFileBlobUrl);
            uploadedFileBlobUrl = null;
          }
        } else {
          selectedFileNameSpan.textContent = file.name;
          fileErrorSpan.classList.add("hidden");
          modalSubmitAttemptBtn.disabled = false;
          uploadedFile = file;
          if (uploadedFileBlobUrl) {
            URL.revokeObjectURL(uploadedFileBlobUrl);
          }
          uploadedFileBlobUrl = URL.createObjectURL(file);
        }
      } else {
        selectedFileNameSpan.textContent = "No file chosen";
        fileErrorSpan.classList.add("hidden");
        modalSubmitAttemptBtn.disabled = true;
        uploadedFile = null;
        if (uploadedFileBlobUrl) {
          URL.revokeObjectURL(uploadedFileBlobUrl);
          uploadedFileBlobUrl = null;
        }
      }
    });
  }

  if (modalSubmitAttemptBtn) {
    modalSubmitAttemptBtn.addEventListener("click", () => {
      if (!uploadedFile) {
        fileErrorSpan.textContent = "Please select a file to upload.";
        fileErrorSpan.classList.remove("hidden");
        return;
      }

      filenameToConfirmSpan.textContent = `${uploadedFile.name}`;

      uploadModalOverlay.classList.add("hidden");
      confirmationModalOverlay.classList.remove("hidden");
      document.body.classList.add("modal-open");
    });
  }

  // Confirmation Yes button
  if (confirmUploadYesBtn) {
    confirmUploadYesBtn.addEventListener("click", () => {
      console.log(
        "File uploaded:",
        uploadedFile.name,
        "Type:",
        uploadedFile.type,
        "Size:",
        uploadedFile.size
      );

      currentAttempt++;
      localStorage.setItem(currentAttemptKey, currentAttempt);
      localStorage.setItem(lastUploadedFileNameKey, uploadedFile.name);
      localStorage.setItem(
        lastUploadedFileTypeKey,
        uploadedFile.name.split(".").pop().toUpperCase()
      );
      localStorage.setItem("submittedAssignmentId", assignmentId);
      localStorage.setItem("submittedStatus", "done");

      updateUIBasedOnAttempts();

      confirmationModalOverlay.classList.add("hidden");
      uploadModalOverlay.classList.add("hidden");
      document.body.classList.remove("modal-open");

      fileUploadInput.value = "";
      selectedFileNameSpan.textContent = "No file chosen";

      successNotification.classList.remove("hidden");
      setTimeout(() => {
        successNotification.classList.add("hidden");
      }, 3000);
    });
  }

  // Confirmation No button
  if (confirmUploadNoBtn) {
    confirmUploadNoBtn.addEventListener("click", () => {
      confirmationModalOverlay.classList.add("hidden");
      uploadModalOverlay.classList.remove("hidden");
      if (uploadedFileBlobUrl) {
        URL.revokeObjectURL(uploadedFileBlobUrl);
      }
      uploadedFileBlobUrl = null;
      uploadedFile = null;
      fileUploadInput.value = "";
      selectedFileNameSpan.textContent = "No file chosen";
    });
  }

  if (downloadToReviewBtn) {
    downloadToReviewBtn.addEventListener("click", () => {
      if (uploadedFileBlobUrl && uploadedFile) {
        const tempLink = document.createElement("a");
        tempLink.href = uploadedFileBlobUrl;
        tempLink.download = uploadedFile.name;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        console.log(`Downloaded file for review: ${uploadedFile.name}`);
      } else {
        console.warn("No file selected for download to review.");
      }
    });
  }

  const backArrowBtn = document.getElementById("backArrowBtn");
  if (backArrowBtn) {
    backArrowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.back();
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const notificationList = document.getElementById("notificationList");

  function calculateDaysLeft(dueDateString) {
    const today = new Date("2025-06-18T00:00:00"); 

    if (dueDateString.toLowerCase().includes("due today")) {
      return { text: "Due today", class: "urgent" };
    }
    if (dueDateString.toLowerCase().includes("overdue")) {
      return { text: dueDateString, class: "urgent" };
    }
    
    const datePart = dueDateString.replace("Due ", "");
    const dueDate = new Date(datePart);
    if (isNaN(dueDate.getTime())) {
      return { text: "Invalid date", class: "normal" };
    }

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { text: "Due tomorrow", class: "soon" };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, class: "soon" };
    } else {
      return { text: `Due in ${diffDays} days`, class: "normal" };
    }
  }

  function showNotifications() {
    const assignmentCards = document.querySelectorAll('.assignment-card[data-status="assigned"], .assignment-card[data-status="missing"]');
    notificationList.innerHTML = ''; 

    if (assignmentCards.length === 0) {
      notificationList.innerHTML = '<div class="notification-empty">No pending assignments.</div>';
      return;
    }

    assignmentCards.forEach(card => {
      const title = card.querySelector('.assignment-title').textContent;
      const course = card.querySelector('.course-name').textContent;
      const dueDateText = card.querySelector('.due-date').textContent;
      const detailsLink = card.querySelector('.details-btn').onclick;

      const dueDateInfo = calculateDaysLeft(dueDateText);

      const item = document.createElement('div');
      item.classList.add('notification-item');
      item.onclick = detailsLink;
      
      item.innerHTML = `
        <div class="notification-content">
          <span class="notification-assignment-title">${title}</span>
          <span class="notification-course-name">${course.trim()}</span>
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

  window.addEventListener("click", (e) => {
    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
      notificationDropdown.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const notificationList = document.getElementById("notificationList");

  function calculateDaysLeft(dueDateString) {
    const today = new Date("2025-06-18T00:00:00"); 

    if (dueDateString.toLowerCase().includes("due today")) {
      return { text: "Due today", class: "urgent" };
    }
    if (dueDateString.toLowerCase().includes("overdue")) {
      return { text: dueDateString, class: "urgent" };
    }
    
    const datePart = dueDateString.replace("Due ", "");
    const dueDate = new Date(datePart);
    if (isNaN(dueDate.getTime())) {
      return { text: "Invalid date", class: "normal" };
    }

    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { text: "Due tomorrow", class: "soon" };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, class: "soon" };
    } else {
      return { text: `Due in ${diffDays} days`, class: "normal" };
    }
  }

  function showNotifications() {
    const assignmentCards = document.querySelectorAll('.assignment-card[data-status="assigned"], .assignment-card[data-status="missing"]');
    notificationList.innerHTML = '';

    if (assignmentCards.length === 0) {
      notificationList.innerHTML = '<div class="notification-empty">No pending assignments.</div>';
      return;
    }

    assignmentCards.forEach(card => {
      const title = card.querySelector('.assignment-title').textContent;
      const course = card.querySelector('.course-name').textContent;
      const dueDateText = card.querySelector('.due-date').textContent;
      const detailsLink = card.querySelector('.details-btn').onclick;

      const dueDateInfo = calculateDaysLeft(dueDateText);

      const item = document.createElement('div');
      item.classList.add('notification-item');
      item.onclick = detailsLink;
      
      item.innerHTML = `
        <div class="notification-content">
          <span class="notification-assignment-title">${title}</span>
          <span class="notification-course-name">${course.trim()}</span>
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

  window.addEventListener("click", (e) => {
    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
      notificationDropdown.classList.remove("show");
    }
  });
});