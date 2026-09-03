/* ============================================================
   STUDENTS PAGE — Module Logic
   ============================================================ */

(function() {
    // ---------- Modal Elements ----------
    const studentModal = document.getElementById('student-modal');
    const deleteModal = document.getElementById('delete-modal');
    const promoteModal = document.getElementById('promote-modal');
    const studentForm = document.getElementById('student-form');
    const addStudentBtn = document.getElementById('add-student-btn');
    const promoteBtn = document.getElementById('promote-btn');
    const studentModalTitle = document.getElementById('student-modal-title');

    // ---------- Open/Close Modals ----------
    function openStudentModal(mode = 'add') {
        studentModal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (mode === 'add') {
            studentModalTitle.textContent = 'Add Student';
            studentForm.reset();
        } else if (mode === 'edit') {
            studentModalTitle.textContent = 'Edit Student';
            // In future, populate form fields from selected student data.
            showToast('Edit feature will be available when data is added.', 'info');
        }
        // Focus first input
        studentForm.querySelector('input, select').focus();
    }

    function closeStudentModal() {
        studentModal.hidden = true;
        document.body.style.overflow = '';
    }

    function openDeleteModal() {
        deleteModal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeDeleteModal() {
        deleteModal.hidden = true;
        document.body.style.overflow = '';
    }

    function openPromoteModal() {
        promoteModal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closePromoteModal() {
        promoteModal.hidden = true;
        document.body.style.overflow = '';
    }

    // ---------- Event Listeners ----------
    addStudentBtn.addEventListener('click', () => openStudentModal('add'));

    promoteBtn.addEventListener('click', openPromoteModal);

    document.getElementById('student-modal-close').addEventListener('click', closeStudentModal);
    document.getElementById('student-modal-cancel').addEventListener('click', closeStudentModal);
    document.getElementById('delete-modal-close').addEventListener('click', closeDeleteModal);
    document.getElementById('delete-cancel').addEventListener('click', closeDeleteModal);
    document.getElementById('promote-modal-close').addEventListener('click', closePromoteModal);
    document.getElementById('promote-close').addEventListener('click', closePromoteModal);

    // Close modals on overlay click (global script handles, but we ensure)
    // Global script's overlay click handler will close any modal-overlay.

    // ---------- Form Validation & Submit ----------
    studentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate required fields
        const requiredFields = [
            { input: document.getElementById('admission-no'), error: document.querySelector('#admission-no + .form-error') },
            { input: document.getElementById('student-name'), error: document.querySelector('#student-name + .form-error') },
            { input: document.getElementById('student-class'), error: document.querySelector('#student-class + .form-error') },
            { input: document.getElementById('student-section'), error: document.querySelector('#student-section + .form-error') },
            { input: document.getElementById('roll-no'), error: document.querySelector('#roll-no + .form-error') }
        ];

        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.input.value.trim()) {
                field.error.hidden = false;
                field.input.classList.add('input-error');
                isValid = false;
            } else {
                field.error.hidden = true;
                field.input.classList.remove('input-error');
            }
        });

        if (!isValid) {
            showToast('Please fill all required fields.', 'error');
            return;
        }

        // Since zero data phase, just show success and close modal
        showToast('Student added successfully (demo).', 'success');
        closeStudentModal();
        studentForm.reset();
    });

    // ---------- Delete Confirmation ----------
    document.getElementById('delete-confirm').addEventListener('click', function() {
        showToast('Student deleted successfully (demo).', 'success');
        closeDeleteModal();
    });

    // ---------- Search & Filter (no real data, but handle interactions) ----------
    const searchInput = document.getElementById('student-search');
    const classFilter = document.getElementById('class-filter');
    const sectionFilter = document.getElementById('section-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');

    function handleFilterChange() {
        // In Phase 2, this will trigger data reload.
        // For now, show informational toast if user interacts.
        showToast('Filtering will be active when data is added.', 'info');
    }

    searchInput.addEventListener('input', handleFilterChange);
    classFilter.addEventListener('change', handleFilterChange);
    sectionFilter.addEventListener('change', handleFilterChange);

    resetFiltersBtn.addEventListener('click', function() {
        searchInput.value = '';
        classFilter.value = '';
        sectionFilter.value = '';
        showToast('Filters reset.', 'info');
    });

    // ---------- Export Actions (call global functions) ----------
    // Already bound via onclick attributes in HTML.

    // ---------- Table Actions (delegated for future) ----------
    // In Phase 2, row action buttons will be added dynamically and handled here.
    // For now, no data.

})();
