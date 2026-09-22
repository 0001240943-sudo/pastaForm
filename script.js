/* ============================================================
   VELO ENGENHARIA — script.js v2
============================================================ */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ── PROGRESS BAR ─────────────────────────────────────────── */
const bar = $('#progress-bar');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0).toFixed(2) + '%';
}, { passive: true });

/* ── STICKY HEADER ────────────────────────────────────────── */
const header = $('#header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 100);
}, { passive: true });

/* ── HAMBURGER / DRAWER ───────────────────────────────────── */
const hamburger = $('#hamburger');
const drawer    = $('#drawer');
const overlay   = $('#overlay');
const drawerClose = $('#drawer-close');

function openDrawer() {
  hamburger.classList.add('open');
  drawer.classList.add('open');
  overlay.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => hamburger.classList.contains('open') ? closeDrawer() : openDrawer());
drawerClose.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
$$('a', drawer).forEach(a => a.addEventListener('click', closeDrawer));

/* ── HERO PROFILE SELECTOR ────────────────────────────────── */
const profiles = {
  construir: {
    title: 'Sua obra na<br><em>direção certa.</em>',
    sub:   'Gestão integrada, qualidade premium e total previsibilidade de custos — do diagnóstico à entrega.',
    /* ★ AJUSTE: mesma foto de obra usada no fundo padrão do hero (style.css .hero-bg) */
    bg:    'https://images.unsplash.com/photo-1609867271967-a82f85c48531?w=1800&h=1100&fit=crop&auto=format&q=80'
  },
  reformar: {
    title: 'Reforma comercial<br><em>sem parar o negócio.</em>',
    sub:   'Coordenamos toda a obra para que você continue focado na operação enquanto transformamos o seu espaço.',
    bg:    'https://images.unsplash.com/photo-1768321902380-c65dbd4df3f2?w=1400&h=900&fit=crop&auto=format'
  },
  laudo: {
    title: 'Diagnóstico técnico<br><em>preciso e confiável.</em>',
    sub:   'Laudos de patologias, estruturas e adequações normativas com documentação completa para decisões seguras.',
    bg:    'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=1400&h=900&fit=crop&auto=format'
  }
};
const heroBg    = $('#hero-bg');
const heroTitle = $('#hero-title');
const heroSub   = $('#hero-sub');
$$('.psw').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = profiles[btn.dataset.profile];
    if (!p) return;
    $$('.psw').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    [heroTitle, heroSub, heroBg].forEach(el => { el.style.transition = 'none'; el.style.opacity = '0'; });
    setTimeout(() => {
      heroTitle.innerHTML  = p.title;
      heroSub.textContent  = p.sub;
      heroBg.style.backgroundImage = `url('${p.bg}')`;
      [heroTitle, heroSub, heroBg].forEach(el => {
        el.style.transition = 'opacity .5s ease';
        el.style.opacity = '1';
      });
    }, 180);
  });
});

/* ── ANIMATED STAT COUNTERS ───────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(ease * target);
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
const statNums = $$('.stat-num');
let countersRun = false;
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersRun) {
      countersRun = true;
      statNums.forEach(animateCounter);
    }
  });
}, { threshold: .4 });
if (statNums.length) statsObs.observe(statNums[0].closest('.hero-stats'));

/* ── SERVICE FILTER ───────────────────────────────────────── */
$$('.flt').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.flt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.svc-card').forEach(card => {
      card.classList.toggle('filtered-out', f !== 'all' && card.dataset.category !== f);
    });
  });
});

