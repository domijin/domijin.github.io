import test from "node:test";
import assert from "node:assert/strict";
import {
  CHECKS,
  HYPOTHESES,
  PEOPLE,
  PRIVATE_NOTES,
  SHARED_QUESTION,
  STAGES,
  TOPICS,
  TOPIC_VIEWS,
  TRIALS,
  canAlign,
  canAnswer,
  canExplain,
  canPrepare,
  canReview,
  canTest,
  createInitialState,
  getBorrowedTopics,
  getResult,
  getSharedTopics,
  hasGroundedExchange,
  transition,
} from "../src/lib/sharedKnowledgeModel.ts";

function freezeDeep(value) {
  if (value !== null && typeof value === "object") {
    Object.freeze(value);
    for (const key of Object.keys(value)) {
      freezeDeep(value[key]);
    }
  }
  return value;
}

function step(state, action) {
  freezeDeep(state);
  return transition(state, action);
}

function reachAligned(state) {
  let s = step(state, { type: "disclose", person: "leo" });
  s = step(s, { type: "disclose", person: "maya" });
  s = step(s, { type: "explain", learner: "maya" });
  s = step(s, { type: "explain", learner: "leo" });
  s = step(s, { type: "answer", learner: "maya", optionId: CHECKS.maya.correctId });
  s = step(s, { type: "answer", learner: "leo", optionId: CHECKS.leo.correctId });
  s = step(s, { type: "align" });
  return s;
}

test("fictional Maya/Leo fixtures define six topics, shared overlap without alignment, and immutable baselines", () => {
  assert.equal(PEOPLE.length, 2);
  assert.equal(TOPICS.length, 6);
  assert.equal(STAGES.length, 5);
  assert.equal(HYPOTHESES.length, 2);
  assert.equal(TRIALS.length, 3);
  assert.match(SHARED_QUESTION, /downloadable exercise/i);

  const shared = getSharedTopics();
  assert.deepEqual(shared, ["access", "practice"]);

  // Shared topics still hold distinct assumptions and provenance across Maya and Leo
  for (const topicId of shared) {
    assert.notEqual(TOPIC_VIEWS[topicId].maya.assumption, TOPIC_VIEWS[topicId].leo.assumption);
    assert.notEqual(TOPIC_VIEWS[topicId].maya.provenance, TOPIC_VIEWS[topicId].leo.provenance);
    assert.ok(TOPIC_VIEWS[topicId].maya.unknown.length > 0);
    assert.ok(TOPIC_VIEWS[topicId].leo.unknown.length > 0);
  }

  // Fixtures and private notes are frozen against mutation
  assert.equal(Object.isFrozen(PEOPLE), true);
  assert.equal(Object.isFrozen(PEOPLE[0].levels), true);
  assert.equal(Object.isFrozen(PRIVATE_NOTES.maya), true);
});

test("stage navigation cannot bypass prerequisites or fabricate state", () => {
  let state = createInitialState();
  for (const stage of [1, 2, 3, 4, 0]) {
    state = step(state, { type: "stage", stage });
    assert.equal(state.stage, stage);
    assert.equal(canExplain(state, "maya"), false);
    assert.equal(canExplain(state, "leo"), false);
    assert.equal(canAnswer(state, "maya"), false);
    assert.equal(canAnswer(state, "leo"), false);
    assert.equal(hasGroundedExchange(state), false);
    assert.equal(canAlign(state), false);
    assert.equal(canTest(state), false);
    assert.equal(canReview(state), false);
    assert.equal(canPrepare(state), false);
    assert.equal(getResult(state), null);
  }
});

