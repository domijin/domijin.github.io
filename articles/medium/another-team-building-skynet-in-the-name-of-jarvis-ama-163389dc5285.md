# Another team building Skynet, in the name of Jarvis — AMA

*Medium · AI & Product · November 2024 — By Domi Jin*

## Building Jarvis — AMA

> **Author’s Note:** For background: my friends and I started this venture named ThirdEar, rebranded as TwinMind later on. We released a Chrome Extension and did a launch on [Product Hunt](https://twinmind.co/ph-launch-dj). To help gain visibility and promote our branding, I wrote this up in order to do a live AMA to acquire potential users.
>
> We were ranked #2 Product of the Day, but this is just the first step of the beginning. Feel free to reach out and continue supporting the product!

**Intro:**

Hey Reddit, we’re a team of PhDs creating something we believe will fundamentally change how you interact with AI. Our project is called **Third Ear**: the first always-on, proactive AI that listens to you, understands your context, and evolves with you. Think of it as your personal Jarvis, except it’s always learning to assist you better.

### What is Third Ear and TwinMind?

**Third Ear** is our iOS app that works as an always-on AI, listening (with your permission) and building a memory of your context. **TwinMind** takes it further, providing personalized insights and real-time assistance, like an AI twin that knows your world.

We also have a **Chrome extension** that adds online context to TwinMind, creating a richer AI memory. Together, these tools help you work, communicate, and learn more effectively.

### What Problem Are We Solving?

Today’s AI is fundamentally limited because it’s generic — it doesn’t know you. Whether it’s a chatbot, an assistant, or a search engine, the experience is the same for everyone. This lack of personalization means AI can’t truly help you in the ways you need. We believe AI should be a deeply personal tool, tailored to your specific context, needs, and goals. **Third Ear** and **TwinMind** are built to solve this — giving you an AI that evolves with you, remembers what’s important to you, and proactively assists you based on what it knows about *you*.

### Why Should You Try Us?

If you’ve ever wished for an AI that feels like it’s truly yours, instead of just a generic tool, **Third Ear** and **TwinMind** are for you. We’re building an AI that helps you think, communicate, and navigate your day with the benefit of memory and context — an AI that’s always learning about you, for you. Whether you’re in meetings, browsing the web, or having important conversations, our AI is there to make sure you never miss a beat, offering support when you need it most.

### Privacy Concerns

We understand that privacy is a major concern, and we take it very seriously. Our iOS app and Chrome extension use edge models to process your information locally, meaning your data is processed directly on your device. We only connect to the cloud model when it’s absolutely necessary, and even then, we use a query rewrite to remove any personal identifiers. This ensures that the server doesn’t know anything about you, maintaining your privacy while still providing the benefits of personalized AI.

<figure class="diagram-figure">
  <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TwinMind Hybrid Edge-Cloud Privacy Architecture">
    <defs>
      <marker id="arrow-tm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2980b9"/>
      </marker>
    </defs>
    <rect width="760" height="280" rx="10" fill="#f8fafc"/>
    <text x="380" y="28" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="700" fill="#0f172a">TWINMIND / THIRD EAR: HYBRID EDGE-CLOUD PRIVACY ARCHITECTURE</text>
    <rect x="24" y="54" width="210" height="175" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="24" y="54" width="210" height="32" rx="8" fill="#e0f2fe"/>
    <text x="129" y="75" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="700" fill="#0369a1">1. MULTIMODAL CAPTURE</text>
    <text x="40" y="110" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#1e293b">• Third Ear iOS App</text>
    <text x="48" y="128" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#64748b">Permissioned ambient voice</text>
    <text x="40" y="156" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#1e293b">• Chrome Extension</text>
    <text x="48" y="174" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#64748b">Real-time browser &amp; tab context</text>
    <rect x="38" y="192" width="182" height="24" rx="4" fill="#f1f5f9"/>
    <text x="129" y="208" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#475569">Continuous Personal Stream</text>
    <line x1="234" y1="140" x2="270" y2="140" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-tm)"/>
    <rect x="276" y="54" width="216" height="175" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect x="276" y="54" width="216" height="32" rx="8" fill="#0284c7"/>
    <text x="384" y="75" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff">2. ON-DEVICE EDGE ENGINE</text>
    <text x="292" y="110" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#1e293b">• Local Memory Graph</text>
    <text x="300" y="128" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#64748b">Indexed directly on user device</text>
    <text x="292" y="156" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#1e293b">• PII Scrubber &amp; Rewriter</text>
    <text x="300" y="174" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#64748b">Strips names, IDs &amp; raw audio</text>
    <rect x="292" y="192" width="184" height="24" rx="4" fill="#dcfce7"/>
    <text x="384" y="208" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#166534">Raw data stays on device</text>
    <line x1="492" y1="140" x2="528" y2="140" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-tm)"/>
    <rect x="534" y="54" width="202" height="175" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="534" y="54" width="202" height="32" rx="8" fill="#e0f2fe"/>
    <text x="635" y="75" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="700" fill="#0369a1">3. CLOUD LLM REASONING</text>
    <text x="550" y="110" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#1e293b">• Anonymized Query</text>
    <text x="558" y="128" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#64748b">Only scrubbed prompts sent</text>
    <text x="550" y="156" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="#1e293b">• Proactive Synthesis</text>
    <text x="558" y="174" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" fill="#64748b">Real-time insights &amp; actions</text>
    <rect x="548" y="192" width="174" height="24" rx="4" fill="#fef3c7"/>
    <text x="635" y="208" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#92400e">20x lower API cost · 0 PII</text>
    <text x="380" y="256" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" fill="#475569">Platform-agnostic software memory layer that evolves with the user without compromising identity.</text>
  </svg>
  <figcaption>Figure 1: TwinMind’s hybrid edge-cloud architecture processes audio and browser streams locally, scrubbing personal identifiers before invoking cloud LLMs—reducing API costs by 20x while keeping raw context on-device.</figcaption>
