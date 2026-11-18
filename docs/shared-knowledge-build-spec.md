# Shared knowledge — implementation specification

17 November 2026 · Approved implementation direction for this task.
Read with [research](shared-knowledge-research.md), [Hydrogen visual exploration](shared-knowledge-visual-spec.md) and [Hydrogen model exploration](shared-knowledge-model-spec.md). This specification resolves differences between the explorations and governs implementation. Build begins only after this document.

## Purpose and integration

Route `/shared-knowledge/`, mirrored at `/next/shared-knowledge/`. Title **Two people, a wider horizon**. Subtitle: **Common ground, different paths, a question to explore together.**

A separate, self-contained interactive essay connects Open Learning (personal learning) with the Collaborative Manifesto (shared knowledge as social infrastructure). Link from homepage Human Agency and Working Together, the Open Learning post, archive, `llms.txt`, `llms-full.txt`, `agent-context.json`, sitemap. Do not replace the existing LLM knowledge sphere, map of writings or astrophysical figures.

Opening first-person framing, grounded in the existing essays: “I see education and shared knowledge as part of the foundation of a collaborative society. What becomes possible when two people can see both their common ground and the different paths that brought them there?” Do not invent a personal recollection or a claim about a deployed educational system.

## Selected visual

Paired **schematic 2D competence maps**, with side-by-side and overlay views. Six labelled topic spokes, asymmetric illustrative familiarity contours for two fictional people. Cyan and blue, distinguished by solid/dashed strokes as well as colour. Radial values are assigned categorical levels for this example, not measurements or rankings. Position, area and outline size must not imply overall ability, worth, or a complete inventory of a mind.

Each topic is selectable with a real HTML button (minimum 44px target), updating the paired claims, assumptions, provenance and unknowns. Inline SVG is for the explanatory geometry; semantic HTML is the accessible control and reading surface. Display a concise legend. Use native-size HTML text for labels on mobile instead of shrinking a large SVG's text.

As the worked exchange progresses, draw a visible bridge between the two people, then **dashed borrowed understanding** in the relevant topic sector. Keep their solid starting competence contours unchanged: passing a single reconstruction question does not establish mastery. A joint question extends beyond their starting maps as a labelled dashed link, not a filled region of acquired knowledge. Examining a result changes the linked provisional note, not a person score.

Responsive: navy/cyan visual stage comparable in care to the wormhole explorer, readable page text, not a wall of control cards. Desktop map + contextual inspector; mobile map, topic controls, inspector in reading order. Accessible focused controls, no mandatory animation, reduced-motion support, SSR initial figure and prose, no new runtime dependency, no LLM/network inference or accounts.

## Fictional scenario and stages

Maya facilitates a neighbourhood learning group; Leo builds its learning website. Both want people to be able to practise independently. They ask why participants open a lesson but leave before trying the exercise. All people, notes and trial outcomes are invented teaching fixtures, labelled prominently. They are not field data, municipal observations or programme results.

Six topics: **Access, Feedback, Practice, Scheduling, Interfaces, Measurement**.

- Maya is familiar with participation, practice and scheduling. She uses *access* to mean having time, a usable device and conditions in which to participate.
- Leo is familiar with interfaces, instrumentation and availability. He uses *access* to mean that a resource loads and can be reached.
- Both recognise Access and Practice. That overlap initially says nothing about checked understanding, shared assumptions or agreement.
- Maya's initially unshared context: some participants use a shared phone and have short, unpredictable periods of quiet time. Provenance: fictional workshop conversations.
- Leo's initially unshared context: an “exercise opened” event records a page visit, not a completed attempt. Provenance: fictional event-schema inspection.
- Disclosure is a demonstration choice over fictional data, not a privacy system. Withholding a note is legitimate; do not blame the person or automatically expose it.

Five readable stages; navigation can preview any stage, but cannot bypass prerequisites or create state:

1. **Compare:** inspect six topics and provenance; toggle separate/overlay views. Common topics remain labelled “shared topic; meaning not yet checked”.
2. **Exchange:** explicitly share either note; explain each partner's context; choose a reconstruction of the other person's point. Wrong interpretations get precise feedback; corrected answers remain only an initial understanding. Learning is reciprocal; both perspectives remain attributable.
3. **Align on a question:** after both reconstructed points, agree on a question and a method while retaining unresolved differences. Proposed question: “Could a downloadable exercise and flexible return time help participants practise independently?” This is coordination, not agreement that an intervention works.
4. **Try and revise:** choose a hypothesis (clearer buttons alone / flexible downloadable practice) and inspect one of three explicitly synthetic follow-up scenarios (encouraging, mixed, contradicting). Evidence can weaken either hypothesis; no automatic efficacy formula. Changing hypothesis clears the chosen scenario, prior review and prepared note. Changing scenario clears the review and note. Outcomes are qualitative invented comparisons of exercise-step completion with the original lesson; there are no sample sizes or effect estimates.
5. **Contribute:** examine source, scope and remaining unknown together, then prepare a local **illustrative provisional note**. Negative and mixed findings are permitted. Nothing is actually published; note preserves both people's contributions and a next question. Reset restores every starting state and UI selection.

No “force consensus collapses intelligence” mechanism: that would introduce an unevidenced causal formula. A short readable contrast explains that shared terminology, shared question and agreement on a claim are different. No psychological percentage sliders or scalar collective-intelligence scores.

## Frozen module contract for parallel implementation

Model file: `green-app/src/lib/sharedKnowledgeModel.ts`.

