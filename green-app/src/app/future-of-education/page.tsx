import type { Metadata } from "next";
import "./future-of-education.css";

const basePath = process.env.NEXT_BASE_PATH ?? "";
const canonicalUrl = "https://domij.info/future-of-education/";
const title = "我对未来教育的期待 | Domi Jin";
const description =
  "关于未来教育的中文简述：愿人人凭一点好奇走进学问，得见前路，亲手试错，在各自步调里长出真本事，再经由证据与同行审视，从独行走向互相成全的协作。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    locale: "zh_CN",
    type: "article",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function FutureOfEducationPage() {
  const homeHref = basePath === "" ? "/" : `${basePath}/`;
  const sharedKnowledgeHref = `${basePath}/shared-knowledge/`;

  return (
    <main lang="zh-CN" className="foe-page">
      <a className="foe-skip" href="#core-framework">
        跳到核心框架
      </a>

      <nav className="foe-topbar" aria-label="页面导航">
        <div className="foe-topbar-inner">
          <a href={homeHref}>&larr; Domi Jin 主页</a>
          <span className="foe-badge">工作构想 · 中文简述</span>
          <div className="foe-topbar-links">
            <a href="/articles/blog/open-learning.html?lang=zh">
              开放学习草案 (CN / EN)
            </a>
            <a href="/articles/blog/learning-about-learning.html?lang=zh">
              学习导图解码 (CN / EN)
            </a>
            <a href={sharedKnowledgeHref}>共享知识交互演示</a>
          </div>
        </div>
      </nav>

      <div className="foe-main">
        <header className="foe-header">
          <p className="foe-eyebrow">开放学习与协作社会 · 个人期待</p>
          <h1>我对未来教育的期待</h1>
          <p className="foe-subtitle">
            愿一点好奇，能引着普通人走到学问的前沿；也愿彼此的见识与来路，成为同行而非隔膜的起点。
          </p>
          <p className="foe-byline">
            Domi Jin · 2026 年 11 月 · 据{" "}
            <a href="/articles/blog/open-learning.html?lang=zh">
              《开放学习》（Open Learning，中 / 英）
            </a>
            、{" "}
            <a href="/articles/blog/learning-about-learning.html?lang=zh">
              《Learning about Learning》思维导图解码
            </a>{" "}
            与{" "}
            <a href="/articles/github/open-learning-lab.html">
              Open Learning Lab
            </a>{" "}
            笔记整理（属个人工作构想，非已建成的学校项目或实测结论）
          </p>
        </header>

        <article className="foe-article">
          <blockquote className="foe-quote">
            <p>知识向人敞开，各人深入自己的追寻；走到边界时，可以独行，也可以同行。</p>
          </blockquote>

          <p>
            这些年我常常在想一个问题：如果一个人能顺着自己的兴趣，一路走到人类知识的边界，然后在那里遇见同样关心这个问题的人，教育会是什么景象？
          </p>
          <p>
            互联网让信息变得容易触及，AI 也许能让通往专业领域的路更看得清。不过，<strong>听懂一段讲解并不等于真正掌握；自己练成了一门本领，也还不等于为公共知识添了新的发现</strong>。现行的学校教育给人打下了很重要的基础和广度；只是在统一的教学步调和有限的个别引导下，许多人的潜能还没来得及舒展，便渐渐淡了下去。
          </p>

          <nav className="foe-toc" aria-label="本文导览">
            <a href="#core-framework">
              <b>01</b> 四项能力与三条原则
            </a>
            <a href="#beyond-illusion">
              <b>02</b> 走出“流畅错觉”
            </a>
            <a href="#collective-forest">
              <b>03</b> 彼此照见，但不设“中央大脑”
            </a>
            <a href="#testing-grounds">
              <b>04</b> 学习科学先于口号，从实处试起
            </a>
          </nav>

          <section id="core-framework" aria-labelledby="framework-heading">
            <h2 id="framework-heading">一、人的四种能力，与三条学习的体验原则</h2>
            <p>
              我期待的学习环境，不是把所有人都送进同一条流水线，而是围绕两个彼此独立的维度展开：一端关乎<strong>人本身要长出怎样的能力</strong>，另一端关乎<strong>求学的过程应当给人怎样的体会</strong>。两条脉络互相交织，没有高低次序之分。
            </p>

            <figure
              className="foe-figure"
              aria-labelledby="foe-diagram-caption"
            >
              <div className="foe-weave">
                <div className="foe-tracks" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <p className="foe-axis-label">
                  人的能力 · 四门并列的拟设课（不分先后）
                </p>
                <ul className="foe-pillars">
                  <li>
                    <strong>志趣与方向</strong>
                    <span>有效利他</span>
                    <small>什么值得去追寻？把个人兴趣与对他人的责任连在一起</small>
                  </li>
                  <li>
                    <strong>看见可能</strong>
                    <span>未来思维</span>
                    <small>事情还可以有什么不同？结合对未来的设想与第一性原理推演</small>
                  </li>
                  <li>
                    <strong>沟通与理解</strong>
                    <span>设计思维</span>
                    <small>我们怎样彼此理解？说清隐含前提，安静倾听并建立共识</small>
                  </li>
                  <li>
                    <strong>韧性与复原</strong>
                    <span>积极心理学</span>
                    <small>遇到挫折时如何坚持、复原，并在需要时从容转向</small>
                  </li>
                </ul>

                <p className="foe-axis-label foe-axis-principles">
                  三条独立的体验原则，同时贯穿四门课程
                </p>
                <ul className="foe-principles">
                  <li>
                    <strong>清晰定向（Informative）</strong>
                    <span>
                      像好游戏里的世界地图与技能树：走过哪些路、当下有哪些本领、前方还有哪些方向，一目了然。
                    </span>
                  </li>
                  <li>
                    <strong>主动交互（Interactive）</strong>
                    <span>
                      动手尝试，看见真实世界给出的回应，再慢慢修正，而不是把现成的答案直接抄下来。
                    </span>
                  </li>
                  <li>
                    <strong>动态适配（Adaptive）</strong>
                    <span>
                      难度与支持随着人的成长一起调整，同时把选择的自主权和节奏留给学习者自己。
                    </span>
                  </li>
                </ul>
              </div>

              <p className="foe-join">
                两维交织，共同指向两种结果{" "}
                <span aria-hidden="true">&darr;</span>
              </p>

              <div className="foe-horizons">
                <div>
                  <strong>个人的扎实掌握</strong>
                  <span>隔日还记得、能够独立推演、也能迁移到陌生问题上</span>
                </div>
                <div>
                  <strong>独立或协作的新探索</strong>
                  <span>经过证据、审视与修正，回流成为众人可用的公共知识</span>
                </div>
              </div>

              <figcaption id="foe-diagram-caption">
                概念工作构想图（非教学顺序，亦非实测结果）：三条学习体验原则同时作用于人的四种基础能力，不隶属于任何单一课程，共同服务于个人掌握与公共探索。
              </figcaption>
            </figure>

            <p>
              这三条里，我尤其看重“清晰定向”。好的游戏之所以让人投入，往往不是因为它不停给出零散的提示，而是因为它一开始就递出一张<strong>可能性的地图</strong>——走过的路、手头的技能、前方还未踏足的林荫，清清楚楚摆在眼前。现实里许多学生，恰恰缺少这样一张属于自己的地图。
            </p>
          </section>

          <section id="beyond-illusion" aria-labelledby="illusion-heading">
            <h2 id="illusion-heading">二、走出屏幕前的“流畅错觉”</h2>
            <p>
              在 AI 时代，学习很容易陷入一种叫作<strong>流畅错觉</strong>（fluency
              illusion）的误区：在对话框里顺着模型清晰的讲解频频点头，等关掉屏幕、自己面对一张白纸或真实权衡时，却发现写不出多少东西。
            </p>
            <p>
              在{" "}
              <a href="/articles/github/open-learning-lab.html">
                Open Learning Lab
              </a>{" "}
              的实验构想里，我想把顺序反过来——先让学习者自己面对约束、写下判断（judgment-first），哪怕起初还粗糙甚至走偏，再去对照专家解法。这样一来，工具就不再是替人省去思考的快捷键，而是陪着拆解问题、显露盲区的对练伙伴。真正的标准不在对话窗口里，而在几天之后，人能不能独立回忆、重新推导，并把能力迁移到陌生的处境中。
            </p>
          </section>

          <section id="collective-forest" aria-labelledby="forest-heading">
            <h2 id="forest-heading">
              三、彼此照见的知识森林，但 AI 不是“中央大脑”
            </h2>
            <p>
              我常借用电影《阿凡达》里那片彼此相连的荧光森林来想象公共学习的空间：每个人的兴趣，就像林间一条渐渐亮起的小径，远处的枝桠提示着还没有人踏足的领域；当你顺着自己的路线走到一个问题面前，林荫另一侧，也许正有人走过完全不同的路径，也停在了同一个问题旁。
            </p>
            <p>
              如果彼此的来路、阅历和隐含的前提能够摊开来被人看见（我们在{" "}
              <a href={sharedKnowledgeHref}>Two people, a wider horizon</a>{" "}
              里做了一个两人知识图谱的交互短篇），那么分歧就不必停留在立场相撞，而可能成为彼此理解、互相补充的窗口。
            </p>
            <p>
              可森林终究只是比喻，不是管理的制度。<strong>AI 不是那棵统摄一切的“圣母树（Eywa）”</strong>
              ——没有任何中央智能应当替所有人决定追求什么，也没有任何模型可以绕过验证直接替结论盖下真理的印章。写什么、留什么、分享什么，都由人自己决定；每一份新提出的见解，也依然带着出处、不确定之处和接受质疑的余地。
            </p>
          </section>

          <section id="testing-grounds" aria-labelledby="testing-heading">
            <h2 id="testing-heading">
              四、学习科学先于口号，并从具体的细处试起
            </h2>
            <p>
              美好的愿望替代不了教学方法。“主动交互”也不意味着让初学者在没有指引的状况下独自摸索。认知科学早就提醒过：初学者需要清晰的讲解和一步步展开的范例，来托住有限的认知负荷；而要把知识真正留下来，靠的是提取练习、用自己的话讲给别人听、刻意练习、间隔重复，以及不被打扰的专注时光。对于时下流行的“成长型思维”（growth mindset）等概念，学界尚有许多讨论，我也更愿意保持审慎，先看证据的边界。
            </p>
            <p>如果把这些想法放进一个小范围的尝试，我想从两个贴近现实的观察出发：</p>
            <ul className="foe-list">
              <li>
                <strong>十二到十四岁的可能起点</strong>
                ：这个年纪的少年人开始渐渐问起“我是谁、想成为怎样的人”。当然，这目前只是一个待检验的猜想，并不是放之四海皆准的必然阶段。
              </li>
              <li>
                <strong>不分年龄的体面与自主</strong>：我在 Palo Alto
                通过 <em>Kin Domi</em>{" "}
                与长者相处时体会到，人在任何年纪都不喜欢居高临下的“照看”或幼稚化的口吻；大家真正需要的，是有尊严的自主能力、低心理负担的好奇心，以及尊重个人判断的同伴。
              </li>
            </ul>
            <p>
              我宁愿早一点在真实小规模的尝试里看清这套设想在哪里会碰壁，也不想花上好几年去维护一个只是听起来优雅的模型。对未来的教育，我素来的期待不过两件事：<strong>让每个想走进知识的人找得到入口，也更容易遇见愿意一同往前走的同行者。</strong>
            </p>
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading">延伸阅读与相关页面</h2>
            <div className="foe-links-grid">
              <a
                className="foe-link-card"
                href="/articles/blog/open-learning.html?lang=zh"
              >
                <strong>开放学习：从个人潜能到共同探索（中文 / EN）</strong>
                <span>
                  工作草案全文（支持同一页面一键切换中文与英文）：四门拟设课程、三条体验原则、学习科学参考文献与待核查清单。
                </span>
              </a>
              <a className="foe-link-card" href={sharedKnowledgeHref}>
                <strong>Two people, a wider horizon</strong>
                <span>
                  交互演示：两位虚构的同行者如何摊开各自的知识图谱、看清分歧从何而来，并一同推敲一个共同的问题。
                </span>
              </a>
              <a
                className="foe-link-card"
                href="/articles/github/open-learning-lab.html"
              >
                <strong>Open Learning Lab</strong>
                <span>
                  研究“先判断、后对照”的 AI 对练方式能否避开流畅错觉，让本事在合上屏幕几天后依然留得住。
                </span>
              </a>
              <a
                className="foe-link-card"
                href="/articles/github/libertyearth-and-future.html"
              >
                <strong>LibertyEarth &amp; The Future Project</strong>
                <span>
                  把教育、个人知识图谱与协作社会连在一起的长期笔记（2019–2025）。
                </span>
              </a>
              <a
                className="foe-link-card"
                href="/articles/blog/learning-about-learning.html?lang=zh"
              >
                <strong>学习的架构：Learning about Learning 思维导图解码（中文 / EN）</strong>
                <span>
                  将 2023 年 3 月 10 日 XMind 学习导图完整解码为 7 张中英文 Mermaid 图示、边界注释与全部 13 条原始参考链接，同一页面支持中英切换。
                </span>
              </a>
            </div>
          </section>
        </article>

        <footer className="foe-footer">
          <p>
            说明：本页是关于未来教育的中文简述与工作假设，整理自站内公开草案与实验笔记，不代表已建成的办学项目或实测成效。
          </p>
          <p>
            <a href={homeHref}>返回 Domi Jin 主页</a> ·{" "}
            <a href="/articles/">全部文章与笔记</a> ·{" "}
            <a href="mailto:contact@domij.info">交流想法 (contact@domij.info)</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
