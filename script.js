// --- GLOBAL LANGUAGE (must be at the very top so all code can reference it) ---
let currentLang = localStorage.getItem('siteLanguage');
if (currentLang !== 'en' && currentLang !== 'mk') {
    currentLang = 'en'; // Forces English if memory is corrupted or empty
}

var translations = {
    en: {
        aboutMe: 'About Me',
        gallery: 'Gallery',
        videos: 'Videos',
        contact: 'Contact',
        NoEvents: 'No specific event details recorded for this month.',
        photographyBy: 'Photography by',
        getInTouch: 'Get in Touch',
        aboutTitle: 'About Me',
        whoAmI: 'Who am I',
        collaborationsGear: 'Collaborations & Experience',
        aboutPara1: 'I\'m Mateja Vasojevikj, also known as <b>vasosofuji</b>, a 20 year old Cybersecurity Student at Faculty of Computer Science and Engineering at "St. Cyril and Methodius" University.',
        aboutPara2: 'On top of being a student, I\'m also a freelance photographer and cinematographer based in <b>Skopje, North Macedonia.</b>',
        aboutPara4: 'If you like any of my work, feel free to <a href="#contact"><b>contact me</b></a> or message me on <a href="https://instagram.com/vasosofuji" target="_blank"><b>instagram!</b></a>',
        aboutPara12: '<b>Artist Collaborations:</b>  I\'ve collaborated with many famous artists such as Vladimir Chetkar, Fiction, Marigold Box (Italy), Korka and <a href="collaborations.html"><b style="color: #a4fcdd">many more!</b></a>',
        aboutPara13: '<b>Festival/Event Collaborations:</b> On top of collaborating with artists, I\'ve worked with a large amount of <a href="collaborations.html"><b style="color: #a4fcdd">venues and organisations.</b></a>',
        aboutPara15: '<b>BEST Skopje:</b> Public Relations and Social Media Responsible and Head of Promotional Material/Ad Campaign for <a href="https://vjobfair.org.mk/" target="_blank"><b style="color: #a4fcdd">Job Fair.</b></a>',
        ReadMore: '<a href="about.html"><b style="color: #a4fcdd">Read More...</b></a>',
        GVInfo: 'Shot on cassette tape with old Sony Camcorder in Prilep, North Macedonia.',

        // Video Page Translations
        VideosTitle: 'Videos',
        Detektiv: 'Detective Vaso',
        DetektivInfo: 'Short Movie-Inspired Ad (Job Fair 2026)',
        Expectations: 'Expectation vs Reality',
        ExpectationsInfo: 'Short Sitcom-Inspired Ad (Job Fair 2026)',
        Apliciraj: 'Apply without stress',
        AplicirajInfo: 'Short Cinematic Ad (Job Fair 2026)',
        GolemotoPromoTitle: 'Teaser Promotion',
        GolemotoPromoDisc: 'Short Promo for Upcoming Concert by Golemata Voda',
        QRCodeTitle: 'QR Code Teaser',
        QRCodeDisc: 'Short Reel Teasing Job Fair',
        OOTitle: 'Official Opening',
        OODisc: 'Video of the Official Opening for Job Fair',
        RedbullTitle: 'RedBull 3x3 Dunk Halftime',
        RedbullDisc: 'The Halftime Show by Dunking Devils',
        MarigoldTitle: 'Marigold Concert Promotion',
        MarigoldDisc: 'Italian Band Promotion',
        videoDescPerseida: 'A film-like music video shot for the band Perseida',
        watchFullVideo: 'Watch Full Video',

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
        bookedDay: '<img src="misc/loading/Sequence%200150.gif" alt="Booked" style="width: 24px; height: auto; filter: drop-shadow(0 0 2px rgba(255, 133, 51, 0.6));"> = Booked Day',
        // About page new sections
        AboutTitle: 'Behind the Lens',
        AboutBio: "I'm a college student balancing my academic career with my love for creativity.<br>My creative expression is done through my assortment of hobbies, which include music, photography, cinematography, programming and more. <br><br> - Photography: I've been a photographer for 2 years now and have made some incredible memories doing it. I've travelled to different cities, I've met the kindest people and I've had the best beer talks. Photography has given me the ability to express my style and viewpoint of the world, as well as make small moments last forever. <br><br> - Cinematography: As any other person with a camera, I also love recording videos, whether it's short-form advertisements or long-form interviews. I aspire to record a short movie when I have more free time in the future.<br><br> - Programming: At the end of the day I am still a student trying to study and get into the field of cybersecurity. This site is a great example of my IT side, as I've spent I don't even know how many hours and days into it.",
        MyGear: 'My Gear',
        CurrentProjects: 'Latest shoot: LoveRave Festival',
        bookingTitle: 'Booking',
        ProjectDesc: "Festival where I got invited to photograph a bunch of the local bands I love.<br>Great energy, great atmosphere and amazing performances!<br>There were also countless DJ's were doing their thing on another stage absolutely killing it.",
        JobFairTitle: 'Job Fair 2026 — BEST Skopje',
        JobFairDesc: "As PR&amp;SM Responsible for Job Fair 2026, I led the full promotional campaign for the event: Video advertisements, LinkedIn Posts, Instagram Posts and I was even on TV! (3 Times)<br><br>The event itself is hosted by BEST Skopje, but the Job Fair Team are the ones that make it their own event. It was a great experience working with my team, as well as a great learning experience in terms of writing scripts, scenes, shooting and putting it all together.<br><br>Best part were the videos promoting the event as well as the advertisements I made for the sponsors who helped fund the whole project.",
        CollabsCTATitle: '<b>All Collaborations</b>',
        CollabsCTADesc: "Artists, venues, festivals & organisations I've worked with",
        ShoutoutLabel: 'Listen to this Band',
        ShoutoutBand: 'Golemata Voda',
        ShoutoutText: "A band which has been with me from the very start. Not only are they an incredible band and musicians, but they're also amazing friends. If you don't know them yet, click the album cover →",

        flagImg: 'misc/uk-flag.png',

        // Validation Messages
        fillReq: 'Please fill out this field.',
        emailReq: 'Please enter a valid email address.',
        CollabArtist: 'Artist Collaborations',
        CollabVenues: 'Venues',
        CollabFestivals: 'Festivals & Events',

        // New translations
        heroDesc: 'Mateja Vasojevikj',
        weekdaySun: 'Sun',
        weekdayMon: 'Mon',
        weekdayTue: 'Tue',
        weekdayWed: 'Wed',
        weekdayThu: 'Thu',
        weekdayFri: 'Fri',
        weekdaySat: 'Sat',
        selectEventType: 'Select Event Type',
        optionConcert: 'Concert',
        optionWedding: 'Wedding',
        optionBirthday: 'Birthday',
        optionPortrait: 'Portrait Shoot',
        optionCommercial: 'Commercial / Brand',
        optionOther: 'Other',
        otherEventPlaceholder: 'Please specify the event',
        scheduledEvents: 'Scheduled Events:',
        alreadyBooked: 'Date is already booked.',
        clickToBook: 'Click to book',
        bookSession: 'Book a Session',
        selectedDate: 'Selected Date',
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
        footerText: '&copy; 2026 Mateja Vasojevikj (vasosofuji). All rights reserved.'
    },
    mk: {
        aboutMe: 'За Мене',
        gallery: 'Галерија',
        videos: 'Видеа',
        contact: 'Контакт',
        NoEvents: 'Нема резервирани денови за овој месец',
        photographyBy: 'Фотографии од',
        getInTouch: 'Контактирај Ме',
        aboutTitle: 'За Мене',
        whoAmI: 'Кој сум јас',
        collaborationsGear: 'Соработки и Искуство',
        aboutPara1: 'Јас сум Матеја Васојевиќ, познат како <b>vasosofuji</b>, 20 годишен студент по Сајбер Безбедност на Факултетот за информатички науки и компјутерско инженерство - Универзитет "Св. Кирил и Методиј".',
        aboutPara2: 'Покрај тоа што сум студент, јас сум и freelance фотограф и кинематограф од <b>Скопје, Македонија.</b>',
        aboutPara4: 'Доколку ви се допаѓа мојата работа, слободно <a href="#contact"><b>контактирајте ме</b></a> или испратете ми порака на <a href="https://instagram.com/vasosofuji" target="_blank"><b>instagram!</b></a>',
        aboutPara12: '<b>Соработки со Артисти:</b> Имам соработувано со голем број познати артисти како Владимир Четкар, Fiction, Marigold Box (Italy), Корка и <a href="collaborations.html"><b style="color: #a4fcdd">многу други!</b></a>',
        aboutPara13: '<b>Соработки со Фестивали/Настани:</b> Освен моите соработки со индивидуални артисти, имам соработувано и со голем број <a href="collaborations.html"><b style="color: #a4fcdd">организации.</b></a>',
        aboutPara15: '<b>БЕСТ Скопје:</b> Одговорен за Односи со Јавноста и Социјални Медиуми како и главен за Промотивната Кампања за <a href="https://vjobfair.org.mk/" target="_blank"><b style="color: #a4fcdd">Job Fair.</b></a>',
        ReadMore: '<a href="about.html"><b style="color: #a4fcdd">Прочитај Повеќе...</b></a>',
        GVInfo: 'Снимено на касета со стар Sony Camcorder во Прилеп, Македонија,',

        // Video Page Translations
        VideosTitle: 'Видеа',
        Detektiv: 'Детектив Васо',
        DetektivInfo: 'Кратка Филмска Реклама (Job Fair 2026)',
        Expectations: 'Очекувања vs Реалност',
        ExpectationsInfo: 'Кратка Комична Реклама (Job Fair 2026)',
        Apliciraj: 'Аплицирај Без Стрес',
        AplicirajInfo: 'Кратка Кинематична Реклама (Job Fair 2026)',
        GolemotoPromoTitle: 'Тизер Промоција',
        GolemotoPromoDisc: 'Кратка видео промоција за Концерт на Големата Вода',
        QRCodeTitle: 'QR Код Тизер',
        QRCodeDisc: 'Краток тизер Reel за Job Fair',
        OOTitle: 'Официјално Отварање',
        OODisc: 'Видео од Официјалното Отварање на Job Fair',
        RedbullTitle: 'Редбул 3x3 Dunk Полувреме',
        RedbullDisc: 'Полувременското шоу на Dunking Devils',
        MarigoldTitle: 'Marigold Концертна Промоција',
        MarigoldDisc: 'Промоција на Италијанскиот бенд',
        videoDescPerseida: 'Филмско музичко видео снимено за бендот Персеида',
        watchFullVideo: 'Гледај го целото видео',

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
        bookedDay: '<img src="misc/loading/Sequence%200150.gif" alt="Booked" style="width: 24px; height: auto; filter: drop-shadow(0 0 2px rgba(255, 133, 51, 0.6));"> = Зафатен Ден',
        // About page new sections
        AboutTitle: 'Зад Објективот',
        AboutBio: "Јас сум студент кој наоѓа баланс помеѓу мојата академска кариера и љубовта кон креативноста.<br>Мојот креативен израз доаѓа преку избор на различни хобија, кои вклучуваат музика, фотографија, кинематографија, програмирање и многу повеќе.<br><br> - Фотографија: Фотографирам веќе две години и преку неа создадов неверојатни спомени. Патував во различни градови, запознав прекрасни луѓе и имав најинтересни муабети. Фотографијата ми ја даде способноста да го изразам мојот стил и поглед кон светот и да направам малите моменти да траат вечно.<br><br> - Кинематографија: Како и секој друг што поседува камера, обожавам да снимам видеа - без разлика дали тоа се кратки реклами или долги интервјуа. Моја желба е да снимам краток филм во иднина.<br><br> - Програмирање: На крајот на денот, јас сум сепак студент кој се труди да ги совлада студиите. Оваа веб-страница е пример за мојата ИТ страна, бидејќи во неа вложив безброј часови и денови.",
        MyGear: 'Моја Опрема',
        CurrentProjects: 'Последно сликање: LoveRave Фестивал',
        bookingTitle: 'Резервација',
        ProjectDesc: "Фестивал каде бев поканет да фотографирам голем број локални бендови.<br>Предобра енергија, уште подобра атмосфера и неверојатни настапи!<br>Исто така имаше и голем репертоар на DJ-ови коишто беа предобри.",
        JobFairTitle: 'Job Fair 2026 — BEST Скопје',
        JobFairDesc: "Како PR&SM Одговорен за Job Fair 2026, ја водев целата промотивна кампања: Видео реклами, LinkedIn постови, Инстаграм постови и бев на телевизија! (3 пати)<br><br>Самиот настан е организиран од БЕСТ Скопје, но тимот за Џоб Фер се тие што го прават настанот да е нивен. Искуството беше многу забавно, но исто така ме научи доста работи во однос на пишување скрипти, сцени, снимање и монтирање на сето тоа.<br><br>Најинтересни беа видеата што ги направивме за рекламирање на настанот како и видеата за спонзорите што помогнаа да се реализира сето ова.",
        CollabsCTATitle: '<b>Сите Соработки</b>',
        CollabsCTADesc: "Артисти, места, фестивали и организации со кои сум работел",
        ShoutoutLabel: 'Слушни го Бендов',
        ShoutoutBand: 'Големата Вода',
        ShoutoutText: "Бенд кој е со мене од самиот почеток. Не само што се предобар бенд и музичари, туку исто така се предобри пријатели. Ако сеуште не ги знаеш, кликни на албумот →",

        flagImg: 'misc/mk-flag.png',

        // Validation Messages
        fillReq: 'Ве молиме пополнете го ова поле.',
        emailReq: 'Ве молиме внесете валидна е-мејл адреса.',
        CollabArtist: 'Соработки со Артисти',
        CollabVenues: 'Места/Локации',
        CollabFestivals: 'Фестивали и Настани',

        // New translations
        heroDesc: 'Матеја Васојевиќ',
        weekdaySun: 'Нед',
        weekdayMon: 'Пон',
        weekdayTue: 'Вто',
        weekdayWed: 'Сре',
        weekdayThu: 'Чет',
        weekdayFri: 'Пет',
        weekdaySat: 'Саб',
        selectEventType: 'Изберете тип на настан',
        optionConcert: 'Концерт',
        optionWedding: 'Свадба',
        optionBirthday: 'Роденден',
        optionPortrait: 'Портретно сликање',
        optionCommercial: 'Комерцијално / Бренд',
        optionOther: 'Друго',
        otherEventPlaceholder: 'Ве молиме наведете го настанот',
        scheduledEvents: 'Резервирани настани:',
        alreadyBooked: 'Датумот е веќе резервиран.',
        clickToBook: 'Кликни за резервација',
        bookSession: 'Резервирај Термин',
        selectedDate: 'Избран датум',
        january: 'Јануари',
        february: 'Февруари',
        march: 'Март',
        april: 'Април',
        may: 'Мај',
        june: 'Јуни',
        july: 'Јули',
        august: 'Август',
        september: 'Септември',
        october: 'Октомври',
        november: 'Ноември',
        december: 'Декември',
        footerText: '&copy; 2026 Матеја Васојевиќ (vasosofuji). Сите права се задржани.'
    }
};

