/* ============================================================
   GLOBAL SCRIPT — Common utilities for School ERP
   ============================================================ */

// ---------- Toast System ----------
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    // Icon based on type
    const iconMap = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>'
    };

    toast.innerHTML = `${iconMap[type] || iconMap.info}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ---------- Modal System ----------
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.hidden = true;
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not([hidden])').forEach(modal => {
            modal.hidden = true;
            document.body.style.overflow = '';
        });
    }
});

// ---------- Table Utilities ----------
function updateEmptyState(tableWrapperId, hasData) {
    const wrapper = document.getElementById(tableWrapperId);
    if (!wrapper) return;
    const emptyState = wrapper.querySelector('.empty-state');
    if (emptyState) {
        emptyState.style.display = hasData ? 'none' : 'block';
    }
}

// Generic pagination click handler (for future use)
function handlePagination(containerId, currentPage, totalPages, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const createButton = (label, page, disabled = false, active = false) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.disabled = disabled;
        if (active) btn.classList.add('active');
        if (!disabled && page !== currentPage) {
            btn.addEventListener('click', () => callback(page));
        }
        container.appendChild(btn);
    };
    // Prev
    createButton('Prev', currentPage - 1, currentPage === 1);
    // Pages (simple version: show all)
    for (let i = 1; i <= totalPages; i++) {
        createButton(i, i, false, i === currentPage);
    }
    // Next
    createButton('Next', currentPage + 1, currentPage === totalPages);
}

// ---------- Export Utilities (placeholder, ready for future data) ----------
function exportToPDF(tableId, filename = 'export.pdf') {
    // Phase 1: No data to export, show info toast
    showToast('PDF export will be available when data is added in Phase 2.', 'info');
}

function exportToExcel(tableId, filename = 'export.xlsx') {
    showToast('Excel export will be available when data is added in Phase 2.', 'info');
}

function printTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .no-print { display: none; }
            </style>
        </head>
        <body>${table.outerHTML}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ---------- Form Validation Helper ----------
function validateRequiredField(input, errorElement) {
    if (!input.value.trim()) {
        errorElement.hidden = false;
        input.classList.add('input-error');
        return false;
    } else {
        errorElement.hidden = true;
        input.classList.remove('input-error');
        return true;
    }
}

// Add .input-error style (will be added to CSS if not present)
const style = document.createElement('style');
style.textContent = `.input-error { border-color: var(--color-danger) !important; }`;
document.head.appendChild(style);
