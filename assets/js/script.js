/* ==========================================================================
   Janaki Professional Academy — School ERP
   script.js — all interactivity, centralized. No Firebase. No fake APIs.
   Guards check for element existence so this file works unmodified on
   every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initSidebar();
  initModals();
  initSidePanels();
  initTabs();
  initSearchFilterTables();
  initStudentsPage();
  initTeachersPage();
  initAttendancePage();
  initFeesSalaryPage();
  initNoticesPage();
  initDocumentsPage();
  initSettingsPage();
  initDashboardExport();
});

/* -------------------- Utilities -------------------- */

function qs(sel, ctx) {
  return (ctx || document).querySelector(sel);
}

function qsa(sel, ctx) {
  return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
}

function showToast(message, tone) {
  var existing = qs(".erp-toast");
  if (existing) existing.remove();

  var toast = document.createElement("div");
  toast.className = "erp-toast";
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);" +
    "background:" + (tone === "danger" ? "#b4322f" : "#1f3a5f") + ";" +
    "color:#fff;padding:10px 18px;border-radius:6px;font-size:0.85rem;" +
    "z-index:2000;max-width:90vw;box-shadow:0 4px 16px rgba(0,0,0,0.18);";
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.remove();
  }, 2500);
}

function generateId(prefix) {
  var n = Math.floor(1000 + Math.random() * 9000);
  return prefix + n;
}

/* -------------------- Sidebar / mobile nav -------------------- */

function initSidebar() {
  var sidebar = qs("#sidebar");
  var hamburger = qs("#hamburgerBtn");
  var closeBtn = qs("#sidebarClose");
  var overlay = qs("#sidebarOverlay");

  if (!sidebar || !hamburger) return;

  function openSidebar() {
    sidebar.classList.add("is-open");
    if (overlay) overlay.classList.add("is-open");
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
  }

  hamburger.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSidebar();
  });
}

/* -------------------- Modals -------------------- */

function initModals() {
  qsa("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal(btn.getAttribute("data-close-modal"));
    });
  });

  qsa(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      qsa(".modal-overlay.is-open").forEach(function (m) {
        m.classList.remove("is-open");
      });
    }
  });
}

function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.add("is-open");
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.remove("is-open");
}

/* -------------------- Side panels -------------------- */

function initSidePanels() {
  qsa("[data-close-panel]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      closePanel(btn.getAttribute("data-close-panel"));
    });
  });

  qsa(".side-panel-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.classList.remove("is-open");
    });
  });
}

function openPanel(id) {
  var panel = document.getElementById(id);
  if (panel) panel.classList.add("is-open");
}

function closePanel(id) {
  var panel = document.getElementById(id);
  if (panel) panel.classList.remove("is-open");
}

/* -------------------- Tabs -------------------- */

function initTabs() {
  qsa(".tabs").forEach(function (tabGroup) {
    var buttons = qsa(".tab-btn", tabGroup);
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-tab-target");
        var container = tabGroup.parentElement;

        buttons.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");

        qsa(".tab-panel", container).forEach(function (panel) {
          panel.classList.toggle("is-active", panel.id === targetId);
        });
      });
    });
  });
}

/* -------------------- Generic search + filter for tables -------------------- */

function filterTableRows(tableBodySelector, emptyStateSelector, matchFn) {
  var rows = qsa(tableBodySelector + " tbody tr");
  var visibleCount = 0;

  rows.forEach(function (row) {
    var match = matchFn(row);
    row.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });

  var emptyState = qs(emptyStateSelector);
  if (emptyState) {
    emptyState.classList.toggle("hidden", visibleCount !== 0);
  }
}

function initSearchFilterTables() {
  /* Generic wiring is done per-page below, since match logic differs
     by table columns. This function is kept as an entry point for
     future shared behavior. */
}

/* -------------------- Students page -------------------- */

