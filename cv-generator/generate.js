// CV generator — Ryan Eromosele Osagiede
// Produces 6 role-tailored CVs × (2-page portfolio + 1-page ATS) as HTML.
// Convert to PDF with Chrome headless (see convert-to-pdf.sh).

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'cvs');

const profile = {
  name: 'Ryan Eromosele Osagiede',
  location: 'Nairobi, Kenya',
  phone: '+254 758 840 248',
  email: 'ryanosagiede4@gmail.com',
  github: 'github.com/ryanreo',
  education: 'BSc Software Development — KCA University (2023 – Present, expected 2026)',
  leadership: 'St. John\u2019s Cadet Leader (2021) \u00b7 School Prefect (2020)',
  languages: 'English (Professional) \u00b7 Swahili (Native / Professional)',
  learningFocus:
    'LLM application development, AI agent orchestration, workflow automation, RAG systems, API integration, and AI-powered business process design.',
};

const projects = {
  built: {
    title: 'Social Commerce Order Support & Returns Agent',
    status: 'BUILT \u00b7 LIVE DEMO',
    repo: 'github.com/ryanreo/ecom-support',
    stack: 'n8n \u00b7 DeepSeek \u00b7 OpenClaw \u00b7 WhatsApp \u00b7 JSON store (Supabase-ready)',
    bullets: [
      'Built a WhatsApp-first AI support agent that classifies customer intent with DeepSeek and answers order-status, product, and return questions automatically from the shop\u2019s own data.',
      'Implemented a production n8n workflow (webhook \u2192 normalization \u2192 intent classification \u2192 per-intent reply branches) with full conversation logging, RMA tracking for returns, and human-escalation flags.',
      'Wired an OpenClaw skill so the WhatsApp-connected agent relays customer messages to n8n and sends the reply back in seconds.',
      'Published with architecture docs, n8n workflow export, data schema, and impact analysis \u2014 designed to cut vendor response time from hours to seconds.',
    ],
  },
  agentLab: {
    title: 'Agentic Workflow Lab \u2014 Self-Verifying AI Agents',
    status: 'BUILT \u00b7 PUBLISHED',
    repo: 'github.com/ryanreo/agentic-workflow-lab',
    stack: 'Python (zero dependencies) \u00b7 DeepSeek \u00b7 eval harness \u00b7 interactive traces',
    bullets: [
      'Built an agent engine from scratch that plans, calls tools, observes results, and self-verifies in a loop \u2014 refusing to finish until its own verifier confirms the work is done.',
      'Shipped four working agents (pipeline doctor, document extractor, deep researcher, QA agent) with a reproducible eval harness: 4/4 tasks passing on DeepSeek, measured across runs.',
      'Published interactive step-through traces so every thought, tool call, and self-check is inspectable \u2014 the observability production agent teams rely on.',
    ],
  },
  designed: [
    {
      title: 'Jua Kali Supplier Intelligence & Trust Agent',
      stack: 'n8n \u00b7 GLM-5.2 \u00b7 DeepSeek \u00b7 Supabase \u00b7 OpenClaw',
      bullets: [
        'Designed an agent that collects supplier listings from classifieds and WhatsApp, uses GLM-5.2 to flag scams and extract product/spec details, and builds a searchable supplier trust database in Supabase.',
      ],
    },
    {
      title: 'Custom Gifting & Magazine Concierge Agent',
      stack: 'n8n \u00b7 GLM-5.2 \u00b7 Supabase \u00b7 WhatsApp \u00b7 M-Pesa Daraja API',
      bullets: [
        'Designed a WhatsApp concierge that captures client gift requests, generates design briefs with GLM-5.2\u2019s long-context memory, and tracks the order from inquiry to design, payment, and delivery.',
      ],
    },
    {
      title: 'Rent Collection & Maintenance Request Agent',
      stack: 'n8n \u00b7 DeepSeek \u00b7 Supabase \u00b7 Africa\u2019s Talking \u00b7 M-Pesa Daraja API',
      bullets: [
        'Designed an SMS/USSD-first system that sends rent reminders, matches M-Pesa payments, and uses DeepSeek to categorize tenant maintenance requests into ticketed records.',
      ],
    },
    {
      title: 'Freelancer Invoice & Payment Tracker Agent',
      stack: 'n8n \u00b7 GLM-5.2 \u00b7 DeepSeek \u00b7 Gmail API \u00b7 Supabase',
      bullets: [
        'Designed an invoice assistant that detects invoices in Gmail, uses GLM-5.2 to extract amount, due date, and client details, and sends automated payment reminders.',
      ],
    },
  ],
  workflows: [
    'WhatsApp lead intake & AI-qualified follow-up workflow',
    'SME social media content generation & approval workflow',
    'Customer support knowledge-base workflow (RAG over business documents)',
    'Meeting notes & action-item summarizer workflow',
    'Expense & M-Pesa transaction categorization workflow',
  ],
};

