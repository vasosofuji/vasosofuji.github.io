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
        shootPlaceholder: 'Tell me about it',
        notesPlaceholder: 'Additional notes',
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
        JobFairTitle: 'Job Fair 2026, BEST Skopje',
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
        galleryH1: 'Photo gallery: portraits, concerts and landscapes by vasosofuji',
        collabsH1: 'Collaborations: bands, venues and festivals photographed by Mateja Vasojevikj',
        thanksTitle: 'Request sent',
        thanksBody: 'Thank you for getting in touch. I will contact you as soon as possible.',
        thanksClose: 'Close',
        sending: 'Sending...',
        sendFailed: 'That did not send. Please try again, or email contact@vasojevich.com.',
        stepWho: 'Your name (optional)',
        stepEmail: 'Your email',
        stepPhone: 'Your number (optional)',
        stepShoot: 'What kind of shoot?',
        stepNotes: 'Anything else?',
        stepNotesHint: 'Location, timings, references, whatever helps.',
        stepNext: 'Continue',
        stepBack: 'Back',
        namePlaceholder: 'Name',
        phonePlaceholder: 'Phone number (optional)',
        consentLabel: "If I don't finish this form, you may contact me about it.",
        consentHint: 'Your email is used only to reply to this enquiry. Nothing is shared with anyone else.',
        privacyLink: 'Privacy',
        privacyTitle: 'Privacy',
        wipTitle: 'Still in the darkroom',
        wipMeta: 'Web development · coming soon',
        wipBody: 'This page is being built. In the meantime, the photography and video work is all live:',
        notFoundTitle: 'Nothing here',
        notFoundMeta: 'This frame came back blank',
        notFoundBody: 'The page you were after has moved or never existed. The work is all still here:',
        notFoundHome: 'Home',
        notFoundGallery: 'Gallery',
        photoCamera: 'Camera',
        photoLens: 'Lens',
        photoLocation: 'Location',
        sheetFrames: 'Frames',
        sheetFilms: 'Films',
        sheetShotOn: 'Shot on',
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
        footerText: '&copy; 2026 Mateja Vasojevikj (vasosofuji). All rights reserved.',

        // Web Development Page Translations (EN)
        webDev: 'Web Dev',
        webDevHeroTitle: 'Bespoke Web Development & Motion Engineering',
        webDevHeroSub: 'Cybersecurity rigor meets cinematographic aesthetics. Building lightning-fast, high-converting digital platforms with React 19, TypeScript, and 60fps GSAP motion.',
        webDevHeroBtnProjects: 'Architecture & Case Study',
        webDevHeroBtnEstimate: 'Scope & Timeline Calculator',
        webDevHeroBtnContact: 'Start a Project',
        webDevStatusAvailable: 'Available for Freelance & Contract Projects',
        webDevFeaturedTitle: 'Architectural Case Study',
        webDevFeaturedSub: 'Deep dive into the design and performance engineering of vasojevich.com',
        webDevPillarsTitle: 'Engineering Principles',
        webDevStackTitle: 'Core Technologies & Tooling',
        webDevEstimatorTitle: 'Interactive Scope & Timeline Estimator',
        webDevEstimatorSub: 'Calculate realistic production turnaround tailored to your project archetype.',
        webDevFaqTitle: 'Frequently Asked Questions',
        webDevCtaTitle: 'Let’s Build Something Unforgettable',
        webDevCtaSub: 'Whether you need a bespoke portfolio, a high-converting business site, or an interactive web application, get in touch to discuss your project.',
        webDevBackToMain: 'Back to Home'
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
        shootPlaceholder: 'Раскажете ми повеќе',
        notesPlaceholder: 'Дополнителни белешки',
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
        JobFairTitle: 'Job Fair 2026, BEST Скопје',
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
        galleryH1: 'Галерија: портрети, концерти и пејзажи од vasosofuji',
        collabsH1: 'Соработки: бендови, локали и фестивали фотографирани од Матеја Васојевиќ',
        thanksTitle: 'Барањето е испратено',
        thanksBody: 'Ви благодарам што се јавивте. Ќе ве контактирам во најкус можен рок.',
        thanksClose: 'Затвори',
        sending: 'Се испраќа...',
        sendFailed: 'Не успеа испраќањето. Обидете се повторно или пишете на contact@vasojevich.com.',
        stepWho: 'Вашето име (опционално)',
        stepEmail: 'Вашата е-пошта',
        stepPhone: 'Вашиот број (опционално)',
        stepShoot: 'Каков вид снимање?',
        stepNotes: 'Уште нешто?',
        stepNotesHint: 'Локација, термини, референци, што било што помага.',
        stepNext: 'Продолжи',
        stepBack: 'Назад',
        namePlaceholder: 'Име',
        phonePlaceholder: 'Телефонски број (опционално)',
        consentLabel: 'Ако не го довршам ова барање, смеете да ме контактирате во врска со него.',
        consentHint: 'Вашата е-пошта се користи само за одговор на ова барање. Не се споделува со никого.',
        privacyLink: 'Приватност',
        privacyTitle: 'Приватност',
        wipTitle: 'Сè уште во темната комора',
        wipMeta: 'Веб развој · наскоро',
        wipBody: 'Оваа страница е во изработка. Во меѓувреме, фотографиите и видеата се достапни:',
        notFoundTitle: 'Нема ништо тука',
        notFoundMeta: 'Оваа снимка се врати празна',
        notFoundBody: 'Страницата што ја баравте е преместена или никогаш не постоела. Сите фотографии се сè уште тука:',
        notFoundHome: 'Почетна',
        notFoundGallery: 'Галерија',
        photoCamera: 'Фотоапарат',
        photoLens: 'Објектив',
        photoLocation: 'Локација',
        sheetFrames: 'Фотографии',
        sheetFilms: 'Видеа',
        sheetShotOn: 'Снимано со',
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
        footerText: '&copy; 2026 Матеја Васојевиќ (vasosofuji). Сите права се задржани.',

        // Web Development Page Translations (MK)
        webDev: 'Веб Развој',
        webDevHeroTitle: 'Креативен Веб Развој & Модерно Инженерство',
        webDevHeroSub: 'Сајбер безбедносна прецизност споена со кинематографска естетика. Изработка на брзи веб платформи со React 19, TypeScript и 60fps GSAP анимации.',
        webDevHeroBtnProjects: 'Архитектура & Студија на Случај',
        webDevHeroBtnEstimate: 'Калкулатор за Проект',
        webDevHeroBtnContact: 'Започни Проект',
        webDevStatusAvailable: 'Достапен за Проекти & Соработка',
        webDevFeaturedTitle: 'Студија на Случај',
        webDevFeaturedSub: 'Детален преглед на архитектурата и перформансите на vasojevich.com',
        webDevPillarsTitle: 'Инженерски Принципи',
        webDevStackTitle: 'Технологии & Алатки',
        webDevEstimatorTitle: 'Интерактивен Калкулатор за Изработка',
        webDevEstimatorSub: 'Пресметајте реални рокови за изработка прилагодени на вашите потреби.',
        webDevFaqTitle: 'Често Поставувани Прашања',
        webDevCtaTitle: 'Подготвени за вашиот нов веб проект?',
        webDevCtaSub: 'Без разлика дали ви е потребно уникатно портфолио или интерактивна веб апликација, контактирајте ме за соработка.',
        webDevBackToMain: 'Назад кон Почетна'
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