window.translations = translations;


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
            // Trigger Transitions.dev staggered texts reveal
            if (entry.target.classList.contains('t-stagger')) {
                entry.target.classList.remove("is-hiding");
                entry.target.classList.add("is-shown");
            } else if (entry.target.classList.contains('cinematic-bg-video')) {
                entry.target.classList.add('is-revealed');
            } else {
                // For standard cards and headings
                entry.target.style.cssText += "opacity: 1; transform: translateY(0);";
            }
        }
    });
}, observerOptions);

// Observer is started AFTER the preloader hides so that cards which are
// already in the viewport still get their slide-up animation (gallery page).
function startScrollReveal() {
    document.querySelectorAll('.photo-card, .section-title, .t-stagger, .cinematic-bg-video').forEach(el => {
        observer.observe(el);
    });
}

// --- DEFERRED BACKGROUND VIDEO ---
// Background videos carry a `data-src` instead of a `src` so nothing is
// fetched up front. The file is attached once the section is one viewport
// away, and playback is suspended again whenever it scrolls out of sight.
function startDeferredVideos() {
    const videos = document.querySelectorAll('video[data-src]');
    if (!videos.length) return;

    const attach = (video) => {
        if (video.dataset.loaded === 'true') return;
        video.dataset.loaded = 'true';

        const source = document.createElement('source');
        source.src = video.dataset.src;
        if (video.dataset.type) source.type = video.dataset.type;
        video.appendChild(source);
        video.load();
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                attach(video);
                // Autoplay is muted-only, so a rejected promise just means the
                // browser declined — nothing to recover from.
                const played = video.play();
                if (played && typeof played.catch === 'function') played.catch(() => {});
            } else if (video.dataset.loaded === 'true') {
                video.pause();
            }
        });
    }, { rootMargin: '100% 0px', threshold: 0 });

    videos.forEach(video => videoObserver.observe(video));
}

