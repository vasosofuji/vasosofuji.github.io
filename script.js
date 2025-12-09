// --- NEW FIX: Ensure page always starts at the top on refresh ---
window.onload = function() {
    // Scrolls the window to the top (0, 0 coordinates) with no smooth animation
    window.scrollTo(0, 0); 
};
// -----------------------------------------------------------------


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

// Apply scroll-reveal setup to all cards
document.querySelectorAll('.photo-card').forEach(card => {
    // 1. Initial scroll-reveal setup (applied to the card)
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease-out";
    
    // Start observing the card for the scroll-reveal effect immediately
    observer.observe(card);
});


// --- GLOBAL PRELOADER LOGIC (FIXED 1.5 seconds) ---
// Find the preloader element immediately
const preloader = document.getElementById('global-preloader');

// Set a timer for the required 1.5 seconds (1500ms) that starts NOW, 
// regardless of images loading status.
setTimeout(() => {
    // Add the 'hidden' class to fade out and hide the preloader
    if (preloader) {
        preloader.classList.add('hidden');
    }
}, 3800);
// --- END GLOBAL PRELOADER LOGIC ---


// --- Mobile Menu Toggle Script (unchanged) ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked (useful for single-page sites)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});
// --- End Mobile Menu Toggle Script ---


// --- CALENDAR FUNCTIONALITY (unchanged) ---


// --- CALENDAR MINIMUM DATE CONSTANTS ---
// Set the earliest date the calendar can show (based on initial values: December 2025)
const MIN_MONTH = 11; // December (0-indexed)
const MIN_YEAR = 2025; 
// ---------------------------------------

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// 1. Array of booked dates (YYYY-M-D) - Used for styling the calendar grid
const bookedDates = [
    "2025-12-20", 
    "2025-12-25"
];

// 2. Object of booked events (Key matches YYYY-M-D in bookedDates) - Used for the legend text
const bookedEvents = {
    "2025-12-20": "Concert coverage for THE POT, LSD During War and BIK at La Kanja.",
    "2025-12-25": "Concert coverage for BIK at Dze Pub."
};

let currentMonth = MIN_MONTH; 
let currentYear = MIN_YEAR; 

// Cache DOM elements
const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const contactMessage = document.getElementById('contactMessage');
const bookingDetailsContainer = document.getElementById('bookingDetails'); 

// Function to handle date selection
function selectDate(day, month, year) {
    const fullDate = `${months[month]} ${day}, ${year}`;
    const messageTemplate = `Hello Mateja, I am contacting you to inquire about booking a session on: ${fullDate}.\n`;
    
    // 1. Fill the message textarea
    contactMessage.value = messageTemplate;

    // 2. Scroll to the contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // 3. Focus on the message field after scrolling
    setTimeout(() => {
        contactMessage.focus();
    }, 500);
}

// Function to update the booking details legend
function updateBookingDetails() {
    // Filter booked events for the current month/year
    const currentMonthBookings = Object.keys(bookedEvents).filter(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        // Month in object is 1-indexed, currentMonth is 0-indexed
        return year === currentYear && (month - 1) === currentMonth; 
    });

    if (currentMonthBookings.length === 0) {
        bookingDetailsContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic; margin-top: 10px;">No specific event details recorded for this month.</p>';
        return;
    }

    let html = '<h3 style="color: var(--accent); margin-top: 20px; font-size: 1.1rem;">Scheduled Events:</h3>';
    html += '<ul class="event-list">';
    
    // Sort the bookings numerically by day
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


// Function to render the calendar grid
function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = "";
    
    // Update the event details when the calendar is rendered
    updateBookingDetails(); 


    // NEW: Disable prev button if we are at the starting month/year
    if (currentMonth === MIN_MONTH && currentYear === MIN_YEAR) {
        prevMonthBtn.style.opacity = '0.3'; // Visual hint it's disabled
        prevMonthBtn.style.cursor = 'default';
        prevMonthBtn.style.pointerEvents = 'none'; // Make it unclickable
    } else {
        prevMonthBtn.style.opacity = '1';
        prevMonthBtn.style.cursor = 'pointer';
        prevMonthBtn.style.pointerEvents = 'auto';
    }

    // Render leading blank days
    for (let i = 0; i < firstDayOfMonth; i++) {
        const blankDay = document.createElement('div');
        blankDay.classList.add('day', 'blank');
        calendarGrid.appendChild(blankDay);
    }

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;

        const dateString = `${currentYear}-${currentMonth + 1}-${day}`;
        
        if (bookedDates.includes(dateString)) {
            dayElement.classList.add('booked');
            // Use the event description as the tooltip
            dayElement.title = bookedEvents[dateString] || "Date is already booked.";
        } else {
            // If the day is NOT booked or blank, make it clickable
            dayElement.classList.add('available');
            dayElement.title = `Click to book ${months[currentMonth]} ${day}, ${currentYear}`;
            
            // Add click listener to available days
            dayElement.addEventListener('click', () => {
                selectDate(day, currentMonth, currentYear);
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
}


// Function to change the month and handle year rollover
function changeMonth(offset) {
    let nextMonth = currentMonth + offset;
    let nextYear = currentYear;

    if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
    } else if (nextMonth < 0) {
        nextMonth = 11;
        nextYear--;
    }

    // NEW CHECK: Prevent going before the minimum date (MIN_YEAR/MIN_MONTH)
    if (nextYear < MIN_YEAR || (nextYear === MIN_YEAR && nextMonth < MIN_MONTH)) {
        // Stop the function if the change is invalid (trying to go too far back)
        return; 
    }
    
    // Only update if the change is valid
    currentMonth = nextMonth;
    currentYear = nextYear;

    renderCalendar();
}


// Add event listeners for arrows
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

// Initial render when the page loads
renderCalendar();
