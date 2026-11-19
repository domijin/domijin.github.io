import type { Metadata } from "next";
import "./future-of-education.css";

const basePath = process.env.NEXT_BASE_PATH ?? "";
const canonicalUrl = "https://domij.info/future-of-education/";
const title = "我对未来教育的期待 | Domi Jin";
const description =
  "关于未来教育的中文简述：以个人好奇心为起点，兼顾清晰定向、主动交互与动态适配的学习体验，在证据与审视中从个人精进走向自愿协作。";

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
            <a href="/articles/blog/learning-about-learning.html?lang=zh">
              学习导图解码 (CN / EN)
            </a>
            <a href="/articles/blog/open-learning.html">Open Learning 英文草案</a>
            <a href={sharedKnowledgeHref}>共享知识交互演示</a>
          </div>
        </div>
      </nav>

      <div className="foe-main">
        <header className="foe-header">
          <p className="foe-eyebrow">开放学习与协作社会 · 个人期待</p>
          <h1>我对未来教育的期待</h1>
          <p className="foe-subtitle">
            让好奇心走到人类知识的前沿，也让彼此理解成为协作的起点。
          </p>
          <p className="foe-byline">
            Domi Jin · 2026 年 11 月 · 根据{" "}
            <a href="/articles/blog/open-learning.html">Open Learning</a>、{" "}
            <a href="/articles/blog/learning-about-learning.html?lang=zh">
              Learning about Learning 思维导图解码
            </a>{" "}
            与{" "}
            <a href="/articles/github/open-learning-lab.html">
              Open Learning Lab
            </a>{" "}
            笔记整理（属个人工作构想，非已建成的学校项目或评估结论）
          </p>
        </header>

        <article className="foe-article">
          <blockquote className="foe-quote">
            <p>知识自由获取，精进各自追寻，探索独立或协作推进。</p>
          </blockquote>

          <p>
            我一直反复在想一个问题：如果任何人都可以顺着自己的兴趣，一路走到人类知识的前沿，然后再遇见同样关心这个问题的人，教育会是什么样子？
          </p>
          <p>
            互联网已经让资料变得容易获取，AI
            也可能让通往专业领域的路径更容易看清。但<strong>听懂一段解释，不等于真正掌握；个人学会了一门本领，也还不等于形成可检验的贡献</strong>。现有的学校教育提供了必要的基础和广度，但统一的进度和有限的个性化引导，常常让许多人的潜能还没来得及展开，就已经被焦虑或标准答案磨平了。
          </p>

          <nav className="foe-toc" aria-label="本文导览">
            <a href="#core-framework">
              <b>01</b> 四项能力与三条原则
            </a>
            <a href="#beyond-illusion">
              <b>02</b> 警惕 AI 的流畅错觉
            </a>
            <a href="#collective-forest">
              <b>03</b> 彼此看见，但不设“中央大脑”
            </a>
            <a href="#testing-grounds">
              <b>04</b> 科学先于口号，并从验证开始
            </a>
          </nav>

          <section id="core-framework" aria-labelledby="framework-heading">
            <h2 id="framework-heading">一、四项核心能力，与三条学习体验原则</h2>
            <p>
              我期待的学习环境，不是把所有人送进同一条流水线，而是围绕两个相互独立的维度来设计：一端是<strong>人想要长出怎样的核心能力</strong>，另一端是<strong>学习过程本身应当带来怎样的体验</strong>。两者正交，没有上下级之分。
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
                  人的能力 · 四门并列的基础课构想（不分先后）
                </p>
                <ul className="foe-pillars">
                  <li>
                    <strong>志趣与方向</strong>
                    <span>有效利他</span>
                    <small>什么值得去追寻？把兴趣与社会责任连起来</small>
                  </li>
                  <li>
                    <strong>可能性</strong>
                    <span>未来思维</span>
                    <small>事情还可以有何不同？用第一性原理推演多种未来</small>
                  </li>
                  <li>
                    <strong>沟通与共情</strong>
                    <span>设计思维</span>
                    <small>我们如何彼此理解？讲清假设、倾听并建立共识</small>
                  </li>
                  <li>
                    <strong>韧性与复原</strong>
                    <span>积极心理学</span>
                    <small>遇到挫折或转向时，如何坚持、复原与调整</small>
                  </li>
                </ul>

                <p className="foe-axis-label foe-axis-principles">
                  由三条独立的学习体验原则同时横切四项能力
                </p>
                <ul className="foe-principles">
                  <li>
                    <strong>清晰定向（Informative）</strong>
                    <span>
                      像好游戏里的世界地图与技能树：知道自己从哪里来、现在在哪里、还可以去向何方。
                    </span>
                  </li>
                  <li>
                    <strong>主动交互（Interactive）</strong>
                    <span>
                      先自己动手尝试和判断，观察真实反馈，再对照修正，而不是直接抄走答案。
                    </span>
                  </li>
                  <li>
                    <strong>动态适配（Adaptive）</strong>
                    <span>
                      难度、提示与节奏随学习者的成长而调整，同时把选择权和节奏留在人自己手里。
                    </span>
                  </li>
                </ul>
              </div>

              <p className="foe-join">
                两维交织，共同指向两种并重的结果{" "}
                <span aria-hidden="true">&darr;</span>
              </p>

              <div className="foe-horizons">
                <div>
                  <strong>个人的扎实精进</strong>
                  <span>留得住、能独立重构、能迁移到陌生问题</span>
                </div>
                <div>
                  <strong>独立或协作的新探索</strong>
                  <span>经过证据、审视与修正后，回流公共知识</span>
                </div>
              </div>

              <figcaption id="foe-diagram-caption">
                概念工作构想图（非教学顺序或实测结果）：三条学习体验原则同时作用于四项人的核心能力，不隶属任何单一课程，共同服务于个人掌握与公共探索。
              </figcaption>
            </figure>

            <p>
              其中，我尤其看重“清晰定向”。一款好游戏之所以让人投入，往往不是因为它不停喂给玩家碎片，而是因为它给出一张<strong>可能性的地图</strong>——你看得见自己走过的路、当下拥有的技能，以及前方尚未探索的分支。现实中的许多学生，恰恰缺少这样一张属于自己的地图。
            </p>
          </section>

          <section id="beyond-illusion" aria-labelledby="illusion-heading">
            <h2 id="illusion-heading">二、把学习从“流畅错觉”里拉回来</h2>
            <p>
              在 AI 时代，学习最大的陷阱之一是<strong>流畅错觉</strong>（fluency
              illusion）：在对话框里顺着模型清晰的讲解频频点头，关掉屏幕自己面对一张白纸或真实权衡时，却发现什么也写不出来。
            </p>
            <p>
              在{" "}
              <a href="/articles/github/open-learning-lab.html">
                Open Learning Lab
              </a>{" "}
              的设计实验里，我更倾向于把顺序反过来——先让学习者自己面对约束、做出判断（judgment-first），哪怕判断是粗糙甚至错的，再去对照专家方案或参考答案。这样一来，工具就不再是替人思考的“快捷键”，而是陪你拆解问题、暴露盲区的对练伙伴。真正的标准也不在对话窗口里，而在几天之后能否独立回忆、重新推导，并迁移到没见过的新问题上。
            </p>
          </section>

          <section id="collective-forest" aria-labelledby="forest-heading">
            <h2 id="forest-heading">
              三、互相连接的知识森林，但 AI 不是“中央大脑”
            </h2>
            <p>
              我常常用电影《阿凡达》里那片互相连接的发光森林来想象学习的公共空间：每一个人的兴趣，就像林间一条逐渐亮起的路径，远处未踏足的枝桠提示着未知的领域；当你沿着自己的路线走到某个问题面前，另一位走过完全不同道路的人，也恰好来到同一个问题旁。
            </p>
            <p>
              如果彼此的出发点、经验背景与隐含假设能够被清晰地看见（我们在{" "}
              <a href={sharedKnowledgeHref}>Two people, a wider horizon</a>{" "}
              里做了一个两人知识图谱的交互演示），那么分歧就不再只是立场相撞，而更可能成为彼此理解与互补的入口。
            </p>
            <p>
              但森林只是意象，不是治理模型。<strong>AI 不是 Eywa</strong>
              ——没有任何中央智能应当替所有人决定什么值得追求，也没有任何模型可以绕过验证直接盖章真理。无论是一个人独立钻研，还是几个人自愿协作，提出的新想法都必须经过<strong>证据、同行审视与修正</strong>，才能真正汇入开放的知识公共池。
            </p>
          </section>

          <section id="testing-grounds" aria-labelledby="testing-heading">
            <h2 id="testing-heading">
              四、学习科学先于口号，并从具体的小处开始验证
            </h2>
            <p>
              好的愿景不能替代教学方法。“主动交互”也不等于让初学者漫无目的地摸索。认知科学反复提醒我们：初学阶段往往需要清晰的讲解与示范来控制认知负荷；而把知识真正留下来，靠的是提取练习、用自己的话讲给别人听、刻意练习、间隔重复，以及不被信息流切碎的专注时间。对“成长型思维”等流行概念，我也宁可保持审慎，先看证据边界。
            </p>
            <p>如果把这些想法放进一个小规模试点，我想从两个现实观察出发：</p>
            <ul className="foe-list">
              <li>
                <strong>一个可能的起步年龄（12–14 岁）</strong>
                ：这个阶段的孩子往往开始认真追问“我是谁、想成为什么样的人”。这本身是一个待检验的假设，而不是放之四海而皆准的阶段论。
              </li>
              <li>
                <strong>面向所有年龄的体面与自主</strong>：我在 Palo Alto
                通过 <em>Kin Domi</em>{" "}
                与长者相处的经验告诉我，人在任何年纪都不喜欢居高临下的“照看”或幼稚化的口吻；大家真正需要的，是有尊严的自主能力、低心理负担的好奇心，以及尊重个人判断的伙伴。
              </li>
            </ul>
            <p>
              我宁愿尽早在真实小规模的尝试里发现这套设想哪里行不通，也不愿花好几年去辩护一个看似优雅却经不起检验的模型。对未来的教育，我最朴素的期待不过两件事：<strong>让每个人都有机会找到属于自己的入口，也更容易遇见愿意一起把未知往前推一步的同行者。</strong>
            </p>
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading">延伸阅读与相关页面</h2>
            <div className="foe-links-grid">
              <a
                className="foe-link-card"
                href="/articles/blog/open-learning.html"
              >
                <strong>Open Learning（英文工作草案）</strong>
                <span>
                  四门拟议课程、三条体验原则、学习科学参考文献与待核查清单的完整英文笔记。
                </span>
              </a>
              <a className="foe-link-card" href={sharedKnowledgeHref}>
                <strong>Two people, a wider horizon</strong>
                <span>
                  交互演示：两位虚构的协作者如何对照各自的知识边界、厘清分歧来源并测试共同问题。
                </span>
              </a>
              <a
                className="foe-link-card"
                href="/articles/github/open-learning-lab.html"
              >
                <strong>Open Learning Lab</strong>
                <span>
                  研究“先判断、后对照”的 AI 对练方式是否能减少流畅错觉、提升延迟迁移效果。
                </span>
              </a>
              <a
                className="foe-link-card"
                href="/articles/github/libertyearth-and-future.html"
              >
                <strong>LibertyEarth &amp; The Future Project</strong>
                <span>
                  将教育、个人知识图谱与协作社会联系起来的长期笔记（2019–2025）。
                </span>
              </a>
              <a
                className="foe-link-card"
                href="/articles/blog/learning-about-learning.html?lang=zh"
              >
                <strong>学习的架构：Learning about Learning 思维导图解码（中文 / EN）</strong>
                <span>
                  将 2023 年 3 月 10 日 XMind 学习导图完整解码为 7 张中英文 Mermaid 图示、边界注释与全部 13 条原始参考链接，同一页面支持一键切换中文与英文。
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
