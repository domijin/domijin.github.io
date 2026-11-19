import type { Metadata } from "next";
import "./future-of-education.css";

const basePath = process.env.NEXT_BASE_PATH ?? "";
const canonicalUrl = "https://domij.info/future-of-education/";
const title = "我对未来教育的期待 | Domi Jin";
const description =
  "《开放学习》的中文简述。四门拟设课程、三条学习体验原则，以及我想怎样检验学习、自主、合作、韧性与辅导成本。";

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
          <div className="foe-topbar-links">
            <a href="/articles/blog/open-learning.html?lang=zh#zh">中文全文</a>
            <a href="/articles/blog/open-learning.html" lang="en">Full essay in English</a>
          </div>
        </div>
      </nav>

      <div className="foe-main">
        <header className="foe-header">
          <p className="foe-eyebrow">《开放学习》中文简述 · Domi Jin · 2026 年 11 月</p>
          <h1>我对未来教育的期待</h1>
          <p className="foe-subtitle">
            如果一个孩子对课堂上的某个问题格外好奇，下课以后，他怎样知道还有什么可以学？走得再远些，又能在哪里遇见关心同一个问题的人？
          </p>
        </header>

        <article className="foe-article">
          <p>
            学校让人有机会接触许多原本不会自己去找的学问。我也常想，一堂课有自己的进度，每个人的疑问却来得有早有晚。能不能多给人一点引导，让他沿着自己的兴趣走深一些？《开放学习》写的就是这个还在摸索的想法。
          </p>

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
                    <small>我们怎样彼此理解？说清隐含前提，听清对方的意思，把想法做出来一起看</small>
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

          <section id="beyond-illusion" aria-labelledby="illusion-heading">
            <h2 id="illusion-heading">关上屏幕以后</h2>
            <p>
              AI 把一道题讲得很清楚，听的人一路跟得上。过几天，换一道题，还能自己把思路理出来吗？我想用这样的机会看看，一个人究竟学会了什么。对刚入门的人，一道讲清了步骤的例题也许比独自摸索更有帮助。什么时候该示范、什么时候可以放手，要看学习者已经懂得多少。
            </p>
          </section>

          <section id="collective-forest" aria-labelledby="forest-heading">
            <h2 id="forest-heading">走到同一个问题面前</h2>
            <p>
              我想到《阿凡达》里的森林。两个人从不同的小径走来，停在同一个问题面前。要是能听懂对方一路上见过什么，即使意见不同，也可能想到原先没有想到的事。AI 或许能帮忙牵线。要不要同行、愿意分享什么，仍由各人决定。一项发现是否可信，也该让大家看证据，由不得一个模型说了算。独自研究，或与人合作，都应当向没有机构身份的人敞开。
            </p>
            <p>
              复现一次实验，订正一个错误，做件别人用得上的工具，都可以是贡献。要让别人放心地接着做下去，得把依据留下来，让人能查、能问，有错也能改。
            </p>
          </section>

          <section id="testing-grounds" aria-labelledby="testing-heading">
            <h2 id="testing-heading">怎样知道有没有用</h2>
            <p>
              我想过先和十二到十四岁的孩子做一次小规模尝试。这个年龄是否合适，还要检验。我想看的有五件事：过些日子还能不能独自解新题，能不能说清自己为什么这样选，理解分歧后能不能一起把问题想得更周全，受挫后能不能调整方法，以及花同样的时间和钱能学到多少。等辅导撤去，留下来的本领才看得清。
            </p>
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading">沿着这些问题读下去</h2>
            <p>
              《开放学习》<a href="/articles/blog/open-learning.html?lang=zh#zh">中文全文</a>与
              <a href="/articles/blog/open-learning.html" lang="en">English original</a> 说明了这个设想的来由、我参考的研究和仍待核查的问题。
              <a href="/articles/blog/learning-about-learning.html?lang=zh#zh">2023 年的学习导图</a>保留了早先的阅读线索。
            </p>
            <p>
              另外两件工作各取了其中一个问题。<a href="/articles/github/open-learning-lab.html">Open Learning Lab</a> 提出一个实验，有的人先写下自己的判断，再读讲解；有的人先读讲解。过几天，两组人各自解一道新题，表现会有什么不同？
              <a href={sharedKnowledgeHref}>Two people, a wider horizon</a> 则借两位虚构的合作者，演示怎样找出分歧从哪里来。
            </p>
            <p>
              我也在<a href="/articles/substack/reclaiming-play-as-a-life-skill.html">写长者与游戏的随笔</a>里谈过成年以后还能怎样学习。往更远处想，教育和人们怎样组织知识、一道做事，也有关系。这条思路记在 <a href="/articles/github/libertyearth-and-future.html">LibertyEarth</a> 里。
            </p>
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
