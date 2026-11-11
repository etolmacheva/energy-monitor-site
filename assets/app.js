// Сайт сам ничего не знает про Метрику и GA4 — он только кладёт события в dataLayer.
// Что с ними делать (отправить цель в Метрику, событие в GA4) — решает Google Tag Manager.
window.dataLayer = window.dataLayer || [];

const COMPANIES = [
  { key: "rosseti", name: "Россети", sector: "Электроэнергетика", sub: "Сети", ticker: "FEES" },
  { key: "inter_rao", name: "Интер РАО", sector: "Электроэнергетика", sub: "Генерация и сбыт", ticker: "IRAO" },
  { key: "rushydro", name: "РусГидро", sector: "Электроэнергетика", sub: "Генерация", ticker: "HYDR" },
  { key: "unipro", name: "Юнипро", sector: "Электроэнергетика", sub: "Генерация", ticker: "UPRO" },
  { key: "mosenergo", name: "Мосэнерго", sector: "Электроэнергетика", sub: "Генерация", ticker: "MSNG" },
  { key: "so_ups", name: "Системный оператор ЕЭС", sector: "Электроэнергетика", sub: "Диспетчеризация", ticker: null },
  { key: "gazprom", name: "Газпром", sector: "Нефть и газ", sub: "Интегрированная", ticker: "GAZP" },
  { key: "gazprom_neft", name: "Газпром нефть", sector: "Нефть и газ", sub: "Нефть", ticker: "SIBN" },
  { key: "lukoil", name: "ЛУКОЙЛ", sector: "Нефть и газ", sub: "Нефть", ticker: "LKOH" },
  { key: "rosneft", name: "Роснефть", sector: "Нефть и газ", sub: "Нефть", ticker: "ROSN" },
  { key: "novatek", name: "НОВАТЭК", sector: "Нефть и газ", sub: "Газ и СПГ", ticker: "NVTK" },
  { key: "transneft", name: "Транснефть", sector: "Нефть и газ", sub: "Транспорт", ticker: "TRNFP" },
  { key: "rosatom", name: "Росатом", sector: "Атомная энергетика", sub: "Интегрированная", ticker: null },
];

const cards = document.getElementById("cards");

function render(sector) {
  cards.innerHTML = "";
  COMPANIES.filter(c => sector === "all" || c.sector === sector).forEach(c => {
    const el = document.createElement("article");
    el.className = "card";
    el.dataset.company = c.key;
    const hhLink = `https://hh.ru/search/vacancy?text=${encodeURIComponent(c.name)}&search_field=company_name&professional_role=96`;
    el.innerHTML = `
      <p class="sector">${c.sector} · ${c.sub}</p>
      <h3>${c.name}</h3>
      <p class="ticker">${c.ticker ? "Тикер MOEX: " + c.ticker : "Акции не обращаются на бирже"}</p>
      <div class="details" hidden>
        <p>Здесь будут ваши выводы: число IT-вакансий, ключевые навыки, цифровые инициативы.</p>
        <a class="out" href="${hhLink}" target="_blank" rel="noopener">Вакансии на hh.ru →</a>
      </div>`;
    el.addEventListener("click", e => {
      if (e.target.closest("a")) return; // клики по ссылкам считает GTM сам (Outbound)
      const details = el.querySelector(".details");
      const opening = details.hidden;
      details.hidden = !details.hidden;
      if (opening) {
        window.dataLayer.push({
          event: "company_card_open",
          company_key: c.key,
          company_name: c.name,
          sector: c.sector,
        });
      }
    });
    cards.appendChild(el);
  });
}

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.sector);
    window.dataLayer.push({ event: "sector_filter", sector: btn.dataset.sector });
  });
});

document.getElementById("download-report").addEventListener("click", () => {
  window.dataLayer.push({ event: "report_download", file_name: "report.pdf" });
});

document.getElementById("subscribe-btn").addEventListener("click", () => {
  window.dataLayer.push({ event: "subscribe_click" });
});

render("all");