// --- LOADER SEQUENCE LOGIC ---
const TOTAL_FRAMES = 96;
const preloaderFrames = [];
let framesPreloaded = false;

// Start fresh on every page load
let currentSequenceFrame = 0;
let sequenceAnimationFrameId = null;

function preloadSequenceFrames() {
    if (framesPreloaded) return;
    framesPreloaded = true;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const num = String(100 + i).padStart(4, '0');
        // Preload frames from misc/loading folder
        img.src = `misc/loading/Sequence ${num}.gif`;
        preloaderFrames.push(img);
    }
}
// Start preloading immediately so frames are ready
preloadSequenceFrames();

function startLoaderSequence(canvas) {
    if (canvas.dataset.animating === 'true') return;
    canvas.dataset.animating = 'true';
    
    const ctx = canvas.getContext('2d');
    // Set internal resolution high enough for crisp rendering
    canvas.width = 400; 
    canvas.height = 400;
    
    let lastFrameTime = performance.now();
    const fpsInterval = 1000 / 30; // 30 FPS for smooth animation
    
    function animate(currentTime) {
        if (!canvas.isConnected) return; // Stop if canvas is removed from DOM
        sequenceAnimationFrameId = requestAnimationFrame(animate);
        
        const elapsed = currentTime - lastFrameTime;
        
        if (elapsed > fpsInterval) {
            lastFrameTime = currentTime - (elapsed % fpsInterval);
            
            const img = preloaderFrames[currentSequenceFrame];
            if (img && img.complete && img.naturalWidth !== 0) {
                // Sync internal resolution to the actual image to prevent squashing/stretching
                if (canvas.width !== img.naturalWidth) {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
            
            currentSequenceFrame = (currentSequenceFrame + 1) % TOTAL_FRAMES;
        }
    }
    requestAnimationFrame((time) => {
        lastFrameTime = time;
        animate(time);
    });
}

// --- GLOBAL PRELOADER & HERO ANIMATION FIX ---
const preloader = document.getElementById('global-preloader');
const heroHeader = document.getElementById('parallax-header') || document.querySelector('header');

if (!preloader) {
    document.body.classList.add('loaded');
    // No curtain to wait on, so wire the deferred work up straight away.
    startScrollReveal();
    startDeferredVideos();
}

// IMMEDIATELY start the sequence if the canvas exists so it doesn't freeze on page load!
if (preloader) {
    const curtain = preloader.querySelector('.preloader-curtain');
    if (curtain) {
        let canvas = curtain.querySelector('.loader-sequence');
        if (canvas) {
            startLoaderSequence(canvas);
        }
    }
}

const isFirstVisit = !sessionStorage.getItem('hasVisited');
const preloaderDuration = isFirstVisit ? 2500 : 1500;

if (isFirstVisit) {
    sessionStorage.setItem('hasVisited', 'true');
}

setTimeout(() => {
    if (preloader) {
        const curtain = preloader.querySelector('.preloader-curtain');
        if (curtain) {
            // Dynamically inject the Canvas loading sequence if it's somehow missing
            let canvas = curtain.querySelector('.loader-sequence');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.className = 'loader-sequence';
                curtain.appendChild(canvas);
            }
            
            // Dynamically inject the Text Logo if it's missing
            let textLogo = curtain.querySelector('.loader-text-logo');
            if (!textLogo) {
                textLogo = document.createElement('div');
                textLogo.className = 'loader-text-logo';
                textLogo.textContent = 'vasosofuji';
                curtain.appendChild(textLogo);
            }
            startLoaderSequence(canvas);

            // Execute the diagonal reveal animation with an artificial delay
            setTimeout(() => {
                curtain.classList.add('wiping-up'); // Triggers camera fade-out
                
                curtain.style.transition = 'none';
                curtain.style.animation = 'none';
                void curtain.offsetWidth;
                curtain.style.animation = 'wipeReveal 1.0s cubic-bezier(0.7, 0, 0.3, 1) forwards';
                document.body.classList.add('loaded');
                
                // After the curtain finishes sliding out, remove the preloader from the DOM
                setTimeout(() => {
                    preloader.classList.add('done');
                    if (heroHeader) {
                        heroHeader.classList.add('hero-active');
                    }
                    if (sequenceAnimationFrameId) cancelAnimationFrame(sequenceAnimationFrameId);
                    
                    if (window.location.hash) {
                        const targetElement = document.querySelector(window.location.hash);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    startScrollReveal();
                    startDeferredVideos();
                }, 1000);
            }, 100); // Fast 0.1s load delay so the fade starts immediately
        }
    }
}, preloaderDuration);

// --- SMOOTH PAGE TRANSITIONS ---
// Delegated from the document rather than bound per-link at load time. The
// navigation is rendered by React after this script runs, so the menu's links
// did not exist yet and never got a listener — clicking Home/About/Gallery
// navigated bare, which is why the cover wipe only played from in-page links.
document.addEventListener('click', (e) => {
    // Let modified clicks (new tab, download, save) behave natively
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Something else already handled it (e.g. the menu's Contact link)
    if (e.defaultPrevented) return;

    const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!link) return;

    if (link.hostname === window.location.hostname && link.target !== '_blank' && !link.hasAttribute('download')) {
        {
            const isSamePage = (link.pathname === window.location.pathname && link.search === window.location.search);
            // Don't intercept anchor links on the same page
            if (isSamePage) return;

            e.preventDefault();
            const targetUrl = link.href;

            if (preloader) {
                // Show preloader again
                preloader.classList.remove('done');
                const curtain = preloader.querySelector('.preloader-curtain');
                if (curtain) {
                    // Dynamically inject the Canvas loading sequence just in case
                    let canvas = curtain.querySelector('.loader-sequence');
                    if (!canvas) {
                        canvas = document.createElement('canvas');
                        canvas.className = 'loader-sequence';
                        curtain.appendChild(canvas);
                    }
                    startLoaderSequence(canvas);

                    // Execute the diagonal cover animation
                    curtain.classList.remove('wiping-up'); // Ensure sequence can be visible
                    curtain.classList.add('do-wipe-down'); // Triggers sequence fade-in
                    curtain.style.transition = 'none';
                    curtain.style.animation = 'none';
                    void curtain.offsetWidth;
                    curtain.style.animation = 'wipeCover 1.0s cubic-bezier(0.7, 0, 0.3, 1) forwards';
                }
                // Wait for animation to finish before navigating
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1200); // 1.0s wipe + 0.2s text display buffer
            } else {
                window.location.href = targetUrl;
            }
        }
    }
});

// --- MOBILE MENU ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if(menuToggle){
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if(menuToggle) menuToggle.classList.remove('active');
        }
    });
});