const baseSkills = {
  automation: [
    'AI agent design & orchestration',
    'LLM-powered workflow automation (n8n)',
    'Prompt engineering & structured output parsing',
    'Intent classification & routing',
    'Retrieval-Augmented Generation (RAG)',
    'Human-in-the-loop approval workflows',
    'Error handling, retries & logging',
    'Webhooks & REST API integration',
  ],
  tools: [
    'n8n \u00b7 OpenClaw \u00b7 DeepSeek \u00b7 GLM-5.2 \u00b7 Supabase \u00b7 MySQL \u00b7 PostgreSQL',
    'WhatsApp Business API \u00b7 Twilio \u00b7 Africa\u2019s Talking \u00b7 M-Pesa Daraja API',
    'Gmail API \u00b7 Google Sheets \u00b7 Google Drive \u00b7 Telegram API \u00b7 Slack',
  ],
  dev: [
    'JavaScript / TypeScript',
    'Python',
    'Node.js',
    'HTML / CSS',
    'REST APIs & API integration',
    'Database design (relational + Supabase)',
    'Git & GitHub',
    'Debugging & testing',
    'Technical documentation',
  ],
  business: [
    'Business process mapping',
    'SME workflow analysis',
    'Customer journey design',
    'Operational cost reduction',
    'Documentation & SOP creation',
  ],
};

