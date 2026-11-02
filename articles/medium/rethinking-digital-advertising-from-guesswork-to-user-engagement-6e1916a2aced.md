---
title: "Rethinking Digital Advertising: From Guesswork to User Engagement"
author: "Domi Jin (Dongming Jin)"
date: "Thu, 10 Oct 2024 04:44:08 GMT"
source: "Medium (@domijin)"
original_url: "https://domijin.medium.com/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced"
local_html: "/articles/medium/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced.html"
---

> **Repository Mirror & Reference Copy**
> This article is archived directly in [`domijin.github.io`](https://github.com/domijin/domijin.github.io) for preservation and offline inspection.
> - **Original Publication**: [Rethinking Digital Advertising: From Guesswork to User Engagement](https://domijin.medium.com/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced) (Medium (@domijin), Thu, 10 Oct 2024 04:44:08 GMT)

# Rethinking Digital Advertising: From Guesswork to User Engagement

Traditional digital advertising often relies on guessing user needs based on incomplete data. Instead, we should focus on understanding users through interactive engagement, creating a more refined and dynamic ad delivery system.

Here are some thoughts on how to achieve that:

**1. Increase User Interactions & Positive Sample Rate**

• **Objective**: Design interactions that actively encourage users to engage with ads beyond clicks, increasing the volume of data collected per session.

• **Tactics**:

• **Dynamic Ad Switching**: Implement a “shuffle” feature within a single ad slot to allow users to change the ad if it doesn’t resonate. Track these interactions as a proxy for content preference.

- **Interactive Ad Units**: Create rich media formats like swipeable image carousels, quick polls, or “choose your adventure” stories to capture richer behavioral data.

**2. Refine Intent Labels Using Marketing Funnel**

• **Objective**: Move beyond simple “click or not” labels. Use refined intent labels to create a granular understanding of where users are in their journey.

• **Tactics**:

• **User State Tracking**: Implement a multi-stage label system to track the user’s stage across **awareness, interest, consideration, and conversion**.

**3. Expand Ad Types Using GenAI & UGC**

• **Objective**: Use generative AI and creator-generated content to diversify ad styles, ensuring there’s always a relevant format for every type of user.

• **Tactics**:

• **Ad Content Generator**: Implement a GenAI system that can auto-generate multiple ad creatives based on high-performing templates (e.g., explainer videos, parameter-based comparisons, and visual storytelling).

• **Creator Ecosystem**: Build an API to allow third-party creators to submit branded content and automatically match it with user segments based on their style preference (e.g., educational, humorous, inspirational).

**4. Build Detailed & Reusable User Profiles**

• **Objective**: Develop detailed user profiles that can serve as a long-term competitive advantage (moat) by enhancing both targeting precision and model efficiency.

• **Tactics**:

• **Interest Graphs**: Create a multi-layered interest graph that captures not just primary interests but also contextual and session-level nuances (e.g., “workday interest” vs. “weekend leisure interest”).

• **Profile Distillation**: Use fine-tuning techniques to distill session-level behavior and historical data into compact embeddings, reducing the need for large-scale models.

• **Adaptive Profiles**: Allow profiles to dynamically update based on real-time interactions and adapt targeting strategies (e.g., shifting from product-focused to lifestyle-based ads as interests evolve).

**5. Deploy Efficient Candidate Generation Models**

• **Objective**: Use distilled user profiles and session-level data to build smaller, cost-efficient models that can handle candidate generation without compromising performance.

**System Architecture & Implementation Roadmap**

1. **Data Pipeline**:

• Set up a **real-time data ingestion pipeline** to handle user feedback, engagement data, and contextual signals.

• Use **feature stores** to maintain session-level and long-term user features.

2. **Labeling & Profile Service**:

• Build a centralized **user state service** that maps interactions to funnel stages.

• Implement a **profile aggregation service** that combines session data with historical data, outputting refined user embeddings.

3. **Dynamic Ad Serving**:

• Design a **dynamic ad delivery system** that supports in-session creative switching, real-time updates, and multi-variant testing.

• Introduce a **creative generation engine** powered by GenAI to scale up content production.

4. **Profile Distillation & Efficient Candidate Models**:

• Use compact transformer models to distill user behavior into high-quality embeddings.

• Deploy **multi-stage candidate generation models** with fine-tuning capabilities to minimize system footprint.

By shifting from a reactive to a proactive system, we can transform digital advertising from guesswork into a structured process of user education, engagement, and demand realization. This approach builds deeper user relationships and creates a sustainable competitive advantage for the platform.