// --- CALENDAR LOGIC ---
const now = new Date();
const MIN_MONTH = now.getMonth();
const MIN_YEAR = now.getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const bookedDatesSet = new Set([]);
const bookedEvents = {};

let currentMonth = MIN_MONTH;
let currentYear = MIN_YEAR;

const CALENDAR_ID = '7abe65512f610add0100bb2a437d6adc52a8178335bfa2108ecb48dd1d393a12@group.calendar.google.com';
const API_KEY = 'AIzaSyDuBqcKohcaa6msyJ69eNW3J_SwI76vtlM';

async function fetchGoogleCalendarEvents() {
    try {
        const timeMin = new Date(currentYear, currentMonth, 1).toISOString();
        // Fetch up to 1 year in advance so we don't have to fetch every time they change the month
        const timeMax = new Date(currentYear + 1, currentMonth, 1).toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            data.items.forEach(event => {
                let y, m, d;
                if (event.start.date) {
                    // All-day event: "YYYY-MM-DD"
                    const parts = event.start.date.split('-');
                    y = parseInt(parts[0], 10);
                    m = parseInt(parts[1], 10);
                    d = parseInt(parts[2], 10);
                } else if (event.start.dateTime) {
                    // Specific time event
                    const dateObj = new Date(event.start.dateTime);
                    y = dateObj.getFullYear();
                    m = dateObj.getMonth() + 1;
                    d = dateObj.getDate();
                }
                
                if (y && m && d) {
                    const dateStr = `${y}-${m}-${d}`;
                    bookedDatesSet.add(dateStr);
                    bookedEvents[dateStr] = event.summary || "Booked";
                }
            });
            renderCalendar(); // Re-render the calendar with the newly fetched data
        }
    } catch (error) {
        console.error("Failed to fetch Google Calendar events:", error);
    }
}