const roles = [
  {
    slug: 'ai-workflow-engineer',
    title: 'AI Workflow Engineer',
    altTitle: 'Automation Developer',
    file: 'AI_Workflow_Engineer',
    summary:
      'Software Development student at KCA University and AI workflow engineer who designs and builds practical AI-powered automation for Kenyan businesses using n8n, OpenClaw, DeepSeek and GLM-5.2. Focused on turning manual business processes \u2014 customer support, supplier vetting, rent collection, invoicing \u2014 into reliable automated workflows with clear logging, human approval steps, and measurable operational impact. Built and published a working WhatsApp customer-support agent \u2014 live demo (github.com/ryanreo/ecom-support) and freelances building websites.',
    skills: {
      automation: baseSkills.automation,
      tools: baseSkills.tools,
      dev: baseSkills.dev.slice(0, 5),
      business: baseSkills.business.slice(0, 3),
    },
    projectsLead: 'AI workflow automation projects',
  },
  {
    slug: 'n8n-automation-specialist',
    title: 'n8n Automation Specialist',
    altTitle: 'Workflow Automation Engineer',
    file: 'n8n_Automation_Specialist',
    summary:
      'Software Development student at KCA University specializing in n8n workflow automation. Designs end-to-end automation pipelines \u2014 webhooks, AI/LLM steps, data transformation, scheduling, and integrations with WhatsApp, Gmail, Google Sheets, and M-Pesa \u2014 with production-grade error handling and logging. Built and published a working n8n-powered customer-support agent for WhatsApp \u2014 live demo (github.com/ryanreo/ecom-support) and freelances building websites. Focused on helping Kenyan SMEs and freelancers cut manual work and respond to customers faster.',
    skills: {
      automation: [
        'n8n workflow design (webhooks, sub-workflows, error workflows)',
        'AI/LLM nodes & agent steps inside n8n',
        'Scheduling, triggers & webhook integrations',
        'Data transformation & structured output parsing',
        'Error handling, retries & observability',
        'Human-in-the-loop approval steps',
      ],
      tools: baseSkills.tools,
      dev: baseSkills.dev.slice(0, 5),
      business: baseSkills.business.slice(0, 3),
    },
    projectsLead: 'n8n automation projects',
  },
  {
    slug: 'llm-application-developer',
    title: 'LLM Application Developer',
    altTitle: 'AI Application Engineer',
    file: 'LLM_Application_Developer',
    summary:
      'Software Development student at KCA University building LLM-powered applications that solve real business problems. Hands-on with DeepSeek, GLM-5.2 and OpenAI-compatible APIs \u2014 prompt engineering, structured output parsing, intent classification, tool calling, and RAG over business documents. Built and published a working LLM-powered WhatsApp customer-support agent \u2014 live demo (github.com/ryanreo/ecom-support) and freelances building websites. Designs applications that turn unstructured business input into reliable, structured, automated outcomes.',
    skills: {
      automation: [
        'LLM integration (DeepSeek, GLM-5.2, OpenAI-compatible)',
        'Prompt engineering & system prompt design',
        'Structured output parsing & JSON schema',
        'Intent classification & routing',
        'Retrieval-Augmented Generation (RAG)',
        'Embeddings & vector search (Supabase)',
        'Tool calling & agent orchestration',
      ],
      tools: baseSkills.tools,
      dev: baseSkills.dev.slice(0, 6),
      business: baseSkills.business.slice(0, 3),
    },
    projectsLead: 'LLM application projects',
  },
  {
    slug: 'ai-automation-engineer',
    title: 'AI Automation Engineer',
    altTitle: 'AI Agent Developer',
    file: 'AI_Automation_Engineer',
    summary:
      'Software Development student at KCA University building AI agents and automation systems for Kenyan SMEs, service providers, and informal-sector businesses. Combines n8n workflow orchestration, OpenClaw agent coordination, and DeepSeek/GLM-5.2 intelligence with WhatsApp, SMS, Gmail, and M-Pesa integrations to reduce manual work and improve response times. Built and published a working AI customer-support agent \u2014 live demo (github.com/ryanreo/ecom-support) and freelances building websites.',
    skills: {
      automation: baseSkills.automation,
      tools: baseSkills.tools,
      dev: baseSkills.dev.slice(0, 5),
      business: baseSkills.business.slice(0, 3),
    },
    projectsLead: 'AI agent & automation projects',
  },
  {
    slug: 'ai-agent-developer',
    title: 'AI Agent Developer',
    altTitle: 'LLM Application Developer',
    file: 'AI_Agent_Developer',
    summary:
      'Software Development student at KCA University who designs AI agents that do real work for Kenyan businesses \u2014 answering customers, vetting suppliers, chasing invoices, managing rentals. Strong on agent architecture, intent classification, LLM orchestration (DeepSeek, GLM-5.2), RAG, and human-in-the-loop guardrails, deployed through n8n and OpenClaw. Built and published a working WhatsApp support agent \u2014 live demo (github.com/ryanreo/ecom-support), plus a self-verifying agent lab with an eval harness (github.com/ryanreo/agentic-workflow-lab).',
    leadProject: 'agentlab',
    skills: {
      automation: [
        'AI agent design & orchestration',
        'LLM integration & model routing',
        'Intent classification & conversation flows',
        'Retrieval-Augmented Generation (RAG)',
        'Memory & context management',
        'Tool calling & structured outputs',
        'Human-in-the-loop approval & escalation',
      ],
      tools: baseSkills.tools,
      dev: baseSkills.dev.slice(0, 5),
      business: baseSkills.business.slice(0, 4),
    },
    projectsLead: 'AI agent projects',
  },
  {
    slug: 'software-developer',
    title: 'Software Developer',
    altTitle: 'JavaScript / Node.js Developer',
    file: 'Software_Developer',
    summary:
      'Software Development student at KCA University with hands-on experience building web applications and AI-powered systems. Comfortable across the stack \u2014 JavaScript/TypeScript, Python, Node.js, HTML/CSS, relational databases, REST APIs, and Git \u2014 and able to ship complete features from database schema to UI. Built and published a working n8n + DeepSeek customer-support application \u2014 live demo (github.com/ryanreo/ecom-support) and freelances building websites for clients.',
    skills: {
      dev: baseSkills.dev,
      automation: baseSkills.automation.slice(0, 4),
      tools: baseSkills.tools,
      business: baseSkills.business.slice(0, 2),
    },
    projectsLead: 'Software & AI projects',
  },
];

// ---------- HTML builders ----------

const esc = (s) => s;

function header(role) {
  return `
  <div class="head">
    <h1>${profile.name}</h1>
    <div class="titlebar">${role.title} | ${role.altTitle}</div>
    <div class="contact">
      Nairobi, Kenya &nbsp;\u00b7&nbsp; ${profile.phone} &nbsp;\u00b7&nbsp; ${profile.email} &nbsp;\u00b7&nbsp; GitHub: ${profile.github}
    </div>
  </div>`;
}

function section(title, inner) {
  return `<h2>${title}</h2>${inner}`;
}