/* ── SERVICE ASIDE PANEL ──────────────────────────────────── */
const services = {
  'reforma-comercial': {
    tag: 'Reforma', title: 'Reforma Comercial',
    desc: 'Revitalização completa de lojas, escritórios, restaurantes e demais espaços comerciais com gestão integrada e mínimo impacto na operação do negócio.',
    etapas: ['Vistoria técnica e diagnóstico de patologias', 'Projeto executivo e memorial descritivo', 'Cronograma físico-financeiro detalhado', 'Coordenação de equipes e fornecedores', 'Relatórios semanais de progresso', 'Entrega com garantia e acompanhamento pós-obra'],
    prazo: 'De 30 a 120 dias, conforme metragem e escopo'
  },
  implantacao: {
    tag: 'Implantação', title: 'Implantação de Negócios',
    desc: 'Transformamos uma área bruta em espaço completamente operacional, desde o projeto arquitetônico até a entrega das chaves prontas para abrir.',
    etapas: ['Diagnóstico e definição de escopo', 'Aprovação de projetos nos órgãos competentes', 'Instalações elétrica, hidráulica e HVAC', 'Acabamentos premium com padrão de marca', 'Montagem e mobiliário sob supervisão', 'Entrega operacional documentada'],
    prazo: 'De 60 a 180 dias, conforme complexidade'
  },
  laudo: {
    tag: 'Laudo', title: 'Laudo Técnico',
    desc: 'Diagnóstico especializado por engenheiros certificados para identificar patologias, não conformidades e necessidades de adequação legal.',
    etapas: ['Inspeção visual e instrumental do imóvel', 'Identificação de infiltrações, fissuras e patologias', 'Análise de conformidade normativa', 'Relatório técnico fotográfico completo', 'Recomendações de intervenção prioritária', 'Suporte para tomada de decisão'],
    prazo: 'De 5 a 15 dias úteis'
  },
  manutencao: {
    tag: 'Manutenção', title: 'Manutenção Preventiva',
    desc: 'Planos periódicos para preservar o padrão das instalações, evitar falhas e reduzir custos emergenciais ao longo do tempo.',
    etapas: ['Auditoria técnica do estado atual', 'Elaboração do Plano de Manutenção', 'Execução com equipes certificadas', 'Relatórios com registro fotográfico', 'Atendimento a emergências com SLA garantido', 'Revisão anual do plano'],
    prazo: 'Contratos mensais, trimestrais ou anuais'
  },
  fachada: {
    tag: 'Fachada', title: 'Revitalização de Fachada',
    desc: 'Renovação visual externa que reforça a identidade da marca, melhora a percepção do cliente e aumenta o valor percebido do espaço.',
    etapas: ['Análise do projeto de identidade visual', 'Proposta de materiais e acabamentos premium', 'Restauração ou troca de revestimentos', 'Pintura, ACM, vidro ou granito conforme projeto', 'Iluminação de fachada (luminotécnica)', 'Garantia de acabamento e impermeabilização'],
    prazo: 'De 15 a 60 dias conforme extensão'
  },
  aprovacao: {
    tag: 'Aprovação', title: 'Aprovação de Projetos',
    desc: 'Gestão completa do processo burocrático junto à Prefeitura, Corpo de Bombeiros, Vigilância Sanitária e demais órgãos reguladores.',
    etapas: ['Análise de viabilidade e requisitos legais', 'Elaboração de projetos para aprovação', 'Protocolo e acompanhamento junto aos órgãos', 'Gestão de pendências e adequações', 'Obtenção de licenças e alvarás', 'Entrega de documentação regularizada'],
    prazo: '30 a 120 dias, conforme órgão e município'
  }
};

const panel        = $('#service-panel');
const panelBody    = $('#panel-body');
const panelClose   = $('#panel-close');
const panelOverlay = $('#panel-overlay');


/* ★ AJUSTE: bloco do slider antes/depois removido — a seção Projetos agora é uma
   galeria de fotos (.proj-grid), então os elementos #before-after/#ba-before/#ba-handle
   não existem mais no HTML. Mantê-lo aqui quebraria o script inteiro (querySelector
   retornando null e o addEventListener seguinte lançando erro). */


/* ── CONTACT FORM ─────────────────────────────────────────── */
$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#cn').value.trim();
  const email = $('#ce').value.trim();
  const msg = $('#cm').value.trim();
  if (!name || !email || !msg) { alert('Preencha todos os campos.'); return; }
  const text = encodeURIComponent(`Olá! Me chamo ${name} (${email}) e gostaria de entrar em contato:\n\n${msg}`);
  window.open(`https://wa.me/5531999999999?text=${text}`, '_blank', 'noopener');
  e.target.reset();
});

/* ── WIZARD ───────────────────────────────────────────────── */
const panels = ['wp1','wp2','wp3','wp-ok'];
const wsteps = $$('.wstep');
const wlines = $$('.wline');
let wCurrent = 0;

function wShow(idx) {
  panels.forEach((id, i) => $('#' + id).classList.toggle('hidden', i !== idx));
  wsteps.forEach((s, i) => {
    s.classList.remove('active','done');
    if (i < idx) s.classList.add('done');
    if (i === idx) s.classList.add('active');
  });
  wlines.forEach((l, i) => l.classList.toggle('done', i < idx));
  wCurrent = idx;
}
const wGet = name => { const r = document.querySelector(`input[name="${name}"]:checked`); return r ? r.value : null; };

/* ★ AJUSTE: estimativa ao vivo — o diferencial pedido pelo cliente para a seção
   de orçamento. Faixas de R$/m² são valores de referência de mercado para obra
   comercial; ajustar conforme o histórico real da Velo quando disponível. */
