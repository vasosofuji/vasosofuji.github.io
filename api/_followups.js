// The follow up sent an hour after a booking, written per kind of shoot.
//
// Kept apart from the endpoint because this is copy, not plumbing, and it is
// the part that will actually get edited. Every shoot type the booking form
// offers has an entry, in both languages, and each asks for the things that
// genuinely change how that shoot gets planned rather than asking generically
// for "more details".

const wrap = (bodyHtml) =>
  `<!doctype html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#222">${bodyHtml}<p style="color:#888;font-size:12px">vasojevich.com</p></body></html>`;

const sign = {
  en: '<p>No rush on any of it, whatever you have is useful.<br>Mateja</p>',
  mk: '<p>Нема брзање, корисно е сè што имате.<br>Матеја</p>',
};

const COPY = {
  Portrait: {
    en: {
      subject: 'A few things that help me plan your portraits',
      body: `
        <p>While your enquiry is with me, here is what makes the biggest difference
        to a portrait session if you have time to think about it.</p>
        <ul>
          <li><strong>References.</strong> A Pinterest board, a few saved posts,
          screenshots, anything at all. Five images tell me more about what you
          want than a paragraph does.</li>
          <li><strong>The mood.</strong> Warm and soft, hard and contrasty,
          washed out, deep colour. Even one word helps.</li>
          <li><strong>Clothes.</strong> What you are thinking of wearing, and
          whether you want more than one look.</li>
          <li><strong>Where.</strong> Somewhere that means something to you, or
          leave it to me and I will suggest places around Skopje that suit the
          light at your time of day.</li>
          <li><strong>Poses.</strong> If posing makes you self conscious, say so.
          Most people say so. I direct throughout and you will not be left
          standing there wondering what to do with your hands.</li>
        </ul>`,
    },
    mk: {
      subject: 'Неколку работи што помагаат за вашите портрети',
      body: `
        <p>Додека го гледам вашето барање, еве што најмногу помага кај портретна
        сесија ако имате време да размислите.</p>
        <ul>
          <li><strong>Референци.</strong> Pinterest табла, зачувани објави,
          слики од екран, било што. Пет слики ми кажуваат повеќе од цел пасус.</li>
          <li><strong>Атмосферата.</strong> Топло и меко, остро и контрастно,
          избледено, длабоки бои. И еден збор е доволен.</li>
          <li><strong>Облека.</strong> Што планирате да носите и дали сакате
          повеќе од еден изглед.</li>
          <li><strong>Каде.</strong> Место што ви значи нешто, или оставете на
          мене и ќе предложам локации во Скопје според светлината.</li>
          <li><strong>Позирање.</strong> Ако ви е непријатно да позирате, кажете.
          На повеќето луѓе им е. Ве водам низ целата сесија.</li>
        </ul>`,
    },
  },
  Concert: {
    en: {
      subject: 'A few things that help me shoot your set',
      body: `
        <p>While your enquiry is with me, here is what I would want to know before
        a show.</p>
        <ul>
          <li><strong>Who is playing.</strong> A link to the band, and anything
          you have of them live rather than posed.</li>
          <li><strong>The sound.</strong> It changes how I shoot more than
          anything else. A quiet set and a loud one are different jobs.</li>
          <li><strong>The room.</strong> Venue and stage, and whether there is a
          pit or I will be working from the floor.</li>
          <li><strong>Lighting.</strong> Whoever runs it is worth asking. Heavy
          strobe or near darkness both change what is possible.</li>
          <li><strong>What the photos are for.</strong> Press, a release,
          socials, or the band's own archive. It changes what I chase.</li>
        </ul>`,
    },
    mk: {
      subject: 'Неколку работи што помагаат за снимањето на настапот',
      body: `
        <p>Додека го гледам вашето барање, еве што би сакал да знам пред настап.</p>
        <ul>
          <li><strong>Кој свири.</strong> Линк до бендот и што било од нив во
          живо, не позирано.</li>
          <li><strong>Звукот.</strong> Го менува снимањето повеќе од сè друго.
          Тивок и гласен настап се две различни работи.</li>
          <li><strong>Просторот.</strong> Место и сцена, и дали има простор пред
          сцената или работам од подот.</li>
          <li><strong>Осветлувањето.</strong> Вреди да го прашате оној што го
          води. Многу строб или речиси мрак менуваат што е можно.</li>
          <li><strong>За што се сликите.</strong> Медиуми, издание, социјални
          мрежи или архива на бендот.</li>
        </ul>`,
    },
  },
  Commercial: {
    en: {
      subject: 'A few things that help me scope your shoot',
      body: `
        <p>While your enquiry is with me, here is what I need to scope commercial
        work properly.</p>
        <ul>
          <li><strong>The brand.</strong> Who it is and a link, so I can see
          where the images have to sit.</li>
          <li><strong>What we are shooting.</strong> Product, people, the space,
          or some mix.</li>
          <li><strong>Where it runs.</strong> Website, print, paid social, out of
          home. That decides format and crop before anything else.</li>
          <li><strong>Existing guidelines.</strong> If there is a brand book or
          an existing set the new work has to sit beside, send it.</li>
          <li><strong>Deliverables and dates.</strong> Roughly how many finished
          images, and when you need them.</li>
          <li><strong>Usage.</strong> How long and where you need the rights to
          run, so I can quote it properly rather than revisiting it later.</li>
        </ul>`,
    },
    mk: {
      subject: 'Неколку работи што помагаат за вашето снимање',
      body: `
        <p>Додека го гледам вашето барање, еве што ми треба за да го проценам
        комерцијалното снимање како што треба.</p>
        <ul>
          <li><strong>Брендот.</strong> Кој е и линк, за да видам каде одат
          сликите.</li>
          <li><strong>Што снимаме.</strong> Производ, луѓе, простор, или
          комбинација.</li>
          <li><strong>Каде се објавува.</strong> Веб, печат, платени реклами,
          билборди. Тоа го одредува форматот пред сè друго.</li>
          <li><strong>Постоечки упатства.</strong> Ако има brand book или
          постоечки материјали, пратете ги.</li>
          <li><strong>Испорака и рокови.</strong> Приближно колку финални слики
          и до кога.</li>
          <li><strong>Права на користење.</strong> Колку долго и каде, за да
          можам да пресметам точно уште сега.</li>
        </ul>`,
    },
  },
  Wedding: {
    en: {
      subject: 'A few things that help me plan your day',
      body: `
        <p>While your enquiry is with me, here is what helps most with a wedding.</p>
        <ul>
          <li><strong>The shape of the day.</strong> Rough timings and the
          locations, even if some of it is still moving.</li>
          <li><strong>The moments that matter.</strong> The ones you would be
          upset to not have. Tell me and I will be standing in the right place.</li>
          <li><strong>Family.</strong> Who needs to be in a formal photograph,
          and anything about who stands where that I would not guess.</li>
          <li><strong>How present you want me.</strong> Some couples want it
          documented from a distance, others want directing. Both are fine.</li>
          <li><strong>Other suppliers.</strong> Video especially, so we plan
          around each other instead of into each other.</li>
        </ul>`,
    },
    mk: {
      subject: 'Неколку работи што помагаат за вашиот ден',
      body: `
        <p>Додека го гледам вашето барање, еве што најмногу помага за свадба.</p>
        <ul>
          <li><strong>Тек на денот.</strong> Груби термини и локации, и ако
          некои работи сè уште се менуваат.</li>
          <li><strong>Моментите што ви значат.</strong> Оние што не смеат да
          останат неснимени. Кажете ми и ќе бидам на вистинското место.</li>
          <li><strong>Семејство.</strong> Кој треба да биде на официјалните
          слики и што не би претпоставил сам.</li>
          <li><strong>Колку да се чувствувам.</strong> Некои сакаат сè од
          дистанца, други сакаат водење. И двете се во ред.</li>
          <li><strong>Останати соработници.</strong> Особено видео, за да се
          испланираме еден околу друг.</li>
        </ul>`,
    },
  },
  Birthday: {
    en: {
      subject: 'A few things that help me plan the day',
      body: `
        <p>While your enquiry is with me, a few things worth knowing.</p>
        <ul>
          <li><strong>Whose day it is</strong> and roughly how many people.</li>
          <li><strong>Where and when.</strong> Indoors or out, and what time,
          which decides the light.</li>
          <li><strong>The moments.</strong> Anything planned that has to be
          photographed, a cake, a speech, a surprise.</li>
          <li><strong>The feel.</strong> Candid throughout, or proper group
          photographs of everyone as well.</li>
        </ul>`,
    },
    mk: {
      subject: 'Неколку работи што помагаат за денот',
      body: `
        <p>Додека го гледам вашето барање, неколку работи вредни да ги знам.</p>
        <ul>
          <li><strong>Чиј е денот</strong> и приближно колку луѓе.</li>
          <li><strong>Каде и кога.</strong> Внатре или надвор и во колку часот,
          што ја одредува светлината.</li>
          <li><strong>Моментите.</strong> Што е планирано и мора да се слика,
          торта, говор, изненадување.</li>
          <li><strong>Стилот.</strong> Само спонтано, или и заеднички слики со
          сите.</li>
        </ul>`,
    },
  },
  Other: {
    en: {
      subject: 'A few things that help me plan your shoot',
      body: `
        <p>While your enquiry is with me, anything you can tell me about the
        following will help.</p>
        <ul>
          <li><strong>What we are photographing</strong> and who is involved.</li>
          <li><strong>Where and when</strong>, even loosely.</li>
          <li><strong>What the images are for.</strong> It decides more than
          anything else about how I shoot them.</li>
          <li><strong>References.</strong> Anything you have seen and liked,
          mine or otherwise.</li>
        </ul>`,
    },
    mk: {
      subject: 'Неколку работи што помагаат за вашето снимање',
      body: `
        <p>Додека го гледам вашето барање, ќе помогне сè што можете да ми кажете
        за следното.</p>
        <ul>
          <li><strong>Што снимаме</strong> и кој е вклучен.</li>
          <li><strong>Каде и кога</strong>, макар и приближно.</li>
          <li><strong>За што се сликите.</strong> Тоа одредува најмногу.</li>
          <li><strong>Референци.</strong> Што било што сте виделе и ви се
          допаднало.</li>
        </ul>`,
    },
  },
};

// The form's own option values, mapped onto the entries above. Anything it does
// not recognise, including a free typed answer from the "Other" branch, lands on
// the general follow up rather than on nothing at all.
function normalise(eventType) {
  const v = String(eventType || '').toLowerCase();
  if (v.includes('portrait')) return 'Portrait';
  if (v.includes('concert')) return 'Concert';
  if (v.includes('commercial') || v.includes('brand')) return 'Commercial';
  if (v.includes('wedding')) return 'Wedding';
  if (v.includes('birthday')) return 'Birthday';
  return 'Other';
}

export function buildFollowUp(eventType, lang, firstName) {
  const kind = normalise(eventType);
  const copy = COPY[kind][lang === 'mk' ? 'mk' : 'en'];
  const greeting = firstName
    ? (lang === 'mk' ? `Здраво ${firstName},` : `Hi ${firstName},`)
    : (lang === 'mk' ? 'Здраво,' : 'Hi,');

  return {
    kind,
    subject: copy.subject,
    html: wrap(`<p>${greeting}</p>${copy.body}${sign[lang === 'mk' ? 'mk' : 'en']}`),
  };
}

export const FOLLOW_UP_KINDS = Object.keys(COPY);