function bullets(items, cls = '') {
  return `<ul class="${cls}">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

function projectBlock(p) {
  return `
  <div class="project">
    <div class="projhead"><span class="projtitle">${esc(p.title)}</span>${p.status ? `<span class="status">${esc(p.status)}</span>` : ''}${p.repo ? `<span class="repo">${esc(p.repo)}</span>` : ''}</div>
    <div class="stack">${esc(p.stack)}</div>
    ${bullets(p.bullets)}
  </div>`;
}

function buildFull(role) {
  const s = role.skills;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 11mm 14mm 10mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 9.5pt; color: #1a1a1a; line-height: 1.36; margin: 0; }
  .head { border-bottom: 2.5px solid #0b3d6e; padding-bottom: 6px; margin-bottom: 10px; }
  h1 { font-size: 21pt; margin: 0 0 2px 0; color: #0b3d6e; letter-spacing: 0.5px; }
  .titlebar { font-size: 11.5pt; font-weight: 600; color: #333; margin-bottom: 3px; }
  .contact { font-size: 8.8pt; color: #444; }
  h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 1px; color: #0b3d6e; border-bottom: 1px solid #b9c9d8; padding-bottom: 2px; margin: 7px 0 4px 0; }
  ul { margin: 3px 0 4px 0; padding-left: 16px; }
  li { margin-bottom: 2.5px; }
  .cols { display: flex; gap: 24px; }
  .cols > div { flex: 1; }
  .project { margin-bottom: 5px; }
  .projhead { font-weight: 600; font-size: 10.2pt; }
  .status { display: inline-block; margin-left: 6px; font-size: 7.5pt; font-weight: 700; color: #fff; background: #1e7a3c; padding: 1px 6px; border-radius: 8px; vertical-align: middle; }
  .repo { display: inline-block; margin-left: 6px; font-size: 8pt; color: #0b5a9e; vertical-align: middle; }
  .stack { font-size: 8.2pt; color: #555; font-style: italic; margin: 1px 0 1px 0; }
  .skillcats { font-weight: 600; color: #0b3d6e; margin-top: 4px; }
  .one-line { margin: 2px 0; }
  .footer { margin-top: 10px; font-size: 8.4pt; color: #444; border-top: 1px solid #ccc; padding-top: 5px; }
</style></head><body>
${header(role)}
${section('Professional Summary', `<p style="margin:3px 0 4px 0">${esc(role.summary)}</p>`)}
${section('Proof of Work', `<p style="margin:3px 0 4px 0">5 AI agent prototypes focused on Kenyan business problems \u00b7 5 practical automation workflows for SMEs and freelancers \u00b7 2 published projects with live demos, GitHub repos, architecture docs, and eval results \u00b7 demo walkthroughs in progress.</p>`)}
${section('Core Skills', `
  <div class="cols">
    <div>
      <div class="skillcats">AI &amp; Automation</div>${bullets(s.automation, 'one-line')}
    </div>
    <div>
      <div class="skillcats">Software Development</div>${bullets(s.dev, 'one-line')}
    </div>
  </div>
  <div class="skillcats">Tools &amp; Platforms</div>
  ${bullets(s.tools, 'one-line')}
  <div class="skillcats">Business &amp; Product</div>
  ${bullets(s.business, 'one-line')}
`)}
${section(role.projectsLead, `
  ${role.leadProject === 'agentlab' ? projectBlock(projects.agentLab) + projectBlock(projects.built) : projectBlock(projects.built) + projectBlock(projects.agentLab)}
  ${projects.designed.map(projectBlock).join('')}
`)}
${section('Everyday Automation Workflows', bullets(projects.workflows, 'one-line'))}
${section('Software Development Background', `
  <ul>
    <li>Freelance web developer \u2014 built websites for clients end to end (design, development, deployment).</li>
    <li>Built and published a production n8n + DeepSeek application (github.com/ryanreo/ecom-support) covering webhook handling, AI integration, data persistence, and documentation.</li>
    <li>Built web-based applications using software development principles, relational database design, REST APIs, version control, and technical documentation (JavaScript/TypeScript, Python, Node.js).</li>
  </ul>
`)}
${section('Leadership', `<p style="margin:3px 0 4px 0">${esc(profile.leadership)}</p>`)}
${section('Education', `<p style="margin:3px 0 4px 0"><strong>${esc(profile.education)}</strong></p>`)}
${section('Technical Toolstack', `
  <div class="cols">
    <div><div class="skillcats">Automation Stack</div>${bullets(['n8n', 'OpenClaw', 'GLM-5.2', 'DeepSeek', 'Supabase', 'MySQL', 'PostgreSQL', 'REST APIs', 'Webhooks'], 'one-line')}</div>
    <div><div class="skillcats">Integrations</div>${bullets(['WhatsApp Business API', 'Twilio', 'Africa\u2019s Talking', 'M-Pesa Daraja API', 'Gmail API', 'Google Sheets', 'Telegram API', 'Slack'], 'one-line')}</div>
    <div><div class="skillcats">Development</div>${bullets(['Git & GitHub', 'VS Code', 'Postman', 'Node.js', 'Python', 'JavaScript / TypeScript'], 'one-line')}</div>
  </div>
`)}
${section('Languages', `<p style="margin:3px 0 4px 0">${esc(profile.languages)}</p>`)}
${section('Current Learning Focus', `<p style="margin:3px 0 4px 0">${esc(profile.learningFocus)}</p>`)}
<div class="footer">Demo videos: in progress \u00b7 GitHub: ${profile.github}</div>
</body></html>`;
}

