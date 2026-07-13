#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const SITE_ORIGIN = "https://miyogift.com";
const API_URL = "https://api.miyogift.com/app/sitemap/list";
const INIT_MODE = process.argv.includes("--init");

const locales = [
  { id: "en-US", key: "en", prefix: "", file: "README.md", label: "English", sitemap: "en-US", home: "/" },
  { id: "zh-CN", key: "zh", prefix: "/zh", file: "README.zh-CN.md", label: "简体中文", sitemap: "zh-CN", home: "/zh" },
  { id: "zh-HANT", key: "zhHant", prefix: "/zh-hant", file: "README.zh-HANT.md", label: "繁體中文", sitemap: "zh-HANT", home: "/zh-hant" },
  { id: "es-419", key: "es", prefix: "/es", file: "README.es-419.md", label: "Español", sitemap: "es-419", home: "/es" },
  { id: "pt-BR", key: "pt", prefix: "/pt", file: "README.pt-BR.md", label: "Português do Brasil", sitemap: "pt-BR", home: "/pt" },
  { id: "ja-JP", key: "ja", prefix: "/ja", file: "README.ja-JP.md", label: "日本語", sitemap: "ja-JP", home: "/ja" },
  { id: "de-DE", key: "de", prefix: "/de", file: "README.de-DE.md", label: "Deutsch", sitemap: "de-DE", home: "/de" },
  { id: "ko-KR", key: "ko", prefix: "/ko", file: "README.ko-KR.md", label: "한국어", sitemap: "ko-KR", home: "/ko" },
  { id: "ar-SA", key: "ar", prefix: "/ar", file: "README.ar-SA.md", label: "العربية", sitemap: "ar-SA", home: "/ar" },
  { id: "fr-FR", key: "fr", prefix: "/fr", file: "README.fr-FR.md", label: "Français", sitemap: "fr-FR", home: "/fr" },
  { id: "id-ID", key: "id", prefix: "/id", file: "README.id-ID.md", label: "Bahasa Indonesia", sitemap: "id-ID", home: "/id" },
  { id: "pl-PL", key: "pl", prefix: "/pl", file: "README.pl-PL.md", label: "Polski", sitemap: "pl-PL", home: "/pl" },
];

const headers = {
  "Client-Default-Locale": "en",
  "Client-Locale-en": "en-US",
  "Client-Locale-zh": "zh-CN",
  "Client-Locale-zh-hant": "zh-HANT",
  "Client-Locale-es": "es-419",
  "Client-Locale-pt": "pt-BR",
  "Client-Locale-ja": "ja-JP",
  "Client-Locale-de": "de-DE",
  "Client-Locale-ko": "ko-KR",
  "Client-Locale-ar": "ar-SA",
  "Client-Locale-fr": "fr-FR",
  "Client-Locale-id": "id-ID",
  "Client-Locale-pl": "pl-PL",
};

const copy = {
  en: {
    strong: "The official GitHub directory for MiYo Gift.",
    intro: "Discover personal digital gift experiences made with meaningful words, photos, videos, and music.",
    visit: "Visit MiYo Gift",
    browse: "Browse Gift Ideas",
    blog: "Read the Blog",
    languages: "Languages",
    about: "About MiYo Gift",
    aboutBody: [
      "[MiYo Gift]({home}) is a browser-based space for creating a digital gift around one person, one relationship, or one meaningful moment.",
      "Instead of sending another ordinary message, you can bring together personal words, favorite photos, videos, shared memories, and music in one thoughtfully arranged experience.",
      "Create and edit online, preview the result before publishing, and share the finished gift through a private link or QR code.",
      "MiYo Gift is designed for birthdays, anniversaries, long-distance relationships, apologies, graduations, romantic occasions, and the smaller moments that still deserve care.",
    ],
    start: "Start Here",
    startItems: [
      ["Visit MiYo Gift", "/", "Open the official website and begin exploring the experience."],
      ["Explore Gift Ideas", "/gift-ideas", "Find inspiration by occasion and emotional moment."],
      ["About MiYo Gift", "/about", "Learn more about the product and the thinking behind it."],
      ["MiYo Gift Blog", "/blog", "Read gift inspiration, relationship ideas, and practical guides."],
    ],
    ideasTitle: "Gift Ideas by Occasion",
    ideasIntro: "These collections help you find a suitable direction before choosing a specific digital gift template.",
    ideasLink: "Explore {title} gift ideas",
    ideas: {
      anniversary: "Anniversary",
      birthday: "Birthday",
      "long-distance-relationship": "Long-Distance Relationship",
      apology: "Apology",
      graduation: "Graduation",
      "valentines-day": "Valentine's Day",
    },
    templatesTitle: "Digital Gift Templates",
    templatesIntro: "Choose a template as the starting point, then personalize the content for the person receiving it.",
    templateLink: "View {title}",
    templates: {
      q7n4m: "Anniversary Memory Letter with Timeline Moments",
      v8r2s: "Anniversary Memory Letter with a Final Surprise",
      z3p9k: "Birthday Memory Gift Page",
      m8r4t: "Birthday Memory Wish Page",
      q6n2v: "Interactive Birthday Surprise Page",
      "love-note-galaxy": "Love Note Galaxy",
    },
    how: "How MiYo Gift Works",
    steps: [
      ["Find a starting point", "Browse the available gift ideas and templates to find an experience that fits the occasion and relationship."],
      ["Add your own story", "Personalize the words, photos, videos, and music directly in your browser."],
      ["Preview the experience", "Review the gift before publishing and make changes until the presentation feels right."],
      ["Publish and share", "Publish the personalized gift and send it through a private link or QR code. Scheduled link delivery by email is also available."],
    ],
    why: "Why Create a Digital Gift?",
    whyBody: [
      "A digital gift can hold more than a single greeting.",
      "It gives you room to organize memories, write something personal, include media that matters, and shape the order in which the recipient experiences everything.",
      "It can also be opened across phones, tablets, and desktop computers without requiring the recipient to install an app.",
      "The value comes from the thought placed inside it: the selected memories, the written details, and the way the experience is created for one particular person.",
    ],
    official: "Official MiYo Gift Pages",
    officialLabels: ["MiYo Gift Homepage", "Gift Ideas", "About MiYo Gift", "MiYo Gift Blog", "Privacy Policy", "Terms of Service", "Cookie Policy", "Copyright Information"],
    siteIndex: "Site Index",
    siteIndexBody: "The official XML sitemaps provide the latest index of MiYo Gift pages:",
    sitemapIndex: "MiYo Gift Sitemap Index",
    localeSitemap: "English Sitemap",
    repo: "About This Repository",
    repoBody: [
      "This repository is the official public GitHub directory for [MiYo Gift]({home}).",
      "It provides a concise introduction to the product and organized access to official gift ideas, templates, language editions, and website resources.",
      "This repository does not contain personalized user gifts, private gift content, or the source code of the MiYo Gift application.",
      "For current product information and available experiences, visit the official website.",
    ],
    explore: "Explore MiYo Gift",
    footer: "More than a message. Made for someone who matters.",
  },
  zh: {
    strong: "MiYo Gift 的官方 GitHub 目录。",
    intro: "探索由真诚文字、照片、视频和音乐组成的个性化数字礼物体验。",
    visit: "访问 MiYo Gift",
    browse: "浏览礼物灵感",
    blog: "阅读博客",
    languages: "语言版本",
    about: "关于 MiYo Gift",
    aboutBody: [
      "[MiYo Gift]({home}) 是一个可在浏览器中使用的数字礼物创作空间，适合为某个人、某段关系或某个值得纪念的时刻制作一份私人礼物。",
      "你不必只发送一条普通消息，而是可以把想说的话、喜欢的照片、视频、共同回忆和音乐组织成一个更完整、更有心意的体验。",
      "你可以在线创建和编辑，在发布前预览效果，并通过私人链接或二维码分享完成后的礼物。",
      "MiYo Gift 适合生日、纪念日、异地恋、道歉、毕业、浪漫节日，也适合那些虽小却值得认真对待的时刻。",
    ],
    start: "从这里开始",
    startItems: [
      ["访问 MiYo Gift", "/", "打开官方网站，开始了解数字礼物体验。"],
      ["查看礼物灵感", "/gift-ideas", "按场景和情感时刻寻找适合的方向。"],
      ["关于 MiYo Gift", "/about", "了解产品和背后的创作理念。"],
      ["MiYo Gift 博客", "/blog", "阅读礼物灵感、关系话题和实用指南。"],
    ],
    ideasTitle: "按场景浏览礼物灵感",
    ideasIntro: "这些集合可以先帮你确定方向，再选择具体的数字礼物模板。",
    ideasLink: "查看{title}礼物灵感",
    ideas: { anniversary: "纪念日", birthday: "生日", "long-distance-relationship": "异地恋", apology: "道歉", graduation: "毕业", "valentines-day": "情人节" },
    templatesTitle: "数字礼物模板",
    templatesIntro: "选择一个模板作为起点，再为收礼的人填入属于你们的内容。",
    templateLink: "查看{title}",
    templates: { q7n4m: "纪念日回忆信：时间线版本", v8r2s: "纪念日回忆信：最终惊喜版本", z3p9k: "生日回忆礼物页", m8r4t: "生日回忆祝福页", q6n2v: "互动生日惊喜页", "love-note-galaxy": "Love Note Galaxy" },
    how: "MiYo Gift 如何使用",
    steps: [["找到起点", "浏览礼物灵感和模板，选择适合场景与关系的体验。"], ["加入你的故事", "直接在浏览器中个性化文字、照片、视频和音乐。"], ["预览体验", "发布前检查效果，并调整到你觉得合适为止。"], ["发布并分享", "发布个性化礼物，通过私人链接或二维码发送，也支持定时邮件发送链接。"]],
    why: "为什么选择数字礼物？",
    whyBody: ["数字礼物可以承载的不只是一句问候。", "它让你有空间整理回忆、写下真正想说的话、加入重要媒体，并安排收礼人看到一切的顺序。", "它可以在手机、平板和桌面设备上打开，不需要收礼人安装应用。", "真正有价值的是你放进去的心意：被挑选的回忆、被写下的细节，以及这份体验只为某一个人而做。"],
    official: "MiYo Gift 官方页面",
    officialLabels: ["MiYo Gift 首页", "礼物灵感", "关于 MiYo Gift", "MiYo Gift 博客", "隐私政策", "服务条款", "Cookie 政策", "版权信息"],
    siteIndex: "站点索引",
    siteIndexBody: "官方 XML sitemap 提供 MiYo Gift 页面的最新索引：",
    sitemapIndex: "MiYo Gift Sitemap 索引",
    localeSitemap: "简体中文 Sitemap",
    repo: "关于这个仓库",
    repoBody: ["这个仓库是 [MiYo Gift]({home}) 的官方公开 GitHub 目录。", "它简要介绍产品，并整理官方礼物灵感、模板、多语言版本和网站资源入口。", "这个仓库不包含用户的私人礼物内容，也不包含 MiYo Gift 应用源代码。", "如需查看最新产品信息和可用体验，请访问官方网站。"],
    explore: "探索 MiYo Gift",
    footer: "不只是一条消息，而是为重要的人认真制作。",
  },
};

