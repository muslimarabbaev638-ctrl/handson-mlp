// ─────────────────────────────────────────────────────────────────────────────
// ALL FACTS ABOUT THE SCHOOL — the single source of truth for every page.
//
// Text in three languages is written as { uz, ru, en }. In Uzbek you can type a
// plain apostrophe (o'quvchi, ta'lim); the build converts it to the correct
// oʻ / gʻ / ʼ characters.
//
// Unconfirmed information is wrapped in a marker (see src/lib/facts.js):
//   todo('what is needed')        → missing, not shown on the site
//   draft(value, 'what to check') → suggested text, shown only in draft builds
//   verify(value, 'what to check')→ from the old site, shown, but double-check it
// Run `npm run check` to list them all. To confirm a fact, replace the marker
// with the plain value, e.g.  founded: 2019,
// ─────────────────────────────────────────────────────────────────────────────
import { todo, draft, verify } from '../src/lib/facts.js';

export const site = {
  // Address of the live site. Used for canonical links, the sitemap and link
  // previews in Telegram / Facebook. Can be overridden with SITE_URL=... at build.
  url: 'https://urgutim.uz',
};

export const school = {
  name: {
    uz: 'Urgut tumani ixtisoslashtirilgan maktabi',
    ru: 'Ургутская специализированная школа',
    en: 'Urgut Specialized School',
  },
  nameNote: todo(
    'Confirm the official English name. It must match the name on transcripts and the name the counselor uses in Common App / College Board, letter for letter.',
  ),

  type: {
    uz: 'Davlat ixtisoslashtirilgan maktabi',
    ru: 'Государственная специализированная школа',
    en: 'State specialized school',
  },

  // The state system the school belongs to.
  network: {
    name: 'PIIMA',
    url: 'https://piima.uz',
    admissionsPortal: 'https://ariza.piima.uz',
  },
  networkOfficialName: todo(
    'Full official name of the agency behind the acronym PIIMA, in uz/ru/en (copy it from piima.uz). The old site used “Ixtisoslashtirilgan taʼlim muassasalari agentligi”, which does not match the acronym.',
  ),

  founded: todo('Year the school was founded (or opened in its current form).'),
  grades: '5–11',
  maxClassSize: 24,
  students: todo('Total number of students this school year (per grade if possible).'),
  teachers: todo('Number of teachers.'),
  languageOfInstruction: todo(
    'Language(s) of instruction in uz/ru/en, e.g. { uz: "oʻzbek tili", ru: "узбекский", en: "Uzbek" }.',
  ),

  location: {
    district: { uz: 'Urgut tumani', ru: 'Ургутский район', en: 'Urgut District' },
    region: { uz: 'Samarqand viloyati', ru: 'Самаркандская область', en: 'Samarkand Region' },
    country: { uz: "O'zbekiston", ru: 'Узбекистан', en: 'Uzbekistan' },
  },
  address: verify(
    {
      uz: "Navoiy ko'chasi, 186-uy, Do'stlik MFY, Urgut tumani, Samarqand viloyati, O'zbekiston",
      ru: 'ул. Навои, 186, махалля «Дустлик», Ургутский район, Самаркандская область, Узбекистан',
      en: '186 Navoiy Street, Do‘stlik mahalla, Urgut District, Samarkand Region, Uzbekistan',
    },
    'The old site showed three different versions of the address (with and without the street, with and without the mahalla). Confirm the exact official address in all three languages.',
  ),
  postalCode: todo('Postal code of the school.'),
  geo: { lat: 39.411111, lon: 67.243555 },
  maps: {
    yandex: 'https://yandex.uz/maps/org/urgut_tuman_ixtisoslashtirilgan_maktabi/155493075708/',
    yandexEmbed:
      'https://yandex.uz/map-widget/v1/?ll=67.243555%2C39.411111&mode=search&oid=155493075708&ol=biz&z=16',
    google: 'https://www.google.com/maps/search/?api=1&query=39.411111%2C67.243555',
  },

  contact: {
    email: 'info@urgutim.uz',
    phone: '+998941709077',
    phoneDisplay: '+998 94 170 90 77',
    hours: todo('Office hours in uz/ru/en, e.g. { en: "Monday–Saturday, 08:00–17:00" }.'),
  },
  emailNote: todo('Make sure info@urgutim.uz actually receives mail (send a test message from an outside address).'),

  social: [
    { id: 'telegram', label: 'Telegram', handle: '@Urgut_IM', url: 'https://t.me/Urgut_IM' },
    { id: 'instagram', label: 'Instagram', handle: '@im.urgut', url: 'https://instagram.com/im.urgut' },
    { id: 'facebook', label: 'Facebook', handle: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100084770284564' },
  ],

  // College Board school code. Universities in the USA use it to identify the school.
  ceebCode: todo(
    'College Board (CEEB) school code. If the school does not have one yet, the counselor can request it from College Board; until then leave this as todo.',
  ),

  leadership: [
    {
      id: 'director',
      role: { uz: 'Direktor', ru: 'Директор', en: 'Director (Principal)' },
      person: todo('Director: full name (Latin script), and optionally email/phone: { name: "…", email: "…", phone: "…" }.'),
    },
    {
      id: 'deputy',
      role: {
        uz: "Direktorning o'quv ishlari bo'yicha o'rinbosari",
        ru: 'Заместитель директора по учебной работе',
        en: 'Deputy Director for Academic Affairs',
      },
      person: todo('Deputy director for academic affairs: { name, email?, phone? }.'),
    },
    {
      id: 'counselor',
      role: {
        uz: "Oliy ta'limga yo'naltirish bo'yicha maslahatchi",
        ru: 'Консультант по поступлению в университеты',
        en: 'University Counselor',
      },
      person: todo(
        'University counselor: { name, email, phone }. Universities contact this person to verify transcripts and recommendations — the most important contact on the School Profile.',
      ),
    },
  ],

  overview: {
    uz: "Urgut tumani ixtisoslashtirilgan maktabi — 5–11-sinflarda iqtidorli o'quvchilar tahsil oladigan bepul davlat maktabi. Maktab PIIMA tizimiga kiradi. O'quvchilar tanlov asosidagi kirish imtihonlari orqali qabul qilinadi va 5-sinfdan boshlab matematika, fizika, kimyo va biologiya fanlarini chuqurlashtirilgan tartibda o'rganadi. Har bir sinfda 24 nafardan ko'p o'quvchi bo'lmaydi.",
    ru: 'Ургутская специализированная школа — бесплатная государственная школа для одарённых учащихся 5–11 классов, входящая в систему PIIMA. Учеников принимают по результатам конкурсных вступительных экзаменов; с 5 класса они углублённо изучают математику, физику, химию и биологию. В каждом классе — не более 24 учеников.',
    en: 'Urgut Specialized School is a tuition-free state school for academically gifted students in grades 5–11. It is part of the PIIMA system of specialized schools in Uzbekistan. Students are admitted through a competitive entrance examination and study mathematics, physics, chemistry and biology in depth from grade 5. No class has more than 24 students.',
  },

  mission: {
    uz: "Maqsadimiz — hududdagi eng iqtidorli yoshlarni saralab olish, ularga zamonaviy axborot texnologiyalari va STEAM yo'nalishlarida puxta ta'lim berish hamda kelajak muhandislari, shifokorlari va dasturchilarini tayyorlash.",
    ru: 'Наша цель — находить самых одарённых молодых людей региона, давать им сильное образование в области информационных технологий и STEAM и готовить будущих инженеров, врачей и программистов.',
    en: 'Our aim is to find the most gifted young people in the region, give them a strong education in information technology and STEAM, and prepare the engineers, doctors and programmers of the future.',
  },

  specialization: {
    subjects: [
      { id: 'math', name: { uz: 'Matematika', ru: 'Математика', en: 'Mathematics' } },
      { id: 'physics', name: { uz: 'Fizika', ru: 'Физика', en: 'Physics' } },
      { id: 'chemistry', name: { uz: 'Kimyo', ru: 'Химия', en: 'Chemistry' } },
      { id: 'biology', name: { uz: 'Biologiya', ru: 'Биология', en: 'Biology' } },
      { id: 'it', name: { uz: 'Axborot texnologiyalari', ru: 'Информационные технологии', en: 'Information technology' } },
    ],
    text: {
      uz: "Matematika, fizika, kimyo va biologiya 5-sinfdan boshlab chuqurlashtirilgan tartibda o'qitiladi. Dasturda axborot texnologiyalari va STEAM yo'nalishiga alohida e'tibor qaratiladi.",
      ru: 'Математика, физика, химия и биология изучаются углублённо начиная с 5 класса. Особое внимание в программе уделяется информационным технологиям и STEAM.',
      en: 'Mathematics, physics, chemistry and biology are taught in depth from grade 5. The program places particular emphasis on information technology and STEAM.',
    },
  },

  teachersNote: verify(
    {
      uz: "Darslarni ko'p bosqichli saralashdan o'tgan o'qituvchilar olib boradi; ularning ko'pchiligi xalqaro va milliy sertifikatlarga ega.",
      ru: 'Уроки ведут учителя, прошедшие многоэтапный отбор; многие из них имеют международные и национальные сертификаты.',
      en: 'Teachers are selected through a multi-stage testing process, and many hold international and national certifications.',
    },
    'Claim from the old site. Confirm it, and ideally add numbers (e.g. how many teachers hold IELTS/CEFR or subject certificates).',
  ),

  facilities: verify(
    [
      {
        uz: "Amaliy mashg'ulotlar uchun STEAM laboratoriyalari",
        ru: 'STEAM-лаборатории для практических занятий',
        en: 'STEAM laboratories for practical work',
      },
    ],
    'From the old site. Confirm, and add the other facilities (library, computer lab, sports hall, dormitory, canteen…).',
  ),

  academics: {
    calendar: draft(
      {
        uz: "O'quv yili sentabr oyi boshidan may oyi oxirigacha davom etadi va to'rt chorakka bo'linadi.",
        ru: 'Учебный год длится с начала сентября до конца мая и делится на четыре четверти.',
        en: 'The school year runs from early September to late May and is divided into four quarters.',
      },
      'Draft based on the usual school calendar in Uzbekistan. Confirm the term structure and when final grades are issued (universities ask when mid-year grades will be available).',
    ),

    grading: draft(
      {
        scale: [
          { mark: '5', meaning: { uz: "A'lo", ru: 'Отлично', en: 'Excellent' }, us: 'A' },
          { mark: '4', meaning: { uz: 'Yaxshi', ru: 'Хорошо', en: 'Good' }, us: 'B' },
          { mark: '3', meaning: { uz: 'Qoniqarli', ru: 'Удовлетворительно', en: 'Satisfactory' }, us: 'C' },
          { mark: '2', meaning: { uz: 'Qoniqarsiz', ru: 'Неудовлетворительно', en: 'Unsatisfactory (fail)' }, us: 'F' },
        ],
        note: {
          uz: "Baholar Oʻzbekistonda qabul qilingan 5 ballik tizimda qo'yiladi. 3 va undan yuqori baho — o'tish bahosi.",
          ru: 'Оценки выставляются по принятой в Узбекистане пятибалльной шкале. Проходная оценка — 3 и выше.',
          en: 'Grades are given on the five-point scale used in Uzbekistan. The minimum passing grade is 3.',
        },
      },
      'Draft of the national 5-point scale with an approximate US equivalent. Confirm the scale that appears on transcripts, and whether the school gives a US-style conversion at all.',
    ),

    gpaAndRank: todo(
      'How grades are reported to universities: does the school calculate a GPA, weight grades, or rank students? If it does not rank, say so (e.g. { en: "The school does not rank students." }).',
    ),

    graduation: draft(
      {
        uz: "11-sinfni tamomlab, davlat yakuniy attestatsiyasidan muvaffaqiyatli o'tgan o'quvchilarga umumiy o'rta ta'lim to'g'risidagi davlat namunasidagi attestat beriladi.",
        ru: 'Учащиеся, окончившие 11 класс и успешно прошедшие государственную итоговую аттестацию, получают государственный аттестат об общем среднем образовании.',
        en: 'Students who complete grade 11 and pass the state final examinations receive the national Certificate of General Secondary Education (attestat).',
      },
      'Draft. Confirm graduation requirements and which national final exams students take.',
    ),

    notOffered: todo(
      'Programs the school does NOT offer (e.g. AP, IB, A-Levels, honors levels) in uz/ru/en. Universities read this so students are not disadvantaged for courses that were not available to them.',
    ),

    curriculum: draft(
      {
        grades: [5, 6, 7, 8, 9, 10, 11],
        // hours: weekly hours for grades 5..11 (null = unknown, shown as "—")
        subjects: [
          { name: { uz: 'Matematika (algebra, geometriya)', ru: 'Математика (алгебра, геометрия)', en: 'Mathematics (algebra, geometry)' }, advanced: true, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Fizika', ru: 'Физика', en: 'Physics' }, advanced: true, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Kimyo', ru: 'Химия', en: 'Chemistry' }, advanced: true, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Biologiya', ru: 'Биология', en: 'Biology' }, advanced: true, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Informatika va axborot texnologiyalari', ru: 'Информатика и ИТ', en: 'Computer science and IT' }, advanced: false, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Ingliz tili', ru: 'Английский язык', en: 'English' }, advanced: false, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Ona tili va adabiyot', ru: 'Родной язык и литература', en: 'Uzbek language and literature' }, advanced: false, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Rus tili', ru: 'Русский язык', en: 'Russian' }, advanced: false, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Tarix', ru: 'История', en: 'History' }, advanced: false, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Geografiya', ru: 'География', en: 'Geography' }, advanced: false, hours: [null, null, null, null, null, null, null] },
          { name: { uz: 'Jismoniy tarbiya', ru: 'Физическая культура', en: 'Physical education' }, advanced: false, hours: [null, null, null, null, null, null, null] },
        ],
      },
      'Draft subject list. Correct the subject names, add missing subjects, and fill in the weekly hours for grades 5–11 (hours: [g5, g6, g7, g8, g9, g10, g11]).',
    ),

    internationalExams: verify(
      {
        uz: "Ko'plab o'quvchilar maktabda o'qiyotgan paytidayoq IELTS va SAT imtihonlarini topshiradi. 2026-yilda 48 nafar bitiruvchidan 32 nafari IELTS va SAT kabi xalqaro hamda milliy sertifikatlarga ega bo'ldi.",
        ru: 'Многие ученики сдают IELTS и SAT ещё во время учёбы в школе. В 2026 году 32 из 48 выпускников получили международные и национальные сертификаты, такие как IELTS и SAT.',
        en: 'Many students take IELTS and SAT while still at school. In 2026, 32 of 48 graduates held international or national certificates such as IELTS and SAT.',
      },
      'From the old site. Say whether the school runs IELTS/SAT preparation classes, and give the breakdown by exam.',
    ),

    competitions: verify(
      [
        {
          year: 2026,
          text: {
            uz: "Aniq fanlar, ayniqsa informatika bo'yicha tuman va Samarqand viloyati olimpiadalarida birinchi o'rinlar.",
            ru: 'Первые места на районных и областных (Самаркандская область) олимпиадах по точным наукам, особенно по информатике.',
            en: 'First places in district and Samarkand regional olympiads in the exact sciences, especially computer science.',
          },
        },
      ],
      'From the old site (vague). Add each award separately: subject, level (district / regional / national / international), place, year, and the student’s name if they agree.',
    ),

    activities: [
      {
        name: { uz: '«Direktor olimpiadasi»', ru: '«Олимпиада директора»', en: 'Director’s Olympiad' },
        text: {
          uz: "O'quvchilarning bilim darajasini muntazam kuzatib borish va rag'batlantirish uchun maktab miqyosida doimiy o'tkaziladigan olimpiada.",
          ru: 'Регулярная общешкольная олимпиада для отслеживания и поощрения успехов учеников.',
          en: 'A regular school-wide olympiad used to track and reward students’ progress.',
        },
      },
    ],
    moreActivities: todo(
      'Clubs, olympiad teams, sports, debate, volunteering, student government, projects — anything outside lessons. Universities look for this.',
    ),
  },

  results: {
    classes: [
      {
        year: 2026,
        graduates: verify(48, 'Number of graduates in 2026 (from the old site).'),
        certified: verify(
          32,
          'From the old site: “32 of 48 graduates obtained international and national certificates such as IELTS and SAT”. Give a breakdown if possible (how many IELTS and bands, how many SAT, how many national certificates).',
        ),
        // Scores the school published on its old site (certificate gallery).
        testHighlights: {
          ielts: [8.0, 7.5, 7.5, 7.5, 7.0],
          sat: [1500, 1410, 1310],
        },
        // Universities that sent admission letters (from the old site).
        offers: [
          { name: 'Pennsylvania State University', country: 'USA' },
          { name: 'Michigan State University', country: 'USA' },
          { name: 'Arizona State University', country: 'USA' },
          { name: 'Rochester Institute of Technology', country: 'USA' },
          { name: 'Florida Institute of Technology', country: 'USA' },
          { name: 'Queens University of Charlotte', country: 'USA' },
        ],
        destinations: todo(
          'Where the Class of 2026 actually enrolled (universities in Uzbekistan and abroad, with the number of students), e.g. [{ name: "…", country: "…", students: 3 }].',
        ),
        continuingRate: todo('Share of the Class of 2026 who continued to higher education (e.g. 92).'),
        testStats: todo(
          'For all 2026 test-takers: number of students and median/range for IELTS and SAT, e.g. { en: "IELTS: 28 students, median 7.0; SAT: 9 students, range 1310–1500" }.',
        ),
      },
    ],
  },

  admissions: {
    grades: verify(
      {
        uz: "5–11-sinflarga qabul qilinadi; har bir sinf uchun alohida kvota belgilanadi.",
        ru: 'Приём ведётся в 5–11 классы; для каждого класса устанавливается отдельная квота.',
        en: 'Students are admitted to grades 5–11, with a separate quota for each grade.',
      },
      'Confirm which grades admit new students each year.',
    ),
    exams: verify(
      {
        uz: "Kirish imtihonlari asosan matematika va ingliz tilidan o'tkaziladi. Fanlar ro'yxatini har yili PIIMA belgilaydi.",
        ru: 'Вступительные экзамены проводятся в основном по математике и английскому языку. Перечень предметов ежегодно определяет PIIMA.',
        en: 'The entrance examinations are mainly in mathematics and English. PIIMA sets the exact subjects every year.',
      },
      'Confirm this year’s entrance exam subjects.',
    ),
    timeline: verify(
      {
        uz: "Arizalar odatda may–iyun oylarida qabul qilinadi, kirish imtihonlari iyun oyining oxirgi o'n kunligida o'tkaziladi. Aniq sanalar har yili PIIMA portalida e'lon qilinadi.",
        ru: 'Заявления обычно принимаются в мае–июне, вступительные экзамены проходят в последней декаде июня. Точные даты ежегодно публикуются на портале PIIMA.',
        en: 'Applications are usually accepted in May–June, and the entrance examinations take place in the last ten days of June. Exact dates are published every year on the PIIMA portal.',
      },
      'The old site said both “June” and “May–June”. Confirm the usual timing.',
    ),
    documents: verify(
      [
        { uz: "Ota-onaning (qonuniy vakilning) arizasi", ru: 'Заявление родителя (законного представителя)', en: 'Application from a parent or legal guardian' },
        { uz: "O'quvchining tug'ilganlik haqidagi guvohnomasi nusxasi", ru: 'Копия свидетельства о рождении ученика', en: 'Copy of the student’s birth certificate' },
        { uz: "Hozirgi maktabdan o'qish to'g'risidagi ma'lumotnoma", ru: 'Справка с места учёбы из текущей школы', en: 'Certificate of enrolment from the current school' },
        { uz: "3×4 formatdagi 2 dona surat va tibbiy ma'lumotnoma", ru: 'Две фотографии 3×4 и медицинская справка', en: 'Two 3×4 photos and a medical certificate' },
      ],
      'From the old site. Confirm the list, or delete this block and simply point families to the portal.',
    ),
    faq: [
      {
        q: { uz: "Arizani to'g'ridan-to'g'ri maktabga topshirsa bo'ladimi?", ru: 'Можно ли подать заявление напрямую в школу?', en: 'Can I apply directly to the school?' },
        a: {
          uz: "Yo'q. Arizalar faqat PIIMA rasmiy portali — ariza.piima.uz orqali qabul qilinadi. Maktab arizalarni mustaqil ravishda qabul qilmaydi.",
          ru: 'Нет. Заявления принимаются только через официальный портал PIIMA — ariza.piima.uz. Школа не принимает заявления самостоятельно.',
          en: 'No. Applications are accepted only through the official PIIMA portal, ariza.piima.uz. The school does not accept applications itself.',
        },
      },
      {
        q: { uz: "Ta'lim pullikmi?", ru: 'Обучение платное?', en: 'Do we have to pay?' },
        a: {
          uz: "Yo'q. Barcha o'quvchilar davlat hisobidan bepul o'qiydi. Qabul uchun ham hech qanday to'lov olinmaydi.",
          ru: 'Нет. Все ученики учатся бесплатно, за счёт государства. За поступление также никакая плата не взимается.',
          en: 'No. Education is free for every student and paid for by the state. There is no fee for admission either.',
        },
      },
      {
        q: { uz: 'Qaysi fanlardan imtihon topshiriladi?', ru: 'По каким предметам сдают экзамены?', en: 'Which subjects are tested?' },
        a: {
          uz: "Kirish imtihonlari asosan matematika va ingliz tilidan o'tkaziladi. Aniq ro'yxatni har yili PIIMA belgilaydi.",
          ru: 'В основном математика и английский язык. Точный перечень ежегодно определяет PIIMA.',
          en: 'Mainly mathematics and English. PIIMA sets the exact list every year.',
        },
      },
      {
        q: { uz: 'Qaysi sinflarga qabul qilinadi?', ru: 'В какие классы принимают?', en: 'Which grades can students apply to?' },
        a: {
          uz: "5-sinfdan 11-sinfgacha. Har bir sinf uchun alohida kvota ajratiladi.",
          ru: 'С 5 по 11 класс. Для каждого класса выделяется отдельная квота.',
          en: 'Grades 5 to 11. Each grade has its own quota.',
        },
      },
      {
        q: { uz: 'Qabul qachon boʻladi?', ru: 'Когда проходит приём?', en: 'When does admission take place?' },
        a: {
          uz: "Arizalar odatda may–iyun oylarida qabul qilinadi, imtihonlar iyun oyining oxirida o'tkaziladi. Aniq sanalar PIIMA portalida e'lon qilinadi.",
          ru: 'Заявления обычно принимают в мае–июне, экзамены проходят в конце июня. Точные даты публикуются на портале PIIMA.',
          en: 'Applications are usually accepted in May–June and exams are held at the end of June. Exact dates are announced on the PIIMA portal.',
        },
      },
    ],
  },

  // Photos: put image files in the photos/ folder with these names
  // (hero.jpg, campus.jpg, students.jpg, lab.jpg, classroom.jpg). The build
  // resizes them, converts them to WebP and removes location/camera metadata.
  // Any photo that is missing is simply left out of the design.
  photos: {
    hero: { alt: { uz: 'Maktab binosi', ru: 'Здание школы', en: 'The school building' } },
    campus: { alt: { uz: 'Maktab hududi', ru: 'Территория школы', en: 'The school campus' } },
    students: { alt: { uz: "Dars paytida o'quvchilar", ru: 'Ученики на уроке', en: 'Students in class' } },
    lab: { alt: { uz: "STEAM laboratoriyasida o'quvchilar", ru: 'Ученики в STEAM-лаборатории', en: 'Students in a STEAM laboratory' } },
    classroom: { alt: { uz: 'Sinf xonasi', ru: 'Учебный класс', en: 'A classroom' } },
  },
};
