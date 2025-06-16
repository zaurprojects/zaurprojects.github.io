// --- Page Navigation Logic ---
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    // Show the selected page
    const activePage = document.getElementById(pageId);
    if (activePage) {
       activePage.classList.add('active');
    }
}

// --- Form Submission Logic ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('contact-form-container').style.display = 'none';
        document.getElementById('thank-you-message').style.display = 'block';
    });
}