// Reveal observer tracks cards, headings, and deferred sections as they enter the viewport.
// Using a WeakSet ensures startScrollReveal is idempotent when re-run after dynamic mounts.
const observedScrollRevealElements = new WeakSet();

function startScrollReveal() {
    document.querySelectorAll('.photo-card:not(.photo-card--masonry), .section-title, .t-stagger, .cinematic-bg-video').forEach(el => {
        if (!observedScrollRevealElements.has(el)) {
            observedScrollRevealElements.add(el);
            observer.observe(el);
        }
    });
}

window.startScrollReveal = startScrollReveal;

// A MutationObserver watches for content mounted asynchronously by React islands,
// ensuring late-rendered headings and gallery items are observed without relying on timers.
if (typeof MutationObserver !== 'undefined') {
    const scrollRevealMutationObserver = new MutationObserver(() => {
        startScrollReveal();
    });
    if (document.body) {
        scrollRevealMutationObserver.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body) {
                scrollRevealMutationObserver.observe(document.body, { childList: true, subtree: true });
            }
        });
    }
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
                // browser declined - nothing to recover from.
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
// The camera loader sequence is driven entirely by pure CSS keyframe animations
// stepping background-position across an 8x12 WebP sprite sheet.
// Moving frame progression off the JavaScript main thread onto the browser compositor
// guarantees that rotation never skips or stutters during heavy CPU hydration.

// --- SMOOTH PAGE TRANSITIONS & PRELOADER LOGIC ---
// Fresh arrivals bypass the curtain entirely to maximize Core Web Vitals (FCP and LCP).
// Internal page navigation uses a rapid wipe transition with the spinning camera loader.
const isInternalNav = sessionStorage.getItem('isInternalNav') === 'true';
const heroHeader = document.getElementById('parallax-header') || document.querySelector('header');

// Wipe timings tuned for fast, immediate page switching while keeping the camera rotation distinct.
// At 380ms for wipeCover and 380ms for wipeReveal, the diagonal sweep feels crisp and cinematic.
// The location change at 400ms gives the 30 FPS sprite loader 12 distinct rotation frames.
const WIPE_COVER_MS = 380;
const NAV_DELAY_MS = 400;
const WIPE_REVEAL_MS = 380;

