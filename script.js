// --- Ensure page starts at top ONLY if no hash anchor ---
window.onload = function() {
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
    // Initialize form validation messages
    updateFormValidationMessages(currentLang);
};

// --- SCROLL REVEAL LOGIC ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Set initial hidden state immediately so cards don't flash visible
document.querySelectorAll('.photo-card').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = "all 0.6s ease-out";
});

// Observer is started AFTER the preloader hides so that cards which are
// already in the viewport still get their slide-up animation (gallery page).
function startScrollReveal() {
    document.querySelectorAll('.photo-card').forEach(card => {
        observer.observe(card);
    });
}

// --- GLOBAL PRELOADER & HERO ANIMATION FIX ---
const preloader = document.getElementById('global-preloader');
const heroHeader = document.querySelector('header');

const isFirstVisit = !sessionStorage.getItem('hasVisited');
const preloaderDuration = isFirstVisit ? 3800 : 1500;

if (isFirstVisit) {
    sessionStorage.setItem('hasVisited', 'true');
}

setTimeout(() => {
    if (preloader) {
        preloader.classList.add('hidden');
        if (heroHeader) {
            heroHeader.classList.add('hero-active');
        }
        startScrollReveal();
    }
}, preloaderDuration);

// --- MOBILE MENU ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if(menuToggle){
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// --- CALENDAR LOGIC ---
const MIN_MONTH = 2;
const MIN_YEAR = 2026;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const bookedDates = ["2026-3-20", "2026-3-21"];
const bookedEvents = {"2026-3-20": "LoveRave Festival - MKC", "2026-3-21": "Pope Cafe Opening"};

let currentMonth = MIN_MONTH;
let currentYear = MIN_YEAR;

const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const contactMessage = document.getElementById('contactMessage');
const bookingDetailsContainer = document.getElementById('bookingDetails');

function selectDate(day, month, year) {
    // 1. Fill Input
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        const formatMonth = String(month + 1).padStart(2, '0');
        const formatDay = String(day).padStart(2, '0');
        dateInput.value = `${year}-${formatMonth}-${formatDay}`;
    }

    // 2. SCROLL TO FORM on mobile only
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        const formContainer = document.getElementById('contact-form-calendar');
        if (formContainer) {
            const yOffset = -80;
            const y = formContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setTimeout(() => {
                if (contactMessage) contactMessage.focus();
            }, 800);
        }
    }
}

// Block Booked Dates Logic
const datePicker = document.getElementById('dateInput');
if(datePicker) {
    datePicker.addEventListener('input', function() {
        const selectedDate = this.value;
        if (typeof bookedDates !== 'undefined' && bookedDates.includes(selectedDate)) {
            alert("Sorry, that date is already booked! Please select an available date from the calendar.");
            this.value = "";
        }
    });
}

function updateBookingDetails() {
    if(!bookingDetailsContainer) return;

    const currentMonthBookings = Object.keys(bookedEvents).filter(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return year === currentYear && (month - 1) === currentMonth;
    });

    if (currentMonthBookings.length === 0) {
        bookingDetailsContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic; margin-top: 10px;" data-translate="NoEvents">No specific event details recorded for this month.</p>';
        // Refresh translation for the new element
        const noEventElem = bookingDetailsContainer.querySelector('[data-translate="NoEvents"]');
        if(noEventElem && translations[currentLang]) {
            noEventElem.textContent = translations[currentLang]['NoEvents'];
        }
        return;
    }

    const scheduledLabel = 'Scheduled Events:';
    let html = `<h3 style="color: var(--accent); margin-top: 20px; font-size: 1.1rem;">${scheduledLabel}</h3><ul class="event-list">`;
    currentMonthBookings.sort((a, b) => {
        return Number(a.split('-')[2]) - Number(b.split('-')[2]);
    });

    currentMonthBookings.forEach(dateKey => {
        const day = dateKey.split('-')[2];
        html += `<li><strong>${day}. ${months[currentMonth]}:</strong> ${bookedEvents[dateKey]}</li>`;
    });
    html += '</ul>';
    bookingDetailsContainer.innerHTML = html;
}