function initStudentsPage() {
  var table = qs("#studentsTable");
  if (!table) return;

  var searchInput = qs("#studentSearch");
  var classFilter = qs("#filterClass");
  var statusFilter = qs("#filterStatus");

  function applyFilters() {
    var term = (searchInput.value || "").toLowerCase().trim();
    var cls = classFilter.value;
    var status = statusFilter.value;

    filterTableRows("#studentsTable", "#studentsEmptyState", function (row) {
      var name = row.children[2].textContent.toLowerCase();
      var id = row.children[1].textContent.toLowerCase();
      var rowClass = row.getAttribute("data-class") || "";
      var rowStatus = row.getAttribute("data-status") || "";

      var matchesTerm = !term || name.indexOf(term) !== -1 || id.indexOf(term) !== -1;
      var matchesClass = !cls || rowClass === cls;
      var matchesStatus = !status || rowStatus === status;

      return matchesTerm && matchesClass && matchesStatus;
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (classFilter) classFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);

  var addBtn = qs("#addStudentBtn");
  var studentForm = qs("#studentForm");
  var modalTitle = qs("#studentModalTitle");

  if (addBtn) {
    addBtn.addEventListener("click", function () {
      studentForm.reset();
      qs('[name="admissionNo"]', studentForm).value = generateId("ADM-2026-");
      modalTitle.textContent = "Add student";
      openModal("studentModal");
    });
  }

  if (studentForm) {
    studentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = qs('[name="name"]', studentForm).value.trim();
      if (!name) {
        showToast("Enter the student's full name.", "danger");
        return;
      }
      showToast("Student saved.");
      closeModal("studentModal");
    });
  }

  qsa(".btn-edit-student").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      modalTitle.textContent = "Edit student — " + row.children[2].textContent;
      openModal("studentModal");
    });
  });

  qsa(".btn-view-student").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      var name = row.children[2].textContent;
      var initials = name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();

      qs("#studentPanelInitials").textContent = initials;
      qs("#studentPanelName").textContent = name;
      qs("#studentPanelId").textContent = row.getAttribute("data-student-id");
      qs("#studentPanelClass").textContent = row.children[3].textContent;
      qs("#studentPanelRoll").textContent = row.children[4].textContent;
      qs("#studentPanelGuardian").textContent = row.children[5].textContent;
      qs("#studentPanelContact").textContent = row.children[6].textContent;

      var statusBadge = qs("#studentPanelStatus");
      var status = row.getAttribute("data-status");
      statusBadge.textContent = status;
      statusBadge.className = "badge " + (status === "Active" ? "badge-success" : "badge-neutral");

      openPanel("studentPanel");
    });
  });

  var panelEditBtn = qs("#studentPanelEditBtn");
  if (panelEditBtn) {
    panelEditBtn.addEventListener("click", function () {
      closePanel("studentPanel");
      modalTitle.textContent = "Edit student — " + qs("#studentPanelName").textContent;
      openModal("studentModal");
    });
  }
}

/* -------------------- Teachers page -------------------- */