// Hover styling on the hero text stays disabled until its entrance animation
// has finished. The hover rules drive opacity and letter-spacing, which the
// reveal keyframes also animate, so a pointer already resting over the text
// made the reveal stutter. Waits for the last reveal to end, with a timeout
// fallback for when animations never run (reduced motion, or a restored page).
function markHeroEnteredWhenSettled(heroHeader) {
    if (!heroHeader || heroHeader.classList.contains('hero-entered')) return;

    let settled = false;
    const settle = () => {
        if (settled) return;
        settled = true;
        clearTimeout(fallback);
        heroHeader.removeEventListener('animationend', onEnd);
        heroHeader.classList.add('hero-entered');
    };

    // .hero-desc starts last (0.6s delay + 1.2s duration)
    const last = heroHeader.querySelector('.hero-desc');
    const onEnd = (e) => {
        if (!last || e.target === last) settle();
    };

    heroHeader.addEventListener('animationend', onEnd);
    const fallback = setTimeout(settle, 2200);
}

if (isInternalNav) {
    // Clear flag so reloads or direct address bar entries act as fresh arrivals
    sessionStorage.removeItem('isInternalNav');

    // Create preloader DOM element for the incoming reveal animation
    let preloader = document.getElementById('global-preloader');
    if (!preloader) {
        preloader = document.createElement('div');
        preloader.id = 'global-preloader';
        preloader.innerHTML = '<div class="preloader-curtain wiping-up"><div class="loader-sequence"></div></div>';
        document.body.appendChild(preloader);
    }

    // Remove static head-script transition cover class now that animated preloader is attached
    document.documentElement.classList.remove('is-transitioning');

    const curtain = preloader.querySelector('.preloader-curtain');
    if (curtain) {
        curtain.style.transition = 'none';
        curtain.style.animation = 'none';
        void curtain.offsetWidth;
        curtain.style.animation = `wipeReveal ${WIPE_REVEAL_MS}ms cubic-bezier(0.7, 0, 0.3, 1) forwards`;
        document.body.classList.add('loaded');

        setTimeout(() => {
            preloader.classList.add('done');
            preloader.remove();

            if (heroHeader) {
                heroHeader.classList.add('hero-active');
                markHeroEnteredWhenSettled(heroHeader);
            }

            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
            startScrollReveal();
            startDeferredVideos();
        }, WIPE_REVEAL_MS);
    }
} else {
    // Fresh arrival: no curtain or preloader overhead, render real content immediately
    document.documentElement.classList.remove('is-transitioning');
    document.body.classList.add('loaded');
    if (heroHeader) {
        heroHeader.classList.add('hero-active');
        markHeroEnteredWhenSettled(heroHeader);
    }
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
    startScrollReveal();
    startDeferredVideos();
}