function renderCalendar() {
    if(!calendarGrid) return;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYearDisplay.textContent = `${months[currentMonth]} ${currentYear}`;
    calendarGrid.innerHTML = "";
    updateBookingDetails();

    if (currentMonth === MIN_MONTH && currentYear === MIN_YEAR) {
        prevMonthBtn.style.opacity = '0.3';
        prevMonthBtn.style.pointerEvents = 'none';
    } else {
        prevMonthBtn.style.opacity = '1';
        prevMonthBtn.style.pointerEvents = 'auto';
    }

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
            dayElement.addEventListener('click', () => selectDate(day, currentMonth, currentYear));
        }
        calendarGrid.appendChild(dayElement);
    }
}

function changeMonth(offset) {
    let nextMonth = currentMonth + offset;
    let nextYear = currentYear;

    if (nextMonth > 11) { nextMonth = 0; nextYear++; }
    else if (nextMonth < 0) { nextMonth = 11; nextYear--; }

    if (nextYear < MIN_YEAR || (nextYear === MIN_YEAR && nextMonth < MIN_MONTH)) return;

    currentMonth = nextMonth;
    currentYear = nextYear;
    renderCalendar();
}

if(prevMonthBtn && nextMonthBtn) {
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
    renderCalendar();
}

// --- MOBILE GALLERY TAP HANDLER ---
document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        const wasActive = card.classList.contains('mobile-active');
        document.querySelectorAll('.photo-card').forEach(c => c.classList.remove('mobile-active'));
        if (!wasActive) {
            card.classList.add('mobile-active');
        }
    });
});

// --- FORMSPREE HANDLING & DATE SYNC ---
const dateInputSync = document.getElementById('dateInput');
if (dateInputSync) {
    const minMonthStr = String(MIN_MONTH + 1).padStart(2, '0');
    dateInputSync.min = `${MIN_YEAR}-${minMonthStr}-01`;
}

var form = document.getElementById("contact-form");
async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Thanks! Your message has been sent.";
            status.style.color = "var(--accent)";
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form";
                }
                status.style.color = "red";
            });
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem connecting to the server.";
        status.style.color = "red";
    });
}
if (form) {
    form.addEventListener("submit", handleSubmit);
}
window.addEventListener('pageshow', function(event) {
    var form = document.getElementById('contact-form');
    if (form) form.reset();
});

// --- LANGUAGE TOGGLE & TRANSLATIONS ---
const langToggle = document.getElementById('langToggle');
const langFlag = document.querySelector('.lang-flag');
let currentLang = localStorage.getItem('siteLanguage') || 'en';