const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarGrid = document.getElementById('calendarGrid');
const contactMessage = document.getElementById('contactMessage');
const bookingDetailsContainer = document.getElementById('bookingDetails');

function openPopupCalendar() {
    const popupCalendarModal = document.getElementById('popupCalendarModal');
    if (popupCalendarModal) {
        renderCalendar();
        popupCalendarModal.classList.add('active');
    }
}
window.openPopupCalendar = openPopupCalendar;

function selectDate(day, month, year) {
    const formatMonth = String(month + 1).padStart(2, '0');
    const formatDay = String(day).padStart(2, '0');
    const fullDate = `${year}-${formatMonth}-${formatDay}`;
    
    // Set hidden date input
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.value = fullDate;
    }
    
    // Update display text in modal
    const displayElement = document.getElementById('modalDateDisplay');
    if (displayElement) {
        const monthKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const monthKey = monthKeys[month];
        const translatedMonth = (translations[currentLang] && translations[currentLang][monthKey]) || months[month];
        const selectedDatePrefix = (translations[currentLang] && translations[currentLang].selectedDate) || "Selected Date";
        displayElement.textContent = `${selectedDatePrefix}: ${day}. ${translatedMonth} ${year}`;
    }
    
    // Also trigger the event type change to update the formspree subject
    const eventTypeSelect = document.getElementById('eventTypeSelect');
    if (eventTypeSelect) {
        eventTypeSelect.dispatchEvent(new Event('change'));
    }

    // Close popup calendar modal if open
    const popupCalendarModal = document.getElementById('popupCalendarModal');
    if (popupCalendarModal) {
        popupCalendarModal.classList.remove('active');
    }
    
    // Open form modal
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('closeModal');
    const popupCalendarModal = document.getElementById('popupCalendarModal');
    const closePopupBtn = document.getElementById('closePopupCalendarModal');
    const eventTypeSelect = document.getElementById('eventTypeSelect');
    const dateInput = document.getElementById('dateInput');
    const subjectField = document.getElementById('formspreeSubject');
    const otherEventInput = document.getElementById('otherEventInput');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (closePopupBtn && popupCalendarModal) {
        closePopupBtn.addEventListener('click', () => {
            popupCalendarModal.classList.remove('active');
        });
    }
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.classList.remove('active');
        }
        if (popupCalendarModal && e.target === popupCalendarModal) {
            popupCalendarModal.classList.remove('active');
        }
    });

    // ESC key listener to close active modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal) modal.classList.remove('active');
            if (popupCalendarModal) popupCalendarModal.classList.remove('active');
        }
    });

    // Intercept contact clicks across the page
    function setupContactTriggers() {
        const selector = 'a[href="#contact"], a[href="index.html#contact"], a[href="#contact-form"], [data-translate="contact"], [data-translate="getInTouch"], [data-translate="contactMe"]';
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('click', (e) => {
                const targetModal = document.getElementById('popupCalendarModal');
                if (targetModal) {
                    e.preventDefault();
                    e.stopPropagation();
                    openPopupCalendar();

                    // Close mobile menu if active
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.getElementById('menuToggle');
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        if (menuToggle) menuToggle.classList.remove('active');
                    }
                }
            });
        });
    }
    setupContactTriggers();

    // Check if page loaded with #contact in URL hash
    if (window.location.hash === '#contact' || window.location.hash === '#contact-form') {
        openPopupCalendar();
        history.replaceState(null, null, ' ');
    }

    // Dynamically update Formspree Subject
    function updateSubject() {
        let eventType = eventTypeSelect ? (eventTypeSelect.value || "Booking Request") : "Booking Request";
        
        if (eventType === "Other") {
            if (otherEventInput) {
                otherEventInput.style.display = "block";
                otherEventInput.required = true;
                if (otherEventInput.value.trim() !== "") {
                    eventType = `Other: ${otherEventInput.value.trim()}`;
                }
            }
        } else {
            if (otherEventInput) {
                otherEventInput.style.display = "none";
                otherEventInput.required = false;
                otherEventInput.value = ""; // Clear it when hidden
            }
        }

        const dateVal = dateInput ? (dateInput.value || "Unknown Date") : "Unknown Date";
        
        if (subjectField) {
            subjectField.value = `${eventType} - ${dateVal}`;
        }
    }

    if (eventTypeSelect) eventTypeSelect.addEventListener('change', updateSubject);
    if (otherEventInput) otherEventInput.addEventListener('input', updateSubject);
    // Call once initially to set it up
    updateSubject();
});