copy.zhHant = {
  ...copy.zh,
  strong: "MiYo Gift 的官方 GitHub 目錄。",
  intro: "探索由真誠文字、照片、影片和音樂組成的個人化數位禮物體驗。",
  visit: "造訪 MiYo Gift",
  browse: "瀏覽禮物靈感",
  blog: "閱讀部落格",
  languages: "語言版本",
  about: "關於 MiYo Gift",
  aboutBody: [
    "[MiYo Gift]({home}) 是一個可在瀏覽器中使用的數位禮物創作空間，適合為某個人、某段關係或某個值得紀念的時刻製作一份私人禮物。",
    "你不必只傳送一則普通訊息，而是可以把想說的話、喜歡的照片、影片、共同回憶和音樂整理成一個更完整、更有心意的體驗。",
    "你可以在線上建立與編輯，在發布前預覽成果，並透過私人連結或 QR Code 分享完成後的禮物。",
    "MiYo Gift 適合生日、紀念日、遠距離戀愛、道歉、畢業、浪漫節日，也適合那些雖小卻值得用心對待的時刻。",
  ],
  ideas: { anniversary: "紀念日", birthday: "生日", "long-distance-relationship": "遠距離戀愛", apology: "道歉", graduation: "畢業", "valentines-day": "情人節" },
  templates: { q7n4m: "紀念日回憶信：時間線版本", v8r2s: "紀念日回憶信：最終驚喜版本", z3p9k: "生日回憶禮物頁", m8r4t: "生日回憶祝福頁", q6n2v: "互動生日驚喜頁", "love-note-galaxy": "Love Note Galaxy" },
  localeSitemap: "繁體中文 Sitemap",
  footer: "不只是一則訊息，而是為重要的人用心製作。",
};

const compactCopies = {
  es: ["El directorio oficial de MiYo Gift en GitHub.", "Descubre regalos digitales personales creados con palabras, fotos, videos y música con significado.", "Visitar MiYo Gift", "Ver ideas de regalo", "Leer el blog", "Idiomas", "Acerca de MiYo Gift", "Empieza aquí", "Ideas de regalo por ocasión", "Plantillas de regalos digitales", "Cómo funciona MiYo Gift", "¿Por qué crear un regalo digital?", "Páginas oficiales de MiYo Gift", "Índice del sitio", "Acerca de este repositorio", "Explorar MiYo Gift", "Más que un mensaje. Hecho para alguien que importa."],
  pt: ["O diretório oficial do MiYo Gift no GitHub.", "Descubra experiências pessoais de presente digital feitas com palavras, fotos, vídeos e música com significado.", "Visitar o MiYo Gift", "Ver ideias de presente", "Ler o blog", "Idiomas", "Sobre o MiYo Gift", "Comece aqui", "Ideias de presente por ocasião", "Modelos de presente digital", "Como o MiYo Gift funciona", "Por que criar um presente digital?", "Páginas oficiais do MiYo Gift", "Índice do site", "Sobre este repositório", "Explorar o MiYo Gift", "Mais que uma mensagem. Feito para alguém que importa."],
  ja: ["MiYo Gift の公式 GitHub ディレクトリです。", "思いのこもった言葉、写真、動画、音楽でつくるパーソナルなデジタルギフトを見つけましょう。", "MiYo Gift を開く", "ギフトアイデアを見る", "ブログを読む", "言語", "MiYo Gift について", "はじめに", "シーン別ギフトアイデア", "デジタルギフトテンプレート", "MiYo Gift の使い方", "なぜデジタルギフトを作るのか", "MiYo Gift 公式ページ", "サイトインデックス", "このリポジトリについて", "MiYo Gift を見る", "ただのメッセージではなく、大切な人のためにつくるもの。"],
  de: ["Das offizielle GitHub-Verzeichnis für MiYo Gift.", "Entdecke persönliche digitale Geschenke mit bedeutungsvollen Worten, Fotos, Videos und Musik.", "MiYo Gift besuchen", "Geschenkideen ansehen", "Blog lesen", "Sprachen", "Über MiYo Gift", "Hier starten", "Geschenkideen nach Anlass", "Digitale Geschenkvorlagen", "So funktioniert MiYo Gift", "Warum ein digitales Geschenk erstellen?", "Offizielle MiYo Gift-Seiten", "Site-Index", "Über dieses Repository", "MiYo Gift entdecken", "Mehr als eine Nachricht. Gemacht für jemanden, der zählt."],
  ko: ["MiYo Gift의 공식 GitHub 디렉터리입니다.", "의미 있는 글, 사진, 영상, 음악으로 만드는 개인적인 디지털 선물 경험을 만나보세요.", "MiYo Gift 방문하기", "선물 아이디어 보기", "블로그 읽기", "언어", "MiYo Gift 소개", "시작하기", "상황별 선물 아이디어", "디지털 선물 템플릿", "MiYo Gift 사용 방법", "왜 디지털 선물을 만들까요?", "MiYo Gift 공식 페이지", "사이트 색인", "이 저장소 소개", "MiYo Gift 둘러보기", "메시지 그 이상. 소중한 사람을 위해 만든 선물."],
  ar: ["الدليل الرسمي لـ MiYo Gift على GitHub.", "اكتشف تجارب هدايا رقمية شخصية مصنوعة بالكلمات والصور والفيديوهات والموسيقى ذات المعنى.", "زيارة MiYo Gift", "تصفح أفكار الهدايا", "قراءة المدونة", "اللغات", "حول MiYo Gift", "ابدأ من هنا", "أفكار هدايا حسب المناسبة", "قوالب الهدايا الرقمية", "كيف يعمل MiYo Gift", "لماذا تنشئ هدية رقمية؟", "صفحات MiYo Gift الرسمية", "فهرس الموقع", "حول هذا المستودع", "استكشف MiYo Gift", "أكثر من رسالة. مصنوع لشخص يهمك."],
  fr: ["Le répertoire GitHub officiel de MiYo Gift.", "Découvrez des cadeaux numériques personnels créés avec des mots, des photos, des vidéos et de la musique qui comptent.", "Visiter MiYo Gift", "Voir les idées cadeaux", "Lire le blog", "Langues", "À propos de MiYo Gift", "Commencer ici", "Idées cadeaux par occasion", "Modèles de cadeaux numériques", "Comment fonctionne MiYo Gift", "Pourquoi créer un cadeau numérique ?", "Pages officielles de MiYo Gift", "Index du site", "À propos de ce dépôt", "Explorer MiYo Gift", "Plus qu'un message. Créé pour quelqu'un qui compte."],
  id: ["Direktori GitHub resmi untuk MiYo Gift.", "Temukan pengalaman hadiah digital personal yang dibuat dengan kata-kata, foto, video, dan musik bermakna.", "Kunjungi MiYo Gift", "Lihat ide hadiah", "Baca blog", "Bahasa", "Tentang MiYo Gift", "Mulai di sini", "Ide hadiah berdasarkan momen", "Template hadiah digital", "Cara kerja MiYo Gift", "Mengapa membuat hadiah digital?", "Halaman resmi MiYo Gift", "Indeks situs", "Tentang repositori ini", "Jelajahi MiYo Gift", "Lebih dari sekadar pesan. Dibuat untuk seseorang yang berarti."],
  pl: ["Oficjalny katalog GitHub dla MiYo Gift.", "Odkryj osobiste cyfrowe prezenty tworzone ze znaczących słów, zdjęć, filmów i muzyki.", "Odwiedź MiYo Gift", "Zobacz pomysły na prezent", "Czytaj blog", "Języki", "O MiYo Gift", "Zacznij tutaj", "Pomysły na prezent według okazji", "Szablony cyfrowych prezentów", "Jak działa MiYo Gift", "Dlaczego stworzyć cyfrowy prezent?", "Oficjalne strony MiYo Gift", "Indeks strony", "O tym repozytorium", "Odkryj MiYo Gift", "Więcej niż wiadomość. Stworzone dla kogoś ważnego."],
};

