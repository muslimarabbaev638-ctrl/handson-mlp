// News posts, newest first. To add a post, copy one block and change it.
// `date` is 'YYYY-MM' (or 'YYYY-MM-DD'); `slug` becomes the web address:
// /news/<slug>/ (and /ru/news/<slug>/, /en/news/<slug>/).
// `body` is a list of paragraphs.

export const news = [
  {
    slug: '2026-graduates-certificates',
    date: '2026-07',
    tag: { uz: 'Bitiruvchilar', ru: 'Выпускники', en: 'Graduates' },
    title: {
      uz: "48 nafar bitiruvchidan 32 nafari xalqaro va milliy sertifikatlarga ega bo'ldi",
      ru: '32 из 48 выпускников получили международные и национальные сертификаты',
      en: '32 of 48 graduates earn international and national certificates',
    },
    summary: {
      uz: "2026-yil bitiruvchilarining uchdan ikki qismi IELTS va SAT kabi sertifikatlarni maktabni tamomlashdan oldin qo'lga kiritdi.",
      ru: 'Две трети выпускников 2026 года получили сертификаты, такие как IELTS и SAT, ещё до окончания школы.',
      en: 'Two thirds of the Class of 2026 earned certificates such as IELTS and SAT before finishing school.',
    },
    body: {
      uz: [
        "Joriy yilda 48 nafar bitiruvchimizdan 32 nafari IELTS va SAT kabi nufuzli xalqaro hamda milliy sertifikatlarni maktabni tamomlashdan oldin qo'lga kiritdi.",
        "Bitiruvchilarimiz AQShning bir qator universitetlaridan qabul takliflarini oldi. Ular orasida Pennsylvania State University, Michigan State University va Arizona State University bor.",
      ],
      ru: [
        'В этом году 32 из 48 наших выпускников ещё до окончания школы получили престижные международные и национальные сертификаты, такие как IELTS и SAT.',
        'Наши выпускники получили предложения о зачислении от ряда университетов США, в том числе Pennsylvania State University, Michigan State University и Arizona State University.',
      ],
      en: [
        'This year, 32 of our 48 graduates earned respected international and national certificates such as IELTS and SAT before finishing school.',
        'Our graduates received offers of admission from several universities in the United States, including Pennsylvania State University, Michigan State University and Arizona State University.',
      ],
    },
  },
  {
    slug: '2026-olympiad-results',
    date: '2026-05',
    tag: { uz: 'Olimpiada', ru: 'Олимпиада', en: 'Olympiads' },
    title: {
      uz: "Informatika bo'yicha viloyatda yetakchilik",
      ru: 'Лидерство в области по информатике',
      en: 'Leading the region in computer science',
    },
    summary: {
      uz: "O'quvchilarimiz tuman va viloyat olimpiadalarida birinchi o'rinlarni egalladi.",
      ru: 'Наши ученики заняли первые места на районных и областных олимпиадах.',
      en: 'Our students took first places in district and regional olympiads.',
    },
    body: {
      uz: [
        "Maktabimiz o'quvchilari aniq fanlar, xususan informatika bo'yicha tuman va Samarqand viloyati olimpiadalarida faxrli birinchi o'rinlarni egalladi.",
      ],
      ru: [
        'Учащиеся нашей школы заняли почётные первые места на районных и областных (Самаркандская область) олимпиадах по точным наукам, в частности по информатике.',
      ],
      en: [
        'Our students took first places in district and Samarkand regional olympiads in the exact sciences, particularly in computer science.',
      ],
    },
  },
  {
    slug: 'directors-olympiad',
    date: '2026-04',
    tag: { uz: "Ta'lim jarayoni", ru: 'Учебный процесс', en: 'School life' },
    title: {
      uz: "An'anaviy «Direktor olimpiadasi»",
      ru: 'Традиционная «Олимпиада директора»',
      en: 'The traditional Director’s Olympiad',
    },
    summary: {
      uz: "Maktab miqyosidagi olimpiada o'quvchilarning bilim darajasini kuzatish va rag'batlantirishga xizmat qiladi.",
      ru: 'Общешкольная олимпиада помогает отслеживать и поощрять успехи учеников.',
      en: 'A school-wide olympiad that tracks and rewards students’ progress.',
    },
    body: {
      uz: [
        "O'quvchilarning bilim darajasini doimiy kuzatib borish va rag'batlantirish maqsadida maktab miqyosida «Direktor olimpiadasi» muntazam ravishda tashkil etib kelinmoqda.",
      ],
      ru: [
        'Для постоянного отслеживания и поощрения успехов учеников в школе регулярно проводится общешкольная «Олимпиада директора».',
      ],
      en: [
        'To monitor and reward students’ progress throughout the year, the school regularly holds a school-wide Director’s Olympiad.',
      ],
    },
  },
];