// --- SMOOTH PAGE TRANSITIONS ---
// Delegated from the document so both static links and React-rendered navigation trigger transitions.
document.addEventListener('click', (e) => {
    // Let modified clicks (new tab, download, save) behave natively
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Something else already handled it (e.g. the menu's Contact link)
    if (e.defaultPrevented) return;

    const link = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!link) return;

    if (link.hostname === window.location.hostname && link.target !== '_blank' && !link.hasAttribute('download')) {
        const normalize = (p) => {
            const clean = p.replace(/\/index\.html$/, '').replace(/\/$/, '');
            return clean === '' ? '/' : clean;
        };

        const isSamePage = (normalize(link.pathname) === normalize(window.location.pathname) && link.search === window.location.search);

        // Anchor links on the current page keep their default behaviour
        if (isSamePage && link.hash) return;

        // Following "Home" or clicking the logo while already home scrolls back to the top
        if (isSamePage) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        e.preventDefault();
        const targetUrl = link.href;

        // Signal to the destination page that it arrived via internal navigation
        sessionStorage.setItem('isInternalNav', 'true');

        // Dynamically create or reveal the preloader curtain on the outgoing page
        let preloader = document.getElementById('global-preloader');
        if (!preloader) {
            preloader = document.createElement('div');
            preloader.id = 'global-preloader';
            preloader.innerHTML = '<div class="preloader-curtain do-wipe-down"><div class="loader-sequence"></div></div>';
            document.body.appendChild(preloader);
        } else {
            preloader.classList.remove('done');
            const curtain = preloader.querySelector('.preloader-curtain');
            if (curtain) {
                let seq = curtain.querySelector('.loader-sequence');
                if (!seq) {
                    seq = document.createElement('div');
                    seq.className = 'loader-sequence';
                    curtain.appendChild(seq);
                }
                curtain.classList.remove('wiping-up');
                curtain.classList.add('do-wipe-down');
            }
        }

        const curtain = preloader.querySelector('.preloader-curtain');
        if (curtain) {
            curtain.style.transition = 'none';
            curtain.style.animation = 'none';
            void curtain.offsetWidth;
            curtain.style.animation = `wipeCover ${WIPE_COVER_MS}ms cubic-bezier(0.7, 0, 0.3, 1) forwards`;
        }

        // Navigate to target URL after cover wipe completes
        setTimeout(() => {
            window.location.href = targetUrl;
        }, NAV_DELAY_MS);
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

// --- BOOKING MODALS ON EVERY PAGE ---
// Only index.html carried this markup, so Contact in the menu silently did
// nothing on the gallery and video pages - openPopupCalendar() found no modal
// and returned. Injecting it here keeps one copy rather than pasting seventy
// lines into each page and letting them drift apart. This runs at module scope,
// which for a deferred module means the DOM is parsed but DOMContentLoaded has
// not fired yet, so the listener wiring further down still picks these up.
function injectBookingModals() {
    if (document.getElementById('popupCalendarModal')) return;

    const host = document.getElementById('page-wrapper') || document.body;
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        .map(d => `<div data-translate="weekday${d}">${d}</div>`)
        .join('');

    const markup = `
        <div id="popupCalendarModal" class="modal-overlay">
            <div class="modal-content calendar-modal-content">
                <span class="close-modal" id="closePopupCalendarModal">&times;</span>
                <h3 class="modal-heading" data-translate="bookSession" style="font-size: 1.3rem; margin-bottom: 0.6rem; padding-bottom: 0;">Book a Session</h3>
                <div class="calendar-container popup-calendar-container">
                    <div class="calendar-header">
                        <span class="month-year" id="popupMonthYearDisplay"></span>
                        <div class="nav-arrows">
                            <span class="arrow left" id="popupPrevMonth">&#8592;</span>
                            <span class="arrow right" id="popupNextMonth">&#8594;</span>
                        </div>
                    </div>
                    <div class="weekdays">${weekdays}</div>
                    <div class="calendar-grid" id="popupCalendarGrid"></div>
                    <p class="calendar-legend" data-translate="bookedDay" data-html
                        style="display: flex; align-items: center; justify-content: center; gap: 8px;"><img
                            src="misc/loading/Sequence%200150.gif" alt="Booked"
                            style="width: 24px; height: auto; filter: drop-shadow(0 0 2px rgba(255, 133, 51, 0.6));"> =
                        Booked Day</p>
                    <div id="popupBookingDetails" class="booking-details-container"></div>
                </div>
            </div>
        </div>

        <div id="bookingModal" class="modal-overlay">
            <div class="modal-content booking-modal-content">
                <span class="close-modal" id="closeModal">&times;</span>
                <h3 class="modal-heading" data-translate="bookingTitle">Book a Date</h3>
                <p id="modalDateDisplay" class="modal-subheading"></p>

                <ol class="booking-progress" aria-label="Booking steps">
                    <li data-step-dot="1" class="is-current"></li>
                    <li data-step-dot="2"></li>
                    <li data-step-dot="3"></li>
                    <li data-step-dot="4"></li>
                </ol>

                <form id="contact-form" action="https://formspree.io/f/mbdaobka" method="post" autocomplete="off" novalidate>
                    <input type="hidden" name="_subject" id="formspreeSubject" value="New Booking Request">
                    <input type="hidden" name="date" id="dateInput">

                    <!-- 1 · who -->
                    <fieldset class="booking-step is-active" data-step="1">
                        <legend class="booking-step-label" data-translate="stepWho">Your name (optional)</legend>
                        <input type="text" name="name" id="bookingName" autocomplete="name"
                            placeholder="Name" data-placeholder="namePlaceholder">
                    </fieldset>

                    <!-- 2 · email + phone + consent. The timer starts here. -->
                    <fieldset class="booking-step" data-step="2">
                        <legend class="booking-step-label" data-translate="stepEmail">Your email</legend>
                        <input type="email" name="email" id="bookingEmail" required autocomplete="email"
                            placeholder="Email" data-placeholder="emailPlaceholder">
                        <label for="bookingPhone" class="booking-step-label" data-translate="stepPhone">Your number (optional)</label>
                        <input type="tel" name="phone" id="bookingPhone" autocomplete="tel"
                            placeholder="Phone number (optional)" data-placeholder="phonePlaceholder">
                        <label class="booking-consent">
                            <input type="checkbox" id="bookingConsent" name="follow_up_consent" value="yes" checked>
                            <span data-translate="consentLabel">If I don't finish this form, you may contact me about it.</span>
                        </label>
                        <!-- The sentence is translated through a span of its own. With
                             data-translate on the paragraph, switching language wrote
                             textContent over the whole thing and took the privacy link
                             with it. -->
                        <p class="booking-hint">
                            <span data-translate="consentHint">Your email is used only to reply to this enquiry. Nothing is shared with anyone else.</span>
                            <a href="/privacy" target="_blank" rel="noopener" data-translate="privacyLink">Privacy</a>
                        </p>
                    </fieldset>

                    <!-- 3 · what -->
                    <fieldset class="booking-step" data-step="3">
                        <legend class="booking-step-label" data-translate="stepShoot">What kind of shoot?</legend>
                        <select name="event_type" id="eventTypeSelect" required>
                            <option value="" disabled selected data-translate="selectEventType">Select Event Type</option>
                            <option value="Concert" data-translate="optionConcert">Concert</option>
                            <option value="Wedding" data-translate="optionWedding">Wedding</option>
                            <option value="Birthday" data-translate="optionBirthday">Birthday</option>
                            <option value="Portrait Shoot" data-translate="optionPortrait">Portrait Shoot</option>
                            <option value="Commercial" data-translate="optionCommercial">Commercial / Brand</option>
                            <option value="Other" data-translate="optionOther">Other</option>
                        </select>
                        <input type="text" name="other_event_type" id="otherEventInput"
                            placeholder="Please specify the event" data-placeholder="otherEventPlaceholder" style="display: none;">
                        <textarea name="message" rows="3" id="bookingMessage"
                            placeholder="Tell me about it" data-placeholder="shootPlaceholder"></textarea>
                    </fieldset>

                    <!-- 4 · anything else -->
                    <fieldset class="booking-step" data-step="4">
                        <legend class="booking-step-label" data-translate="stepNotes">Anything else?</legend>
                        <textarea name="notes" rows="4" id="contactMessage"
                            placeholder="Additional notes" data-placeholder="notesPlaceholder"></textarea>
                        <p class="booking-hint" data-translate="stepNotesHint">Location, timings, references, whatever helps.</p>
                    </fieldset>

                    <p id="my-form-status" role="status" aria-live="polite"></p>

                    <div class="booking-nav">
                        <button type="button" class="booking-back" id="bookingBack" data-translate="stepBack">Back</button>
                        <button type="button" class="btn booking-next" id="bookingNext" data-translate="stepNext">Continue</button>
                        <button type="submit" class="btn booking-submit" id="bookingSubmit" data-translate="sendMessage">Send Message</button>
                    </div>
                </form>
            </div>
        </div>`;

    host.insertAdjacentHTML('beforeend', markup);
}
injectBookingModals();

// --- MULTI-STEP BOOKING FORM + TELEGRAM NOTIFICATIONS ---
//
// Four steps: name -> email -> shoot type -> notes. Completed bookings are
// delivered to Formspree, and also sent to Telegram as a booking notice (or as
// a resolution notice if previously reported as abandoned). Abandoned enquiries
// send an unfinished notice if consent was granted. The alert goes through
// /api/notify so the bot token stays on the server.
(function bookingFlow() {
    // Counted from the last thing the visitor did, not from the moment they
    // typed their email. A fixed countdown fires while someone is still
    // writing out their third step, which lands an "unfinished" alert
    // moments before the finished booking itself arrives.
    const ABANDON_AFTER_MS = 30 * 1000;
    const ENDPOINT = '/api/notify';

    const form = () => document.getElementById('contact-form');
    if (!form()) return;

    const steps = () => Array.from(document.querySelectorAll('.booking-step'));
    const dots = () => Array.from(document.querySelectorAll('[data-step-dot]'));
    const el = (id) => document.getElementById(id);

    let current = 1;
    let abandonTimer;
    let alreadyReported = false; // never notify twice for one enquiry
    let resolvedReported = false;
    let bookingReported = false;
    let submitted = false;

    const stepName = (n) => ({ 1: 'name', 2: 'email', 3: 'shoot type', 4: 'notes' })[n] || String(n);

    const validEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((v || '').trim());

    function snapshot() {
        const sel = el('eventTypeSelect');
        return {
            name: el('bookingName') ? el('bookingName').value : '',
            email: el('bookingEmail') ? el('bookingEmail').value : '',
            phone: el('bookingPhone') ? el('bookingPhone').value : '',
            date: el('dateInput') ? el('dateInput').value : '',
            eventType: sel && sel.value === 'Other'
                ? (el('otherEventInput') ? el('otherEventInput').value : 'Other')
                : (sel ? sel.value : ''),
            message: el('bookingMessage') ? el('bookingMessage').value : '',
            notes: el('contactMessage') ? el('contactMessage').value : '',
            consent: !!(el('bookingConsent') && el('bookingConsent').checked),
            reachedStep: stepName(current),
        };
    }

    function notify(kind, options) {
        const beacon = options && options.beacon;
        const data = snapshot();
        if (!validEmail(data.email)) return;
        if (kind === 'abandoned') {
            if (!data.consent || alreadyReported || submitted) return;
            alreadyReported = true;
        }
        if (kind === 'resolved') {
            if (!alreadyReported || resolvedReported) return;
            resolvedReported = true;
        }
        if (kind === 'booking') {
            if (alreadyReported || bookingReported) return;
            bookingReported = true;
        }

        const payload = JSON.stringify(Object.assign({ kind: kind }, data));
        // sendBeacon survives the page being closed, which is the usual way a
        // booking gets abandoned; a fetch would be cancelled mid-flight.
        if (beacon && navigator.sendBeacon) {
            navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
            return;
        }
        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
        }).catch(() => { /* Formspree remains the system of record */ });
    }

    // Restarted by every keystroke and every step change, so it only ever runs
    // out on a form nobody is touching any more.
    function startAbandonTimer() {
        clearTimeout(abandonTimer);
        if (submitted || alreadyReported) return;
        if (!(el('bookingConsent') && el('bookingConsent').checked)) return;
        if (!validEmail(el('bookingEmail') ? el('bookingEmail').value : '')) return;
        abandonTimer = setTimeout(() => notify('abandoned'), ABANDON_AFTER_MS);
    }

    function show(n) {
        const all = steps();
        current = Math.min(Math.max(n, 1), all.length);
        all.forEach((f) => f.classList.toggle('is-active', Number(f.dataset.step) === current));
        dots().forEach((d) => {
            const i = Number(d.dataset.stepDot);
            d.classList.toggle('is-current', i === current);
            d.classList.toggle('is-done', i < current);
        });
        if (el('bookingBack')) el('bookingBack').hidden = current === 1;
        if (el('bookingNext')) el('bookingNext').hidden = current === all.length;
        if (el('bookingSubmit')) el('bookingSubmit').hidden = current !== all.length;
        if (el('my-form-status')) el('my-form-status').textContent = '';
        const active = all.find((f) => f.classList.contains('is-active'));
        const first = active && active.querySelector('input, select, textarea');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    }

    function stepIsValid() {
        const status = el('my-form-status');
        const t = (typeof translations !== 'undefined' && translations[currentLang]) || {};
        if (current === 2 && !validEmail(el('bookingEmail') ? el('bookingEmail').value : '')) {
            if (status) status.textContent = t.emailReq || 'Please enter a valid email address.';
            if (el('bookingEmail')) el('bookingEmail').focus();
            return false;
        }
        if (current === 3 && !(el('eventTypeSelect') && el('eventTypeSelect').value)) {
            if (status) status.textContent = t.selectEventType || 'Select Event Type';
            if (el('eventTypeSelect')) el('eventTypeSelect').focus();
            return false;
        }
        return true;
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('#bookingNext')) {
            if (!stepIsValid()) return;
            show(current + 1);
            startAbandonTimer();
        } else if (e.target.closest('#bookingBack')) {
            show(current - 1);
            startAbandonTimer();
        }
    });

    // Enter advances instead of submitting early, except on the last step.
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const f = form();
        if (!f || !f.contains(e.target) || e.target.tagName === 'TEXTAREA') return;
        if (current < steps().length) {
            e.preventDefault();
            if (el('bookingNext')) el('bookingNext').click();
        }
    });

    // Any activity inside the form pushes the countdown back out to a full
    // thirty seconds. `input` covers typing, `change` covers the select and
    // the consent tick.
    const bumpTimer = (e) => {
        const f = form();
        if (f && f.contains(e.target)) startAbandonTimer();
    };
    document.addEventListener('input', bumpTimer);
    document.addEventListener('change', bumpTimer);

    // Leaving with the form unfinished is itself the signal - report then,
    // rather than waiting out a timer that will never fire.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && current >= 2 && !submitted) {
            notify('abandoned', { beacon: true });
        }
    });
    window.addEventListener('pagehide', () => {
        if (current >= 2 && !submitted) notify('abandoned', { beacon: true });
    });

    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
        new MutationObserver(() => {
            if (bookingModal.classList.contains('active')) {
                submitted = false;
                alreadyReported = false;
                resolvedReported = false;
                bookingReported = false;
                clearTimeout(abandonTimer);
                show(1);
            } else {
                clearTimeout(abandonTimer);
            }
        }).observe(bookingModal, { attributes: true, attributeFilter: ['class'] });
    }

    // --- KEYBOARD-AWARE MODAL ---
    // visualViewport reports the space left once the on-screen keyboard is up.
    // Feeding that to CSS keeps the modal inside what is actually visible, and
    // the focused field gets scrolled into that space.
    const vv = window.visualViewport;
    if (vv) {
        const syncViewport = () => {
            document.documentElement.style.setProperty('--vvh', `${vv.height}px`);
            // A meaningful shortfall against the window height means a keyboard.
            document.body.classList.toggle('keyboard-open', window.innerHeight - vv.height > 150);
        };
        vv.addEventListener('resize', syncViewport);
        vv.addEventListener('scroll', syncViewport);
        syncViewport();
    }

    document.addEventListener('focusin', (e) => {
        const field = e.target;
        if (!field.matches('.modal-content input, .modal-content select, .modal-content textarea')) return;
        // Wait for the keyboard animation before measuring, or the field is
        // scrolled to a position that no longer exists once it finishes.
        setTimeout(() => field.scrollIntoView({ block: 'center', behavior: 'smooth' }), 320);
    });

    // --- THANK YOU ---
    // Formspree is posted normally and answers with a redirect, so without this
    // the visitor is thrown onto a Formspree page. Sending it by fetch keeps
    // them here and lets the confirmation replace the form in place.
    function showThanks() {
        const content = document.querySelector('#bookingModal .modal-content');
        if (!content) return;
        const t = (typeof translations !== 'undefined' && translations[currentLang]) || {};
        const email = (el('bookingEmail') && el('bookingEmail').value) || '';
        content.innerHTML = `
            <span class="close-modal" id="closeModal">&times;</span>
            <div class="thanks-panel">
                <div class="thanks-mark" aria-hidden="true">&#10003;</div>
                <h3 class="thanks-title">${t.thanksTitle || 'Request sent'}</h3>
                <p class="thanks-body">${t.thanksBody || 'Thank you for getting in touch. I will contact you as soon as possible.'}</p>
                ${email ? '<p class="thanks-detail"></p>' : ''}
                <button type="button" class="btn" id="thanksClose">${t.thanksClose || 'Close'}</button>
            </div>`;
        // Set as text, never as markup: whatever was typed into the field is
        // echoed back here, and it has no business being parsed as HTML.
        const detail = content.querySelector('.thanks-detail');
        if (detail) detail.textContent = email;
        content.querySelector('#thanksClose').focus();
    }

    form().addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = form();
        submitted = true;
        clearTimeout(abandonTimer);

        const status = el('my-form-status');
        const t = (typeof translations !== 'undefined' && translations[currentLang]) || {};
        const submit = el('bookingSubmit');
        if (submit) submit.disabled = true;
        if (status) status.textContent = t.sending || 'Sending...';

        // Formspree is the system of record for completed bookings. When an
        // enquiry was already reported as abandoned, a single resolution follow-up
        // is sent to Telegram after Formspree accepts the submission to resolve
        // the earlier alert. If it was not reported as abandoned, a standard booking
        // alert is sent to Telegram instead.

        try {
            const res = await fetch(f.action, {
                method: 'POST',
                body: new FormData(f),
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
            if (alreadyReported) {
                notify('resolved');
            } else {
                notify('booking');
            }
            showThanks();
        } catch (err) {
            console.error('booking: could not submit the form', err);
            submitted = false;
            if (submit) submit.disabled = false;
            if (status) {
                status.textContent = t.sendFailed
                    || 'That did not send. Please try again, or email contact@vasojevich.com.';
            }
        }
    });

    show(1);
})();

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
            // The menu drawer's own Contact link is React's to handle - its
            // handler closes the drawer before opening the calendar. This
            // listener calls stopPropagation, so if it ever bound to that link
            // (a race: React mounting before DOMContentLoaded) React's handler
            // never ran, the drawer stayed open behind the calendar, and the
            // first tap outside closed the drawer instead of the calendar.
            if (element.closest('.menu-content')) return;
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