</figure>

### FAQs

#### How do you make money?

We want to leverage capital to make our service free for everyone. Our hybrid approach has reduced the cost of LLM API calls by at least 20x. Additionally, we plan to build premium features on top of your AI memory, such as advanced agent functions and a potential function store.

#### Why software and not hardware?

We believe that building a truly personalized AI should be independent of hardware. The best hardware teams, like Apple, are already doing amazing things, and we see our role as creating the software layer that works across all devices. Our focus is on building an AI memory that is platform-agnostic, meaning it travels with you no matter what device or ecosystem you use.

#### Why are we focusing on B2C instead of B2B?

We believe that the power of a personalized AI like **TwinMind** is best experienced by individual users. Our mission is to empower people in their daily lives — whether it’s enhancing personal productivity, improving communication, or simply being a supportive companion. While there are B2B applications, we want to start by making a tangible difference for individuals, one person at a time.

#### Why both an iOS app and a Chrome extension?

Our iOS app provides the always-on, voice-based context building, while the Chrome extension helps **TwinMind** understand what you’re doing online. Many of our users find that having both provides a more complete experience — voice and visual context together allow the AI to understand you more fully and provide better assistance. Plus, the Chrome extension offers instant value by giving real-time insights during your online activities.

#### Can I use the Chrome extension without the iOS app?

Yes, you can use the Chrome extension independently, but keep in mind that it won’t feel as personalized at first. Over time, as you use it more, the AI will start to understand you better, building a personalized memory. It’s like training your own AI — the more you use it, the better it gets at serving *you*.

**Join the community:** Come chat with us on Discord and support our launch on [Product Hunt](https://twinmind.co/ph-launch-dj)!

---
*Originally published on [Medium](https://medium.com/@domijin/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285) · November 2024.*