for (const [key, values] of Object.entries(compactCopies)) {
  copy[key] = {
    ...copy.en,
    strong: values[0],
    intro: values[1],
    visit: values[2],
    browse: values[3],
    blog: values[4],
    languages: values[5],
    about: values[6],
    start: values[7],
    ideasTitle: values[8],
    templatesTitle: values[9],
    how: values[10],
    why: values[11],
    official: values[12],
    siteIndex: values[13],
    repo: values[14],
    explore: values[15],
    footer: values[16],
  };
}

Object.assign(copy.es, {
  ideas: { anniversary: "Aniversario", birthday: "Cumpleaños", "long-distance-relationship": "Relación a distancia", apology: "Disculpa", graduation: "Graduación", "valentines-day": "Día de San Valentín" },
  templates: { q7n4m: "Carta de recuerdos de aniversario con línea de tiempo", v8r2s: "Carta de recuerdos de aniversario con sorpresa final", z3p9k: "Página de regalo de cumpleaños con recuerdos", m8r4t: "Página de deseos de cumpleaños con recuerdos", q6n2v: "Página interactiva de sorpresa de cumpleaños", "love-note-galaxy": "Galaxia de notas de amor" },
  localeSitemap: "Sitemap en español",
});
Object.assign(copy.pt, {
  ideas: { anniversary: "Aniversário de relacionamento", birthday: "Aniversário", "long-distance-relationship": "Relacionamento à distância", apology: "Pedido de desculpa", graduation: "Formatura", "valentines-day": "Dia dos Namorados" },
  templates: { q7n4m: "Carta de memórias de aniversário com linha do tempo", v8r2s: "Carta de memórias de aniversário com surpresa final", z3p9k: "Página de presente de aniversário com memórias", m8r4t: "Página de desejos de aniversário com memórias", q6n2v: "Página interativa de surpresa de aniversário", "love-note-galaxy": "Galáxia de notas de amor" },
  localeSitemap: "Sitemap em português",
});
Object.assign(copy.ja, {
  ideas: { anniversary: "記念日", birthday: "誕生日", "long-distance-relationship": "遠距離恋愛", apology: "謝罪", graduation: "卒業", "valentines-day": "バレンタインデー" },
  templates: { q7n4m: "タイムライン付き記念日メモリーレター", v8r2s: "最後のサプライズ付き記念日メモリーレター", z3p9k: "誕生日メモリーギフトページ", m8r4t: "誕生日メモリーウィッシュページ", q6n2v: "インタラクティブ誕生日サプライズページ", "love-note-galaxy": "Love Note Galaxy" },
  localeSitemap: "日本語 Sitemap",
});
Object.assign(copy.de, {
  ideas: { anniversary: "Jahrestag", birthday: "Geburtstag", "long-distance-relationship": "Fernbeziehung", apology: "Entschuldigung", graduation: "Abschluss", "valentines-day": "Valentinstag" },
  templates: { q7n4m: "Jahrestags-Erinnerungsbrief mit Timeline", v8r2s: "Jahrestags-Erinnerungsbrief mit finaler Überraschung", z3p9k: "Geburtstags-Erinnerungsgeschenkseite", m8r4t: "Geburtstagswunsch-Seite mit Erinnerungen", q6n2v: "Interaktive Geburtstagsüberraschung", "love-note-galaxy": "Liebesnotizen-Galaxie" },
  localeSitemap: "Deutsche Sitemap",
});
Object.assign(copy.ko, {
  ideas: { anniversary: "기념일", birthday: "생일", "long-distance-relationship": "장거리 연애", apology: "사과", graduation: "졸업", "valentines-day": "밸런타인데이" },
  templates: { q7n4m: "타임라인 기념일 추억 편지", v8r2s: "마지막 서프라이즈 기념일 추억 편지", z3p9k: "생일 추억 선물 페이지", m8r4t: "생일 추억 축하 페이지", q6n2v: "인터랙티브 생일 서프라이즈 페이지", "love-note-galaxy": "Love Note Galaxy" },
  localeSitemap: "한국어 Sitemap",
});
Object.assign(copy.ar, {
  ideas: { anniversary: "الذكرى السنوية", birthday: "عيد الميلاد", "long-distance-relationship": "العلاقة عن بعد", apology: "الاعتذار", graduation: "التخرج", "valentines-day": "عيد الحب" },
  templates: { q7n4m: "رسالة ذكريات للذكرى مع خط زمني", v8r2s: "رسالة ذكريات للذكرى مع مفاجأة أخيرة", z3p9k: "صفحة هدية عيد ميلاد بالذكريات", m8r4t: "صفحة أمنيات عيد ميلاد بالذكريات", q6n2v: "صفحة مفاجأة عيد ميلاد تفاعلية", "love-note-galaxy": "مجرة رسائل الحب" },
  localeSitemap: "خريطة الموقع العربية",
});
Object.assign(copy.fr, {
  ideas: { anniversary: "Anniversaire de couple", birthday: "Anniversaire", "long-distance-relationship": "Relation à distance", apology: "Excuses", graduation: "Diplôme", "valentines-day": "Saint-Valentin" },
  templates: { q7n4m: "Lettre de souvenirs d'anniversaire avec chronologie", v8r2s: "Lettre de souvenirs d'anniversaire avec surprise finale", z3p9k: "Page cadeau d'anniversaire avec souvenirs", m8r4t: "Page de voeux d'anniversaire avec souvenirs", q6n2v: "Page surprise d'anniversaire interactive", "love-note-galaxy": "Galaxie de mots d'amour" },
  localeSitemap: "Sitemap français",
});
Object.assign(copy.id, {
  ideas: { anniversary: "Hari jadi", birthday: "Ulang tahun", "long-distance-relationship": "Hubungan jarak jauh", apology: "Permintaan maaf", graduation: "Kelulusan", "valentines-day": "Hari Valentine" },
  templates: { q7n4m: "Surat Kenangan Hari Jadi dengan Linimasa", v8r2s: "Surat Kenangan Hari Jadi dengan Kejutan Akhir", z3p9k: "Halaman Hadiah Ulang Tahun dengan Kenangan", m8r4t: "Halaman Ucapan Ulang Tahun dengan Kenangan", q6n2v: "Halaman Kejutan Ulang Tahun Interaktif", "love-note-galaxy": "Love Note Galaxy" },
  localeSitemap: "Sitemap Bahasa Indonesia",
});
Object.assign(copy.pl, {
  ideas: { anniversary: "Rocznica", birthday: "Urodziny", "long-distance-relationship": "Związek na odległość", apology: "Przeprosiny", graduation: "Ukończenie szkoły", "valentines-day": "Walentynki" },
  templates: { q7n4m: "List wspomnień na rocznicę z osią czasu", v8r2s: "List wspomnień na rocznicę z finałową niespodzianką", z3p9k: "Urodzinowa strona prezentu ze wspomnieniami", m8r4t: "Urodzinowa strona życzeń ze wspomnieniami", q6n2v: "Interaktywna strona niespodzianki urodzinowej", "love-note-galaxy": "Galaktyka miłosnych wiadomości" },
  localeSitemap: "Polska mapa witryny",
});

