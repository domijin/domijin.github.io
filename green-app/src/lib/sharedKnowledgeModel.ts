export type PersonId = 'maya' | 'leo';
export type TopicId = 'access' | 'feedback' | 'practice' | 'scheduling' | 'interfaces' | 'measurement';
export type Stage = 0 | 1 | 2 | 3 | 4;
export type HypothesisId = 'buttons' | 'flexible';
export type TrialId = 'encouraging' | 'mixed' | 'contradicting';

export interface TopicView {
  claim: string;
  provenance: string;
  assumption: string;
  unknown: string;
}

export interface Contribution {
  title: string;
  question: string;
  hypothesis: string;
  finding: string;
  scope: string;
  unknown: string;
  contributors: string[];
  provenance: string[];
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
  | { type: 'stage'; stage: Stage }
  | { type: 'disclose'; person: PersonId }
  | { type: 'explain'; learner: PersonId }
  | { type: 'answer'; learner: PersonId; optionId: string }
  | { type: 'align' }
  | { type: 'hypothesis'; id: HypothesisId }
  | { type: 'trial'; id: TrialId }
  | { type: 'review' }
  | { type: 'prepare' }
  | { type: 'reset' };

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.freeze(value);
    for (const key of Object.keys(value as Record<string, unknown>)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}

function otherPerson(person: PersonId): PersonId {
  return person === 'maya' ? 'leo' : 'maya';
}

export const PEOPLE: readonly {
  id: PersonId;
  name: string;
  role: string;
  levels: Record<TopicId, number>;
}[] = deepFreeze([
  {
    id: 'maya',
    name: 'Maya',
    role: 'Neighbourhood learning-group facilitator (fictional)',
    levels: {
      access: 2,
      feedback: 3,
      practice: 3,
      scheduling: 3,
      interfaces: 1,
      measurement: 1,
    },
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'Learning-website builder (fictional)',
    levels: {
      access: 2,
      feedback: 1,
      practice: 2,
      scheduling: 1,
      interfaces: 3,
      measurement: 3,
    },
  },
]);

export const TOPICS: readonly { id: TopicId; label: string }[] = deepFreeze([
  { id: 'access', label: 'Access' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'practice', label: 'Practice' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'interfaces', label: 'Interfaces' },
  { id: 'measurement', label: 'Measurement' },
]);

export const STAGES: readonly { id: Stage; label: string; description: string }[] = deepFreeze([
  {
    id: 0,
    label: 'Compare',
    description:
      'Inspect all six topics, provenance, and declared unknowns. Sharing a topic label does not mean sharing definitions, assumptions, or agreement.',
  },
  {
    id: 1,
    label: 'Exchange',
    description:
      'Choose what context to share, explain each partner’s perspective, and check whether the listener can reconstruct the point in their own words.',
  },
  {
    id: 2,
    label: 'Align on a question',
    description:
      'Once both reciprocal checks pass, agree on a shared question and inquiry method while leaving differing viewpoints and unknowns intact.',
  },
  {
    id: 3,
    label: 'Try and revise',
    description:
      'Pick a hypothesis and inspect a synthetic follow-up scenario—encouraging, mixed, or contradicting—to see what the example supports or weakens.',
  },
  {
    id: 4,
    label: 'Contribute',
    description:
      'Examine provenance, scope limits, and remaining unknowns together, then prepare a local illustrative provisional note.',
  },
]);

export const TOPIC_VIEWS: Record<TopicId, Record<PersonId, TopicView>> = deepFreeze({
  access: {
    maya: {
      claim: 'Participants leave before trying the exercise when they lack unhurried time or a personal device.',
      provenance: 'Fictional workshop conversations after three evening sessions.',
      assumption: 'Access means having quiet time, a usable device, and conditions in which to participate.',
      unknown: 'How often drop-offs come from layout confusion versus household interruptions.',
    },
    leo: {
      claim: 'The exercise route loads reliably in under two seconds on mobile browsers.',
      provenance: 'Fictional response-time checks and static-route verification.',
      assumption: 'Access means a resource loads cleanly and can be reached over a standard connection.',
      unknown: 'What happens in a learner’s room or household after the page finishes loading.',
    },
  },
  feedback: {
    maya: {
      claim: 'Learners hesitate to retry when a prompt marks them wrong without showing where their reasoning diverged.',
      provenance: 'Fictional observations sitting beside first-time workshop learners.',
      assumption: 'Feedback helps independent practice only when it supports revision without embarrassment.',
      unknown: 'Whether short worked hints on the page reduce hesitation when no facilitator is nearby.',
    },
    leo: {
      claim: 'Every question already displays an immediate correct or try-again status banner on submission.',
      provenance: 'Fictional exercise component inspection.',
      assumption: 'Fast pass/retry indicators give self-directed learners enough guidance to continue.',
      unknown: 'Why so many visitors close the tab before submitting even one answer.',
    },
  },
  practice: {
    maya: {
      claim: 'Independent practice happens in brief, interrupted pockets rather than one long sitting.',
      provenance: 'Fictional check-in notes with neighbourhood group participants.',
      assumption: 'Exercises must survive interruptions so learners can pause and return without starting over.',
      unknown: 'Whether printable or downloadable sheets would actually be picked up between sessions.',
    },
    leo: {
      claim: 'Each lesson places a short interactive exercise directly beneath the reading passage.',
      provenance: 'Fictional lesson template review.',
      assumption: 'Keeping reading and practice on one web page minimises navigation friction.',
      unknown: 'Why learners open the exercise section and leave without completing a question.',
    },
  },
  scheduling: {
    maya: {
      claim: 'Shift work, commutes, and family routines leave learners with unpredictable ten-minute windows.',
      provenance: 'Fictional attendance notes and participant sign-ups.',
      assumption: 'Practice needs flexible return times rather than assuming everyone studies on a fixed evening.',
      unknown: 'Which hours between weekly meetings participants actually find quiet time.',
    },
    leo: {
      claim: 'New lessons publish every Tuesday evening alongside a suggested 45-minute study block.',
      provenance: 'Fictional release schedule on the group website.',
      assumption: 'A regular weekly slot helps participants set aside uninterrupted study time.',
      unknown: 'How many participants try to fit practice into spare moments outside Tuesday evenings.',
    },
  },
  interfaces: {
    maya: {
      claim: 'Small screens feel crowded when prompts, instructions, and input controls compete for space.',
      provenance: 'Fictional over-the-shoulder phone observations during group sessions.',
      assumption: 'Calm, uncluttered wording makes starting an exercise less intimidating.',
      unknown: 'Whether button labels or being tethered to a live browser page causes more drop-offs.',
    },
    leo: {
      claim: 'The start-exercise button sits clearly above the fold and passes keyboard and contrast checks.',
      provenance: 'Fictional interface audit across mobile and desktop viewports.',
      assumption: 'Clearer visual hierarchy and button labels are the main lever for raising exercise-step completion.',
      unknown: 'Whether shared-device constraints make any live-only web interface awkward to finish.',
    },
  },
  measurement: {
    maya: {
      claim: 'Reported weekly opens look far higher than the number of participants who say they tried an exercise.',
      provenance: 'Fictional debrief chats compared with weekly summary totals.',
      assumption: 'Website open counts may be overstating how many learners genuinely began the task.',
      unknown: 'Which specific visitor action triggers the website’s “exercise opened” counter.',
    },
    leo: {
      claim: 'Site logs show frequent “exercise opened” events followed by very few “exercise submitted” events.',
      provenance: 'Fictional aggregate counter export from the learning website.',
      assumption: 'An “exercise opened” event reflects a learner who started reading the task and then gave up.',
      unknown: 'How many logged opens are quick previews by someone planning to return later.',
    },
  },
});

export const PRIVATE_NOTES: Record<
  PersonId,
  { summary: string; provenance: string; assumption: string; unknown: string }
> = deepFreeze({
  maya: {
    summary:
      'Some participants share a single household phone and only get short, unpredictable periods of quiet time.',
    provenance: 'Fictional workshop conversations (shared voluntarily).',
    assumption:
      'If practice requires staying online in one sitting, learners on shared phones will close the page before trying.',
    unknown: 'How many participants would actually use a downloadable sheet and return on a flexible schedule.',
  },
  leo: {
    summary:
      'An “exercise opened” event records a page visit when the lesson loads, not a completed or even started attempt.',
    provenance: 'Fictional event-schema inspection (shared voluntarily).',
    assumption:
      'Treating page loads as started attempts makes brief previews look like mid-exercise abandonment.',
    unknown: 'How often visitors load the page simply to check what is needed for later.',
  },
});

export const CHECKS: Record<
  PersonId,
  {
    prompt: string;
    options: readonly { id: string; label: string; feedback: string }[];
    correctId: string;
  }
> = deepFreeze({
  maya: {
    prompt: 'Reconstruct Leo’s point: what does his event-schema note show about “exercise opened”?',
    correctId: 'maya-visit-not-attempt',
    options: [
      {
        id: 'maya-visit-not-attempt',
        label:
          'The counter fires on a page visit rather than a started attempt, so many “opens” may just be quick previews.',
        feedback:
          'Initial understanding checked: distinguishing a page visit from an exercise attempt explains why raw open counts look misleading. This marks a borrowed starting point, not instrumentation expertise.',
      },
      {
        id: 'maya-broken-submit',
        label: 'The submit button is failing silently for almost everyone who opens an exercise.',
        feedback:
          'Not quite: Leo’s schema inspection shows what triggers “exercise opened” (a page load), not a broken submit handler.',
      },
      {
        id: 'maya-topic-unpopular',
        label: 'Participants read the whole exercise and decide the subject itself is uninteresting.',
        feedback:
          'Not supported by the note: a page-load log records that the page rendered, not why someone closed it.',
      },
    ],
  },
  leo: {
    prompt: 'Reconstruct Maya’s point: why might participants leave after opening the lesson page?',
    correctId: 'leo-shared-phone-windows',
    options: [
      {
        id: 'leo-shared-phone-windows',
        label:
          'Some learners use a shared phone and only have short, unpredictable quiet windows, so they cannot always stay online to finish on the spot.',
        feedback:
          'Initial understanding checked: device sharing and fragmented time turn “leaving before trying” into a scheduling and portability question, not only a page-layout question. This is a borrowed anchor, not facilitation mastery.',
      },
      {
        id: 'leo-desktop-only',
        label: 'Participants dislike mobile layouts and only want to practise on desktop screens.',
        feedback:
          'Too narrow: Maya noted shared phone access and short quiet periods, not a preference for desktop computers.',
      },
      {
        id: 'leo-too-hard',
        label: 'The exercises are far too advanced and half the syllabus needs to be removed.',
        feedback:
          'Not what Maya observed: her note points to shared devices and unpredictable quiet windows, not syllabus difficulty.',
      },
    ],
  },
});

export const SHARED_QUESTION =
  'Could a downloadable exercise and flexible return time help participants practise independently?';

export const HYPOTHESES: readonly { id: HypothesisId; label: string; prediction: string }[] = deepFreeze([
  {
    id: 'buttons',
    label: 'Clearer buttons alone',
    prediction:
      'Making the on-page start button clearer and more prominent will raise exercise-step completion without adding downloadable sheets or flexible return windows.',
  },
  {
    id: 'flexible',
    label: 'Flexible downloadable practice',
    prediction:
      'Providing a lightweight downloadable exercise alongside flexible return times will increase exercise-step completion for shared-device learners; independent practice remains a further question.',
  },
]);

export const TRIALS: readonly { id: TrialId; label: string; observation: string }[] = deepFreeze([
  {
    "id": "encouraging",
    "label": "Encouraging comparison (fictional)",
    "observation": "Invented comparison: with the tested change, participants complete an exercise step more often than with the original lesson. Some still stop early. Next-day reconstruction and transfer to another task have not been checked."
  },
  {
    "id": "mixed",
    "label": "Mixed comparison (fictional)",
    "observation": "Invented comparison: with the tested change, some participants complete an exercise step more often than with the original lesson, while those sharing a phone during interrupted evenings show no clear improvement. Next-day reconstruction has not been checked."
  },
  {
    "id": "contradicting",
    "label": "Contradicting comparison (fictional)",
    "observation": "Invented comparison: with the tested change, exercise-step completion is no better than with the original lesson. Follow-up comments still mention unclear first-step wording and interrupted time. Next-day reconstruction has not been checked."
  }
]);

interface TrialEvaluation {
  finding: string;
  scope: string;
  unknown: string;
  status: 'supported-in-example' | 'mixed' | 'not-supported';
}

const RESULTS_BY_HYPOTHESIS: Record<HypothesisId, Record<TrialId, TrialEvaluation>> = deepFreeze({
  "buttons": {
    "encouraging": {
      "finding": "The fictional comparison offers initial support for clearer starting buttons as a way to help people complete an exercise step. It does not yet answer whether they can practise independently.",
      "scope": "An invented comparison of exercise-step completion, not a programme evaluation or evidence of durable learning. No sample size, effect estimate or statistical inference is represented.",
      "unknown": "Whether participants can reconstruct the exercise later without hints and transfer it to a different task; which constraints remain for people using shared devices.",
      "status": "supported-in-example"
    },
    "mixed": {
      "finding": "The fictional comparison suggests clearer starting buttons may help some participants complete an exercise step, while shared-device and interrupted-time barriers remain. The wider question is unresolved.",
      "scope": "An invented comparison of exercise-step completion, not a programme evaluation or evidence of durable learning. No sample size, effect estimate or statistical inference is represented.",
      "unknown": "Whether participants can reconstruct the exercise later without hints and transfer it to a different task; which constraints remain for people using shared devices.",
      "status": "mixed"
    },
    "contradicting": {
      "finding": "The fictional comparison does not support clearer starting buttons as sufficient to improve exercise-step completion. A correction or a better next question is still worth sharing.",
      "scope": "An invented comparison of exercise-step completion, not a programme evaluation or evidence of durable learning. No sample size, effect estimate or statistical inference is represented.",
      "unknown": "Whether participants can reconstruct the exercise later without hints and transfer it to a different task; which constraints remain for people using shared devices.",
      "status": "not-supported"
    }
  },
  "flexible": {
    "encouraging": {
      "finding": "The fictional comparison offers initial support for downloadable practice with flexible return times as a way to help people complete an exercise step. It does not yet answer whether they can practise independently.",
      "scope": "An invented comparison of exercise-step completion, not a programme evaluation or evidence of durable learning. No sample size, effect estimate or statistical inference is represented.",
      "unknown": "Whether offline availability, flexible timing or some other difference matters; whether participants can reconstruct and transfer the exercise without hints.",
      "status": "supported-in-example"
    },
    "mixed": {
      "finding": "The fictional comparison suggests downloadable practice with flexible return times may help some participants complete an exercise step, while shared-device and interrupted-time barriers remain. The wider question is unresolved.",
      "scope": "An invented comparison of exercise-step completion, not a programme evaluation or evidence of durable learning. No sample size, effect estimate or statistical inference is represented.",
      "unknown": "Whether offline availability, flexible timing or some other difference matters; whether participants can reconstruct and transfer the exercise without hints.",
      "status": "mixed"
    },
    "contradicting": {
      "finding": "The fictional comparison does not support downloadable practice with flexible return times as sufficient to improve exercise-step completion. A correction or a better next question is still worth sharing.",
      "scope": "An invented comparison of exercise-step completion, not a programme evaluation or evidence of durable learning. No sample size, effect estimate or statistical inference is represented.",
      "unknown": "Whether offline availability, flexible timing or some other difference matters; whether participants can reconstruct and transfer the exercise without hints.",
      "status": "not-supported"
    }
  }
});

const BORROWED_TOPICS_BY_LEARNER: Record<PersonId, readonly TopicId[]> = deepFreeze({
  maya: ['measurement'],
  leo: ['scheduling'],
});

export function createInitialState(): SharedKnowledgeState {
  return {
    stage: 0,
    disclosed: { maya: false, leo: false },
    explained: { maya: false, leo: false },
    answers: { maya: null, leo: null },
    understood: { maya: false, leo: false },
    questionAligned: false,
    hypothesisId: 'buttons',
    trialId: null,
    reviewed: false,
    note: null,
  };
}

export function canExplain(state: SharedKnowledgeState, learner: PersonId): boolean {
  return state.disclosed[otherPerson(learner)];
}

export function canAnswer(state: SharedKnowledgeState, learner: PersonId): boolean {
  return canExplain(state, learner) && state.explained[learner];
}

export function hasGroundedExchange(state: SharedKnowledgeState): boolean {
  return (
    state.disclosed.maya &&
    state.disclosed.leo &&
    state.explained.maya &&
    state.explained.leo &&
    state.understood.maya &&
    state.understood.leo
  );
}

export function canAlign(state: SharedKnowledgeState): boolean {
  return hasGroundedExchange(state);
}

export function canTest(state: SharedKnowledgeState): boolean {
  return hasGroundedExchange(state) && state.questionAligned;
}

export function canReview(state: SharedKnowledgeState): boolean {
  return canTest(state) && state.trialId !== null;
}

export function canPrepare(state: SharedKnowledgeState): boolean {
  return canReview(state) && state.reviewed;
}

export function getSharedTopics(): TopicId[] {
  const maya = PEOPLE.find((person) => person.id === 'maya');
  const leo = PEOPLE.find((person) => person.id === 'leo');
  if (!maya || !leo) {
    return [];
  }
  return TOPICS.map((topic) => topic.id).filter(
    (topicId) => maya.levels[topicId] >= 2 && leo.levels[topicId] >= 2,
  );
}

export function getBorrowedTopics(state: SharedKnowledgeState, learner: PersonId): TopicId[] {
  if (!canAnswer(state, learner) || !state.understood[learner]) {
    return [];
  }
  return [...BORROWED_TOPICS_BY_LEARNER[learner]];
}

export function getResult(
  state: SharedKnowledgeState,
): { finding: string; scope: string; unknown: string; status: 'supported-in-example' | 'mixed' | 'not-supported' } | null {
  if (!canTest(state) || state.trialId === null) {
    return null;
  }
  const evaluation = RESULTS_BY_HYPOTHESIS[state.hypothesisId][state.trialId];
  return {
    finding: evaluation.finding,
    scope: evaluation.scope,
    unknown: evaluation.unknown,
    status: evaluation.status,
  };
}

export function transition(state: SharedKnowledgeState, action: Action): SharedKnowledgeState {
  switch (action.type) {
    case 'stage': {
      if (state.stage === action.stage) {
        return state;
      }
      return {
        ...state,
        stage: action.stage,
      };
    }

    case 'disclose': {
      const nextValue = !state.disclosed[action.person];
      const nextDisclosed: Record<PersonId, boolean> = {
        ...state.disclosed,
        [action.person]: nextValue,
      };

      if (nextValue) {
        return {
          ...state,
          disclosed: nextDisclosed,
        };
      }

      const dependentLearner = otherPerson(action.person);
      return {
        ...state,
        disclosed: nextDisclosed,
        explained: {
          ...state.explained,
          [dependentLearner]: false,
        },
        answers: {
          ...state.answers,
          [dependentLearner]: null,
        },
        understood: {
          ...state.understood,
          [dependentLearner]: false,
        },
        questionAligned: false,
        trialId: null,
        reviewed: false,
        note: null,
      };
    }

    case 'explain': {
      if (!canExplain(state, action.learner) || state.explained[action.learner]) {
        return state;
      }
      return {
        ...state,
        explained: {
          ...state.explained,
          [action.learner]: true,
        },
      };
    }

    case 'answer': {
      if (!canAnswer(state, action.learner)) {
        return state;
      }
      const check = CHECKS[action.learner];
      const validOption = check.options.some((option) => option.id === action.optionId);
      if (!validOption) {
        return state;
      }

      const isCorrect = action.optionId === check.correctId;
      const wasUnderstood = state.understood[action.learner];
      if (state.answers[action.learner] === action.optionId && wasUnderstood === isCorrect) {
        return state;
      }

      const nextAnswers: Record<PersonId, string | null> = {
        ...state.answers,
        [action.learner]: action.optionId,
      };
      const nextUnderstood: Record<PersonId, boolean> = {
        ...state.understood,
        [action.learner]: isCorrect,
      };

      if (wasUnderstood && !isCorrect) {
        return {
          ...state,
          answers: nextAnswers,
          understood: nextUnderstood,
          questionAligned: false,
          trialId: null,
          reviewed: false,
          note: null,
        };
      }

      return {
        ...state,
        answers: nextAnswers,
        understood: nextUnderstood,
      };
    }

    case 'align': {
      if (!canAlign(state) || state.questionAligned) {
        return state;
      }
      return {
        ...state,
        questionAligned: true,
      };
    }

    case 'hypothesis': {
      if (state.hypothesisId === action.id) {
        return state;
      }
      return {
        ...state,
        hypothesisId: action.id,
        trialId: null,
        reviewed: false,
        note: null,
      };
    }

    case 'trial': {
      if (!canTest(state) || state.trialId === action.id) {
        return state;
      }
      return {
        ...state,
        trialId: action.id,
        reviewed: false,
        note: null,
      };
    }

    case 'review': {
      if (!canReview(state) || state.reviewed) {
        return state;
      }
      return {
        ...state,
        reviewed: true,
      };
    }

    case 'prepare': {
      if (!canPrepare(state) || state.note !== null) {
        return state;
      }
      const result = getResult(state);
      const hypothesis = HYPOTHESES.find((item) => item.id === state.hypothesisId);
      const trial = TRIALS.find((item) => item.id === state.trialId);
      if (!result || !hypothesis || !trial) {
        return state;
      }

      return {
        ...state,
        note: {
          title: `Illustrative note: ${hypothesis.label} — ${trial.label}`,
          question: SHARED_QUESTION,
          hypothesis: `${hypothesis.label}: ${hypothesis.prediction}`,
          finding: result.finding,
          scope: result.scope,
          unknown: result.unknown,
          contributors: [
            'Maya (neighbourhood learning-group facilitator, fictional)',
            'Leo (learning-website builder, fictional)',
          ],
          provenance: [
            `Maya: ${PRIVATE_NOTES.maya.provenance}`,
            `Leo: ${PRIVATE_NOTES.leo.provenance}`,
            `Follow-up fixture: ${trial.observation}`,
          ],
          status: 'Illustrative provisional note',
        },
      };
    }

    case 'reset': {
      return createInitialState();
    }

    default: {
      return state;
    }
  }
}
