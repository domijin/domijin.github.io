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
              四种核心能力可以在同一个项目里培养。学习体验另有三条原则：清晰定向，让知识、能力与观点的来路和可能方向变得清晰可见；主动交互，让尝试得到反馈；动态适配，让挑战和帮助随人调整。
            </p>

            <figure
              className="foe-figure"
              aria-labelledby="framework-heading"
            >
              <div className="foe-weave">
                <p className="foe-axis-label">四种核心能力</p>
                <ul className="foe-pillars">
                  <li>使命感与社会责任</li><li>第一性原理与未来想象</li>
                  <li>沟通与协作</li><li>韧性与心智弹性</li>
                </ul>
                <p className="foe-axis-label foe-axis-principles">三条体验原则</p>
                <ul className="foe-principles">
                  <li>清晰定向</li><li>主动交互</li><li>动态适配</li>
                </ul>
              </div>
              <p className="foe-goals-label">共同指向两个目标</p>
              <div className="foe-horizons">
                <div><strong>个人的扎实掌握</strong></div>
                <div><strong>独立或协作的新探索</strong></div>
              </div>
            </figure>

          </section>

          <section id="collective-forest" aria-labelledby="forest-heading">
            <h2 id="forest-heading">同一个问题，两条来路</h2>
            <p>想象《阿凡达》中潘多拉的生命网络。如果知识也能这样探索，两个人也许会在一张星图前相遇。一个人做模拟，关心模型里漏掉了什么；另一个人做观测，知道望远镜在哪些地方看不清。他们都想知道，图上那片空白究竟意味着什么。</p>
            <p>共同的兴趣让我们相遇，不同的经历和观点让我们思考。把模型的假设和观测的限制放在一起，两个人便能设计一个各自都没想到的检验。结果若经得起别人复查，就能成为下一个人探索的起点。</p>
            <p>我希望这样的相遇，不必只靠运气。</p>
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
