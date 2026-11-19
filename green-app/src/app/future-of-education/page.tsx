import type { Metadata } from "next";
import "./future-of-education.css";

const basePath = process.env.NEXT_BASE_PATH ?? "";
const canonicalUrl = "https://domij.info/future-of-education/";
const title = "我对未来教育的期待 | Domi Jin";
const description =
  "开放知识，释放个体潜能；连接不同的智慧，拓展人类认知的边界。";

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

  return (
    <main lang="zh-CN" className="foe-page">
      <a className="foe-skip" href="#core-framework">
        跳到核心框架
      </a>

      <nav className="foe-topbar" aria-label="页面导航">
        <div className="foe-topbar-inner">
          <a href={homeHref}>&larr; Domi Jin 主页</a>
          <div className="foe-topbar-links">
            <a href="/articles/blog/open-learning.html?lang=zh#zh">中文全文</a>
            <a href="/articles/blog/open-learning.html" lang="en">Full essay in English</a>
          </div>
        </div>
      </nav>

      <div className="foe-main">
        <header className="foe-header">
          <p className="foe-eyebrow">开放学习 · 愿景 · Domi Jin · 2026 年 11 月</p>
          <h1>我对未来教育的期待</h1>
          <p className="foe-subtitle">开放知识，释放个体潜能；连接不同的智慧，拓展人类认知的边界。</p>
        </header>

        <article className="foe-article">
          <p>设想人类积累的知识向每个人开放。一位学生、一位刚转行的工程师、一位退休的老师，都能沿着自己的问题一直学到前沿。在那里，他可以独自做一次实验，也可以找到关心同一个问题、却有不同本领的人。</p>
          <p>公开一篇论文，只需给出一个链接。让一个人从读懂第一张图走到能质疑论文的结论，却需要长久的引导。AI 带来的机会，是让更多人以负担得起的成本得到这样的帮助，并保有选择方向的自由。</p>
          <section id="core-framework" aria-labelledby="framework-heading">
            <h2 id="framework-heading">我希望人学到什么，又怎样学</h2>
            <p>
              我设想了四门课，每门课关心一种能力。至于课怎么上，我会问同样的三个问题：学习者看得清方向吗？有机会亲自尝试、得到反馈吗？遇到困难或已有余力时，能调整难度和帮助吗？
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
                    <strong>使命感与社会责任</strong>
                    <span>有效利他</span>
                    <small>什么值得去追寻？把个人兴趣与对他人的责任连在一起</small>
                  </li>
                  <li>
                    <strong>第一性原理与未来想象</strong>
                    <span>未来思维</span>
                    <small>事情还可以有什么不同？结合对未来的设想与第一性原理推演</small>
                  </li>
                  <li>
                    <strong>沟通与协作</strong>
                    <span>设计思维</span>
                    <small>我们怎样彼此理解？说清隐含前提，听清对方的意思，把想法做出来一起看</small>
                  </li>
                  <li>
                    <strong>韧性与心智弹性</strong>
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
                      看见自己学过什么、下一步能去哪里，也能了解别人依据什么走到了不同的判断。
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
                我希望这两方面的设计能支持{" "}
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
                这是课程设计的草图。四门课可以分别尝试，每一门都用得上这三条原则。
              </figcaption>
            </figure>

          </section>

          <section id="collective-forest" aria-labelledby="forest-heading">
            <h2 id="forest-heading">同一个问题，两条来路</h2>
            <p>想象《阿凡达》中潘多拉的生命网络。如果知识也能这样探索，两个人也许会在一张星图前相遇。一个人做模拟，关心模型里漏掉了什么；另一个人做观测，知道望远镜在哪些地方看不清。他们都想知道，图上那片空白究竟意味着什么。</p>
            <p>共同的兴趣让我们相遇，不同的经历和观点让我们思考。把模型的假设和观测的限制放在一起，两个人便能设计一个各自都没想到的检验。结果若经得起别人复查，就能成为下一个人探索的起点。</p>
            <p>你手上有没有这样一个问题，已经走了一段路，却还缺少另一种眼光？</p>
            <p><a href="/articles/blog/open-learning.html?lang=zh#zh">读《开放学习》：模型、依据与验证方案</a></p>
          </section>
        </article>

        <footer className="foe-footer">
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