// The submit handler that used to live here was the original single-step
// version, and it was never removed when the multi-step flow above took over.
// Both were bound to the same form, so every booking was posted to Formspree
// twice and every enquiry arrived as a pair of identical emails. The flow in
// bookingFlow() is the only one now.
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

    // Every field carries the key for its own placeholder, so new ones are
    // translated by adding the attribute rather than another line here. The
    // name and phone fields were both missed while this was a hand-written
    // list of selectors.
    document.querySelectorAll('[data-placeholder]').forEach(field => {
        const key = field.getAttribute('data-placeholder');
        if (translations[lang][key]) field.placeholder = translations[lang][key];
    });

    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    if (submitButton) submitButton.textContent = translations[lang].sendMessage;

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

// --- RETURNING VIA THE BACK BUTTON ---
// Leaving a page runs the curtain closed and leaves it that way. When the
// browser restores that page from its back/forward cache it restores the DOM
// exactly as it was, curtain down, body mid-transition, so the page came
// back stuck behind a black screen with nothing left to run and clear it.
// Every restore clears the curtain immediately; there is nothing to cover
// because the content is already painted underneath.
window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;

    const curtain = document.querySelector('.preloader-curtain');
    const shell = document.getElementById('global-preloader');
    if (curtain) {
        curtain.style.animation = 'none';
        curtain.classList.remove('do-wipe-down', 'wiping-up');
    }
    if (shell) {
        shell.classList.add('done');
        shell.remove();
    }
    document.documentElement.classList.remove('is-transitioning');
    document.body.classList.add('loaded');

    const hero = document.getElementById('parallax-header') || document.querySelector('header');
    if (hero) {
        hero.classList.add('hero-active', 'hero-entered');
    }
});


