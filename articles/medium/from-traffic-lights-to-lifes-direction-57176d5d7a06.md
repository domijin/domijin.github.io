---
title: "From Traffic Lights to Life’s Direction"
author: "Domi Jin (Dongming Jin)"
date: "Tue, 10 Oct 2023 15:45:32 GMT"
source: "Medium (@domijin)"
original_url: "https://domijin.medium.com/from-traffic-lights-to-lifes-direction-57176d5d7a06"
local_html: "/articles/medium/from-traffic-lights-to-lifes-direction-57176d5d7a06.html"
---

> **Repository Mirror & Reference Copy**
> This article is archived directly in [`domijin.github.io`](https://github.com/domijin/domijin.github.io) for preservation and offline inspection.
> - **Original Publication**: [From Traffic Lights to Life’s Direction](https://domijin.medium.com/from-traffic-lights-to-lifes-direction-57176d5d7a06) (Medium (@domijin), Tue, 10 Oct 2023 15:45:32 GMT)

# From Traffic Lights to Life’s Direction

From the bustling streets cross China, I gazed at my smartphone, navigating the intricate lanes using the Chinese navigation app: Amap. What caught my attention wasn’t the familiar voice guiding me through turns, but the traffic light countdown function. I watched in amazement as the seconds ticked down, preparing me for each stop and start with remarkable accuracy.

I had often heard about China’s prowess in infrastructure development, especially its ambitious smart city initiatives. Naturally, my first thought was that this impeccable synchronization was the fruit of the seamless government-enterprise cooperation, marking a new era of data integration for the welfare of its citizens. The thought was thrilling, painting a picture of a future where the lines between governance and technology blurred to create urban utopias.

However, my bubble of awe was soon pricked by a post I stumbled upon on Zhihu, China’s Quora counterpart. The post indicated that this wasn’t so much a result of comprehensive city data sharing, but more the genius of algorithmic design. While a part of me felt a pang of disappointment — the romanticized vision of a holistic government-tech partnership fading — another part couldn’t help but marvel at the sheer innovative product thinking that made such a feature possible.

Driven by curiosity, I delved into public discussions, even dissecting patents linked to the topic, hoping to demystify the workings behind the curtain. And that’s when I decided to summon my trusted digital companion, ChatGPT, to aid my mission.

With ChatGPT by my side, my jumbled thoughts soon found structure. Together, we brainstormed, dissected, and sketched out a plausible MVP system design to decode this traffic light magic. While I was fully aware that our discussion merely scratched the surface of what it takes to breathe life into such an innovation, the sense of accomplishment was undeniable.

Here we go (I’m planning to spend a bit more time to implement a MVP version of the algorithm, if you are interested, feel free to reach out for the full context of the prompting):

> The logic you outlined is a promising starting point for a Minimum Viable Product (MVP) traffic light cycle estimator. Let’s delve a bit deeper into its implementation and potential improvements:

> **1. Determining Traffic Light Pattern:**

> Before we can make any estimations, understanding the pattern of the traffic light is crucial. Some traffic lights may follow simple, static cycles (e.g., 60 seconds green, 20 seconds yellow, 60 seconds red), while others might be dynamically adjusted based on real-time traffic conditions.

> Static Cycle Estimation: With enough historical data, the static pattern can be estimated by just looking at how frequently users stop or pass at an intersection over time.

> Dynamic Cycle Estimation: This would be trickier and would need more data. Understanding peak traffic hours, specific days of the week, or any other pattern that could influence the dynamic change in light patterns would be beneficial.

> **2. Traffic Light Cycle Synchronization Logic:**

> Given the scenarios you’ve outlined, there are some clarifications and potential additions:

> For scenario 3, one might argue that a yellow light scenario can be considered, where the driver decided to stop considering they might not be able to cross during the yellow signal.

> Introducing a ‘confidence score’ for the state estimation will be helpful. This score could be based on the number of user data points that align with a certain state and the historical accuracy of those estimations.

> **3. User’s Position Relative to Traffic Light:**

> As you pointed out, the position of the user relative to the traffic light plays an essential role in understanding the signal’s state. Machine learning can be leveraged here:

> Data Collection: Gather data on user speed, acceleration, and deceleration patterns as they approach traffic lights.

> Training: Use this data to train a model to predict at which position a user decided to stop. This prediction can help in understanding how long it took for them to reach the light from their stopping point, adding accuracy to the synchronization logic.

> **4. Enhancements & Additional Data:**

> Multiple Data Points: If multiple users are approaching or are at the same traffic light, the data from all these users can be aggregated to make a more accurate estimation of the traffic light state.

> Crowdsourced Feedback: As you mentioned, integrating features similar to Waze, where users can report the current state of the traffic light, can provide direct validation and correction of the traffic light cycle estimates in real-time.

> **5. UI/UX Considerations for the End User:**

> Display Confidence: If you’re displaying the estimated traffic light state or wait time countdown, also display the confidence level so that users understand the accuracy and reliability of the provided information.

> Safety: Ensure users are not overly distracted by the app, as they should always focus on the road. The UI should be intuitive and non-obtrusive.

> **Conclusion**:

> The MVP, with the mentioned enhancements, has the potential to significantly improve drivers’ experience at traffic lights. It’s worth noting that the success of this system greatly relies on user adoption: the more users actively use and provide feedback to the system, the more accurate and efficient it becomes. Consider partnerships with popular navigation apps or car manufacturers to integrate and scale this solution for maximum impact.

Zooming out, the world is experiencing a social economic shift, and we are on a path desperately searching for transformative technology like controlled nuclear fusion, bioengineering, and AGI. The globe yearns for another wave of hyper-growth. This period allowed me a chance to step back and reflect deeply. This revelation became one of the many signals steering my career recalibration after my five-year stint in the startup ecosystem.

With a renewed sense of purpose, I’m poised and eager to embrace the next five years. The recent time at Wolfram Summer School satisfied my curiosity bud around Stephen Wolfram, as well as their ChatGPT integration with symbolic computation (one of my speculation around AGI involves LLM as memory, symbolic computation as chain of thoughts, robotics as AI-world interface, see [https://domijin.github.io/all-about-chatgpt.html](https://domijin.github.io/all-about-chatgpt.html)). This interlude also offered a chance for introspection, aligning my ambitions with the principles of effective altruism, aiming to generate a positive societal impact. Moreover, it was a much-needed period to reconnect with my roots and family in China since pandemic.

I look forward to journaling more insights and discoveries from this recalibrative phase.