function initTeachersPage() {
  var table = qs("#teachersTable");
  if (!table) return;

  var searchInput = qs("#teacherSearch");
  var subjectFilter = qs("#filterSubject");
  var statusFilter = qs("#filterEmpStatus");

  function applyFilters() {
    var term = (searchInput.value || "").toLowerCase().trim();
    var subject = subjectFilter.value;
    var status = statusFilter.value;

    filterTableRows("#teachersTable", "#teachersEmptyState", function (row) {
      var name = row.children[2].textContent.toLowerCase();
      var id = row.children[1].textContent.toLowerCase();
      var rowSubject = row.getAttribute("data-subject") || "";
      var rowStatus = row.getAttribute("data-status") || "";

      var matchesTerm = !term || name.indexOf(term) !== -1 || id.indexOf(term) !== -1;
      var matchesSubject = !subject || rowSubject === subject;
      var matchesStatus = !status || rowStatus === status;

      return matchesTerm && matchesSubject && matchesStatus;
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (subjectFilter) subjectFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);

  var addBtn = qs("#addTeacherBtn");
  var teacherForm = qs("#teacherForm");
  var modalTitle = qs("#teacherModalTitle");

  if (addBtn) {
    addBtn.addEventListener("click", function () {
      teacherForm.reset();
      qs('[name="teacherId"]', teacherForm).value = generateId("JPA-TCH-0");
      modalTitle.textContent = "Add teacher";
      openModal("teacherModal");
    });
  }

  if (teacherForm) {
    teacherForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = qs('[name="name"]', teacherForm).value.trim();
      if (!name) {
        showToast("Enter the teacher's full name.", "danger");
        return;
      }
      showToast("Teacher saved.");
      closeModal("teacherModal");
    });
  }

  qsa(".btn-edit-teacher").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      modalTitle.textContent = "Edit teacher — " + row.children[2].textContent;
      openModal("teacherModal");
    });
  });

  qsa(".btn-view-teacher").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      var name = row.children[2].textContent;
      var initials = name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();

      qs("#teacherPanelInitials").textContent = initials;
      qs("#teacherPanelName").textContent = name;
      qs("#teacherPanelId").textContent = row.getAttribute("data-teacher-id");
      qs("#teacherPanelSubject").textContent = row.children[3].textContent;
      qs("#teacherPanelClass").textContent = row.children[4].textContent;
      qs("#teacherPanelEmail").textContent = row.children[5].textContent;
      qs("#teacherPanelContact").textContent = row.children[6].textContent;

      var statusBadge = qs("#teacherPanelStatus");
      var status = row.getAttribute("data-status");
      statusBadge.textContent = status;
      statusBadge.className =
        "badge " +
        (status === "Active" ? "badge-success" : status === "On leave" ? "badge-warning" : "badge-neutral");

      openPanel("teacherPanel");
    });
  });

  var panelEditBtn = qs("#teacherPanelEditBtn");
  if (panelEditBtn) {
    panelEditBtn.addEventListener("click", function () {
      closePanel("teacherPanel");
      modalTitle.textContent = "Edit teacher — " + qs("#teacherPanelName").textContent;
      openModal("teacherModal");
    });
  }
}

/* -------------------- Attendance page -------------------- */

function initAttendancePage() {
  var table = qs("#attendanceTable");
  if (!table) return;

  var searchInput = qs("#attendanceSearch");
  var saveBtn = qs("#saveAttendanceBtn");
  var savedNote = qs("#attendanceSavedNote");
  var classSelect = qs("#attendanceClass");
  var dateInput = qs("#attendanceDate");

  function recalculateCounts() {
    var rows = qsa("#attendanceTable tbody tr");
    var present = 0, absent = 0, late = 0;

    rows.forEach(function (row) {
      var checked = qs('input[type="radio"]:checked', row);
      if (!checked) return;
      if (checked.value === "present") present++;
      else if (checked.value === "absent") absent++;
      else if (checked.value === "late") late++;
    });

    var total = present + absent + late;
    var pct = total ? (((present + late) / total) * 100).toFixed(1) : "0.0";

    if (qs("#countPresent")) qs("#countPresent").textContent = present;
    if (qs("#countAbsent")) qs("#countAbsent").textContent = absent;
    if (qs("#countLate")) qs("#countLate").textContent = late;
    if (qs("#countPercent")) qs("#countPercent").textContent = pct + "%";
  }

  qsa('#attendanceTable input[type="radio"]').forEach(function (input) {
    input.addEventListener("change", recalculateCounts);
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var term = searchInput.value.toLowerCase().trim();
      filterTableRows("#attendanceTable", "#attendanceEmptyState", function (row) {
        var name = (row.getAttribute("data-student-name") || "").toLowerCase();
        var roll = (row.getAttribute("data-roll") || "").toLowerCase();
        return !term || name.indexOf(term) !== -1 || roll.indexOf(term) !== -1;
      });
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      var records = qsa("#attendanceTable tbody tr").map(function (row) {
        var checked = qs('input[type="radio"]:checked', row);
        return {
          roll: row.getAttribute("data-roll"),
          name: row.getAttribute("data-student-name"),
          status: checked ? checked.value : null
        };
      });

      var key = "jpa_attendance_" + (dateInput ? dateInput.value : "") + "_" + (classSelect ? classSelect.value : "");

      try {
        localStorage.setItem(key, JSON.stringify(records));
        savedNote.textContent = "Saved locally at " + new Date().toLocaleTimeString();
        showToast("Attendance saved.");
      } catch (err) {
        showToast("Could not save attendance in this browser.", "danger");
      }
    });
  }

  recalculateCounts();
}