// --- PHOTO CARD VALUE TRANSLATIONS ---
// The gallery markup is authored in English and is the single source of truth;
// these map those exact strings to Macedonian at render time. People's names
// and band names are proper nouns and are deliberately absent - only the
// descriptive titles appear here.
var photoLocationsMk = {
    'Ohrid, Macedonia - Beach': 'Охрид, Македонија - Плажа',
    'Ohrid, Macedonia - Lake': 'Охрид, Македонија - Езеро',
    'Ohrid, Macedonia - Old Pier': 'Охрид, Македонија - Стариот кеј',
    'Ohrid, Macedonia - Old Town': 'Охрид, Македонија - Стар град',
    'Ohrid, Macedonia - Ostrovche': 'Охрид, Македонија - Островче',
    'Ohrid, Macedonia - Pier': 'Охрид, Македонија - Кеј',
    'Skopje, Macedonia - "Old School" Bar': 'Скопје, Македонија - Бар „Old School“',
    'Skopje, Macedonia - GTC': 'Скопје, Македонија - ГТЦ',
    'Skopje, Macedonia - GTC Stairs': 'Скопје, Македонија - Скалите кај ГТЦ',
    'Skopje, Macedonia - Garage': 'Скопје, Македонија - Гаража',
    'Skopje, Macedonia - In front of MKC': 'Скопје, Македонија - Пред МКЦ',
    'Skopje, Macedonia - Kotur': 'Скопје, Македонија - Котур',
    'Skopje, Macedonia - Laboratorium': 'Скопје, Македонија - Лабораториум',
    'Skopje, Macedonia - MKC': 'Скопје, Македонија - МКЦ',
    'Skopje, Macedonia - Vodno': 'Скопје, Македонија - Водно',
    'Skopje, Macedonia - Zhelezara': 'Скопје, Македонија - Железара'
};

