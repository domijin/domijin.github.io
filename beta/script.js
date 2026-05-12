const form = document.querySelector('#beta-form');
const statusEl = document.querySelector('#form-status');
const langToggle = document.querySelector('[data-lang-toggle]');

const translations = {
  en: {
    metaTitle: 'Life Hack: iMessage as Router to the Internet',
    metaDescription: 'Life Hack: iMessage as a low-bandwidth router to the internet — an HCI harness for querying agents when normal internet is limited.',
    skip: 'Skip to signup',
    brand: 'Life Hack',
    nav_router: 'Router',
    nav_harness: 'Harness',
    nav_beta: 'Beta',
    nav_signup: 'Request access',
    hero_eyebrow: 'Invite-only field demo',
    hero_title: 'Life Hack: iMessage as a router to the internet.',
    hero_subtitle: 'A tiny HCI harness for the dawn of agent interfaces: use the message pipe you already have to ask an internet-connected agent for answers when normal browsing is expensive, blocked, or unavailable.',
    hero_cta: 'Request Beta Access',
    hero_secondary: 'See the hack',
    hero_microcopy: 'Manual approval required. Experimental, low-bandwidth, and intentionally small.',
    bubble_1: 'I’m on a flight. What’s the weather when I land?',
    bubble_2: 'Landing around 6pm: 54°F, cloudy, light wind. Bring a jacket.',
    bubble_3: 'Summarize today’s AI news in 3 bullets.',
    bubble_4: '1) New model releases. 2) Agent tooling updates. 3) Policy debate around safety evals.',
    bubble_5: 'Low bandwidth in. Useful internet-shaped answer out.',
    router_eyebrow: 'The positioning',
    router_title: 'Not another chatbot. A bandwidth transformer.',
    feature_1_title: 'Plane mode internet',
    feature_1_body: 'On some flights, iMessage works without buying full Wi‑Fi. The agent turns that tiny channel into search, summaries, and practical answers.',
    feature_2_title: 'Satellite-text edge cases',
    feature_2_body: 'When cellular data is gone but text still works, the assistant can route short prompts to an internet-connected machine.',
    feature_3_title: 'Constrained I/O',
    feature_3_body: 'The interface accepts short, messy messages and returns compressed answers that fit messaging limits.',
    feature_4_title: 'Human-centered harness',
    feature_4_body: 'It treats messaging as the control surface for agents: familiar, interruptible, asynchronous, and resilient.',
    feature_5_title: 'Core hack',
    feature_5_body: 'A very limited pipe becomes more useful when the other end is an agent that can browse, reason, compress, and act.',
    harness_eyebrow: 'HCI harness',
    harness_title: 'Before neural links, the best interface may be the boring one already in your pocket.',
    harness_body: 'This beta explores iMessage as a universal command line for everyday agents: low attention, low bandwidth, works across devices, and often survives when the browser does not.',
    beta_eyebrow: 'Beta expectations',
    beta_title: 'A hack demo, not a telecom product.',
    beta_body: 'Access is invite-only for now. Every signup is reviewed manually before activation.',
    beta_li_1: 'Manual approval is required before activation.',
    beta_li_2: 'Approval and onboarding may take up to 12 hours.',
    beta_li_3: 'Availability depends on Apple/iMessage, carrier, airplane, satellite, and local network behavior.',
    beta_li_4: 'Early limitations, rough edges, latency, and occasional misses are expected.',
    beta_li_5: 'Feedback is part of the beta and helps decide what gets built next.',
    safety_eyebrow: 'Limitations and safety',
    safety_title: 'Experimental software, not emergency infrastructure.',
    safety_body: 'This service is not a replacement for 911, emergency services, medical professionals, legal professionals, financial advisors, or human caregivers. In emergencies, contact local emergency services directly.',
    signup_eyebrow: 'Request access',
    signup_title: 'Join the private beta.',
    signup_body: 'Keep this short. If approved, more setup can happen through the assistant itself.',
    privacy_title: 'Privacy and consent',
    privacy_body: 'Your signup information is used to review access, onboard you, request feedback, and improve the beta. Do not submit highly sensitive details here. This static page does not store data locally beyond form submission.',
    label_name: 'Name',
    label_imessage: 'iMessage account / phone number',
    placeholder_imessage: 'Phone number or Apple ID',
    label_email: 'Email',
    label_source: 'How did you hear about this beta?',
    label_use_case: 'What would you most likely use this for?',
    use_case_daily: 'Daily AI assistant',
    use_case_info: 'Weather / news / stock lookup',
    use_case_emergency: 'Emergency contact / escalation plan',
    use_case_productivity: 'Productivity / memory / reminders',
    use_case_family: 'Family / caregiver support',
    use_case_other: 'Other',
    label_proactive: 'Are you comfortable receiving proactive messages for onboarding, feedback, and beta improvement?',
    yes: 'Yes',
    no: 'No',
    label_note: 'What problem would you most like this assistant to solve for you?',
    optional: 'Optional',
    consent_text: 'I understand this is an invite-only beta. Access requires manual approval. I may receive a confirmation message if approved. I understand this service is experimental and should not replace emergency services, medical advice, legal advice, or financial advice.',
    submit: 'Request Beta Access',
    footer_contact: 'Founder/beta contact:',
    footer_privacy: 'Privacy note: this beta only uses signup information to review access, onboard approved users, request feedback, and improve the service.',
    footer_privacy_link: 'Read privacy note',
    footer_hosted: 'Hosted as a static GitHub Pages site.',
    validation_fix: 'Please fix the highlighted fields.',
    validation_name: 'Please enter your name.',
    validation_imessage: 'Please enter the iMessage phone number or Apple ID you want to use.',
    validation_email: 'Please enter a valid email address.',
    validation_source: 'Please share how you heard about the beta.',
    validation_use_case: 'Please choose the most likely use case.',
    validation_proactive: 'Please choose Yes or No.',
    validation_consent: 'Please confirm the beta consent statement before requesting access.',
    submitting: 'Submitting request…',
    duplicate: 'Signup already received. You do not need to submit again.',
    failed: 'Submission failed. Please check the form and try again.',
    failed_contact: 'Submission failed. Please try again later or contact Contact@domij.info.',
    success: 'Request received. If approved, you may receive a confirmation message after manual review.',
    toggle: '中文',
  },
  zh: {
    metaTitle: '通过 iMessage 与 AI 对话的窄带实验',
    metaDescription: '一个邀请制实验：在航班、野外和弱网场景里，用 iMessage 发一句话，让 Agent 替你查信息、压缩答案。',
    skip: '跳到申请表',
    brand: '窄带实验',
    nav_router: '机制',
    nav_harness: '窄带',
    nav_beta: '预期',
    nav_signup: '申请内测',
    hero_eyebrow: '邀请制实验 · 人工审核',
    hero_title: '通过 iMessage 与 AI 对话的窄带实验。',
    hero_subtitle: '有些时候，浏览器打不开，完整网络也不在场。但一条消息还发得出去。这个实验试的是：能不能把这条很窄的通道，接到一个会查信息、会压缩答案的 Agent 后面。',
    hero_cta: '申请内测',
    hero_secondary: '看机制',
    hero_microcopy: '人工审核，最多约 12 小时。实验性质，不保证随时可用、秒回或持续开通。',
    bubble_1: '我在飞机上。落地那边冷吗？',
    bubble_2: '傍晚 6 点左右 54°F，多云，风不大。带件外套。',
    bubble_3: '今天 AI 圈发生了什么？压成 3 条。',
    bubble_4: '1）新模型发布。2）Agent 工具更新。3）安全评测还在争。',
    bubble_5: '发出去的是一句话，回来的是压缩过的信息。',
    router_eyebrow: '这个实验在试什么',
    router_title: '不是让 iMessage 变快。是让另一端变聪明。',
    feature_1_title: '航班上的窄带问答',
    feature_1_body: '有些航班上，iMessage 还能发。它不是完整网络，也不总是可用。但如果消息能出去，Agent 就可以试着替你查一点信息。',
    feature_2_title: '野外和卫星短信边界',
    feature_2_body: '在某些运营商、机型和地区，短信可能通过卫星或弱网链路送达。这个实验只使用已经能发出去的消息，不承诺覆盖。',
    feature_3_title: '短输入，短输出',
    feature_3_body: '输入可以很短、很临时。输出也必须短：少寒暄，直接给能读完、能用的信息。',
    feature_4_title: '把消息线程当控制面',
    feature_4_body: '消息线程熟悉、异步、可打断。它不优雅，但在弱网里，有时候比一个完整 App 更现实。',
    feature_5_title: '核心取舍',
    feature_5_body: '带宽没有变宽。只是窄通道后面接了一个能查、能想、能压缩的 Agent。所以它适合问关键小问题，不适合刷网页。',
    harness_eyebrow: '窄带交互',
    harness_title: '先别谈未来接口。先看一条短信还能做多少事。',
    harness_body: '这个实验把 iMessage 当成 Agent 的低带宽入口。它慢、受限、依赖运营商和 Apple 的行为。但正因为限制很硬，才值得试。',
    beta_eyebrow: '先把预期说清楚',
    beta_title: '这是实验，不是电信产品。',
    beta_body: '目前只做小范围邀请制。每个申请都会人工看一眼，再决定是否开通。',
    beta_li_1: '开通前需要人工审核。',
    beta_li_2: '审核和后续说明最多可能需要约 12 小时。',
    beta_li_3: '能不能发出去，取决于 Apple/iMessage、运营商、航班、卫星短信和当地网络。',
    beta_li_4: '它可能慢、可能失败，也可能给出不完整答案。',
    beta_li_5: '如果你只是想找一个随时可用的入口，这个阶段可能不适合。',
    safety_eyebrow: '安全边界',
    safety_title: '不要把它当救命通道。',
    safety_body: '它不能替代 911、当地紧急服务、医生、律师、财务顾问或真人照护者。真遇到紧急情况，请直接联系当地紧急服务。',
    signup_eyebrow: '申请内测',
    signup_title: '提交邮箱，进入等待名单。',
    signup_body: '申请后会人工审核。通过的话，你会收到后续说明；整个过程最多可能需要约 12 小时。',
    privacy_title: '隐私与同意',
    privacy_body: '你的申请信息只用于审核、开通、收集反馈和改进这个实验。不要在这里填高度敏感信息。这个静态页面除了提交表单，不会在本地存数据。',
    label_name: '姓名',
    label_imessage: '能收 iMessage 的账号 / 手机号',
    placeholder_imessage: '手机号或 Apple ID',
    label_email: '邮箱',
    label_source: '你是怎么知道这个实验的？',
    label_use_case: '你最可能在什么场景下用它？',
    use_case_daily: '日常小问题',
    use_case_info: '天气 / 新闻 / 股票查询',
    use_case_emergency: '航班 / 野外 / 弱网下查信息',
    use_case_productivity: '提醒 / 记忆 / 简短任务',
    use_case_family: '给家人留一个低带宽入口',
    use_case_other: '其他',
    label_proactive: '你愿意接收少量用于开通、反馈和改进的主动消息吗？',
    yes: '是',
    no: '否',
    label_note: '你最想在什么场景里试它？',
    optional: '可选',
    consent_text: '我理解这是邀请制实验，需要人工审核；审核和后续说明最多可能需要约 12 小时。我也理解它不保证随时可用、秒回或持续开通，不能替代紧急服务、医疗建议、法律建议或财务建议。',
    submit: '提交申请',
    footer_contact: 'Founder / Beta 联系方式：',
    footer_privacy: '隐私说明：本实验只使用申请信息来审核访问、开通、收集反馈并改进体验。',
    footer_privacy_link: '阅读隐私说明',
    footer_hosted: '本站托管在 GitHub Pages。',
    validation_fix: '请修正高亮字段。',
    validation_name: '请输入姓名。',
    validation_imessage: '请输入你想使用的 iMessage 手机号或 Apple ID。',
    validation_email: '请输入有效邮箱。',
    validation_source: '请填写你是怎么知道这个实验的。',
    validation_use_case: '请选择一个最可能的使用场景。',
    validation_proactive: '请选择是或否。',
    validation_consent: '提交前，请确认同意声明。',
    submitting: '正在提交…',
    duplicate: '已经收到你的申请，不需要重复提交。',
    failed: '提交失败。请检查表单后重试。',
    failed_contact: '提交失败。请稍后重试，或联系 Contact@domij.info。',
    success: '申请已收到。如果通过审核，你会收到后续确认消息。',
    toggle: 'EN',
  },
};

