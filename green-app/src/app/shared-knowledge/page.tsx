import type { Metadata } from "next";
import SharedKnowledgeExplorer from "@/components/SharedKnowledgeExplorer";
import "./shared-knowledge.css";

const basePath = process.env.NEXT_BASE_PATH ?? "/next";
const canonicalUrl = "https://domij.info/shared-knowledge/";
const title = "Two people, a wider horizon | Domi Jin";
const description =
  "An interactive essay on how two people compare schematic topic-specific competence maps, check mutual understanding without erasing differences, and test a joint question.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title,
    description,
    url: canonicalUrl,
    locale: "en_GB",
    type: "article",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function SharedKnowledgePage() {
  const homeHref = basePath === "" ? "/" : `${basePath}/`;

  return (
    <main lang="en-GB" className="sk-page">
      <a className="sk-skip" href="#explorer">
        Skip to the interactive competence maps
      </a>
      <div className="sk-container">
        <header className="sk-header">
          <a className="sk-header-brand" href={homeHref}>
            Domi Jin <span>/ Thoughts and experiments</span>
          </a>
          <div className="sk-header-links">
            <a href={`${basePath}/#human-agency`}>03 · Human Agency</a>
            <a href={`${basePath}/#working-together`}>04 · Working Together</a>
            <a href="#sources">Sources &amp; scope &darr;</a>
          </div>
        </header>

        <section className="sk-hero" aria-labelledby="sk-title">
          <p className="sk-eyebrow">
            COLLECTIVE INQUIRY &middot; AN INTERACTIVE ESSAY
          </p>
          <h1 id="sk-title">
            Two people, a wider horizon
            <span>
              Common ground, different paths, a question to explore together.
            </span>
          </h1>
          <p className="sk-hero-quote">
            I see education and shared knowledge as part of the
            foundation of a collaborative society. What becomes possible when
            two people can see both their common ground and the different paths
            that brought them there?
          </p>
        </section>

        <nav className="sk-nav" aria-label="Page sections">
          <a href="#explorer">
            <b>01</b> Competence maps
          </a>
          <a href="#states">
            <b>02</b> What changes?
          </a>
          <a href="#connections">
            <b>03</b> Related essays
          </a>
          <a href="#sources">
            <b>04</b> Sources &amp; scope
          </a>
        </nav>

        <div className="sk-fictional-banner" role="note">
          <strong>Meet Maya and Leo.</strong> She facilitates a neighbourhood
          learning group; he builds its website. Both wonder why people open a
          lesson and leave before trying the exercise. Follow their exchange
          below. The people, maps, notes and outcomes are fictional.
        </div>

        <noscript>
          <div className="sk-callout">
            JavaScript is disabled: the starting schematic competence maps,
            initial topic provenance, explanatory sections, related essays, and
            primary sources remain readable on this page. Interactive disclosure
            toggles, reconstruction checks, hypothesis trials, and local
            provisional-note preparation require JavaScript.
          </div>
        </noscript>

        <SharedKnowledgeExplorer />

        <section
          id="states"
          className="sk-section"
          aria-labelledby="states-title"
        >
          <div className="sk-section-head">
            <span className="sk-number">02</span>
            <div>
              <p className="sk-eyebrow">WHAT CHANGES THROUGH AN EXCHANGE?</p>
              <h2 id="states-title">
                Shared vocabulary is not mutual understanding
              </h2>
            </div>
          </div>

          <div className="sk-four-grid">
            <article className="sk-prose-card">
              <h3>1. Common topic</h3>
              <p>
                Maya and Leo both recognise <em>Access</em> and{" "}
                <em>Practice</em>. On a map, their contours reach working
                familiarity on the same spoke, yet Maya means time, quiet space,
                and a shared phone while Leo means a page that loads. Overlap on
                a label only marks where a check needs to happen.
              </p>
            </article>

            <article className="sk-prose-card">
              <h3>2. Understanding a perspective</h3>
              <p>
                Can I explain your point in a way you recognise? Here, each
                person tries to interpret a specific note from the other. Dashed
                marks show this borrowed context. Their starting maps stay
                unchanged: a brief exchange does not establish lasting mastery.
              </p>
            </article>

            <article className="sk-prose-card">
              <h3>3. Shared question &amp; method</h3>
              <p>
                Aligning on a question coordinates what to test next without
                forcing agreement on an answer or merging distinct experience.
                On the map, the joint frontier extends outward as a dashed
                question link—not a filled territory of settled knowledge.
              </p>
            </article>

            <article className="sk-prose-card">
              <h3>4. Examined provisional contribution</h3>
              <p>
                A contribution can report an encouraging, mixed, or
                not-supported outcome. What makes it useful to others is keeping
                its source, scope, contributors, and remaining unknown intact
                rather than polishing a claim into certainty.
              </p>
            </article>
          </div>
        </section>

        <section
          id="connections"
          className="sk-section"
          aria-labelledby="connections-title"
        >
          <div className="sk-section-head">
            <span className="sk-number">03</span>
            <div>
              <p className="sk-eyebrow">WRITINGS IN THIS COLLECTION</p>
              <h2 id="connections-title">
                Between individual learning and working together
              </h2>
            </div>
          </div>
          <p className="sk-caption">
            This interactive note sits between{" "}
            <a href={`${basePath}/#human-agency`}>03 &middot; Human Agency</a>{" "}
            and{" "}
            <a href={`${basePath}/#working-together`}>
              04 &middot; Working Together
            </a>
            , complementing the separate{" "}
            <a href={`${basePath}/knowledge/`}>
              3D language-model knowledge boundary sketch
            </a>
            . It draws on three essays in the local archive:
          </p>

          <div className="sk-essay-links">
            <a
              className="sk-essay-card"
              href="/articles/blog/open-learning.html"
            >
              <strong>
                Open Learning: From Individual Potential to Collective Discovery
              </strong>
              <span>
                Connects personal mastery and voluntary collaboration, insisting
                that the commons grows only when claims pass through evidence,
                critique, and revision.
              </span>
              <em>Read essay &rarr;</em>
            </a>

            <a
              className="sk-essay-card"
              href="/articles/blog/free-market-in-a-possibility-universe.html"
            >
              <strong>
                Free Market in a Possibility Universe &amp; The Collaborative
                Manifesto
              </strong>
              <span>
                Links inductive and deductive reasoning with building a shared
                knowledge base together rather than handing judgement to a
                central authority.
              </span>
              <em>Read essay &rarr;</em>
            </a>

            <a
              className="sk-essay-card"
              href="/articles/substack/overachievers-responsibility-reflection.html"
            >
              <strong>
                Overachiever&apos;s Responsibility: Leadership, Alignment, and
                Sustainable Growth
              </strong>
              <span>
                Uses greatest common divisor (shared principles) and least
                common multiple (complementary strengths) as a metaphor for
                alignment—not a mathematical formula for people.
              </span>
              <em>Read essay &rarr;</em>
            </a>
          </div>
        </section>

        <footer id="sources" className="sk-sources">
          <p className="sk-eyebrow">SOURCES &amp; SCOPE</p>
          <h2>What informed this example</h2>
          <p>
            Three primary works informed the questions highlighted by this
            demonstration. They motivate why explanation, unshared evidence, and
            active reconstruction are separated here; they do not validate this
            interface.
          </p>

          <ol>
            <li id="ref-clark-brennan">
              <a href="https://web.stanford.edu/~clark/1990s/Clark%2C%20H.H.%20_%20Brennan%2C%20S.E.%20_Grounding%20in%20communication_%201991.pdf">
                Clark &amp; Brennan (1991), Grounding in Communication
              </a>
              <span>
                In <em>Perspectives on Socially Shared Cognition</em>, pp.
                127&ndash;149. Examines how people coordinate content and
                process across grounding criteria and media. Shared words do
                not establish mutual understanding; a button here cannot
                establish another real person&apos;s understanding.
              </span>
            </li>

            <li id="ref-stasser-titus">
              <a href="https://www.uni-muenster.de/imperia/md/content/psyifp/aeechterhoff/vorlesungkommunikation/stasser_titus_unsharedinfogroupdisc_jpsp1985.pdf">
                Stasser &amp; Titus (1985), Pooling of Unshared Information in
                Group Decision Making
              </a>
              <span>
                <em>Journal of Personality and Social Psychology</em> 48(6),
                1467&ndash;1478. In their caucus simulation, groups often failed
                to combine unshared corrective facts and discussion favoured
                shared facts and existing preferences. Making distinctive
                evidence inspectable does not by itself resolve sampling bias or
                make every disagreement useful.
              </span>
            </li>

            <li id="ref-chi-wylie">
              <a href="https://csi.asu.edu/wp-content/uploads/2018/01/ChiWylie2014ICAP.pdf">
                Chi &amp; Wylie (2014), The ICAP Framework: Linking Cognitive
                Engagement to Active Learning Outcomes
              </a>
              <span>
                <em>Educational Psychologist</em> 49(4), 219&ndash;243 (
                <a href="https://doi.org/10.1080/00461520.2014.965823">DOI</a>).
                Differentiates modes of cognitive engagement and reviews
                learning evidence with explicit caveats. Invites active
                reconstruction rather than passive reveal—while noting that
                answering a single question here demonstrates neither durable
                learning nor mastery.
              </span>
            </li>
          </ol>

          <p className="sk-caption">
            The maps are a schematic view of a circle of competence: six topics,
            with familiarity assigned for this example. Distance and area are
            not measured scores. The interaction uses fictional material and
            prepares a note for this visit only; it does not profile people,
            assess mastery or publish their contributions.
          </p>

          <nav className="sk-footer-nav" aria-label="Footer navigation">
            <a href={homeHref}>&larr; Back to the website</a>
            <a href={`${basePath}/#human-agency`}>03 &middot; Human Agency</a>
            <a href={`${basePath}/#working-together`}>
              04 &middot; Working Together
            </a>
            <a href={`${basePath}/knowledge/`}>Knowledge boundary sketch</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