const ESTIMATE_RATES = {
  'Reforma Comercial':        { min: 1200, max: 2200 }, // R$/m²
  'Implantação de Negócio':   { min: 1800, max: 3200 }, // R$/m²
  'Revitalização de Fachada': { min: 650,  max: 1300 }  // R$/m²
};
const LAUDO_RANGE = { min: 1800, max: 4500 }; // valor fechado (não é por m²)
const METRO_AREA = {
  'Até 100 m²':      80,
  '100 a 300 m²':    200,
  '300 a 600 m²':    450,
  'Acima de 600 m²': 750
};
const DEFAULT_AREA = 200; // "chute" inicial usado antes de a metragem ser informada

function formatBRL(valor) {
  const mil = Math.round(valor / 1000);
  return `R$ ${mil.toLocaleString('pt-BR')} mil`;
}

const oeValue = $('#oe-value');
const oeNote  = $('#oe-note');

function updateEstimate() {
  if (!oeValue) return; // painel só existe na seção de orçamento
  const tipo  = wGet('tipo');
  const metro = wGet('metro');
  const prazo = wGet('prazo');

  if (!tipo) {
    oeValue.textContent = 'Escolha o tipo de obra para começar';
    oeNote.textContent  = 'Valor referencial, sujeito a vistoria técnica.';
    return;
  }

  if (tipo === 'Laudo Técnico') {
    oeValue.textContent = `${formatBRL(LAUDO_RANGE.min)} – ${formatBRL(LAUDO_RANGE.max)}`;
    oeNote.textContent  = 'Valor fechado por diagnóstico — não depende da metragem.';
  } else {
    const rate = ESTIMATE_RATES[tipo];
    const area = METRO_AREA[metro] || DEFAULT_AREA;
    oeValue.textContent = `${formatBRL(rate.min * area)} – ${formatBRL(rate.max * area)}`;
    oeNote.textContent  = metro
      ? 'Valor referencial, sujeito a vistoria técnica.'
      : 'Estimativa inicial — informe a metragem para refinar.';
  }

  if (prazo === 'Urgente (até 30 dias)') {
    oeNote.textContent += ' Prazo urgente pode acrescentar taxa de agilização.';
  }
}

// atualiza a cada escolha, sem esperar o clique em "Próximo" — é o que dá a
// sensação de resposta imediata
$$('input[name="tipo"], input[name="metro"], input[name="prazo"]').forEach(input => {
  input.addEventListener('change', updateEstimate);
});

$('#wn1').addEventListener('click', () => { if (!wGet('tipo'))  { alert('Selecione o tipo de obra.'); return; } wShow(1); });
$('#wn2').addEventListener('click', () => { if (!wGet('metro')) { alert('Selecione a metragem.');    return; } wShow(2); });
$('#wb2').addEventListener('click', () => wShow(0));
$('#wb3').addEventListener('click', () => wShow(1));
$('#wsend').addEventListener('click', () => {
  const tipo   = wGet('tipo');
  const metro  = wGet('metro');
  const prazo  = wGet('prazo');
  const nome   = $('#wname').value.trim() || 'Cliente';
  if (!tipo)  { alert('Selecione o tipo de obra.'); return; }
  if (!metro) { alert('Selecione a metragem.');    return; }
  if (!prazo) { alert('Selecione o prazo.');       return; }
  const msg = encodeURIComponent(
    `Olá! Sou ${nome} e gostaria de um orçamento.\n\n` +
    `🏗 *Tipo:* ${tipo}\n📐 *Metragem:* ${metro}\n📅 *Prazo:* ${prazo}\n\n` +
    `Simulação pelo site da Velo Engenharia.`
  );
  window.open(`https://wa.me/5531999999999?text=${msg}`, '_blank', 'noopener');
  wShow(3);
});
$('#wrestart').addEventListener('click', () => {
  $$('input[type="radio"]').forEach(r => r.checked = false);
  $('#wname').value = '';
  wShow(0);
  updateEstimate(); // ★ AJUSTE: volta o painel de estimativa ao estado inicial
});
wShow(0);
updateEstimate(); // ★ AJUSTE: estado inicial do painel de estimativa ao carregar a página

/* ── SMOOTH SCROLL ────────────────────────────────────────── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const t = $(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  closeDrawer();
  const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 72;
  window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - hh - 8, behavior: 'smooth' });
});

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: .1, rootMargin: '0px 0px -32px 0px' });

$$('.reveal').forEach((el, i) => {
  const parent = el.parentElement;
  const siblings = [...parent.querySelectorAll('.reveal')];
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = idx * 70 + 'ms';
  obs.observe(el);
});

/* ── ACTIVE NAV LINK ──────────────────────────────────────── */
const sections = $$('section[id]');
const navLinks = $$('.nav-desktop a');
window.addEventListener('scroll', () => {
  const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 72;
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - hh - 60) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === '#' + current));
}, { passive: true });