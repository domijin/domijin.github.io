# Rethinking Digital Advertising: From Guesswork to User Engagement

*Medium · AdTech & ML Systems · October 2024 — By Domi Jin*

Traditional digital advertising often relies on guessing user needs based on incomplete data. Instead, we should focus on understanding users through interactive engagement, creating a more refined and dynamic ad delivery system.

<figure class="diagram-figure">
  <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Closed-Loop Interactive Ad Delivery and Profile Distillation Architecture">
    <defs>
      <marker id="arrow-ra" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2980b9"/>
      </marker>
    </defs>
    <rect width="760" height="280" rx="10" fill="#f8fafc"/>
    <text x="380" y="26" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13.5" font-weight="700" fill="#0f172a">CLOSED-LOOP INTERACTIVE AD DELIVERY &amp; PROFILE DISTILLATION ARCHITECTURE</text>
    <rect x="18" y="48" width="166" height="176" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="18" y="48" width="166" height="28" rx="8" fill="#e0f2fe"/>
    <text x="101" y="66" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#0369a1">1. INTERACTIVE AD UNIT</text>
    <text x="30" y="96" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• In-Slot “Shuffle” UI</text>
    <text x="36" y="112" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">User swaps non-resonant ad</text>
    <text x="30" y="136" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• Polls &amp; Carousels</text>
    <text x="36" y="152" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Rich micro-interactions</text>
    <rect x="28" y="188" width="146" height="24" rx="4" fill="#dcfce7"/>
    <text x="101" y="204" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="600" fill="#166534">+Positive Sample Rate</text>
    <line x1="184" y1="136" x2="204" y2="136" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-ra)"/>
    <rect x="208" y="48" width="166" height="176" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="208" y="48" width="166" height="28" rx="8" fill="#e0f2fe"/>
    <text x="291" y="66" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#0369a1">2. FUNNEL STATE LABELS</text>
    <text x="220" y="96" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• Multi-Stage Intent</text>
    <text x="226" y="112" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Awareness → Interest →</text>
    <text x="226" y="126" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Consideration → Conversion</text>
    <text x="220" y="150" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• Real-Time Feature Store</text>
    <text x="226" y="166" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Session + historical signals</text>
    <rect x="218" y="188" width="146" height="24" rx="4" fill="#f1f5f9"/>
    <text x="291" y="204" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="#475569">Granular State Tracking</text>
    <line x1="374" y1="136" x2="394" y2="136" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-ra)"/>
    <rect x="398" y="48" width="166" height="176" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect x="398" y="48" width="166" height="28" rx="8" fill="#0284c7"/>
    <text x="481" y="66" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#ffffff">3. PROFILE DISTILLATION</text>
    <text x="410" y="96" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• Layered Interest Graph</text>
    <text x="416" y="112" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Workday vs. weekend context</text>
    <text x="410" y="136" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• Compact Transformers</text>
    <text x="416" y="152" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Distills behavior to embeddings</text>
    <rect x="408" y="188" width="146" height="24" rx="4" fill="#e0f2fe"/>
    <text x="481" y="204" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="600" fill="#0369a1">Reusable User Moat</text>
    <line x1="564" y1="136" x2="584" y2="136" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-ra)"/>
    <rect x="588" y="48" width="154" height="176" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="588" y="48" width="154" height="28" rx="8" fill="#e0f2fe"/>
    <text x="665" y="66" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="700" fill="#0369a1">4. GENAI + UGC SERVING</text>
    <text x="600" y="96" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• GenAI Variants</text>
    <text x="606" y="112" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Explainers, specs &amp; stories</text>
    <text x="600" y="136" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#1e293b">• Creator Ecosystem API</text>
    <text x="606" y="152" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" fill="#64748b">Style-matched UGC creatives</text>
    <rect x="598" y="188" width="134" height="24" rx="4" fill="#fef3c7"/>
    <text x="665" y="204" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" font-weight="600" fill="#92400e">Positive-Sum Utility</text>
    <text x="380" y="256" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11.5" fill="#475569">Replacing zero-sum click guesswork with interactive feedback loops, distilled embeddings, and adaptive creatives.</text>
  </svg>
  <figcaption>Figure 1: Closed-loop interactive ad architecture connecting in-slot user interactions (“Shuffle”, polls) to funnel-stage labeling, transformer profile distillation, and GenAI/creator candidate serving.</figcaption>