/* -------------------- Fees & salary page -------------------- */

function initFeesSalaryPage() {
  var feesTable = qs("#feesTable");
  var salaryTable = qs("#salaryTable");
  if (!feesTable && !salaryTable) return;

  if (feesTable) {
    var feeSearch = qs("#feeSearch");
    var feeStatusFilter = qs("#feeStatusFilter");

    function applyFeeFilters() {
      var term = (feeSearch.value || "").toLowerCase().trim();
      var status = feeStatusFilter.value;

      filterTableRows("#feesTable", "#feesEmptyState", function (row) {
        var student = row.children[1].textContent.toLowerCase();
        var receipt = row.children[0].textContent.toLowerCase();
        var rowStatus = row.getAttribute("data-status") || "";
        var matchesTerm = !term || student.indexOf(term) !== -1 || receipt.indexOf(term) !== -1;
        var matchesStatus = !status || rowStatus === status;
        return matchesTerm && matchesStatus;
      });
    }

    if (feeSearch) feeSearch.addEventListener("input", applyFeeFilters);
    if (feeStatusFilter) feeStatusFilter.addEventListener("change", applyFeeFilters);

    qsa(".btn-view-receipt").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var row = btn.closest("tr");
        qs("#receiptId").textContent = row.children[0].textContent;
        qs("#receiptStudent").textContent = row.children[1].textContent;
        qs("#receiptClass").textContent = row.children[2].textContent;
        qs("#receiptAmount").textContent = row.children[3].textContent;
        qs("#receiptBalance").textContent = row.children[4].textContent;
        qs("#receiptDate").textContent = row.children[5].textContent;
        openModal("receiptModal");
      });
    });

    var printReceiptBtn = qs("#printReceiptBtn");
    if (printReceiptBtn) {
      printReceiptBtn.addEventListener("click", function () {
        printElement("receiptPrintArea");
      });
    }
  }

  if (salaryTable) {
    var salarySearch = qs("#salarySearch");
    var salaryStatusFilter = qs("#salaryStatusFilter");

    function applySalaryFilters() {
      var term = (salarySearch.value || "").toLowerCase().trim();
      var status = salaryStatusFilter.value;

      filterTableRows("#salaryTable", "#salaryEmptyState", function (row) {
        var name = row.children[1].textContent.toLowerCase();
        var id = row.children[0].textContent.toLowerCase();
        var rowStatus = row.getAttribute("data-status") || "";
        var matchesTerm = !term || name.indexOf(term) !== -1 || id.indexOf(term) !== -1;
        var matchesStatus = !status || rowStatus === status;
        return matchesTerm && matchesStatus;
      });
    }

    if (salarySearch) salarySearch.addEventListener("input", applySalaryFilters);
    if (salaryStatusFilter) salaryStatusFilter.addEventListener("change", applySalaryFilters);

    qsa(".btn-view-payslip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var row = btn.closest("tr");
        qs("#payslipStaffId").textContent = row.children[0].textContent;
        qs("#payslipName").textContent = row.children[1].textContent;
        qs("#payslipBasic").textContent = row.children[2].textContent;
        qs("#payslipAllowances").textContent = row.children[3].textContent;
        qs("#payslipDeductions").textContent = row.children[4].textContent;
        qs("#payslipNet").textContent = row.children[5].textContent;
        openModal("payslipModal");
      });
    });

    var printPayslipBtn = qs("#printPayslipBtn");
    if (printPayslipBtn) {
      printPayslipBtn.addEventListener("click", function () {
        printElement("payslipPrintArea");
      });
    }
  }
}

/* -------------------- Notices page -------------------- */

