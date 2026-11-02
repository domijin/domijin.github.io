# From Traffic Lights to Life’s Direction

*Medium · Systems & Product · October 2023 — By Domi Jin*

From the bustling streets across China, I gazed at my smartphone, navigating the intricate lanes using the Chinese navigation app: Amap. What caught my attention wasn’t the familiar voice guiding me through turns, but the traffic light countdown function. I watched in amazement as the seconds ticked down, preparing me for each stop and start with remarkable accuracy.

I had often heard about China’s prowess in infrastructure development, especially its ambitious smart city initiatives. Naturally, my first thought was that this impeccable synchronization was the fruit of seamless government-enterprise cooperation, marking a new era of data integration for the welfare of its citizens. The thought was thrilling, painting a picture of a future where the lines between governance and technology blurred to create urban utopias.

However, my bubble of awe was soon pricked by a post I stumbled upon on Zhihu, China’s Quora counterpart. The post indicated that this wasn’t so much a result of comprehensive city data sharing, but more the genius of algorithmic design. While a part of me felt a pang of disappointment — the romanticized vision of a holistic government-tech partnership fading — another part couldn’t help but marvel at the sheer innovative product thinking that made such a feature possible.

Driven by curiosity, I delved into public discussions, even dissecting patents linked to the topic, hoping to demystify the workings behind the curtain. And that’s when I decided to summon my trusted digital companion, ChatGPT, to aid my mission.

With ChatGPT by my side, my jumbled thoughts soon found structure. Together, we brainstormed, dissected, and sketched out a plausible MVP system design to decode this traffic light magic. While I was fully aware that our discussion merely scratched the surface of what it takes to breathe life into such an innovation, the sense of accomplishment was undeniable.

<figure class="diagram-figure">
  <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Crowdsourced Traffic Light Phase and Countdown Inference Pipeline">
    <defs>
      <marker id="arrow-tl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2980b9"/>
      </marker>
    </defs>
    <rect width="760" height="280" rx="10" fill="#f8fafc"/>
    <text x="380" y="26" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13.5" font-weight="700" fill="#0f172a">CROWDSOURCED TRAFFIC LIGHT PHASE INFERENCE (NO MUNICIPAL API REQUIRED)</text>
    <rect x="20" y="48" width="225" height="190" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="20" y="48" width="225" height="30" rx="8" fill="#e0f2fe"/>
    <text x="132" y="68" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11.5" font-weight="700" fill="#0369a1">1. PROBE VEHICLE TRACES</text>
    <text x="34" y="98" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#166534">• Scenario 1 (Green Pass):</text>
    <text x="42" y="114" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Uninterrupted velocity v(t) across stop line</text>
    <text x="34" y="138" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#991b1b">• Scenario 2 (Red Stop Queue):</text>
    <text x="42" y="154" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Deceleration profile &amp; queue offset x_i</text>
    <text x="34" y="178" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#92400e">• Scenario 3 (Yellow Dilemma):</text>
    <text x="42" y="194" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Brake-vs-cross boundary transition</text>
    <rect x="34" y="206" width="197" height="22" rx="4" fill="#f1f5f9"/>
    <text x="132" y="221" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#475569">GPS + IMU Kinematics Stream</text>
    <line x1="245" y1="143" x2="275" y2="143" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-tl)"/>
    <rect x="280" y="48" width="215" height="190" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
    <rect x="280" y="48" width="215" height="30" rx="8" fill="#0284c7"/>
    <text x="387" y="68" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">2. CYCLE &amp; PHASE ESTIMATOR</text>
    <text x="294" y="100" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#1e293b">• Static Periodicity (T_G, T_Y, T_R)</text>
    <text x="302" y="116" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Spectral clustering of stop/start waves</text>
    <text x="294" y="142" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#1e293b">• Dynamic Time-of-Day Priors</text>
    <text x="302" y="158" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Peak-hour &amp; multi-corridor adaptation</text>
    <text x="294" y="184" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#1e293b">• Multi-Driver Aggregation</text>
    <text x="302" y="200" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Real-time phase lock at green onset t_0</text>
    <rect x="294" y="206" width="187" height="22" rx="4" fill="#e0f2fe"/>
    <text x="387" y="221" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#0369a1">Bayesian State Synchronization</text>
    <line x1="495" y1="143" x2="525" y2="143" stroke="#2980b9" stroke-width="2" marker-end="url(#arrow-tl)"/>
    <rect x="530" y="48" width="210" height="190" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect x="530" y="48" width="210" height="30" rx="8" fill="#e0f2fe"/>
    <text x="635" y="68" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11.5" font-weight="700" fill="#0369a1">3. CONFIDENCE-WEIGHTED HUD</text>
    <rect x="565" y="92" width="140" height="44" rx="22" fill="#0f172a"/>
    <circle cx="590" cy="114" r="11" fill="#ef4444"/>
    <circle cx="620" cy="114" r="11" fill="#334155"/>
    <text x="665" y="120" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" font-weight="700" fill="#f8fafc">18s</text>
    <text x="546" y="160" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="600" fill="#1e293b">• Confidence Score Badge</text>
    <text x="554" y="176" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10.5" fill="#64748b">Displays reliability from probe density</text>
    <rect x="546" y="206" width="178" height="22" rx="4" fill="#dcfce7"/>
    <text x="635" y="221" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#166534">Low-Distraction Driver UI</text>
    <text x="380" y="262" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11.5" fill="#475569">Inferring municipal infrastructure state purely from collective smartphone kinematics and ML queue modeling.</text>
  </svg>
  <figcaption>Figure 1: Crowdsourced traffic light phase and countdown inference pipeline—reconstructing signal cycles from probe vehicle kinematics (Green Pass, Red Stop Queue, and Yellow Dilemma Zone) without municipal hardware integration.</figcaption>