function updateBookingDetailsForContainer(container) {
    if (!container) return;

    const currentMonthBookings = Object.keys(bookedEvents).filter(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return year === currentYear && (month - 1) === currentMonth;
    });

    if (currentMonthBookings.length === 0) {
        container.innerHTML = '';
        const p = document.createElement('p');
        p.style.color = 'var(--text-muted)';
        p.style.fontStyle = 'italic';
        p.style.marginTop = '10px';
        p.setAttribute('data-translate', 'NoEvents');
        p.textContent = 'No specific event details recorded for this month.';
        container.appendChild(p);
        
        if (typeof translations !== 'undefined' && translations[currentLang]) {
            p.textContent = translations[currentLang]['NoEvents'];
        }
        return;
    }

    const scheduledLabel = (translations[currentLang] && translations[currentLang].scheduledEvents) || 'Scheduled Events:';
    container.innerHTML = '';
    
    const h3 = document.createElement('h3');
    h3.style.color = 'var(--accent)';
    h3.style.marginTop = '20px';
    h3.style.fontSize = '1.1rem';
    h3.textContent = scheduledLabel;
    container.appendChild(h3);
    
    const ul = document.createElement('ul');
    ul.className = 'event-list';

    currentMonthBookings.sort((a, b) => {
        return Number(a.split('-')[2]) - Number(b.split('-')[2]);
    });

    currentMonthBookings.forEach(dateKey => {
        const day = dateKey.split('-')[2];
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        const monthKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const monthKey = monthKeys[currentMonth];
        const translatedMonth = (translations[currentLang] && translations[currentLang][monthKey]) || months[currentMonth];
        strong.textContent = `${day}. ${translatedMonth}: `;
        li.appendChild(strong);
        li.appendChild(document.createTextNode(bookedEvents[dateKey]));
        ul.appendChild(li);
    });
    
    container.appendChild(ul);
}