function detectLanguage() {
  const saved = localStorage.getItem('beta-lang');
  if (saved === 'zh' || saved === 'en') return saved;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return languages.some((lang) => /^zh/i.test(lang)) ? 'zh' : 'en';
}

let currentLang = detectLanguage();

function t(key) {
  return translations[currentLang][key] || translations.en[key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('beta-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  document.title = t('metaTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('metaDescription'));
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', t('metaTitle'));
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', t('metaDescription'));
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
  if (langToggle) langToggle.textContent = t('toggle');
}

const validators = [
  {
    name: 'name',
    messageKey: 'validation_name',
    isValid: () => document.querySelector('#name').value.trim().length > 1,
  },
  {
    name: 'imessage',
    messageKey: 'validation_imessage',
    isValid: () => document.querySelector('#imessage').value.trim().length > 3,
  },
  {
    name: 'email',
    messageKey: 'validation_email',
    isValid: () => document.querySelector('#email').validity.valid && document.querySelector('#email').value.trim().length > 0,
  },
  {
    name: 'source',
    messageKey: 'validation_source',
    isValid: () => document.querySelector('#source').value.trim().length > 1,
  },
  {
    name: 'use_case',
    messageKey: 'validation_use_case',
    isValid: () => Boolean(document.querySelector('input[name="use_case"]:checked')),
  },
  {
    name: 'proactive_messages',
    messageKey: 'validation_proactive',
    isValid: () => Boolean(document.querySelector('input[name="proactive_messages"]:checked')),
  },
  {
    name: 'consent',
    messageKey: 'validation_consent',
    isValid: () => document.querySelector('#consent').checked,
  },
];

function setError(name, message = '') {
  const errorEl = document.querySelector(`#${name}-error`);
  const control = document.querySelector(`#${name}`) || document.querySelector(`[name="${name}"]`);
  if (errorEl) errorEl.textContent = message;
  const row = control?.closest('.form-row') || control?.closest('.consent-row');
  if (row) row.classList.toggle('has-error', Boolean(message));
}

function validateForm() {
  let firstInvalid = null;

  validators.forEach((validator) => {
    const valid = validator.isValid();
    setError(validator.name, valid ? '' : t(validator.messageKey));
    if (!valid && !firstInvalid) {
      firstInvalid = document.querySelector(`#${validator.name}`) || document.querySelector(`[name="${validator.name}"]`);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus({ preventScroll: false });
    return false;
  }

  return true;
}

langToggle?.addEventListener('click', () => {
  applyLanguage(currentLang === 'zh' ? 'en' : 'zh');
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = '';

  if (!validateForm()) {
    statusEl.textContent = t('validation_fix');
    return;
  }

  const action = form.getAttribute('action') || '';
  const submitButton = form.querySelector('[type="submit"]');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  statusEl.textContent = t('submitting');
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch(action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      statusEl.textContent = result.duplicate ? t('duplicate') : result.error || t('failed');
      return;
    }

    form.reset();
    statusEl.textContent = t('success');
  } catch (error) {
    statusEl.textContent = t('failed_contact');
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

applyLanguage(currentLang);