var photoTitlesMk = {
    'Another Flying Bird': 'Уште една птица во лет',
    'Bridge to Ostrovche': 'Мостот кон Островче',
    'Flying Bird': 'Птица во лет',
    'Old Pier': 'Стариот кеј',
    'Old Town': 'Стар град',
    'Old Town Buildings': 'Згради во стариот град',
    'Standing Bird': 'Птица во мирување',
    'Sunset': 'Зајдисонце',
    'Swan': 'Лебед',
    'Swan in Water': 'Лебед во вода',
    'Swan with Old Town': 'Лебед пред стариот град'
};

// Consumed by the masonry gallery, which re-renders the cards from the DOM.
window.photoI18n = {
    label: function (kind) {
        var t = (typeof translations !== 'undefined' && translations[currentLang]) || {};
        if (kind === 'Camera') return t.photoCamera || 'Camera';
        if (kind === 'Lens') return t.photoLens || 'Lens';
        if (kind === 'Location') return t.photoLocation || 'Location';
        return kind;
    },
    value: function (kind, value) {
        if (currentLang !== 'mk') return value;
        if (kind === 'Location') return photoLocationsMk[value] || value;
        return value;
    },
    title: function (value) {
        if (currentLang !== 'mk') return value;
        return photoTitlesMk[value] || value;
    },
    lang: function () { return currentLang; }
};