const localizedDetails = {
  es: {
    aboutBody: [
      "[MiYo Gift]({home}) es un espacio en el navegador para crear un regalo digital alrededor de una persona, una relación o un momento especial.",
      "En lugar de enviar otro mensaje común, puedes reunir palabras personales, fotos favoritas, videos, recuerdos compartidos y música en una experiencia cuidada.",
      "Crea y edita en línea, revisa el resultado antes de publicarlo y comparte el regalo mediante un enlace privado o un código QR.",
      "MiYo Gift está pensado para cumpleaños, aniversarios, relaciones a distancia, disculpas, graduaciones, ocasiones románticas y pequeños momentos que también merecen cuidado.",
    ],
    startItems: [["Visitar MiYo Gift", "/", "Abre el sitio oficial y empieza a explorar la experiencia."], ["Explorar ideas de regalo", "/gift-ideas", "Encuentra inspiración por ocasión y momento emocional."], ["Acerca de MiYo Gift", "/about", "Conoce mejor el producto y la idea detrás de él."], ["Blog de MiYo Gift", "/blog", "Lee inspiración para regalos, ideas de relación y guías prácticas."]],
    ideasIntro: "Estas colecciones te ayudan a encontrar una dirección antes de elegir una plantilla de regalo digital.",
    templatesIntro: "Elige una plantilla como punto de partida y personaliza el contenido para la persona que recibirá el regalo.",
    ideasLink: "Explorar ideas de {title}",
    templateLink: "Ver {title}",
    steps: [["Encuentra un punto de partida", "Explora ideas y plantillas para encontrar una experiencia adecuada para la ocasión y la relación."], ["Agrega tu historia", "Personaliza palabras, fotos, videos y música directamente en el navegador."], ["Previsualiza la experiencia", "Revisa el regalo antes de publicarlo y ajusta los detalles hasta que se sienta correcto."], ["Publica y comparte", "Publica el regalo y envíalo mediante un enlace privado o código QR. También puedes programar el envío del enlace por correo."]],
    whyBody: ["Un regalo digital puede contener más que un saludo.", "Te da espacio para ordenar recuerdos, escribir algo personal, incluir medios importantes y decidir cómo la otra persona vivirá la experiencia.", "También puede abrirse en teléfonos, tablets y computadoras sin instalar una aplicación.", "Su valor está en el cuidado que contiene: los recuerdos elegidos, los detalles escritos y una experiencia hecha para una persona concreta."],
    officialLabels: ["Inicio de MiYo Gift", "Ideas de regalo", "Acerca de MiYo Gift", "Blog de MiYo Gift", "Política de privacidad", "Términos de servicio", "Política de cookies", "Información de copyright"],
    siteIndexBody: "Los sitemaps XML oficiales ofrecen el índice más reciente de páginas de MiYo Gift:",
    repoBody: ["Este repositorio es el directorio público oficial en GitHub de [MiYo Gift]({home}).", "Ofrece una introducción breve al producto y acceso organizado a ideas, plantillas, versiones de idioma y recursos del sitio.", "Este repositorio no contiene regalos privados de usuarios, contenido personalizado ni el código fuente de la aplicación MiYo Gift.", "Para información actual del producto y experiencias disponibles, visita el sitio oficial."],
  },
  pt: {
    aboutBody: ["[MiYo Gift]({home}) é um espaço no navegador para criar um presente digital em torno de uma pessoa, uma relação ou um momento importante.", "Em vez de enviar apenas mais uma mensagem, você pode reunir palavras pessoais, fotos favoritas, vídeos, memórias compartilhadas e música em uma experiência bem organizada.", "Crie e edite online, visualize o resultado antes de publicar e compartilhe o presente por um link privado ou QR code.", "MiYo Gift foi criado para aniversários, datas especiais, relacionamentos à distância, pedidos de desculpa, formaturas, ocasiões românticas e pequenos momentos que também merecem carinho."],
    startItems: [["Visitar o MiYo Gift", "/", "Abra o site oficial e comece a explorar a experiência."], ["Explorar ideias de presente", "/gift-ideas", "Encontre inspiração por ocasião e momento emocional."], ["Sobre o MiYo Gift", "/about", "Conheça melhor o produto e a ideia por trás dele."], ["Blog do MiYo Gift", "/blog", "Leia inspirações de presente, ideias de relacionamento e guias práticos."]],
    ideasIntro: "Estas coleções ajudam você a encontrar uma direção antes de escolher um modelo de presente digital.",
    templatesIntro: "Escolha um modelo como ponto de partida e personalize o conteúdo para a pessoa que vai receber o presente.",
    ideasLink: "Explorar ideias de {title}",
    templateLink: "Ver {title}",
    steps: [["Encontre um ponto de partida", "Explore ideias e modelos para encontrar uma experiência adequada à ocasião e à relação."], ["Adicione sua história", "Personalize palavras, fotos, vídeos e música diretamente no navegador."], ["Visualize a experiência", "Revise o presente antes de publicar e ajuste os detalhes até que tudo pareça certo."], ["Publique e compartilhe", "Publique o presente e envie por link privado ou QR code. O envio programado do link por e-mail também está disponível."]],
    whyBody: ["Um presente digital pode carregar mais do que uma saudação.", "Ele dá espaço para organizar memórias, escrever algo pessoal, incluir mídias importantes e definir a ordem da experiência.", "Também pode ser aberto em celulares, tablets e computadores sem instalar aplicativo.", "O valor está no cuidado colocado dentro dele: memórias escolhidas, detalhes escritos e uma experiência feita para uma pessoa específica."],
    officialLabels: ["Página inicial do MiYo Gift", "Ideias de presente", "Sobre o MiYo Gift", "Blog do MiYo Gift", "Política de privacidade", "Termos de serviço", "Política de cookies", "Informações de copyright"],
    siteIndexBody: "Os sitemaps XML oficiais oferecem o índice mais recente das páginas do MiYo Gift:",
    repoBody: ["Este repositório é o diretório público oficial do [MiYo Gift]({home}) no GitHub.", "Ele apresenta uma introdução breve ao produto e acesso organizado a ideias, modelos, versões de idioma e recursos do site.", "Este repositório não contém presentes privados de usuários, conteúdo personalizado nem o código-fonte da aplicação MiYo Gift.", "Para informações atuais do produto e experiências disponíveis, visite o site oficial."],
  },
  ja: {
    aboutBody: ["[MiYo Gift]({home}) は、ひとりの相手、ひとつの関係、ひとつの大切な瞬間のためにデジタルギフトを作れるブラウザ上のスペースです。", "いつものメッセージだけで終わらせず、言葉、写真、動画、思い出、音楽をひとつの丁寧な体験としてまとめられます。", "オンラインで作成と編集を行い、公開前にプレビューし、完成したギフトをプライベートリンクや QR コードで共有できます。", "MiYo Gift は誕生日、記念日、遠距離恋愛、謝罪、卒業、ロマンチックな場面、そして小さくても大切にしたい瞬間に向いています。"],
    startItems: [["MiYo Gift を開く", "/", "公式サイトを開いて体験を見てみましょう。"], ["ギフトアイデアを見る", "/gift-ideas", "シーンや気持ちに合わせてインスピレーションを探せます。"], ["MiYo Gift について", "/about", "製品とその考え方を知ることができます。"], ["MiYo Gift ブログ", "/blog", "ギフトのヒント、関係性のアイデア、実用的なガイドを読めます。"]],
    ideasIntro: "具体的なテンプレートを選ぶ前に、贈りたい方向性を見つけるためのコレクションです。",
    templatesIntro: "テンプレートを出発点にして、受け取る人のために内容をパーソナライズできます。",
    ideasLink: "{title}のギフトアイデアを見る",
    templateLink: "{title}を見る",
    steps: [["出発点を見つける", "ギフトアイデアとテンプレートを見て、場面と関係に合う体験を選びます。"], ["自分の物語を入れる", "言葉、写真、動画、音楽をブラウザ上でパーソナライズします。"], ["体験をプレビューする", "公開前に内容を確認し、しっくりくるまで調整します。"], ["公開して共有する", "ギフトを公開し、プライベートリンクや QR コードで送れます。メールでの予約送信にも対応しています。"]],
    whyBody: ["デジタルギフトは、ひとことの挨拶以上のものを届けられます。", "思い出を整理し、自分の言葉を書き、大切なメディアを加え、相手が体験する順番まで整えられます。", "受け取る人はアプリを入れずに、スマートフォン、タブレット、パソコンで開けます。", "価値は中に込めた心遣いにあります。選んだ思い出、書いた細部、そしてひとりのために作られた体験です。"],
    officialLabels: ["MiYo Gift ホーム", "ギフトアイデア", "MiYo Gift について", "MiYo Gift ブログ", "プライバシーポリシー", "利用規約", "Cookie ポリシー", "著作権情報"],
    siteIndexBody: "公式 XML sitemap では、MiYo Gift ページの最新インデックスを確認できます：",
    repoBody: ["このリポジトリは [MiYo Gift]({home}) の公式公開 GitHub ディレクトリです。", "製品の簡潔な紹介と、公式ギフトアイデア、テンプレート、言語版、Web サイトリソースへの入口をまとめています。", "このリポジトリには、ユーザーの個人的なギフト、非公開コンテンツ、MiYo Gift アプリのソースコードは含まれていません。", "最新の製品情報と利用可能な体験については、公式サイトをご覧ください。"],
  },
  de: {
    aboutBody: ["[MiYo Gift]({home}) ist ein browserbasierter Raum, in dem du ein digitales Geschenk für eine Person, eine Beziehung oder einen besonderen Moment erstellen kannst.", "Statt nur eine gewöhnliche Nachricht zu senden, kannst du persönliche Worte, Lieblingsfotos, Videos, gemeinsame Erinnerungen und Musik zu einer durchdachten Erfahrung verbinden.", "Erstelle und bearbeite alles online, prüfe das Ergebnis vor der Veröffentlichung und teile das fertige Geschenk per privatem Link oder QR-Code.", "MiYo Gift eignet sich für Geburtstage, Jahrestage, Fernbeziehungen, Entschuldigungen, Abschlüsse, romantische Anlässe und kleine Momente, die Aufmerksamkeit verdienen."],
    startItems: [["MiYo Gift besuchen", "/", "Öffne die offizielle Website und beginne, die Erfahrung zu erkunden."], ["Geschenkideen ansehen", "/gift-ideas", "Finde Inspiration nach Anlass und emotionalem Moment."], ["Über MiYo Gift", "/about", "Erfahre mehr über das Produkt und die Idee dahinter."], ["MiYo Gift Blog", "/blog", "Lies Geschenkideen, Beziehungsthemen und praktische Leitfäden."]],
    ideasIntro: "Diese Sammlungen helfen dir, eine passende Richtung zu finden, bevor du eine konkrete digitale Geschenkvorlage auswählst.",
    templatesIntro: "Wähle eine Vorlage als Ausgangspunkt und personalisiere den Inhalt für die Person, die das Geschenk erhält.",
    ideasLink: "{title}-Geschenkideen ansehen",
    templateLink: "{title} ansehen",
    steps: [["Einen Ausgangspunkt finden", "Durchsuche Geschenkideen und Vorlagen, um eine Erfahrung zu finden, die zum Anlass und zur Beziehung passt."], ["Deine eigene Geschichte hinzufügen", "Personalisiere Worte, Fotos, Videos und Musik direkt im Browser."], ["Die Erfahrung prüfen", "Sieh dir das Geschenk vor der Veröffentlichung an und passe es an, bis es sich richtig anfühlt."], ["Veröffentlichen und teilen", "Veröffentliche das Geschenk und sende es per privatem Link oder QR-Code. Der geplante Linkversand per E-Mail ist ebenfalls verfügbar."]],
    whyBody: ["Ein digitales Geschenk kann mehr enthalten als einen einzelnen Gruß.", "Es gibt dir Raum, Erinnerungen zu ordnen, etwas Persönliches zu schreiben, wichtige Medien einzubinden und die Reihenfolge der Erfahrung zu gestalten.", "Es kann auf Smartphones, Tablets und Desktop-Computern geöffnet werden, ohne dass eine App installiert werden muss.", "Der Wert entsteht durch die Sorgfalt darin: ausgewählte Erinnerungen, geschriebene Details und eine Erfahrung für eine bestimmte Person."],
    officialLabels: ["MiYo Gift Startseite", "Geschenkideen", "Über MiYo Gift", "MiYo Gift Blog", "Datenschutzerklärung", "Nutzungsbedingungen", "Cookie-Richtlinie", "Copyright-Informationen"],
    siteIndexBody: "Die offiziellen XML-Sitemaps bieten den aktuellen Index der MiYo Gift-Seiten:",
    repoBody: ["Dieses Repository ist das offizielle öffentliche GitHub-Verzeichnis für [MiYo Gift]({home}).", "Es bietet eine kurze Einführung in das Produkt und organisierten Zugang zu offiziellen Geschenkideen, Vorlagen, Sprachversionen und Website-Ressourcen.", "Dieses Repository enthält keine personalisierten Nutzergeschenke, privaten Geschenkinhalte oder den Quellcode der MiYo Gift-Anwendung.", "Aktuelle Produktinformationen und verfügbare Erfahrungen findest du auf der offiziellen Website."],
  },
  ko: {
    aboutBody: ["[MiYo Gift]({home})는 한 사람, 하나의 관계, 하나의 소중한 순간을 위한 디지털 선물을 브라우저에서 만들 수 있는 공간입니다.", "평범한 메시지 대신 개인적인 말, 좋아하는 사진, 영상, 함께한 기억, 음악을 하나의 정성스러운 경험으로 담을 수 있습니다.", "온라인에서 만들고 편집한 뒤 게시 전 미리 확인하고, 완성된 선물을 비공개 링크나 QR 코드로 공유할 수 있습니다.", "MiYo Gift는 생일, 기념일, 장거리 연애, 사과, 졸업, 로맨틱한 순간, 그리고 작지만 소중한 순간에 어울립니다."],
    startItems: [["MiYo Gift 방문하기", "/", "공식 웹사이트를 열고 경험을 살펴보세요."], ["선물 아이디어 보기", "/gift-ideas", "상황과 감정의 순간에 맞는 영감을 찾을 수 있습니다."], ["MiYo Gift 소개", "/about", "제품과 그 뒤의 생각을 더 알아보세요."], ["MiYo Gift 블로그", "/blog", "선물 영감, 관계 아이디어, 실용적인 가이드를 읽어보세요."]],
    ideasIntro: "이 컬렉션은 구체적인 디지털 선물 템플릿을 고르기 전에 방향을 찾는 데 도움이 됩니다.",
    templatesIntro: "템플릿을 시작점으로 선택한 뒤, 선물을 받을 사람에게 맞게 내용을 개인화하세요.",
    ideasLink: "{title} 선물 아이디어 보기",
    templateLink: "{title} 보기",
    steps: [["시작점 찾기", "선물 아이디어와 템플릿을 둘러보고 상황과 관계에 맞는 경험을 찾습니다."], ["나만의 이야기 추가하기", "브라우저에서 글, 사진, 영상, 음악을 직접 개인화합니다."], ["경험 미리보기", "게시 전에 선물을 확인하고 자연스럽게 느껴질 때까지 수정합니다."], ["게시하고 공유하기", "개인화된 선물을 게시하고 비공개 링크나 QR 코드로 보냅니다. 이메일 링크 예약 발송도 사용할 수 있습니다."]],
    whyBody: ["디지털 선물은 한마디 인사보다 더 많은 것을 담을 수 있습니다.", "추억을 정리하고, 개인적인 글을 쓰고, 중요한 미디어를 넣고, 받는 사람이 경험하는 순서까지 구성할 수 있습니다.", "받는 사람은 앱 설치 없이 휴대폰, 태블릿, 데스크톱에서 열 수 있습니다.", "가치는 그 안에 담긴 정성에서 나옵니다. 선택한 추억, 적어 둔 세부사항, 한 사람을 위해 만든 경험입니다."],
    officialLabels: ["MiYo Gift 홈", "선물 아이디어", "MiYo Gift 소개", "MiYo Gift 블로그", "개인정보 처리방침", "서비스 약관", "쿠키 정책", "저작권 정보"],
    siteIndexBody: "공식 XML sitemap은 MiYo Gift 페이지의 최신 색인을 제공합니다:",
    repoBody: ["이 저장소는 [MiYo Gift]({home})의 공식 공개 GitHub 디렉터리입니다.", "제품에 대한 간결한 소개와 공식 선물 아이디어, 템플릿, 언어 버전, 웹사이트 리소스 접근 경로를 제공합니다.", "이 저장소에는 사용자의 개인 선물, 비공개 선물 콘텐츠, MiYo Gift 애플리케이션 소스 코드가 포함되어 있지 않습니다.", "최신 제품 정보와 이용 가능한 경험은 공식 웹사이트에서 확인하세요."],
  },
  ar: {
    aboutBody: ["[MiYo Gift]({home}) مساحة تعمل من المتصفح لإنشاء هدية رقمية حول شخص واحد أو علاقة واحدة أو لحظة ذات معنى.", "بدلا من إرسال رسالة عادية أخرى، يمكنك جمع الكلمات الشخصية والصور المفضلة والفيديوهات والذكريات المشتركة والموسيقى في تجربة مرتبة بعناية.", "أنشئ وعدل عبر الإنترنت، وعاين النتيجة قبل النشر، ثم شارك الهدية عبر رابط خاص أو رمز QR.", "يناسب MiYo Gift أعياد الميلاد والذكرى السنوية والعلاقات عن بعد والاعتذار والتخرج والمناسبات الرومانسية واللحظات الصغيرة التي تستحق الاهتمام."],
    startItems: [["زيارة MiYo Gift", "/", "افتح الموقع الرسمي وابدأ في استكشاف التجربة."], ["تصفح أفكار الهدايا", "/gift-ideas", "اعثر على الإلهام حسب المناسبة واللحظة العاطفية."], ["حول MiYo Gift", "/about", "تعرف أكثر على المنتج والفكرة وراءه."], ["مدونة MiYo Gift", "/blog", "اقرأ إلهام الهدايا وأفكار العلاقات والأدلة العملية."]],
    ideasIntro: "تساعدك هذه المجموعات على اختيار الاتجاه المناسب قبل تحديد قالب هدية رقمية معين.",
    templatesIntro: "اختر قالبا كنقطة بداية، ثم خصص المحتوى للشخص الذي سيتلقى الهدية.",
    ideasLink: "استكشف أفكار {title}",
    templateLink: "عرض {title}",
    steps: [["اختر نقطة بداية", "تصفح أفكار الهدايا والقوالب للعثور على تجربة تناسب المناسبة والعلاقة."], ["أضف قصتك", "خصص الكلمات والصور والفيديوهات والموسيقى مباشرة من المتصفح."], ["عاين التجربة", "راجع الهدية قبل النشر وعدلها حتى تشعر أنها مناسبة."], ["انشر وشارك", "انشر الهدية الشخصية وأرسلها عبر رابط خاص أو رمز QR. يتوفر أيضا إرسال الرابط بالبريد الإلكتروني في وقت محدد."]],
    whyBody: ["يمكن للهدية الرقمية أن تحمل أكثر من مجرد تحية.", "تمنحك مساحة لترتيب الذكريات وكتابة شيء شخصي وإضافة وسائط مهمة وتحديد ترتيب تجربة المتلقي.", "يمكن فتحها على الهواتف والأجهزة اللوحية وأجهزة الكمبيوتر دون الحاجة إلى تثبيت تطبيق.", "تأتي قيمتها من العناية الموضوعة داخلها: الذكريات المختارة، التفاصيل المكتوبة، وتجربة صنعت لشخص محدد."],
    officialLabels: ["الصفحة الرئيسية لـ MiYo Gift", "أفكار الهدايا", "حول MiYo Gift", "مدونة MiYo Gift", "سياسة الخصوصية", "شروط الخدمة", "سياسة ملفات تعريف الارتباط", "معلومات حقوق النشر"],
    siteIndexBody: "توفر خرائط XML الرسمية أحدث فهرس لصفحات MiYo Gift:",
    repoBody: ["هذا المستودع هو الدليل العام الرسمي لـ [MiYo Gift]({home}) على GitHub.", "يقدم تعريفا موجزا بالمنتج ووصولا منظما إلى أفكار الهدايا والقوالب وإصدارات اللغات وموارد الموقع.", "لا يحتوي هذا المستودع على هدايا المستخدمين الشخصية أو محتوى هدايا خاص أو الكود المصدري لتطبيق MiYo Gift.", "للحصول على أحدث معلومات المنتج والتجارب المتاحة، تفضل بزيارة الموقع الرسمي."],
  },
  fr: {
    aboutBody: ["[MiYo Gift]({home}) est un espace dans le navigateur pour créer un cadeau numérique autour d'une personne, d'une relation ou d'un moment important.", "Au lieu d'envoyer un simple message, vous pouvez réunir des mots personnels, des photos préférées, des vidéos, des souvenirs partagés et de la musique dans une expérience soignée.", "Créez et modifiez en ligne, prévisualisez le résultat avant publication, puis partagez le cadeau avec un lien privé ou un QR code.", "MiYo Gift convient aux anniversaires, aux fêtes, aux relations à distance, aux excuses, aux remises de diplôme, aux occasions romantiques et aux petits moments qui méritent de l'attention."],
    startItems: [["Visiter MiYo Gift", "/", "Ouvrez le site officiel et commencez à explorer l'expérience."], ["Explorer les idées cadeaux", "/gift-ideas", "Trouvez l'inspiration par occasion et par moment émotionnel."], ["À propos de MiYo Gift", "/about", "Découvrez le produit et l'idée qui le porte."], ["Blog MiYo Gift", "/blog", "Lisez des inspirations cadeaux, des idées relationnelles et des guides pratiques."]],
    ideasIntro: "Ces collections vous aident à trouver une direction avant de choisir un modèle de cadeau numérique précis.",
    templatesIntro: "Choisissez un modèle comme point de départ, puis personnalisez le contenu pour la personne qui recevra le cadeau.",
    ideasLink: "Explorer les idées {title}",
    templateLink: "Voir {title}",
    steps: [["Trouver un point de départ", "Parcourez les idées cadeaux et les modèles pour trouver une expérience adaptée à l'occasion et à la relation."], ["Ajouter votre histoire", "Personnalisez les mots, les photos, les vidéos et la musique directement dans le navigateur."], ["Prévisualiser l'expérience", "Vérifiez le cadeau avant publication et ajustez-le jusqu'à ce qu'il vous semble juste."], ["Publier et partager", "Publiez le cadeau personnalisé et envoyez-le par lien privé ou QR code. L'envoi programmé du lien par e-mail est également disponible."]],
    whyBody: ["Un cadeau numérique peut contenir plus qu'un simple message.", "Il vous donne de l'espace pour organiser des souvenirs, écrire quelque chose de personnel, ajouter des médias importants et façonner l'ordre de l'expérience.", "Il peut aussi être ouvert sur téléphone, tablette et ordinateur sans installation d'application.", "Sa valeur vient de l'attention qu'il contient : les souvenirs choisis, les détails écrits et l'expérience créée pour une personne précise."],
    officialLabels: ["Accueil MiYo Gift", "Idées cadeaux", "À propos de MiYo Gift", "Blog MiYo Gift", "Politique de confidentialité", "Conditions d'utilisation", "Politique relative aux cookies", "Informations sur le copyright"],
    siteIndexBody: "Les sitemaps XML officiels fournissent l'index le plus récent des pages MiYo Gift :",
    repoBody: ["Ce dépôt est le répertoire GitHub public officiel de [MiYo Gift]({home}).", "Il présente brièvement le produit et organise l'accès aux idées cadeaux, modèles, versions linguistiques et ressources du site.", "Ce dépôt ne contient pas de cadeaux privés d'utilisateurs, de contenu personnalisé ni le code source de l'application MiYo Gift.", "Pour les informations actuelles du produit et les expériences disponibles, visitez le site officiel."],
  },
  id: {
    aboutBody: ["[MiYo Gift]({home}) adalah ruang berbasis browser untuk membuat hadiah digital bagi satu orang, satu hubungan, atau satu momen yang berarti.", "Alih-alih mengirim pesan biasa, Anda dapat menyatukan kata-kata pribadi, foto favorit, video, kenangan bersama, dan musik dalam satu pengalaman yang tertata.", "Buat dan edit secara online, pratinjau hasilnya sebelum diterbitkan, lalu bagikan hadiah melalui tautan pribadi atau kode QR.", "MiYo Gift cocok untuk ulang tahun, hari jadi, hubungan jarak jauh, permintaan maaf, kelulusan, momen romantis, dan momen kecil yang tetap layak dirayakan."],
    startItems: [["Kunjungi MiYo Gift", "/", "Buka situs resmi dan mulai jelajahi pengalamannya."], ["Jelajahi ide hadiah", "/gift-ideas", "Temukan inspirasi berdasarkan momen dan perasaan."], ["Tentang MiYo Gift", "/about", "Pelajari produk dan pemikiran di baliknya."], ["Blog MiYo Gift", "/blog", "Baca inspirasi hadiah, ide hubungan, dan panduan praktis."]],
    ideasIntro: "Koleksi ini membantu Anda menemukan arah sebelum memilih template hadiah digital tertentu.",
    templatesIntro: "Pilih template sebagai titik awal, lalu personalisasi kontennya untuk orang yang menerima hadiah.",
    ideasLink: "Jelajahi ide {title}",
    templateLink: "Lihat {title}",
    steps: [["Temukan titik awal", "Jelajahi ide hadiah dan template untuk menemukan pengalaman yang cocok dengan momen dan hubungan."], ["Tambahkan cerita Anda", "Personalisasi kata-kata, foto, video, dan musik langsung di browser."], ["Pratinjau pengalaman", "Tinjau hadiah sebelum diterbitkan dan sesuaikan sampai terasa tepat."], ["Terbitkan dan bagikan", "Terbitkan hadiah personal dan kirim melalui tautan pribadi atau kode QR. Pengiriman tautan terjadwal lewat email juga tersedia."]],
    whyBody: ["Hadiah digital dapat memuat lebih dari satu ucapan.", "Ia memberi ruang untuk menyusun kenangan, menulis sesuatu yang personal, menambahkan media penting, dan membentuk urutan pengalaman penerima.", "Hadiah dapat dibuka di ponsel, tablet, dan komputer tanpa perlu memasang aplikasi.", "Nilainya berasal dari perhatian yang dimasukkan ke dalamnya: kenangan yang dipilih, detail yang ditulis, dan pengalaman yang dibuat untuk satu orang tertentu."],
    officialLabels: ["Beranda MiYo Gift", "Ide hadiah", "Tentang MiYo Gift", "Blog MiYo Gift", "Kebijakan Privasi", "Ketentuan Layanan", "Kebijakan Cookie", "Informasi Hak Cipta"],
    siteIndexBody: "Sitemap XML resmi menyediakan indeks terbaru halaman MiYo Gift:",
    repoBody: ["Repositori ini adalah direktori publik resmi [MiYo Gift]({home}) di GitHub.", "Repositori ini memberi pengantar singkat tentang produk dan akses terorganisir ke ide hadiah, template, versi bahasa, dan sumber daya situs.", "Repositori ini tidak berisi hadiah pribadi pengguna, konten hadiah privat, atau kode sumber aplikasi MiYo Gift.", "Untuk informasi produk terbaru dan pengalaman yang tersedia, kunjungi situs resmi."],
  },
  pl: {
    aboutBody: ["[MiYo Gift]({home}) to przestrzeń w przeglądarce do tworzenia cyfrowego prezentu dla jednej osoby, jednej relacji lub jednej ważnej chwili.", "Zamiast wysyłać kolejną zwykłą wiadomość, możesz połączyć osobiste słowa, ulubione zdjęcia, filmy, wspólne wspomnienia i muzykę w jedną przemyślaną całość.", "Twórz i edytuj online, sprawdź efekt przed publikacją, a gotowy prezent udostępnij przez prywatny link lub kod QR.", "MiYo Gift pasuje do urodzin, rocznic, związków na odległość, przeprosin, zakończenia szkoły, romantycznych okazji i mniejszych chwil, które też zasługują na uwagę."],
    startItems: [["Odwiedź MiYo Gift", "/", "Otwórz oficjalną stronę i zacznij poznawać doświadczenie."], ["Zobacz pomysły na prezent", "/gift-ideas", "Znajdź inspirację według okazji i emocjonalnego momentu."], ["O MiYo Gift", "/about", "Dowiedz się więcej o produkcie i idei stojącej za nim."], ["Blog MiYo Gift", "/blog", "Czytaj inspiracje prezentowe, pomysły dotyczące relacji i praktyczne poradniki."]],
    ideasIntro: "Te kolekcje pomagają znaleźć właściwy kierunek przed wyborem konkretnego szablonu cyfrowego prezentu.",
    templatesIntro: "Wybierz szablon jako punkt wyjścia, a następnie spersonalizuj treść dla osoby, która otrzyma prezent.",
    ideasLink: "Zobacz pomysły {title}",
    templateLink: "Zobacz {title}",
    steps: [["Znajdź punkt wyjścia", "Przejrzyj pomysły i szablony, aby znaleźć doświadczenie pasujące do okazji i relacji."], ["Dodaj własną historię", "Personalizuj słowa, zdjęcia, filmy i muzykę bezpośrednio w przeglądarce."], ["Podejrzyj doświadczenie", "Sprawdź prezent przed publikacją i poprawiaj go, aż będzie właściwy."], ["Opublikuj i udostępnij", "Opublikuj spersonalizowany prezent i wyślij go przez prywatny link lub kod QR. Dostępne jest także zaplanowane wysłanie linku e-mailem."]],
    whyBody: ["Cyfrowy prezent może pomieścić więcej niż jedno życzenie.", "Daje przestrzeń na uporządkowanie wspomnień, napisanie czegoś osobistego, dodanie ważnych mediów i ułożenie kolejności całego doświadczenia.", "Można go otworzyć na telefonie, tablecie i komputerze bez instalowania aplikacji.", "Jego wartość wynika z troski włożonej do środka: wybranych wspomnień, zapisanych szczegółów i doświadczenia stworzonego dla jednej konkretnej osoby."],
    officialLabels: ["Strona główna MiYo Gift", "Pomysły na prezent", "O MiYo Gift", "Blog MiYo Gift", "Polityka prywatności", "Warunki korzystania", "Polityka cookies", "Informacje o prawach autorskich"],
    siteIndexBody: "Oficjalne mapy XML zawierają najnowszy indeks stron MiYo Gift:",
    repoBody: ["To repozytorium jest oficjalnym publicznym katalogiem GitHub dla [MiYo Gift]({home}).", "Zawiera krótkie wprowadzenie do produktu oraz uporządkowany dostęp do pomysłów, szablonów, wersji językowych i zasobów strony.", "To repozytorium nie zawiera prywatnych prezentów użytkowników, prywatnych treści prezentów ani kodu źródłowego aplikacji MiYo Gift.", "Aktualne informacje o produkcie i dostępnych doświadczeniach znajdziesz na oficjalnej stronie."],
  },
};

