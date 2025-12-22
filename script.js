
// Prevent right-click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});

// Prevent keyboard shortcuts for DevTools
document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }

    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }

    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

// Detect DevTools and close page
(function () {
    const devtools = {
        isOpen: false,
        orientation: null
    };

    const threshold = 160;

    const emitEvent = (isOpen, orientation) => {
        if (devtools.isOpen !== isOpen || devtools.orientation !== orientation) {
            devtools.isOpen = isOpen;
            devtools.orientation = orientation;

            if (isOpen) {
                // Close the page when DevTools is detected
                window.location.href = 'about:blank';
                window.close();
            }
        }
    };

    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (!(heightThreshold && widthThreshold) && ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
            emitEvent(true, orientation);
        } else {
            emitEvent(false, null);
        }
    }, 500);

    // Additional detection using console
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function () {
            emitEvent(true, null);
            throw new Error('DevTools detected');
        }
    });

    setInterval(() => {
        console.log(element);
        console.clear();
    }, 1000);
})();

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
