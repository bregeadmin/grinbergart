const heroPhoto = document.querySelector(".hero-photo");
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll(".tilt");
const motionCards = document.querySelectorAll(".value-strip article, .experience-grid article, .skills-panel, .project-card");
const langToggle = document.querySelector("[data-lang-toggle]");
const motionIsSafe = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
let parallaxFrame = 0;
let pointerFrame = 0;
let latestPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let currentLang = "en";

const translations = {
  "Founder / Real Estate / GTM / Product Strategy": "Founder / недвижимость / GTM / продуктовая стратегия",
  "Value": "Ценность",
  "Projects": "Проекты",
  "Hire": "Связаться",
  "I turn complex markets into revenue systems.": "Я превращаю сложные рынки в работающие коммерческие системы.",
  "Bring me in when the opportunity is valuable but still unshaped: a property business, an investor story, a sales funnel, a partnership format, a product mechanic, or an internal tool that has to make the company faster.": "Меня стоит подключать, когда возможность ценная, но ещё не собрана в ясную систему: бизнес в недвижимости, история для инвестора, воронка продаж, партнёрская модель, продуктовая механика или внутренний инструмент, который должен ускорить компанию.",
  "Invite me to talk": "Пригласить поговорить",
  "See the work": "Смотреть кейсы",
  "property transaction volume closed in one year": "объём сделок с недвижимостью за один год",
  "apartments managed through BRE.GE": "квартир в управлении через BRE.GE",
  "commercial, digital, research and operations projects led": "коммерческих, digital, research и операционных проектов",
  "venture tracks built from zero across property, digital, SaaS and research": "направления, собранные с нуля: недвижимость, digital, SaaS и research",
  "What becomes easier when I join the room": "Что становится проще, когда я в проекте",
  "You get a founder-level operator who can read the market, shape the offer, build trust, coordinate people, sell the first movement, and stay close enough to the work until the system actually runs. I do not separate strategy from delivery: the point of the strategy is to make action easier, faster and commercially sharper.": "Вы получаете человека с founder-мышлением, который умеет читать рынок, собирать оффер, выстраивать доверие, координировать людей, продавать первый шаг и оставаться рядом с исполнением до момента, когда система действительно начинает работать. Для меня стратегия не отделена от реализации: её смысл в том, чтобы действие стало быстрее, понятнее и коммерчески точнее.",
  "Founder operating": "Founder-подход",
  "BRE.GE and real estate management": "BRE.GE и управление недвижимостью",
  "Built a Batumi property and lifestyle business without external funding: sales, owner relations, apartment management, content, local partners and a self-built financial admin for rental income, expenses and balances.": "Создал в Батуми бизнес на стыке недвижимости и lifestyle без внешнего финансирования: продажи, отношения с собственниками, управление квартирами, контент, локальные партнёры и собственная финансовая админка для доходов, расходов и балансов.",
  "Assets and capital": "Активы и капитал",
  "Commercial development from land to tenants": "Коммерческая недвижимость: от земли до арендаторов",
  "Found land, brought investor capital, structured partnerships, managed contractors, handled documentation, solved ownership and auction mechanics, and turned buildings into income-producing assets with tenants.": "Искал землю, приводил инвесторский капитал, структурировал партнёрства, управлял подрядчиками, документами, аукционами и оформлением собственности, а затем превращал здания в доходные активы с арендаторами.",
  "Brand launches": "Запуски брендов",
  "Cadillac, FIFA, SPIEF, Wargaming": "Cadillac, FIFA, SPIEF, Wargaming",
  "Managed launch mechanics, event operations, sponsor zones, logistics, production, staffing, creative adaptations and VIP-level execution where details, timing and reputation were the product.": "Управлял механиками запусков, event operations, спонсорскими зонами, логистикой, продакшеном, персоналом, креативными адаптациями и исполнением VIP-уровня — там, где детали, сроки и репутация сами становятся продуктом.",
  "Product and research": "Продукт и исследования",
  "Locastor, macro indicators, IEEE": "Locastor, макропоказатели, IEEE",
  "Built a research-product logic around consumer behavior in retail, connected it to macroeconomic thinking and business informatics, and developed it into academic work with an IEEE publication.": "Собрал продуктово-исследовательскую логику вокруг поведения покупателей в retail, связал её с макроэкономическим мышлением и бизнес-информатикой, а затем развил в академическую работу с публикацией IEEE.",
  "Digital business": "Digital-бизнес",
  "Agency work and SaaS concepts": "Агентские проекты и SaaS-концепты",
  "Ran digital projects for education, media and consulting clients, including Helen Doron, Varlamov and Malakut pages, then explored Fora: a collaboration layer for visual feedback on any website.": "Вёл digital-проекты для образования, медиа и консалтинга, включая Helen Doron, страницы для Varlamov и Malakut. Позже исследовал Fora — слой для визуального фидбэка прямо поверх любого сайта.",
  "Education and competition": "Образование и конкурсы",
  "Academic foundation": "Академическая база",
  "Management, economics and business informatics shaped through competitive academic tracks and applied digital work.": "Менеджмент, экономика и бизнес-информатика, собранные через сильные академические конкурсы и прикладную digital-практику.",
  "Skills from the field": "Навыки, проверенные практикой",
  "What I can actually do": "Что я реально умею делать",
  "My value is not a single function. I connect market reading, sales, product thinking, investor logic and hands-on execution until an opportunity becomes a working system. I am based between Tel Aviv and Georgia, mobile by default and ready for business trips, launches, investor meetings and on-site work.": "Моя ценность не сводится к одной функции. Я соединяю понимание рынка, продажи, продуктовую логику, инвесторское мышление и личное включение в исполнение — до момента, когда возможность превращается в работающую систему. Я базируюсь между Тель-Авивом и Грузией, мобилен по умолчанию и готов к командировкам, запускам, встречам с инвесторами и работе на месте.",
  "Market strategy": "Рыночная стратегия",
  "Real estate operations": "Операции в недвижимости",
  "Investor storytelling": "Инвесторская упаковка",
  "Sales systems": "Системы продаж",
  "GTM mechanics": "GTM-механики",
  "Partnerships": "Партнёрства",
  "Project management": "Управление проектами",
  "Financial admin logic": "Финансовая автоматизация",
  "Product research": "Продуктовые исследования",
  "Customer analytics": "Клиентская аналитика",
  "Event operations": "Операции на событиях",
  "Digital production": "Digital-продакшен",
  "I can find an opportunity, test if it has money behind it, make the offer believable, and sell the first version before the process becomes heavy.": "Я умею находить возможность, проверять, есть ли за ней деньги, делать оффер убедительным и продавать первую версию до того, как процесс станет тяжёлым.",
  "I can coordinate people who do not naturally speak the same language: investors, contractors, designers, developers, landlords, tenants, clients and local partners.": "Я умею координировать людей, которые обычно говорят на разных языках: инвесторов, подрядчиков, дизайнеров, разработчиков, арендодателей, арендаторов, клиентов и локальных партнёров.",
  "I can move between boardroom logic and ground-level delivery: documents, sales calls, spreadsheets, content, operations, launches and uncomfortable details.": "Я умею переключаться между стратегическим уровнем и практическим исполнением: документы, звонки продаж, таблицы, контент, операции, запуски и неудобные детали.",
  "Selected projects": "Выбранные проекты",
  "Different markets. Same useful pattern: find the signal, make it sell, execute.": "Разные рынки. Один полезный паттерн: найти сигнал, упаковать в продажу, довести до результата.",
  "01 / Current founder case": "01 / Текущий founder-кейс",
  "I built BRE.GE as a Batumi real estate and lifestyle brand for international buyers. The business started without external funding and grew through direct trust, clear explanation, local execution and hands-on sales. Today it combines property selection, buyer guidance, apartment management, content, and internal finance automation for owner balances, rental income and expenses.": "Я создал BRE.GE как бренд недвижимости и lifestyle в Батуми для международных покупателей. Бизнес стартовал без внешнего финансирования и вырос на прямом доверии, понятном объяснении, локальном исполнении и личных продажах. Сегодня он объединяет подбор недвижимости, сопровождение покупателей, управление квартирами, контент и внутреннюю финансовую автоматизацию.",
  "This is the clearest proof that I can create commercial value without a large structure around me: find the demand, build the offer, close transactions, and turn the work into a repeatable operating system.": "Это самый понятный пример того, что я умею создавать коммерческую ценность без большой структуры вокруг: найти спрос, собрать оффер, закрыть сделки и превратить работу в повторяемую операционную систему.",
  "Open BRE.GE": "Открыть BRE.GE",
  "02 / Real estate development": "02 / Девелопмент недвижимости",
  "Commercial development": "Коммерческий девелопмент",
  "I originated commercial real estate projects from zero: found land, recognized the business case, brought in investor capital, structured the partnership, managed contractors and documentation, and then found tenants so the asset could produce income. Total developed commercial property: 1,550 m².": "Я запускал проекты коммерческой недвижимости с нуля: находил землю, видел бизнес-кейс, приводил инвесторский капитал, структурировал партнёрство, управлял подрядчиками и документами, а затем находил арендаторов, чтобы актив начал приносить доход. Общий объём реализованной коммерческой недвижимости: 1 550 м².",
  "The important part is not only construction. It is the full chain: opportunity, capital, land mechanics, permissions, execution, tenants and cash flow.": "Важна не только стройка. Важна вся цепочка: возможность, капитал, земельная механика, разрешения, исполнение, арендаторы и денежный поток.",
  "03 / Launch mechanic": "03 / Механика запуска",
  "Cadillac Take Away Drive": "Cadillac Take Away Drive",
  "I created a product-like launch mechanic for Cadillac: a premium test drive from home to work, ordered through a digital flow and experienced as part of a real city route. It was sold to the brand for a model launch and turned a standard test-drive format into a story people wanted to talk about.": "Я создал для Cadillac механику запуска, похожую на продукт: премиальный тест-драйв от дома до работы, заказанный через digital flow и встроенный в реальный городской маршрут. Формат был продан бренду для запуска модели и превратил стандартный тест-драйв в историю, о которой хотелось говорить.",
  "Result: 120 test drives, 500+ media mentions, 6x lower acquisition cost and a POPAI silver award for shopper marketing strategy.": "Результат: 120 тест-драйвов, 500+ упоминаний в медиа, стоимость привлечения ниже в 6 раз и серебро POPAI за shopper marketing strategy.",
  "Recognized at the international POPAI Awards as a shopper marketing case.": "Проект был отмечен на международном конкурсе POPAI Awards как сильный shopper marketing case.",
  "04 / Research product": "04 / Research-продукт",
  "Locastor": "Locastor",
  "Locastor was a research-product concept for measuring consumer behavior inside a retail space. It connected macroeconomic thinking, shopper marketing and business informatics, and became the basis for my master's research and an IEEE publication.": "Locastor был исследовательско-продуктовой концепцией для измерения поведения покупателей внутри retail-пространства. Он связал макроэкономическое мышление, shopper marketing и бизнес-информатику, а затем стал основой моей магистерской работы и публикации IEEE.",
  "It trained the part of my thinking I still use: observe small behavior patterns, extract the signal, and build a useful business model around it.": "Этот проект натренировал мышление, которым я пользуюсь до сих пор: видеть маленькие поведенческие паттерны, извлекать сигнал и строить вокруг него полезную бизнес-модель.",
  "05 / SaaS concept": "05 / SaaS-концепт",
  "Fora": "Fora",
  "Fora was a SaaS concept for design and development teams: visual comments and stickers on any website, not only inside Figma or another closed workspace. The idea was to bring feedback closer to the actual surface of work and reduce the friction between designers, developers and stakeholders.": "Fora был SaaS-концептом для дизайнерских и разработческих команд: визуальные комментарии и стикеры на любом сайте, а не только внутри Figma или другого закрытого workspace. Идея была в том, чтобы приблизить фидбэк к реальной поверхности работы и снизить трение между дизайнерами, разработчиками и стейкхолдерами.",
  "06 / Early operator case": "06 / Ранний операторский кейс",
  "Digital agency work": "Digital-агентство и production",
  "Before the larger real estate and brand projects, I built and managed digital work end-to-end: client conversations, offer logic, copy, design direction, production and delivery. The projects ranged from education to media and consulting.": "До крупных проектов в недвижимости и брендах я вёл digital-работу end-to-end: разговоры с клиентами, логика оффера, тексты, дизайн-направление, production и delivery. Проекты были в образовании, медиа и консалтинге.",
  "The names were not always global brands, but the training was important: learning how to turn vague client requests into working pages, campaigns and commercial arguments.": "Не все имена были глобальными брендами, но тренировка была важной: превращать размытые клиентские запросы в рабочие страницы, кампании и коммерческие аргументы.",
  "07 / Operations at scale": "07 / Operations at scale",
  "FIFA / SPIEF / Wargaming": "FIFA / SPIEF / Wargaming",
  "I worked inside large public environments where details matter: logistics, accreditation, partner zones, staffing, production, sponsor service, creative adaptations and on-site coordination. These projects trained speed, calm execution and the ability to keep many moving parts aligned under pressure.": "Я работал в больших публичных средах, где решают детали: логистика, аккредитация, партнёрские зоны, персонал, production, sponsor service, креативные адаптации и координация на площадке. Эти проекты натренировали скорость, спокойное исполнение и умение держать под давлением много движущихся частей.",
  "Why this is valuable": "Почему это ценно",
  "Many people can make strategy decks. Many can sell. Many can manage tasks. The value is in combining all three while staying close to reality: seeing the market clearly, making the offer believable, closing the first movement, and building the operating logic behind it.": "Многие умеют делать стратегические презентации. Многие умеют продавать. Многие умеют вести задачи. Ценность в том, чтобы соединить всё это и оставаться близко к реальности: ясно видеть рынок, делать оффер убедительным, закрывать первый импульс и строить операционную логику за ним.",
  "Hire / discuss a role": "Обсудить роль",
  "Review portfolio": "Смотреть портфолио",
  "Let’s discuss where I can create value.": "Давайте обсудим, где я могу создать ценность."
};

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function translatePage(lang) {
  document.documentElement.lang = lang === "ru" ? "ru" : "en";
  document.querySelectorAll("body *").forEach((element) => {
    if (["SCRIPT", "STYLE"].includes(element.tagName)) return;
    if (element.dataset.ru) {
      if (!element.dataset.en) element.dataset.en = element.innerHTML;
      element.innerHTML = lang === "ru" ? element.dataset.ru : element.dataset.en;
      return;
    }
    if (element.closest("[data-ru]")) return;
    if (element === langToggle || element.closest("[data-lang-toggle]") || element.children.length) return;
    const original = element.dataset.en || normalizeText(element.textContent);
    if (!original) return;
    element.dataset.en = original;
    element.textContent = lang === "ru" ? translations[original] || original : original;
  });

  if (langToggle) {
    langToggle.textContent = lang === "ru" ? "EN" : "RU";
    langToggle.setAttribute("aria-label", lang === "ru" ? "Switch to English" : "Switch to Russian");
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.02, rootMargin: "0px 0px 28% 0px" },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = "0ms";
  revealObserver.observe(item);
});