test("no shortcuts: explanation requires partner disclosure and correct answer requires explanation", () => {
  let state = createInitialState();

  // Attempt to explain before partner discloses
  state = step(state, { type: "explain", learner: "maya" });
  assert.equal(state.explained.maya, false);

  // Attempt to answer with the exact right optionId before disclosure or explanation
  state = step(state, { type: "answer", learner: "maya", optionId: CHECKS.maya.correctId });
  assert.equal(state.answers.maya, null);
  assert.equal(state.understood.maya, false);

  // Partner discloses, still cannot answer before explanation
  state = step(state, { type: "disclose", person: "leo" });
  assert.equal(canExplain(state, "maya"), true);
  assert.equal(canAnswer(state, "maya"), false);
  state = step(state, { type: "answer", learner: "maya", optionId: CHECKS.maya.correctId });
  assert.equal(state.answers.maya, null);
  assert.equal(state.understood.maya, false);

  // Cannot align, test, review, or prepare before both pass checks
  state = step(state, { type: "align" });
  state = step(state, { type: "trial", id: "encouraging" });
  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });
  assert.equal(state.questionAligned, false);
  assert.equal(state.trialId, null);
  assert.equal(state.reviewed, false);
  assert.equal(state.note, null);
});

test("explanation alone does not confer understanding, and passing checks never alters baseline competence", () => {
  const initialMayaLevels = { ...PEOPLE[0].levels };
  const initialLeoLevels = { ...PEOPLE[1].levels };

  let state = createInitialState();
  state = step(state, { type: "disclose", person: "leo" });
  state = step(state, { type: "explain", learner: "maya" });

  assert.equal(state.explained.maya, true);
  assert.equal(state.understood.maya, false);
  assert.deepEqual(getBorrowedTopics(state, "maya"), []);

  // Wrong answer keeps understood false
  const wrongMayaOption = CHECKS.maya.options.find((opt) => opt.id !== CHECKS.maya.correctId);
  assert.ok(wrongMayaOption);
  state = step(state, { type: "answer", learner: "maya", optionId: wrongMayaOption.id });
  assert.equal(state.answers.maya, wrongMayaOption.id);
  assert.equal(state.understood.maya, false);
  assert.deepEqual(getBorrowedTopics(state, "maya"), []);

  // Correct reconstruction grants borrowed sector understanding only, leaving PEOPLE levels untouched
  state = step(state, { type: "answer", learner: "maya", optionId: CHECKS.maya.correctId });
  assert.equal(state.understood.maya, true);
  assert.deepEqual(getBorrowedTopics(state, "maya"), ["measurement"]);
  assert.deepEqual(PEOPLE[0].levels, initialMayaLevels);

  // Reciprocal check for Leo
  state = step(state, { type: "disclose", person: "maya" });
  state = step(state, { type: "explain", learner: "leo" });
  state = step(state, { type: "answer", learner: "leo", optionId: CHECKS.leo.correctId });
  assert.equal(state.understood.leo, true);
  assert.deepEqual(getBorrowedTopics(state, "leo"), ["scheduling"]);
  assert.deepEqual(PEOPLE[1].levels, initialLeoLevels);
});

test("withdrawing disclosure clears dependent understanding, alignment, evidence, review, and note while keeping unaffected partner state", () => {
  let state = reachAligned(createInitialState());
  state = step(state, { type: "hypothesis", id: "flexible" });
  state = step(state, { type: "trial", id: "encouraging" });
  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });
  assert.ok(state.note !== null);

  // Leo revokes his disclosure
  state = step(state, { type: "disclose", person: "leo" });

  assert.equal(state.disclosed.leo, false);
  assert.equal(state.explained.maya, false);
  assert.equal(state.answers.maya, null);
  assert.equal(state.understood.maya, false);
  assert.deepEqual(getBorrowedTopics(state, "maya"), []);

  // Maya's disclosure and Leo's check on Maya's note remain intact
  assert.equal(state.disclosed.maya, true);
  assert.equal(state.explained.leo, true);
  assert.equal(state.answers.leo, CHECKS.leo.correctId);
  assert.equal(state.understood.leo, true);
  assert.deepEqual(getBorrowedTopics(state, "leo"), ["scheduling"]);

  // Downstream joint state is cleared
  assert.equal(hasGroundedExchange(state), false);
  assert.equal(state.questionAligned, false);
  assert.equal(state.trialId, null);
  assert.equal(state.reviewed, false);
  assert.equal(state.note, null);
  assert.equal(getResult(state), null);
});