</figure>

Here we go (I’m planning to spend a bit more time to implement an MVP version of the algorithm; if you are interested, feel free to reach out for the full context of the prompting):

> The logic you outlined is a promising starting point for a Minimum Viable Product (MVP) traffic light cycle estimator. Let’s delve a bit deeper into its implementation and potential improvements:
>
> 1. **Determining Traffic Light Pattern:**
>    Before we can make any estimations, understanding the pattern of the traffic light is crucial. Some traffic lights may follow simple, static cycles (e.g., 60 seconds green, 20 seconds yellow, 60 seconds red), while others might be dynamically adjusted based on real-time traffic conditions.
>    - **Static Cycle Estimation:** With enough historical data, the static pattern can be estimated by just looking at how frequently users stop or pass at an intersection over time.
>    - **Dynamic Cycle Estimation:** This would be trickier and would need more data. Understanding peak traffic hours, specific days of the week, or any other pattern that could influence the dynamic change in light patterns would be beneficial.
> 2. **Traffic Light Cycle Synchronization Logic:**
>    Given the scenarios you’ve outlined *[Scenario 1: uninterrupted pass-through on green; Scenario 2: deceleration to a full stop on red; Scenario 3: approaching during the yellow transition]*, there are some clarifications and potential additions:
>    - **Yellow-Light Dilemma Zone:** For scenario 3, one might argue that a yellow light scenario can be considered, where the driver decided to stop considering they might not be able to cross during the yellow signal.
>    - **Confidence Scoring:** Introducing a ‘confidence score’ for the state estimation will be helpful. This score could be based on the number of user data points that align with a certain state and the historical accuracy of those estimations.
> 3. **User’s Position Relative to Traffic Light:**
>    As you pointed out, the position of the user relative to the traffic light plays an essential role in understanding the signal’s state. Machine learning can be leveraged here:
>    - **Data Collection:** Gather data on user speed, acceleration, and deceleration patterns as they approach traffic lights.
>    - **Training:** Use this data to train a model to predict at which position a user decided to stop. This prediction can help in understanding how long it took for them to reach the light from their stopping point, adding accuracy to the synchronization logic.
> 4. **Enhancements & Additional Data:**
>    - **Multiple Data Points:** If multiple users are approaching or are at the same traffic light, the data from all these users can be aggregated to make a more accurate estimation of the traffic light state.
>    - **Crowdsourced Feedback:** As you mentioned, integrating features similar to Waze, where users can report the current state of the traffic light, can provide direct validation and correction of the traffic light cycle estimates in real-time.
> 5. **UI/UX Considerations for the End User:**
>    - **Display Confidence:** If you’re displaying the estimated traffic light state or wait time countdown, also display the confidence level so that users understand the accuracy and reliability of the provided information.
>    - **Safety:** Ensure users are not overly distracted by the app, as they should always focus on the road. The UI should be intuitive and non-obtrusive.
>
> **Conclusion:** The MVP, with the mentioned enhancements, has the potential to significantly improve drivers’ experience at traffic lights. It’s worth noting that the success of this system greatly relies on user adoption: the more users actively use and provide feedback to the system, the more accurate and efficient it becomes. Consider partnerships with popular navigation apps or car manufacturers to integrate and scale this solution for maximum impact.

Zooming out, the world is experiencing a socio-economic shift, and we are on a path desperately searching for transformative technology like controlled nuclear fusion, bioengineering, and AGI. The globe yearns for another wave of hyper-growth. This period allowed me a chance to step back and reflect deeply. This revelation became one of the many signals steering my career recalibration after my five-year stint in the startup ecosystem.

With a renewed sense of purpose, I’m poised and eager to embrace the next five years. The recent time at Wolfram Summer School satisfied my curiosity bug around Stephen Wolfram, as well as their ChatGPT integration with symbolic computation (one of my speculations around AGI involves LLM as memory, symbolic computation as chain of thought, robotics as AI-world interface; see [All About ChatGPT](/articles/blog/all-about-chatgpt.html)). This interlude also offered a chance for introspection, aligning my ambitions with the principles of effective altruism, aiming to generate a positive societal impact. Moreover, it was a much-needed period to reconnect with my roots and family in China since the pandemic.

I look forward to journaling more insights and discoveries from this recalibrative phase.

---
*Originally published on [Medium](https://medium.com/@domijin/from-traffic-lights-to-lifes-direction-57176d5d7a06) · October 2023.*