const translations = {
    en: {
        // ... (Existing)
        aboutMe: 'About Me',
        gallery: 'Gallery',
        videos: 'Videos',
        contact: 'Contact',
        NoEvents: 'No specific event details recorded for this month.',
        photographyBy: 'Photography by',
        getInTouch: 'Get in Touch',
        aboutTitle: 'About Me',
        whoAmI: 'Who am I',
        collaborationsGear: 'Collaborations & Gear',
        aboutPara1: 'I\'m Mateja Vasojevikj, also known as <b>vasosofuji</b>, a 19 year old Cybersecurity Student at Faculty of Computer Science and Engineering at "Sts. Cyril and Methodius" University.',
        aboutPara2: 'On top of being a student, I\'m also a freelance photographer and cinematographer based in <b>Skopje, North Macedonia</b>.',
        aboutPara3: 'I shoot Portraits and Landscapes, but my primary focus is on Events and Concerts.',
        aboutPara4: 'If you like any of my work, feel free to <a href="#contact"><b>contact me</b></a> or message me on <a href="https://instagram.com/vasosofuji"><b>instagram!</b></a>',
        aboutPara12: '<b>Artist Collaborations:</b> Vladimir Chetkar, Noviot Pochetok, Marigold Box (Italy), Epidemik (RS), Ana & Stefan Petanovski, Golemata Voda, Fiction, Korka and many more.',
        aboutPara13: '<b>Festival/Event Collaborations:</b> Zdravo Mladi, Zemjotres, Underfest, Tributefest, Sepak Se Vrti, Stanica26, Marakana, Laboratorium, Enterprise Music School, Kotur, MKC and more.',
        aboutPara14: '<b>Gear:</b> Fujifilm X-T2 with 35mm F/2 and 16-50mm F/3.5-5.6 lenses.',
        aboutPara15: '<b>BEST Skopje:</b> PR&SM Responsible and head of Promotional Material/Ad Campaign for <a href="https://vjobfair.org.mk/"><b>Job Fair</b></a>, hosted by the non-profit and non-political international Student Organisation BEST.',
        GVInfo: 'Shot on cassette tape with old Sony Camcorder in Prilep, North Macedonia.',

        // Video Page Translations
        VideosTitle: 'Videos',
        Detektiv: 'Detective Vaso',
        DetektivInfo: 'Short Movie-Inspired Ad (Job Fair 2026)',
        Expectations: 'Expectation vs Reality',
        ExpectationsInfo: 'Short Sitcom-Inspired Ad (Job Fair 2026)',
        Apliciraj: 'Apply without stress',
        AplicirajInfo: 'Short Cinematic Ad (Job Fair 2026)',

        emailPlaceholder: 'Email',
        datePlaceholder: 'Date',
        messagePlaceholder: 'Message',
        sendMessage: 'Send Message',
        portraits: 'Portraits',
        concerts: 'Concerts',
        landscapes: 'Landscapes',
        GalleryPortraits: 'Portraits',
        GalleryConcerts: 'Concerts',
        GalleryLandscapes: 'Landscapes',
        PortraitsTitle: 'Portraits',
        ConcertsTitle: 'Concerts',
        LandscapesTitle: 'Landscapes',
        myAvailability: 'My Availability',
        contactMe: 'Contact Me',
        bookedDay: '<span class="booked-legend-dot"></span> = Booked Day',
        flagImg: 'misc/uk-flag.png',

        // Validation Messages
        fillReq: 'Please fill out this field.',
        emailReq: 'Please enter a valid email address.'
    },
    mk: {
        // ... (Existing)
        aboutMe: 'За Мене',
        gallery: 'Галерија',
        videos: 'Видеа',
        contact: 'Контакт',
        NoEvents: 'Нема резервирани денови за овој месец',
        photographyBy: 'Фотографии од',
        getInTouch: 'Контактирај Ме',
        aboutTitle: 'За Мене',
        whoAmI: 'Кој сум јас',
        collaborationsGear: 'Соработки и Опрема',
        aboutPara1: 'Јас сум Матеја Васојевиќ, познат како <b>vasosofuji</b>, 19 годишен студент по Сајбер Безбедност на Факултет за информатички науки и компјутерско инженерство на Универзитетот "Св. Кирил и Методиј".',
        aboutPara2: 'Покрај тоа што сум студент, јас сум и freelance фотограф и кинематограф базиран во <b>Скопје, Македонија</b>.',
        aboutPara3: 'Сликам Портрети и Пејзажи, но мојот главен фокус се Настани и Концерти.',
        aboutPara4: 'Доколку ви се допаѓа мојата работа, слободно <a href="#contact"><b>контактирајте ме</b></a> или испратете ми порака на <a href="https://instagram.com/vasosofuji"><b>instagram!</b></a>',
        aboutPara12: '<b>Соработки со Артисти:</b> Владимир Четкар, Новиот Почеток, Marigold Box (Италија), Епидемик (Србија), Ана и Стефан Петановски, Големата Вода, Fiction, Корка и многу други.',
        aboutPara13: '<b>Соработки со Фестивали/Настани:</b> Здраво Млади, Земјотрес, Underfest, Tributefest, Сепак се Врти, Станица26, Маракана, Laboratorium, Enterprise Музичко Школо, Котур, МКЦ и повеќе.',
        aboutPara14: '<b>Опрема:</b> Fujifilm X-T2 со 35mm F/2 и 16-50mm F/3.5-5.6 објективи.',
        aboutPara15: '<b>БЕСТ Скопје:</b> PR&SM Одговорен и главен за Промотивната Кампања за <a href="https://vjobfair.org.mk/"><b>Job Fair</b></a>, организирано од не-профитната и не-политички врзаната Интернационална Студентска Организација БЕСТ.',
        GVInfo: 'Снимено на касета со стар Sony Camcorder во Прилеп, Македонија,',

        // Video Page Translations
        VideosTitle: 'Видеа',
        Detektiv: 'Детектив Васо',
        DetektivInfo: 'Кратка Филмска Реклама (Job Fair 2026)',
        Expectations: 'Очекувања vs Реалност',
        ExpectationsInfo: 'Кратка Комична Реклама (Job Fair 2026)',
        Apliciraj: 'Аплицирај Без Стрес',
        AplicirajInfo: 'Кратка Кинематична Реклама (Job Fair 2026)',

        emailPlaceholder: 'Е-мејл',
        datePlaceholder: 'Дата',
        messagePlaceholder: 'Порака',
        sendMessage: 'Испрати Порака',
        portraits: 'Портрети',
        concerts: 'Концерти',
        landscapes: 'Пејсажи',
        GalleryPortraits: 'Портрети',
        GalleryConcerts: 'Концерти',
        GalleryLandscapes: 'Пејсажи',
        PortraitsTitle: 'Портрети',
        ConcertsTitle: 'Концерти',
        LandscapesTitle: 'Пејсажи',
        myAvailability: 'Достапност',
        contactMe: 'Контактирај Ме',
        bookedDay: '<span class="booked-legend-dot"></span> = Зафатен Ден',
        flagImg: 'misc/mk-flag.png',

        // Validation Messages
        fillReq: 'Ве молиме пополнете го ова поле.',
        emailReq: 'Ве молиме внесете валидна е-мејл адреса.'
    }
};