for (const [key, values] of Object.entries(localizedDetails)) {
  Object.assign(copy[key], values);
}

function siteUrl(locale, route) {
  if (route === "/") return `${SITE_ORIGIN}${locale.home === "/" ? "/" : locale.home}`;
  return `${SITE_ORIGIN}${locale.prefix}${route}`;
}

function detectLocale(loc) {
  return locales
    .filter((locale) => locale.prefix)
    .sort((a, b) => b.prefix.length - a.prefix.length)
    .find((locale) => loc === locale.prefix || loc.startsWith(`${locale.prefix}/`))?.id || "en-US";
}

function stripLocalePrefix(loc, locale) {
  if (!locale.prefix) return loc;
  if (loc === locale.prefix) return "/";
  return loc.slice(locale.prefix.length);
}

function ideaKey(loc) {
  return loc.match(/\/gift-ideas\/([a-z-]+)-\d+$/)?.[1] || "gift";
}

function templateKey(loc) {
  if (loc.includes("love-note-galaxy")) return "love-note-galaxy";
  return loc.match(/-([a-z]\d[a-z]\d[a-z]?)-\d+$/i)?.[1]?.toLowerCase() || "template";
}

function titleFromSlug(loc) {
  const last = loc.split("/").filter(Boolean).pop() || "miyo-gift";
  return last
    .replace(/-[a-z0-9]+-\d+$/i, "")
    .replace(/-\d+$/i, "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function link(label, href) {
  return `[${label}](${href})`;
}

function languageNav(current) {
  return locales.map((locale) => locale.id === current.id ? `**${locale.label}**` : link(locale.label, `./${locale.file}`)).join(" · ");
}

function renderStatic(locale) {
  const t = copy[locale.key];
  const home = siteUrl(locale, "/");
  const lines = [];

  lines.push("# MiYo Gift", "");
  lines.push("<p align=\"center\">", `  <strong>${t.strong}</strong>`, "</p>", "");
  lines.push("<p align=\"center\">", `  ${t.intro}`, "</p>", "");
  lines.push("<p align=\"center\">");
  lines.push(`  <a href="${home}"><strong>${t.visit}</strong></a>`);
  lines.push("  ·");
  lines.push(`  <a href="${siteUrl(locale, "/gift-ideas")}">${t.browse}</a>`);
  lines.push("  ·");
  lines.push(`  <a href="${siteUrl(locale, "/blog")}">${t.blog}</a>`);
  lines.push("</p>", "", "---", "");
  lines.push(`## ${t.languages}`, "", languageNav(locale), "", "---", "");
  lines.push(`## ${t.about}`, "");
  for (const paragraph of t.aboutBody) lines.push(paragraph.replaceAll("{home}", home), "");
  lines.push(`## ${t.start}`, "");
  for (const [label, route, desc] of t.startItems) lines.push(`* ${link(label, siteUrl(locale, route))} — ${desc}`);
  lines.push("", "---", "");
  lines.push(`## ${t.ideasTitle}`, "", t.ideasIntro, "", "<!-- GIFT_IDEAS:START -->", "<!-- GIFT_IDEAS:END -->", "", "---", "");
  lines.push(`## ${t.templatesTitle}`, "", t.templatesIntro, "", "<!-- TEMPLATES:START -->", "<!-- TEMPLATES:END -->", "", "---", "");
  lines.push(`## ${t.how}`, "");
  t.steps.forEach(([heading, body], index) => lines.push(`### ${index + 1}. ${heading}`, "", body, ""));
  lines.push("---", "");
  lines.push(`## ${t.why}`, "");
  for (const paragraph of t.whyBody) lines.push(paragraph, "");
  lines.push("---", "");
  lines.push(`## ${t.official}`, "");
  const routes = ["/", "/gift-ideas", "/about", "/blog", "/privacy-policy", "/terms-of-service", "/cookie-policy", "/copyright"];
  routes.forEach((route, index) => lines.push(`* ${link(t.officialLabels[index], siteUrl(locale, route))}`));
  lines.push("");
  lines.push(`## ${t.siteIndex}`, "", t.siteIndexBody, "");
  lines.push(`* ${link(t.sitemapIndex, `${SITE_ORIGIN}/sitemap_index.xml`)}`);
  lines.push(`* ${link(t.localeSitemap, `${SITE_ORIGIN}/sitemap/${locale.sitemap}.xml`)}`);
  lines.push("", "---", "");
  lines.push(`## ${t.repo}`, "");
  for (const paragraph of t.repoBody) lines.push(paragraph.replaceAll("{home}", home), "");
  lines.push("<p align=\"center\">", `  <a href="${home}"><strong>${t.explore}</strong></a>`, "</p>", "");
  lines.push("<p align=\"center\">", `  ${t.footer}`, "</p>", "");

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function renderIdeas(locale, pages) {
  const t = copy[locale.key];
  const order = ["anniversary", "birthday", "long-distance-relationship", "apology", "graduation", "valentines-day"];
  return pages
    .filter((page) => page.loc.includes("/gift-ideas/"))
    .sort((a, b) => order.indexOf(ideaKey(a.loc)) - order.indexOf(ideaKey(b.loc)))
    .map((page) => {
      const title = t.ideas[ideaKey(page.loc)] || titleFromSlug(page.loc);
      return `### ${title}\n\n${link(t.ideasLink.replace("{title}", title), `${SITE_ORIGIN}${page.loc}`)}`;
    })
    .join("\n\n");
}

function renderTemplates(locale, pages) {
  const t = copy[locale.key];
  const order = ["q7n4m", "v8r2s", "z3p9k", "m8r4t", "q6n2v", "love-note-galaxy"];
  return pages
    .filter((page) => !page.loc.includes("/gift-ideas/"))
    .sort((a, b) => order.indexOf(templateKey(a.loc)) - order.indexOf(templateKey(b.loc)))
    .map((page) => {
      const title = t.templates[templateKey(page.loc)] || titleFromSlug(page.loc);
      return `### ${title}\n\n${link(t.templateLink.replace("{title}", title), `${SITE_ORIGIN}${page.loc}`)}`;
    })
    .join("\n\n");
}

function replaceBlock(content, marker, replacement) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(content)) {
    throw new Error(`Missing ${marker} markers`);
  }
  return content.replace(pattern, `${start}\n\n${replacement}\n\n${end}`);
}

async function fetchPagesByLocale() {
  const response = await fetch(API_URL, { headers });
  if (!response.ok) throw new Error(`Failed to fetch sitemap list: ${response.status} ${response.statusText}`);

  const data = await response.json();
  const byLocale = new Map(locales.map((locale) => [locale.id, []]));

  for (const item of data) {
    if (!item || typeof item.loc !== "string") continue;
    const locale = locales.find((entry) => entry.id === detectLocale(item.loc));
    const relative = stripLocalePrefix(item.loc, locale);
    if (relative === "/" || relative === "/gift-ideas") continue;
    byLocale.get(locale.id).push({ loc: item.loc });
  }

  return byLocale;
}

async function main() {
  const byLocale = await fetchPagesByLocale();

  for (const locale of locales) {
    const filePath = path.join(process.cwd(), locale.file);
    let content;

    try {
      content = INIT_MODE ? renderStatic(locale) : await fs.readFile(filePath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      content = renderStatic(locale);
    }

    const pages = byLocale.get(locale.id);
    content = replaceBlock(content, "GIFT_IDEAS", renderIdeas(locale, pages));
    content = replaceBlock(content, "TEMPLATES", renderTemplates(locale, pages));
    await fs.writeFile(filePath, content, "utf8");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
