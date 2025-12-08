// Simple script to reveal elements on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Apply to cards for scroll reveal AND handle image loading
document.querySelectorAll('.photo-card').forEach(card => {
    // 1. Initial scroll-reveal setup
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease-out";
    
    observer.observe(card);

    // 2. Image loading logic
    const img = card.querySelector('img');
    let isLoaded = false; // Flag to prevent double-firing

    const revealImage = () => {
        if (isLoaded) return;
        isLoaded = true;

        // Remove loader instantly
        card.classList.add('loader-hidden'); 
        
        // Unblur the image (CSS handles the smooth transition)
        img.classList.add('loaded');
    };

    // A. Standard Load Event: Fires when fully loaded
    img.addEventListener('load', revealImage);

    // B. Error Event: Fires if image breaks/404s (Prevents infinite spinner)
    img.addEventListener('error', () => {
        console.warn('Image failed to load:', img.src);
        revealImage(); // Remove loader so we don't block the broken icon/alt text
    });

    // C. Check if already cached/complete
    if (img.complete) {
        revealImage();
    } 
    // D. "90% Loaded" Simulation / Progressive Check
    // If the image has dimensions (naturalWidth > 0), it's visible enough to show.
    else if (img.naturalWidth > 0) {
        revealImage();
    }

    // E. Fail-safe Timer: If nothing happens in 3 seconds, show it anyway.
    // This fixes cases where the browser gets stuck at 99%.
    setTimeout(() => {
        if (!isLoaded) {
            // Only force it if we have dimensions (it's not a broken link)
            if(img.naturalWidth > 0) {
                revealImage();
            } else {
                 // If 0 dimensions after 3s, it's likely broken or very slow. 
                 // We remove the loader anyway so the user isn't stuck.
                 revealImage();
            }
        }
    }, 3000); 
});

// --- Mobile Menu Toggle Script ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// --- CALENDAR FUNCTIONALITY ---
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const bookedDates = ["2025-12-20", "2025-12-25"];
const bookedEvents = {
    "2025-12-20": "Concert coverage for THE POT, LSD During War and BIK at La Kanja.",
    "2025-12-25": "Concert coverage for BIK at Dze Pub."
};

let currentMonth = 11; 
let currentYear = 2025; 

const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const contactMessage = document.getElementById('contactMessage');
const bookingDetailsContainer = document.getElementById('bookingDetails'); 

function selectDate(day, month, year) {
    const fullDate = `${months[month]} ${day}, ${year}`;
    const messageTemplate = `Hello Mateja, I am contacting you to inquire about booking a session on: ${fullDate}.\n`;
    contactMessage.value = messageTemplate;
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { contactMessage.focus(); }, 500);
}

function updateBookingDetails() {
    const currentMonthBookings = Object.keys(bookedEvents).filter(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return year === currentYear && (month - 1) === currentMonth; 
    });

    if (currentMonthBookings.length === 0) {
        bookingDetailsContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic; margin-top: 10px;">No specific event details recorded for this month.</p>';
        return;
    }

    let html = '<h3 style="color: var(--accent); margin-top: 20px; font-size: 1.1rem;">Scheduled Events:</h3>';
    html += '<ul class="event-list">';
    
    currentMonthBookings.sort((a, b) => {
        const dayA = Number(a.split('-')[2]);
        const dayB = Number(b.split('-')[2]);
        return dayA - dayB;
    });

    currentMonthBookings.forEach(dateKey => {
        const day = dateKey.split('-')[2];
        const description = bookedEvents[dateKey];
        html += `<li><strong>${day}. ${months[currentMonth]}:</strong> ${description}</li>`;
    });

    html += '</ul>';
    bookingDetailsContainer.innerHTML = html;
}

function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = "";
    updateBookingDetails(); 

    for (let i = 0; i < firstDayOfMonth; i++) {
        const blankDay = document.createElement('div');
        blankDay.classList.add('day', 'blank');
        calendarGrid.appendChild(blankDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;

        const dateString = `${currentYear}-${currentMonth + 1}-${day}`;
        
        if (bookedDates.includes(dateString)) {
            dayElement.classList.add('booked');
            dayElement.title = bookedEvents[dateString] || "Date is already booked.";
        } else {
            dayElement.classList.add('available');
            dayElement.title = `Click to book ${months[currentMonth]} ${day}, ${currentYear}`;
            dayElement.addEventListener('click', () => {
                selectDate(day, currentMonth, currentYear);
            });
        }
        calendarGrid.appendChild(dayElement);
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

renderCalendar();