// Function to handle browser validation messages
function updateFormValidationMessages(lang) {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        // Reset custom validity on input to clear old messages
        input.oninput = function(e) {
            e.target.setCustomValidity("");
        };

        // Set new message on invalid event
        input.oninvalid = function(e) {
            e.target.setCustomValidity(""); // Clear first
            if (!e.target.validity.valid) {
                if(e.target.validity.valueMissing) {
                    e.target.setCustomValidity(translations[lang].fillReq);
                } else if (e.target.validity.typeMismatch && e.target.type === 'email') {
                    e.target.setCustomValidity(translations[lang].emailReq);
                }
                // Add more conditions if you have other types of validation
            }
        };
    });
}

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLanguage', lang);

    if (langFlag) {
        langFlag.src = translations[lang].flagImg;
    }

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            if (element.hasAttribute('data-html')) {
                element.innerHTML = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    const emailInput = document.querySelector('input[name="email"]');
    const dateInput = document.querySelector('input[name="date-available"]');
    const messageTextarea = document.querySelector('textarea[name="message"]');
    const submitButton = document.querySelector('#contact-form button[type="submit"]');

    if (emailInput) emailInput.placeholder = translations[lang].emailPlaceholder;
    if (dateInput) dateInput.placeholder = translations[lang].datePlaceholder;
    if (messageTextarea) messageTextarea.placeholder = translations[lang].messagePlaceholder;
    if (submitButton) submitButton.textContent = translations[lang].sendMessage;

    // Update validation messages immediately
    updateFormValidationMessages(lang);
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'mk' : 'en';
        updateLanguage(newLang);
    });
}

updateLanguage(currentLang);