</figure>

Here are some thoughts on how to achieve that:

### 1. Increase User Interactions & Positive Sample Rate

- **Objective**: Design interactions that actively encourage users to engage with ads beyond clicks, increasing the volume of data collected per session.
- **Tactics**:
  - **Dynamic Ad Switching**: Implement a “shuffle” feature within a single ad slot to allow users to change the ad if it doesn’t resonate. Track these interactions as a proxy for content preference.
  - **Interactive Ad Units**: Create rich media formats like swipeable image carousels, quick polls, or “choose your adventure” stories to capture richer behavioral data.

### 2. Refine Intent Labels Using Marketing Funnel

- **Objective**: Move beyond simple “click or not” labels. Use refined intent labels to create a granular understanding of where users are in their journey.
- **Tactics**:
  - **User State Tracking**: Implement a multi-stage label system to track the user’s stage across **awareness, interest, consideration, and conversion**.

### 3. Expand Ad Types Using GenAI & UGC

- **Objective**: Use generative AI and creator-generated content to diversify ad styles, ensuring there’s always a relevant format for every type of user.
- **Tactics**:
  - **Ad Content Generator**: Implement a GenAI system that can auto-generate multiple ad creatives based on high-performing templates (e.g., explainer videos, parameter-based comparisons, and visual storytelling).
  - **Creator Ecosystem**: Build an API to allow third-party creators to submit branded content and automatically match it with user segments based on their style preference (e.g., educational, humorous, inspirational).

### 4. Build Detailed & Reusable User Profiles

- **Objective**: Develop detailed user profiles that can serve as a long-term competitive advantage (moat) by enhancing both targeting precision and model efficiency.
- **Tactics**:
  - **Interest Graphs**: Create a multi-layered interest graph that captures not just primary interests but also contextual and session-level nuances (e.g., “workday interest” vs. “weekend leisure interest”).
  - **Profile Distillation**: Use fine-tuning techniques to distill session-level behavior and historical data into compact embeddings, reducing the need for large-scale models.
  - **Adaptive Profiles**: Allow profiles to dynamically update based on real-time interactions and adapt targeting strategies (e.g., shifting from product-focused to lifestyle-based ads as interests evolve).

### 5. Deploy Efficient Candidate Generation Models

- **Objective**: Use distilled user profiles and session-level data to build smaller, cost-efficient models that can handle candidate generation without compromising performance.

## System Architecture & Implementation Roadmap

1. **Data Pipeline**:
   - Set up a **real-time data ingestion pipeline** to handle user feedback, engagement data, and contextual signals.
   - Use **feature stores** to maintain session-level and long-term user features.
2. **Labeling & Profile Service**:
   - Build a centralized **user state service** that maps interactions to funnel stages.
   - Implement a **profile aggregation service** that combines session data with historical data, outputting refined user embeddings.
3. **Dynamic Ad Serving**:
   - Design a **dynamic ad delivery system** that supports in-session creative switching, real-time updates, and multi-variant testing.
   - Introduce a **creative generation engine** powered by GenAI to scale up content production.
4. **Profile Distillation & Efficient Candidate Models**:
   - Use compact transformer models to distill user behavior into high-quality embeddings.
   - Deploy **multi-stage candidate generation models** with fine-tuning capabilities to minimize system footprint.

By shifting from a reactive to a proactive system, we can transform digital advertising from guesswork into a structured process of user education, engagement, and demand realization. This approach builds deeper user relationships and creates a sustainable competitive advantage for the platform.

---
*Originally published on [Medium](https://medium.com/@domijin/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced) · October 2024.*
