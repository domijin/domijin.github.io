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
            <p>知识敞开来，各人凭心意往深处走；走到了边界，或独往，或同行。</p>
          </blockquote>

          <p>
            这些年我反复在想一件事：倘若一个人只凭着心头那一点好奇，就能顺着前路一直往深处走，走到人类认识的边界；到那时，又恰巧能在路口遇见几个关心同一件事的人——教育会成什么模样？
          </p>
          <p>
            网线把书本与资料摆在了众人手边，AI 也让翻山越岭的门径近了许多。可世上的事往往隔着一层纸：<strong>听懂几句讲解，离真正上手还有很远；即便自己炼成了手艺，也未必就替人类添了新知</strong>。现行的学校替人打下了底子、铺开了见识，这功劳谁也抹不掉。只是大伙儿踩着同一记鼓点往前赶，走慢了心慌，顾左右又少个贴身指点的人。多少人的兴致与灵气，还没来得及舒展开，就在整齐划一的年岁里悄然熄了灯。
          </p>

          <nav className="foe-toc" aria-label="本文导览">
            <a href="#core-framework">
              <b>01</b> 四种气力与三条原则
            </a>
            <a href="#beyond-illusion">
              <b>02</b> 莫把听懂当成学会
            </a>
            <a href="#collective-forest">
              <b>03</b> 彼此照见，但不设“中央大脑”
            </a>
            <a href="#testing-grounds">
              <b>04</b> 规律先于口号，从实处试起
            </a>
          </nav>

          <section id="core-framework" aria-labelledby="framework-heading">
            <h2 id="framework-heading">一、四种人的气力，与三条学习的滋味</h2>
            <p>
              我心向往之的学堂，不是把人都送进同一条赶工的流水线，而是守住经与纬两头：一头看<strong>人要长成怎样的底色</strong>，一头看<strong>求学这回事本身该给人怎样的体会</strong>。两条线正交成网，谁也不压在谁头上。
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
                  人的气力 · 四门并列的拟设课（不分先后）
                </p>
                <ul className="foe-pillars">
                  <li>
                    <strong>志趣与担当</strong>
                    <span>有效利他</span>
                    <small>世上何事值得托付光阴？把心头所好接进人世冷暖里</small>
                  </li>
                  <li>
                    <strong>看见可能</strong>
                    <span>未来思维</span>
                    <small>若不照旧例，事情还能怎样？从根本道理重新推演前路</small>
                  </li>
                  <li>
                    <strong>相通相解</strong>
                    <span>设计思维</span>
                    <small>彼此如何真正听懂？把暗设的前提摊在明处，达成共识</small>
                  </li>
                  <li>
                    <strong>韧性与复原</strong>
                    <span>积极心理学</span>
                    <small>跌倒了或换了路，怎么接着走？认准而不死钻牛角尖</small>
                  </li>
                </ul>

                <p className="foe-axis-label foe-axis-principles">
                  三条独立的体验原则，同时织进四门课里
                </p>
                <ul className="foe-principles">
                  <li>
                    <strong>清晰定向（Informative）</strong>
                    <span>
                      像好游戏里的世界地图与技能树：走过哪几步、手头有什么本事、前方还有哪些枝桠，一眼看得真切。
                    </span>
                  </li>
                  <li>
                    <strong>主动交互（Interactive）</strong>
                    <span>
                      先自己试着迈出一脚，看世界如何回响，再对照着改，而不是直接把现成答案抄进本子里。
                    </span>
                  </li>
                  <li>
                    <strong>动态适配（Adaptive）</strong>
                    <span>
                      脚力长一分，担子便添一分；拐弯处有人搭把手，但路怎么走、步子多大，始终留给人自己拿主意。
                    </span>
                  </li>
                </ul>
              </div>

              <p className="foe-join">
                经纬交织，同指两件事{" "}
                <span aria-hidden="true">&darr;</span>
              </p>

              <div className="foe-horizons">
                <div>
                  <strong>个人的扎实精进</strong>
                  <span>隔日还记得、离了拐杖能推导、换道题也解得开</span>
                </div>
                <div>
                  <strong>独行或协作的新探索</strong>
                  <span>经过证据、同行盘问与修正后，回流成众人可用的新知</span>
                </div>
              </div>

              <figcaption id="foe-diagram-caption">
                概念工作构想图（非教学顺序，亦非实测结果）：三条学习体验原则同时作用于四种人的气力，不隶属任何单一课程，共护个人掌握与公共探索。
              </figcaption>
            </figure>

            <p>
              这三条里，我尤其挂念“清晰定向”。好游戏之所以叫人忘我，往往不在于它不停往人兜里塞零碎东西，而在于它一进门就递出一张<strong>可能性的地图</strong>——走过的路、手头的能耐、前方未踏足的林荫，清清楚楚摆在眼前。现实里许多孩子念了许多年书，恰恰少了这么一张属于自己的图。
            </p>
          </section>

          <section id="beyond-illusion" aria-labelledby="illusion-heading">
            <h2 id="illusion-heading">二、莫把屏幕前的流畅，当成真学会了</h2>
            <p>
              眼下和 AI 打交道，求学最容易踩进一个温柔的坑，叫<strong>流畅错觉</strong>（fluency
              illusion）：对着屏幕频频点头，觉得句句在理；可一旦合上盖子，面对一张白纸或一桩需要自己权衡的难事，手里却落不下墨来。
            </p>
            <p>
              在{" "}
              <a href="/articles/github/open-learning-lab.html">
                Open Learning Lab
              </a>{" "}
              的实验构想里，我想把次序倒过来——先让人自己面对约束、写下判断（judgment-first），哪怕那判断还粗糙甚至走偏，再去对照专家解法。这么一来，AI 就不再是替人省事的“快捷键”，而是陪着拆解盲区、把意思问透的对练伙伴。真本事的标准不在对话窗口里，而在几天之后，人能不能凭空把道理重新走通，用到陌生的处境里。
            </p>
          </section>

          <section id="collective-forest" aria-labelledby="forest-heading">
            <h2 id="forest-heading">
              三、互相照见的知识之林，但 AI 不是“中央大脑”
            </h2>
            <p>
              我常拿电影《阿凡达》里那片根脉相连的荧光森林来打比方：每个人的兴致，就像林间一条逐渐亮起的小径，林梢深处还垂着无人踏足的枝蔓；当你顺着自己的路走到某盏灯火前，林荫另一侧，恰巧也有人走着截然不同的山路，停在了同一个问题旁。
            </p>
            <p>
              倘若彼此的来路、阅历与暗设的前提也能摊开来读（我们在{" "}
              <a href={sharedKnowledgeHref}>Two people, a wider horizon</a>{" "}
              里做了一个两人知识图谱的交互短篇），那么分歧便不再只是两堵墙相撞，倒更像互相借光的窗口。
            </p>
            <p>
              可森林只是比喻，不是治理这世界的章法。<strong>AI 不是“圣母树（Eywa）”</strong>
              ——天底下不该有一颗居高临下的大脑，替所有人裁定人生该追寻什么，也不该替任何结论直接盖下“真理”的印章。写什么、留什么、交出什么，全由人自己拿主意；每一句论断，都要带着出处、带着留有余地的不确定性，也留着被人推翻的门缝。
            </p>
          </section>

          <section id="testing-grounds" aria-labelledby="testing-heading">
            <h2 id="testing-heading">
              四、规律先于口号，从具体的细处试起
            </h2>
            <p>
              抱负再好，不能当教法使。“主动交互”也不等于把初学者推进雾里瞎摸索。认知科学早就提醒过：新手上路，脑子经不起太重的负荷，恰恰需要先有明白如话的讲解和一步步做给你看的范例；等站稳了脚，再靠提取练习、用自己的话讲给旁人听、刻意打磨与间隔重温，护住一段不被打扰的专注光阴。至于时下流行的“成长型思维”（growth mindset）之类，学界尚多争论，我宁可先看证据的边界，不轻信万灵药。
            </p>
            <p>真要搭一个小试验场，我想先从两件贴近地面的观察试起：</p>
            <ul className="foe-list">
              <li>
                <strong>十二到十四岁的微光</strong>
                ：那年纪的少年刚抬头打量世界，心头隐约生出“我是谁、往后想成为怎样的人”这一问。当然，这只是我手头一个待检验的猜测，绝非放诸四海皆准的定论。
              </li>
              <li>
                <strong>不论年纪的体面与自主</strong>：我在 Palo Alto
                通过 <em>Kin Domi</em>{" "}
                陪长者相处久了，深知人到任何岁数，都不爱居高临下的“照看”或哄小孩似的口吻；人要的，是有尊严的自主力、低心理负担的好奇心，以及尊重自己判断的同伴。
              </li>
            </ul>
            <p>
              我宁愿趁早在真实小规模的尝试里看见这套设想哪里漏水、哪里碰壁，也不肯花好几年光阴去替一个只在纸面上好看的模型辩护。对未来的教育，我所求不过两句浅话：<strong>让想走进学问的人找得到门径，也更容易遇见愿意一道把前路往前推半步的同行者。</strong>
            </p>
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading">延伸阅读与相关页面</h2>
            <div className="foe-links-grid">
              <a
                className="foe-link-card"
                href="/articles/blog/open-learning.html?lang=zh"
              >
                <strong>开放学习：从一己潜能到众人共探（中文 / EN）</strong>
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