```ts
export type PersonId = 'maya' | 'leo';
export type TopicId = 'access' | 'feedback' | 'practice' | 'scheduling' | 'interfaces' | 'measurement';
export type Stage = 0 | 1 | 2 | 3 | 4;
export type HypothesisId = 'buttons' | 'flexible';
export type TrialId = 'encouraging' | 'mixed' | 'contradicting';
export interface TopicView { claim: string; provenance: string; assumption: string; unknown: string; }
export interface Contribution {
  title: string; question: string; hypothesis: string; finding: string;
  scope: string; unknown: string; contributors: string[]; provenance: string[];
  status: 'Illustrative provisional note';
}
export interface SharedKnowledgeState {
  stage: Stage;
  disclosed: Record<PersonId, boolean>;
  explained: Record<PersonId, boolean>; // learner id, not explainer
  answers: Record<PersonId, string | null>;
  understood: Record<PersonId, boolean>;
  questionAligned: boolean;
  hypothesisId: HypothesisId;
  trialId: TrialId | null;
  reviewed: boolean;
  note: Contribution | null;
}
export type Action =
  | {type:'stage'; stage:Stage} | {type:'disclose'; person:PersonId}
  | {type:'explain'; learner:PersonId} | {type:'answer'; learner:PersonId; optionId:string}
  | {type:'align'} | {type:'hypothesis'; id:HypothesisId} | {type:'trial'; id:TrialId}
  | {type:'review'} | {type:'prepare'} | {type:'reset'};
export const PEOPLE: readonly {id:PersonId; name:string; role:string; levels:Record<TopicId,number>}[];
export const TOPICS: readonly {id:TopicId; label:string}[];
export const STAGES: readonly {id:Stage; label:string; description:string}[];
export const TOPIC_VIEWS: Record<TopicId, Record<PersonId, TopicView>>;
export const PRIVATE_NOTES: Record<PersonId, {summary:string; provenance:string; assumption:string; unknown:string}>;
export const CHECKS: Record<PersonId, {prompt:string; options:readonly {id:string; label:string; feedback:string}[]; correctId:string}>;
export const HYPOTHESES: readonly {id:HypothesisId; label:string; prediction:string}[];
export const TRIALS: readonly {id:TrialId; label:string; observation:string}[];
export const SHARED_QUESTION: string;
export function createInitialState(): SharedKnowledgeState;
export function transition(state:SharedKnowledgeState, action:Action):SharedKnowledgeState;
export function canExplain(state:SharedKnowledgeState, learner:PersonId):boolean;
export function canAnswer(state:SharedKnowledgeState, learner:PersonId):boolean;
export function hasGroundedExchange(state:SharedKnowledgeState):boolean;
export function canAlign(state:SharedKnowledgeState):boolean;
export function canTest(state:SharedKnowledgeState):boolean;
export function canReview(state:SharedKnowledgeState):boolean;
export function canPrepare(state:SharedKnowledgeState):boolean;
export function getSharedTopics():TopicId[]; // assigned familiarity >=2 for both, NOT alignment
export function getBorrowedTopics(state:SharedKnowledgeState, learner:PersonId):TopicId[];
export function getResult(state:SharedKnowledgeState): {finding:string; scope:string; unknown:string; status:'supported-in-example'|'mixed'|'not-supported'} | null;
```

Never mutate input state or fixtures. Explanation requires the other person's shared note. Correct answer requires explanation; getting an answer right without prerequisites has no effect. Withdrawing disclosure or changing a previously correct answer clears dependent understanding, alignment, evidence, review and note; keep unaffected starting data. Question alignment requires both initial understanding checks. Evidence requires question alignment. Review requires evidence. Preparing requires review, but NOT a supportive outcome. Repeated prepare cannot create duplicate records. Stages are purely navigation, not progress evidence. Reset produces fresh immutable baseline.

## File ownership

- Hydrogen model builder: `src/lib/sharedKnowledgeModel.ts`, `tests/sharedKnowledgeModel.test.mjs` only. At least eight meaningful invariant tests, including unsupported and mixed results as valid qualified contributions, revoked consent invalidation, inability to shortcut explanation, reset, immutable starting maps.
- Hydrogen experience builder: `src/components/SharedKnowledgeExplorer.tsx`, `src/app/shared-knowledge/page.tsx`, `src/app/shared-knowledge/shared-knowledge.css` only. Consume frozen model API; do not edit model or shared homepage. Include static explanatory reading and source links from research notes, scoped to claims actually consulted. Public text must never mention agents, prompts or implementation workflow.
- Parent: Mermaid/article/privacy corrections, homepage + discovery integration, review, rendering checks and export wrapper. Review work with Astra after build.

## Acceptance checks

- The post shows both real Mermaid-rendered SVGs, with no raw prompt record or raw Mermaid code block. Downloads are available separately; full prose remains intact.
- No private prompt phrases remain in public source/article/reader data or retained build bundles. Old clients keep valid asset references.
- New page and its first figure/explanatory text appear in both static exports. Scoped page styling does not alter existing pages. Root/staged navigation and root canonical are correct.
- Model tests enforce all invariants; actions have visible feedback; reset covers selected topic and view as well as model.
- At 320px and desktop, figure labels and controls remain legible; topics and stages work by keyboard; no autoplay; no network model loading.
- At least one reproducible interaction check traverses reveal→explain→correct/incorrect reconstruction→align→hypothesis→test→review→prepare→reset, plus a negative result path.
- Research, model assumptions and fictional content are clearly separated, with primary sources and related essays. Claim statuses remain accurate in article, UI and discovery endpoints.