function initNoticesPage() {
  var table = qs("#noticesTable");
  if (!table) return;

  var searchInput = qs("#noticeSearch");
  var categoryFilter = qs("#noticeCategoryFilter");
  var statusFilter = qs("#noticeStatusFilter");

  function applyFilters() {
    var term = (searchInput.value || "").toLowerCase().trim();
    var category = categoryFilter.value;
    var status = statusFilter.value;

    filterTableRows("#noticesTable", "#noticesEmptyState", function (row) {
      var title = row.children[0].textContent.toLowerCase();
      var rowCategory = row.getAttribute("data-category") || "";
      var rowStatus = row.getAttribute("data-status") || "";

      var matchesTerm = !term || title.indexOf(term) !== -1;
      var matchesCategory = !category || rowCategory === category;
      var matchesStatus = !status || rowStatus === status;

      return matchesTerm && matchesCategory && matchesStatus;
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyFilters);

  var addBtn = qs("#addNoticeBtn");
  var noticeForm = qs("#noticeForm");
  var modalTitle = qs("#noticeModalTitle");

  if (addBtn) {
    addBtn.addEventListener("click", function () {
      noticeForm.reset();
      modalTitle.textContent = "Add notice";
      openModal("noticeModal");
    });
  }

  if (noticeForm) {
    noticeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var title = qs('[name="title"]', noticeForm).value.trim();
      if (!title) {
        showToast("Enter a notice title.", "danger");
        return;
      }
      showToast("Notice saved.");
      closeModal("noticeModal");
    });
  }

  qsa(".btn-edit-notice").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      modalTitle.textContent = "Edit notice — " + row.children[0].textContent;
      openModal("noticeModal");
    });
  });

  qsa(".btn-view-notice").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      qs("#noticeViewTitle").textContent = row.children[0].textContent;
      qs("#noticeViewCategory").textContent = row.getAttribute("data-category");
      qs("#noticeViewStatus").textContent = row.getAttribute("data-status");
      qs("#noticeViewDate").textContent = row.children[2].textContent;
      qs("#noticeViewDetails").textContent =
        "Full notice content for \u201c" + row.children[0].textContent + "\u201d will appear here.";
      openModal("noticeViewModal");
    });
  });
}

/* -------------------- Documents page -------------------- */

function initDocumentsPage() {
  var idCardsTab = qs("#idCardsTab");
  if (!idCardsTab) return;

  var printIdCardBtn = qs("#printIdCardBtn");
  var printAdmitCardBtn = qs("#printAdmitCardBtn");
  var printCertificateBtn = qs("#printCertificateBtn");

  if (printIdCardBtn) {
    printIdCardBtn.addEventListener("click", function () {
      window.print();
    });
  }
  if (printAdmitCardBtn) {
    printAdmitCardBtn.addEventListener("click", function () {
      window.print();
    });
  }
  if (printCertificateBtn) {
    printCertificateBtn.addEventListener("click", function () {
      window.print();
    });
  }
}

/* -------------------- Settings page -------------------- */

function initSettingsPage() {
  qsa(
    "#schoolInfoForm, #academicSessionForm, #documentSettingsForm, #generalPreferencesForm"
  ).forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Settings saved.");
    });
  });
}

/* -------------------- Dashboard export -------------------- */

function initDashboardExport() {
  var exportPdfBtn = qs("#exportPdfBtn");
  var exportExcelBtn = qs("#exportExcelBtn");

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", function () {
      window.print();
    });
  }
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener("click", function () {
      showToast("Excel export will be available once the backend is connected.");
    });
  }
}

/* -------------------- Print helper -------------------- */

function printElement(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;

  var printWindow = window.open("", "_blank", "width=480,height=640");
  printWindow.document.write(
    "<html><head><title>Print</title><link rel='stylesheet' href='../assets/css/style.css'></head><body>" +
      el.outerHTML +
      "</body></html>"
  );
  printWindow.document.close();
  printWindow.focus();
  setTimeout(function () {
    printWindow.print();
    printWindow.close();
  }, 300);
}