function renderSingleCalendar(gridEl, monthYearEl, prevBtnEl, nextBtnEl, detailsContainerEl) {
    if (!gridEl) return;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const monthKey = monthKeys[currentMonth];
    const translatedMonth = (translations[currentLang] && translations[currentLang][monthKey]) || months[currentMonth];
    if (monthYearEl) {
        monthYearEl.textContent = `${translatedMonth} ${currentYear}`;
    }
    
    gridEl.innerHTML = "";
    updateBookingDetailsForContainer(detailsContainerEl);

    if (prevBtnEl) {
        if (currentMonth === MIN_MONTH && currentYear === MIN_YEAR) {
            prevBtnEl.style.opacity = '0.3';
            prevBtnEl.style.pointerEvents = 'none';
        } else {
            prevBtnEl.style.opacity = '1';
            prevBtnEl.style.pointerEvents = 'auto';
        }
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
        const blankDay = document.createElement('div');
        blankDay.classList.add('day', 'blank');
        gridEl.appendChild(blankDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        const dateString = `${currentYear}-${currentMonth + 1}-${day}`;

        if (bookedDatesSet.has(dateString)) {
            dayElement.classList.add('booked');
            dayElement.removeAttribute('title');
            
            dayElement.innerHTML = `<img src="misc/loading/Sequence%200150.gif" alt="Booked" class="booked-camera-icon">`;
            
            const tooltip = document.createElement('div');
            tooltip.className = 'day-tooltip';
            const alreadyBookedText = (translations[currentLang] && translations[currentLang].alreadyBooked) || "Date is already booked.";
            tooltip.textContent = bookedEvents[dateString] || alreadyBookedText;
            dayElement.appendChild(tooltip);
        } else {
            dayElement.textContent = day;
            dayElement.classList.add('available');
            const monthKeys = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const monthKey = monthKeys[currentMonth];
            const translatedMonth = (translations[currentLang] && translations[currentLang][monthKey]) || months[currentMonth];
            const clickToBookText = (translations[currentLang] && translations[currentLang].clickToBook) || "Click to book";
            dayElement.title = `${clickToBookText} ${day}. ${translatedMonth} ${currentYear}`;
            dayElement.addEventListener('click', () => selectDate(day, currentMonth, currentYear));
        }
        gridEl.appendChild(dayElement);
    }
}

function renderCalendar() {
    renderSingleCalendar(
        document.getElementById('calendarGrid'),
        document.getElementById('monthYearDisplay'),
        document.getElementById('prevMonth'),
        document.getElementById('nextMonth'),
        document.getElementById('bookingDetails')
    );
    renderSingleCalendar(
        document.getElementById('popupCalendarGrid'),
        document.getElementById('popupMonthYearDisplay'),
        document.getElementById('popupPrevMonth'),
        document.getElementById('popupNextMonth'),
        document.getElementById('popupBookingDetails')
    );
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

const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const popupPrevMonthBtn = document.getElementById('popupPrevMonth');
const popupNextMonthBtn = document.getElementById('popupNextMonth');

if (prevMonthBtn) prevMonthBtn.addEventListener('click', () => changeMonth(-1));
if (nextMonthBtn) nextMonthBtn.addEventListener('click', () => changeMonth(1));
if (popupPrevMonthBtn) popupPrevMonthBtn.addEventListener('click', () => changeMonth(-1));
if (popupNextMonthBtn) popupNextMonthBtn.addEventListener('click', () => changeMonth(1));

renderCalendar();
fetchGoogleCalendarEvents();

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
            status.textContent = "Thanks! Your message has been sent.";
            status.style.color = "var(--accent)";
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.textContent = "Oops! There was a problem submitting your form";
                }
                status.style.color = "red";
            });
        }
    }).catch(error => {
        status.textContent = "Oops! There was a problem connecting to the server.";
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
            }
        };
    });
}

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('siteLanguage', lang);

    const activeFlag = document.querySelector('.lang-flag');
    if (activeFlag) {
        activeFlag.src = translations[lang].flagImg;
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
    const otherEventInput = document.getElementById('otherEventInput');

    if (emailInput) emailInput.placeholder = translations[lang].emailPlaceholder;
    if (dateInput) dateInput.placeholder = translations[lang].datePlaceholder;
    if (messageTextarea) messageTextarea.placeholder = translations[lang].messagePlaceholder;
    if (submitButton) submitButton.textContent = translations[lang].sendMessage;
    if (otherEventInput) otherEventInput.placeholder = translations[lang].otherEventPlaceholder;

    // Update validation messages immediately
    updateFormValidationMessages(lang);

    // Re-render calendar so month/weekdays update instantly
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    // Dispatch custom event to notify React components (like HoverHeading)
    window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
}
window.updateLanguage = updateLanguage;

