// Mobile navigation toggle, shared by every page.
(function () {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');

    if (!nav || !toggle) {
        return;
    }

    function setOpen(open) {
        nav.setAttribute('data-open', open ? 'true' : 'false');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
        setOpen(nav.getAttribute('data-open') !== 'true');
    });

    nav.addEventListener('click', function (event) {
        if (event.target.closest('.nav-links a')) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    });
})();