// --- SCROLLBAR ONLY WHILE SCROLLING ---
// The bar is painted transparent by CSS until <html> carries .is-scrolling.
// Width is never touched, so showing and hiding it cannot reflow the page.
(function scrollbarAutoHide() {
    const root = document.documentElement;
    let idleTimer;

    const show = () => {
        root.classList.add('is-scrolling');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => root.classList.remove('is-scrolling'), 900);
    };

    window.addEventListener('scroll', show, { passive: true });
    // Dragging the bar itself does not always emit scroll events at the ends of
    // the track, and a pointer near the edge is usually reaching for it.
    window.addEventListener('pointerdown', (e) => {
        if (e.clientX > root.clientWidth - 24) show();
    }, { passive: true });
})();

// --- CATEGORY SHEET HEADER META ---
// Fills the caption under a category title from what is actually on the page:
// how many frames it holds, and which bodies they were shot on (read off the
// "Camera:" line already printed in each photo's info panel). Re-runs on a
// language change so the labels follow.
function updateSheetMeta() {
    const target = document.querySelector('[data-sheet-meta]');
    if (!target) return;

    const t = (typeof translations !== 'undefined' && translations[currentLang]) || {};
    const photos = document.querySelectorAll('.gallery-grid .photo-card');
    const videos = document.querySelectorAll('.video-grid .video-card');

    const count = photos.length || videos.length;
    if (!count) {
        target.textContent = '';
        return;
    }

    const noun = photos.length ? (t.sheetFrames || 'Frames') : (t.sheetFilms || 'Films');
    const parts = [`<em>${count}</em> ${noun}`];

    if (photos.length) {
        const bodies = new Set();
        photos.forEach(card => {
            card.querySelectorAll('.photo-info p').forEach(p => {
                const label = p.querySelector('span');
                if (!label || !/camera/i.test(label.textContent)) return;
                const body = p.textContent.replace(label.textContent, '').trim();
                if (body) bodies.add(body);
            });
        });
        if (bodies.size) {
            parts.push(`${t.sheetShotOn || 'Shot on'} ${[...bodies].sort().join(' · ')}`);
        }
    }

    target.innerHTML = parts.join(' &nbsp;/&nbsp; ');
}

document.addEventListener('DOMContentLoaded', updateSheetMeta);
window.addEventListener('languagechange', updateSheetMeta);
// The masonry mount replaces the grid's contents, and it does so before
// DOMContentLoaded fires - so the count above would read an empty grid. It
// calls this again once React has committed.
window.updateSheetMeta = updateSheetMeta;

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
        const SETTLE_EPSILON = 0.05; // px - below this the movement is invisible

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

