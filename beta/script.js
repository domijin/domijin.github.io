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
    metaTitle: 'Life Hack：把 iMessage 变成通往互联网的路由器',
    metaDescription: 'Life Hack：用 iMessage 作为低带宽互联网路由，在飞机、卫星短信和网络受限场景下向联网 Agent 查询信息。',
    skip: '跳到申请表',
    brand: 'Life Hack',
    nav_router: '路由器',
    nav_harness: '交互框架',
    nav_beta: 'Beta',
    nav_signup: '申请内测',
    hero_eyebrow: '邀请制实验 Demo',
    hero_title: 'Life Hack：把 iMessage 变成通往互联网的路由器。',
    hero_subtitle: '一个面向 Agent 时代的 HCI 小实验：当浏览器打不开、网络很贵、带宽很小的时候，用你已经拥有的短信通道，向一台联网的 Agent 要答案。',
    hero_cta: '申请 Beta 访问',
    hero_secondary: '看看这个 Hack',
    hero_microcopy: '需要人工审核。实验性、低带宽、刻意保持小规模。',
    bubble_1: '我在飞机上。落地时天气怎么样？',
    bubble_2: '大约傍晚 6 点落地：54°F，多云，微风。建议带外套。',
    bubble_3: '用 3 条总结今天的 AI 新闻。',
    bubble_4: '1）新模型发布。2）Agent 工具更新。3）围绕安全评测的政策讨论。',
    bubble_5: '输入是很窄的带宽，输出是被压缩过的互联网答案。',
    router_eyebrow: '定位',
    router_title: '不是另一个聊天机器人，而是一个带宽转换器。',
    feature_1_title: '飞机模式下的互联网',
    feature_1_body: '有些航班不买完整 Wi‑Fi 也能用 iMessage。Agent 可以把这个很小的通道变成搜索、总结和实用答案。',
    feature_2_title: '卫星短信等边缘场景',
    feature_2_body: '当蜂窝数据不可用但短信还能发时，助手可以把短提示词路由到一台真正联网的机器。',
    feature_3_title: '受限输入 / 输出',
    feature_3_body: '界面接受短、乱、碎片化的消息，并返回适合短信限制的压缩答案。',
    feature_4_title: '以人为中心的 Agent Harness',
    feature_4_body: '把消息线程当作 Agent 的控制面板：熟悉、可打断、异步，而且在弱网环境下更有韧性。',
    feature_5_title: '核心 Hack',
    feature_5_body: '当另一端接着一个会浏览、推理、压缩和执行的 Agent，一条极窄的管道会突然变得有用。',
    harness_eyebrow: 'HCI Harness',
    harness_title: '在 NeuralLink 到来之前，最好的入口可能是手机里那个无聊但可靠的消息 App。',
    harness_body: '这个 Beta 探索 iMessage 作为日常 Agent 的通用命令行：低注意力、低带宽、跨设备，并且常常在浏览器不可用时仍然可用。',
    beta_eyebrow: 'Beta 预期',
    beta_title: '这是一个 Hack Demo，不是电信产品。',
    beta_body: '目前为邀请制。每个申请都会在激活前人工审核。',
    beta_li_1: '激活前需要人工审核。',
    beta_li_2: '审核和 onboarding 最多可能需要 12 小时。',
    beta_li_3: '可用性取决于 Apple/iMessage、运营商、飞机、卫星短信和当地网络环境。',
    beta_li_4: '早期版本会有延迟、粗糙边缘、限制和偶发错误。',
    beta_li_5: '反馈是 Beta 的一部分，会决定下一步先做什么。',
    safety_eyebrow: '限制与安全',
    safety_title: '实验性软件，不是紧急基础设施。',
    safety_body: '本服务不能替代 911、紧急服务、医生、律师、财务顾问或真人照护者。遇到紧急情况，请直接联系当地紧急服务。',
    signup_eyebrow: '申请访问',
    signup_title: '加入私密 Beta。',
    signup_body: '请尽量简短。如果通过审核，后续设置可以直接在助手里完成。',
    privacy_title: '隐私与同意',
    privacy_body: '你的申请信息只用于审核访问、onboarding、收集反馈和改进 Beta。请不要在这里提交高度敏感信息。这个静态页面除了提交表单外，不会在本地存储数据。',
    label_name: '姓名',
    label_imessage: 'iMessage 账号 / 手机号',
    placeholder_imessage: '手机号或 Apple ID',
    label_email: '邮箱',
    label_source: '你是怎么知道这个 Beta 的？',
    label_use_case: '你最可能用它来做什么？',
    use_case_daily: '日常 AI 助手',
    use_case_info: '天气 / 新闻 / 股票查询',
    use_case_emergency: '紧急联系人 / 升级计划',
    use_case_productivity: '效率 / 记忆 / 提醒',
    use_case_family: '家庭 / 照护支持',
    use_case_other: '其他',
    label_proactive: '你是否愿意接收用于 onboarding、反馈和 Beta 改进的主动消息？',
    yes: '是',
    no: '否',
    label_note: '你最希望这个助手帮你解决什么问题？',
    optional: '可选',
    consent_text: '我理解这是邀请制 Beta，访问需要人工审核；如果通过审核，我可能会收到确认消息。我理解本服务仍处于实验阶段，不能替代紧急服务、医疗建议、法律建议或财务建议。',
    submit: '申请 Beta 访问',
    footer_contact: 'Founder / Beta 联系方式：',
    footer_privacy: '隐私说明：本 Beta 只使用申请信息来审核访问、onboard 已批准用户、收集反馈并改进服务。',
    footer_privacy_link: '阅读隐私说明',
    footer_hosted: '本站托管在 GitHub Pages。',
    validation_fix: '请修正高亮字段。',
    validation_name: '请输入姓名。',
    validation_imessage: '请输入你想使用的 iMessage 手机号或 Apple ID。',
    validation_email: '请输入有效邮箱。',
    validation_source: '请填写你是怎么知道这个 Beta 的。',
    validation_use_case: '请选择最可能的使用场景。',
    validation_proactive: '请选择是或否。',
    validation_consent: '申请访问前，请确认 Beta 同意声明。',
    submitting: '正在提交…',
    duplicate: '已经收到你的申请，不需要重复提交。',
    failed: '提交失败。请检查表单后重试。',
    failed_contact: '提交失败。请稍后重试，或联系 Contact@domij.info。',
    success: '申请已收到。如果通过审核，你可能会收到确认消息。',
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
