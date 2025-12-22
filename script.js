/* ============================================ */
/* UI INTERACTION - REVEAL & COPY FUNCTIONALITY */
/* ============================================ */

let currentExpanded = null;

function handlePaymentClick(id, address, name) {
    const btn = document.getElementById('btn-' + id);
    const addrDiv = document.getElementById('addr-' + id);

    // If clicking the same button, collapse it
    if (currentExpanded === id) {
        addrDiv.classList.remove('show');
        btn.classList.remove('expanded');
        currentExpanded = null;
        return;
    }

    // Collapse previously expanded
    if (currentExpanded) {
        const prevAddr = document.getElementById('addr-' + currentExpanded);
        const prevBtn = document.getElementById('btn-' + currentExpanded);
        prevAddr.classList.remove('show');
        prevBtn.classList.remove('expanded');
    }

    // Expand current
    addrDiv.classList.add('show');
    btn.classList.add('expanded');
    currentExpanded = id;

    // Copy to clipboard instantly
    copyToClipboard(address, name);
}

function copyToClipboard(text, name) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`${name} copied!`);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy. Please try again.');
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');

    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
