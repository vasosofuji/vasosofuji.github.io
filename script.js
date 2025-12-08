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
    // 1. Initial scroll-reveal setup (applied to the card)
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease-out";
    
    // Start observing the card for the scroll-reveal effect immediately
    observer.observe(card);

    // 2. Image loading logic
    const img = card.querySelector('img');
    // We keep the loader reference, but only manipulate the parent class
    
    const handleImageLoad = () => {
        if (img.complete) {
            // FIX: Add a class to the card immediately to trigger loader removal via CSS.
            card.classList.add('loader-hidden'); 
            
            // Add the 'loaded' class to sharpen the image (CSS handles the 0.8s filter transition)
            img.classList.add('loaded');

            // The JS no longer uses setTimeout, eliminating the artificial delay.
        }
    };

    // Event listener for image load
    img.addEventListener('load', handleImageLoad);
    
    // Handle images that are already cached/loaded when the script runs
    if (img.complete) {
        handleImageLoad();
    }
});

// --- Mobile Menu Toggle Script ---
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


// --- CALENDAR FUNCTIONALITY ---

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

let currentMonth = 11; // December (0-indexed)
let currentYear = 2025; 

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

// Add event listeners for arrows
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

// Initial render when the page loads
renderCalendar();