function buildOnePage(role) {
  const s = role.skills;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 11mm 13mm 10mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 8.6pt; color: #1a1a1a; line-height: 1.34; margin: 0; }
  .head { border-bottom: 2px solid #0b3d6e; padding-bottom: 4px; margin-bottom: 7px; }
  h1 { font-size: 16pt; margin: 0 0 1px 0; color: #0b3d6e; }
  .titlebar { font-size: 9.5pt; font-weight: 600; color: #333; }
  .contact { font-size: 7.6pt; color: #444; }
  h2 { font-size: 8.8pt; text-transform: uppercase; letter-spacing: 0.8px; color: #0b3d6e; border-bottom: 1px solid #b9c9d8; padding-bottom: 1px; margin: 6px 0 3px 0; }
  ul { margin: 2px 0 3px 0; padding-left: 13px; }
  li { margin-bottom: 1.5px; }
  .project { margin-bottom: 4px; }
  .projtitle { font-weight: 600; }
  .status { font-size: 6.8pt; font-weight: 700; color: #1e7a3c; }
  .repo { font-size: 7.2pt; color: #0b5a9e; }
  .stack { font-size: 7.4pt; color: #555; font-style: italic; }
  .compact { font-size: 8pt; }
</style></head><body>
${header(role)}
${section('Summary', `<p class="compact" style="margin:2px 0 3px 0">${esc(role.summary)}</p>`)}
${section('Skills', `
  <div class="compact" style="margin:2px 0">
    <strong>AI &amp; Automation:</strong> ${s.automation.join(' \u00b7 ')}<br>
    <strong>Software Development:</strong> ${s.dev.join(' \u00b7 ')}<br>
    <strong>Tools &amp; Platforms:</strong> ${s.tools.join(' \u00b7 ')}
  </div>
`)}
${section('Selected Projects', `
  <div class="project"><span class="projtitle">${esc(projects.built.title)}</span> <span class="status">${esc(projects.built.status)}</span> <span class="repo">${esc(projects.built.repo)}</span><br>
    <span class="stack">${esc(projects.built.stack)}</span><br>
    ${esc(projects.built.bullets[0])}</div>
  <div class="project"><span class="projtitle">${esc(projects.agentLab.title)}</span> <span class="status">${esc(projects.agentLab.status)}</span> <span class="repo">${esc(projects.agentLab.repo)}</span><br>
    <span class="stack">${esc(projects.agentLab.stack)}</span><br>
    ${esc(projects.agentLab.bullets[0])}</div>
  ${projects.designed.map((p) => `<div class="project"><span class="projtitle">${esc(p.title)}</span> <span class="stack">${esc(p.stack)}</span><br>${esc(p.bullets[0])}</div>`).join('')}
`)}
${section('Automation Workflows', `<div class="compact" style="margin:2px 0">${projects.workflows.join(' \u00b7 ')}</div>`)}
${section('Experience &amp; Education', `
  <div class="compact" style="margin:2px 0">
    <strong>Freelance Web Developer</strong> \u2014 built client websites end to end.<br>
    <strong>${esc(profile.education)}</strong><br>
    ${esc(profile.leadership)}
  </div>
`)}
${section('Languages &amp; Learning', `
  <div class="compact" style="margin:2px 0">
    ${esc(profile.languages)}<br>
    <strong>Current focus:</strong> ${esc(profile.learningFocus)}
  </div>
`)}
<div class="footer" style="margin-top:6px; font-size:7.4pt; color:#444; border-top:1px solid #ccc; padding-top:3px;">GitHub: ${profile.github} \u00b7 Demo videos: in progress</div>
</body></html>`;
}

for (const role of roles) {
  const dir = path.join(OUT, role.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `Ryan_Osagiede_${role.file}_CV_2page.html`), buildFull(role));
  fs.writeFileSync(path.join(dir, `Ryan_Osagiede_${role.file}_CV_1page.html`), buildOnePage(role));
  console.log('generated', role.slug);
}
console.log('DONE -', roles.length * 2, 'HTML files');