// Attach event listeners and run update on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);

    const toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'mk' : 'en';
            updateLanguage(newLang);
        });
    }
});

// Sync language if page is loaded/restored from back-forward cache (bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const savedLang = localStorage.getItem('siteLanguage') || 'en';
        updateLanguage(savedLang);
    }
});

// --- HERO PARALLAX FLOATING LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const parallaxContainer = document.getElementById('parallax-container');

    if (parallaxContainer) {
        const floatingEls = parallaxContainer.querySelectorAll('.floating-el');

        let mouseX = 0;
        let mouseY = 0;
        const sensitivity = -1; // Negative for counter-movement
        const easingFactor = 0.05;

        // Create state object for each element to handle smoothing independently
        const elementsData = Array.from(floatingEls).map(el => ({
            element: el,
            depth: parseFloat(el.getAttribute('data-depth')) || 1,
            currentX: 0,
            currentY: 0
        }));

        const updateMousePosition = (clientX, clientY) => {
            const rect = parallaxContainer.getBoundingClientRect();
            // Calculate relative to the center of the viewport for balanced offset
            mouseX = clientX - (rect.left + rect.width / 2);
            mouseY = clientY - (rect.top + rect.height / 2);
        };

        // Physics render loop.
        // The loop is demand-driven: it only runs while the elements are still
        // easing toward the pointer. Once everything has settled (or the hero
        // scrolls out of view) it stops completely instead of repainting
        // sixteen elements every frame for the rest of the session.
        let isVisible = true;
        let animationFrameId = null;
        const SETTLE_EPSILON = 0.05; // px — below this the movement is invisible

        const renderParallax = () => {
            animationFrameId = null;

            if (!isVisible) return;

            let stillMoving = false;

            for (const data of elementsData) {
                const strength = (data.depth * sensitivity) / 20;

                const targetX = mouseX * strength;
                const targetY = mouseY * strength;

                // Easing (Lerp) to make it smooth
                data.currentX += (targetX - data.currentX) * easingFactor;
                data.currentY += (targetY - data.currentY) * easingFactor;

                if (
                    Math.abs(targetX - data.currentX) > SETTLE_EPSILON ||
                    Math.abs(targetY - data.currentY) > SETTLE_EPSILON
                ) {
                    stillMoving = true;
                } else {
                    // Snap so the next comparison is exact and we don't
                    // creep forever on sub-pixel deltas.
                    data.currentX = targetX;
                    data.currentY = targetY;
                }

                // Apply hardware-accelerated transforms
                data.element.style.transform = `translate3d(${data.currentX}px, ${data.currentY}px, 0)`;
            }

            if (stillMoving) requestFrame();
        };

        const requestFrame = () => {
            if (animationFrameId === null && isVisible) {
                animationFrameId = requestAnimationFrame(renderParallax);
            }
        };

        const onPointerInput = (clientX, clientY) => {
            updateMousePosition(clientX, clientY);
            requestFrame();
        };

        // Pointer parallax is a fine-pointer affordance; skip wiring it up on
        // touch-only devices and when the visitor asked for reduced motion.
        const wantsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

        if (wantsMotion) {
            if (hasFinePointer) {
                window.addEventListener(
                    'mousemove',
                    (e) => onPointerInput(e.clientX, e.clientY),
                    { passive: true }
                );
            }

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    onPointerInput(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });
        }

        // OPTIMIZATION: stop the loop outright when the hero is off-screen
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible) {
                requestFrame();
            } else if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }, { threshold: 0 });

        observer.observe(parallaxContainer);
    }
});

