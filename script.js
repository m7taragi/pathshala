const toggleBtn = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;

// Set theme
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlTag.setAttribute('data-theme', savedTheme);

toggleBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('reveal');
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => observer.observe(card));
