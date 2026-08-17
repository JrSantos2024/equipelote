const WHATSAPP = "5543984114172";

const header = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
});

menuBtn?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal, .card, .service, .stat, .reason").forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const prefix = el.dataset.prefix || "";
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    let current = 0;
    const step = Math.max(1, Math.round(target / 60));
    const tick = () => {
      current = Math.min(target, current + step);
      el.textContent = `${prefix}${current.toLocaleString("pt-BR")}${suffix}`;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
    observer.disconnect();
  }, { threshold: 0.5 });
  observer.observe(el);
});

const sim = {
  area: document.querySelector("#area"),
  perc: document.querySelector("#perc"),
  preco: document.querySelector("#preco"),
  lote: document.querySelector("#lote"),
};

function formatBRL(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function updateSim() {
  if (!sim.area || !sim.perc || !sim.preco || !sim.lote) return;
  const area = Number(sim.area.value) || 0;
  const perc = (Number(sim.perc.value) || 0) / 100;
  const preco = Number(sim.preco.value) || 0;
  const lote = Number(sim.lote.value) || 1;
  const vendavel = area * perc;
  const lotes = Math.floor(vendavel / lote);
  const vgv = vendavel * preco;
  document.querySelector("#out-lotes").textContent = lotes.toLocaleString("pt-BR");
  document.querySelector("#out-area").textContent = `${Math.round(vendavel).toLocaleString("pt-BR")} m²`;
  document.querySelector("#out-vgv").textContent = formatBRL(vgv);
}

Object.values(sim).forEach((input) => input?.addEventListener("input", updateSim));
updateSim();

document.querySelectorAll(".choice").forEach((btn) => {
  btn.addEventListener("click", () => btn.classList.toggle("active"));
});

document.querySelectorAll(".switch button").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    scoreQuiz();
  });
});

function scoreQuiz() {
  const box = document.querySelector("#quiz-score");
  if (!box) return;
  const answers = [...document.querySelectorAll(".quiz-item")].map((item) => {
    return item.querySelector(".switch .active")?.dataset.value === "nao";
  });
  const gaps = answers.filter(Boolean).length;
  let title = "Projeto bem encaminhado";
  let text = "Há consistência no caminho. Uma consulta pontual ainda pode acelerar decisões e evitar retrabalho.";
  if (gaps >= 3) {
    title = "Hora de uma consulta técnica";
    text = "Existem lacunas relevantes de viabilidade, aprovação ou estruturação. Uma sessão de 1h com análise prévia tende a reduzir risco e dar clareza no próximo passo.";
  } else if (gaps >= 1) {
    title = "Há pontos cegos no processo";
    text = "O empreendimento já avançou, mas ainda há etapas sem domínio. Vale usar a consulta para validar rumo e priorizar o que destrava o projeto.";
  }
  box.innerHTML = `<b>${title}</b><p>${text}</p>`;
}

scoreQuiz();

function selectedDifficulties() {
  return [...document.querySelectorAll(".choice.active")].map((el) => el.textContent.trim());
}

document.querySelector("#consulta-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const temas = [data.tema1, data.tema2, data.tema3, data.tema4].filter(Boolean).join(" | ");
  const diffs = selectedDifficulties().join(", ") || "não informado";
  const msg = `Olá, Wagner! Quero agendar uma Consulta Técnica da Equipe Lote.
Nome: ${data.nome}
WhatsApp: ${data.telefone}
Cidade: ${data.cidade}
Perfil: ${data.perfil}
Dificuldades: ${diffs}
4 temas: ${temas}
Preferência de data: ${data.data || "a combinar"}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

document.querySelector("#sim-whats")?.addEventListener("click", () => {
  const lotes = document.querySelector("#out-lotes")?.textContent;
  const vgv = document.querySelector("#out-vgv")?.textContent;
  const msg = `Olá! Simulei um empreendimento no site da Equipe Lote e gostaria de uma análise técnica.
Lotes estimados: ${lotes}
VGV estimado: ${vgv}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});