test("changing a previously correct answer to an incorrect one clears alignment, evidence, review, and note", () => {
  let state = reachAligned(createInitialState());
  state = step(state, { type: "trial", id: "mixed" });
  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });
  assert.ok(state.note !== null);

  const wrongLeoOption = CHECKS.leo.options.find((opt) => opt.id !== CHECKS.leo.correctId);
  assert.ok(wrongLeoOption);
  state = step(state, { type: "answer", learner: "leo", optionId: wrongLeoOption.id });

  assert.equal(state.understood.leo, false);
  assert.equal(state.understood.maya, true);
  assert.equal(state.explained.leo, true);
  assert.equal(state.questionAligned, false);
  assert.equal(state.trialId, null);
  assert.equal(state.reviewed, false);
  assert.equal(state.note, null);
});

test("no evidence-free contribution; changing hypothesis or trial clears prior review and note", () => {
  let state = reachAligned(createInitialState());

  // Cannot review or prepare without selecting a trial
  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });
  assert.equal(state.reviewed, false);
  assert.equal(state.note, null);

  // Select trial, review, prepare
  state = step(state, { type: "hypothesis", id: "flexible" });
  state = step(state, { type: "trial", id: "encouraging" });
  assert.equal(canReview(state), true);
  assert.equal(canPrepare(state), false);

  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });
  assert.ok(state.note !== null);

  // Changing hypothesis clears review and prepared note
  state = step(state, { type: "hypothesis", id: "buttons" });
  assert.equal(state.reviewed, false);
  assert.equal(state.note, null);

  assert.equal(state.trialId, null);
  assert.equal(canReview(state), false);
  assert.equal(getResult(state), null);

  // A different hypothesis requires a fresh comparison; old evidence cannot silently change meaning.
  state = step(state, { type: "trial", id: "encouraging" });
  // Re-review and prepare, then change trial -> clears review and note again
  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });
  assert.ok(state.note !== null);
  state = step(state, { type: "trial", id: "mixed" });
  assert.equal(state.reviewed, false);
  assert.equal(state.note, null);
});

test("negative and mixed results produce valid qualified contributions and repeated prepare does not duplicate", () => {
  for (const hypothesisId of ["buttons", "flexible"]) {
    for (const [trialId, expectedStatus] of [
      ["mixed", "mixed"],
      ["contradicting", "not-supported"],
    ]) {
      let state = reachAligned(createInitialState());
      state = step(state, { type: "hypothesis", id: hypothesisId });
      state = step(state, { type: "trial", id: trialId });

      const result = getResult(state);
      assert.ok(result !== null);
      assert.equal(result.status, expectedStatus);

      // Findings must distinguish exercise starts from untested durable learning.
      const trial = TRIALS.find((item) => item.id === trialId);
      assert.ok(trial);
      assert.match(trial.observation, /original lesson/);
      assert.match(result.scope, /not a programme evaluation/);
      assert.match(result.unknown, /without hints/);

      state = step(state, { type: "review" });
      assert.equal(canPrepare(state), true);
      state = step(state, { type: "prepare" });
      assert.ok(state.note !== null);
      assert.equal(state.note.status, "Illustrative provisional note");
      assert.equal(state.note.question, SHARED_QUESTION);
      assert.equal(state.note.finding, result.finding);
      assert.equal(state.note.scope, result.scope);
      assert.equal(state.note.unknown, result.unknown);
      assert.equal(state.note.contributors.length, 2);
      assert.equal(state.note.provenance.length, 3);

      // Repeated prepare has no effect
      const afterSecondPrepare = step(state, { type: "prepare" });
      assert.equal(afterSecondPrepare, state);
    }
  }
});

test("reset restores a fresh immutable baseline equivalent to createInitialState()", () => {
  let state = reachAligned(createInitialState());
  state = step(state, { type: "stage", stage: 4 });
  state = step(state, { type: "hypothesis", id: "flexible" });
  state = step(state, { type: "trial", id: "encouraging" });
  state = step(state, { type: "review" });
  state = step(state, { type: "prepare" });

  const resetState = step(state, { type: "reset" });
  const freshInitial = createInitialState();
  assert.deepEqual(resetState, freshInitial);
  assert.notEqual(resetState, freshInitial);
  assert.notEqual(resetState.disclosed, freshInitial.disclosed);
});