motionCards.forEach((item, index) => {
  item.classList.add("motion-card");
  item.style.transitionDelay = "0ms";
  revealObserver.observe(item);
});

function updateHeroParallax() {
  if (!heroPhoto) return;
  const y = Math.min(window.scrollY * 0.16, 90);
  heroPhoto.style.setProperty("--hero-y", `${y}px`);
}

function requestHeroParallax() {
  if (!motionIsSafe || parallaxFrame) return;
  parallaxFrame = window.requestAnimationFrame(() => {
    parallaxFrame = 0;
    updateHeroParallax();
    updateScrollProgress();
  });
}

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  document.body.style.setProperty("--scroll-progress", `${progress}%`);
}

function requestPointerLight(event) {
  if (!motionIsSafe || !finePointer) return;
  latestPointer = { x: event.clientX, y: event.clientY };
  if (pointerFrame) return;

  pointerFrame = window.requestAnimationFrame(() => {
    pointerFrame = 0;
    document.body.classList.add("has-pointer");
    document.body.style.setProperty("--mouse-x", `${latestPointer.x}px`);
    document.body.style.setProperty("--mouse-y", `${latestPointer.y}px`);
  });
}

if (motionIsSafe && finePointer) {
  tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `translateY(-7px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}

window.addEventListener("scroll", requestHeroParallax, { passive: true });
window.addEventListener("pointermove", requestPointerLight, { passive: true });
langToggle?.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "ru" : "en";
  translatePage(currentLang);
});
updateHeroParallax();
updateScrollProgress();
