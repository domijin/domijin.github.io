"use client";

import React, { useId, useRef, useState } from "react";
import {
  type HypothesisId,
  type PersonId,
  type SharedKnowledgeState,
  type Stage,
  type TopicId,
  type TrialId,
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
} from "@/lib/sharedKnowledgeModel";

type ViewMode = "side-by-side" | "overlay";

const DEFAULT_TOPIC: TopicId = "access";
const DEFAULT_VIEW: ViewMode = "side-by-side";

const RESULT_STATUS_LABELS: Record<
  "supported-in-example" | "mixed" | "not-supported",
  string
> = {
  "supported-in-example": "Supported in this synthetic example",
  mixed: "Mixed outcome in this synthetic example",
  "not-supported": "Not supported in this synthetic example",
};

function levelLabel(level: number): string {
  if (level >= 3) return "Main area of familiarity";
  if (level === 2) return "Working familiarity";
  return "Less familiar";
}

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  spokeIndex: number
): [number, number] {
  const angle = ((spokeIndex * 60 - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function levelRadius(level: number, maxR: number): number {
  const clamped = Math.max(0.4, Math.min(3, level));
  return (clamped / 3) * maxR;
}

function sectorPath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  spokeIndex: number,
  halfAngleDeg: number
): string {
  const centerDeg = spokeIndex * 60 - 90;
  const startRad = ((centerDeg - halfAngleDeg) * Math.PI) / 180;
  const endRad = ((centerDeg + halfAngleDeg) * Math.PI) / 180;
  const x1 = cx + outerR * Math.cos(startRad);
  const y1 = cy + outerR * Math.sin(startRad);
  const x2 = cx + outerR * Math.cos(endRad);
  const y2 = cy + outerR * Math.sin(endRad);
  const x3 = cx + innerR * Math.cos(endRad);
  const y3 = cy + innerR * Math.sin(endRad);
  const x4 = cx + innerR * Math.cos(startRad);
  const y4 = cy + innerR * Math.sin(startRad);
  return [
    `M ${x1.toFixed(1)} ${y1.toFixed(1)}`,
    `A ${outerR.toFixed(1)} ${outerR.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`,
    `L ${x3.toFixed(1)} ${y3.toFixed(1)}`,
    `A ${innerR.toFixed(1)} ${innerR.toFixed(1)} 0 0 0 ${x4.toFixed(1)} ${y4.toFixed(1)}`,
    "Z",
  ].join(" ");
}

function CompetenceSvg({
  mode,
  state,
  selectedTopic,
  maya,
  leo,
  sharedTopics,
  mayaBorrowed,
  leoBorrowed,
}: {
  mode: "maya" | "leo" | "overlay";
  state: SharedKnowledgeState;
  selectedTopic: TopicId;
  maya: (typeof PEOPLE)[number];
  leo: (typeof PEOPLE)[number];
  sharedTopics: TopicId[];
  mayaBorrowed: TopicId[];
  leoBorrowed: TopicId[];
}) {
  const uid = useId().replace(/:/g, "");
  const isOverlay = mode === "overlay";
  const width = isOverlay ? 420 : 360;
  const height = isOverlay ? 356 : 312;
  const cx = width / 2;
  const cy = isOverlay ? 178 : 158;
  const maxR = isOverlay ? 102 : 82;
  const labelR = isOverlay ? 124 : 104;

  const grounded = hasGroundedExchange(state);
  const result = getResult(state);

  const buildPolygonPoints = (levels: Record<TopicId, number>) =>
    TOPICS.map((topic, index) => {
      const r = levelRadius(levels[topic.id] ?? 1, maxR);
      const [x, y] = polarPoint(cx, cy, r, index);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  const mayaPolygon = buildPolygonPoints(maya.levels);
  const leoPolygon = buildPolygonPoints(leo.levels);

  const selectedIndex = Math.max(
    0,
    TOPICS.findIndex((t) => t.id === selectedTopic)
  );

  // Joint question frontier node placed cleanly between Access (0°) and Feedback (60°)
  const questionAngleRad = ((-90 + 26) * Math.PI) / 180;
  const questionR = maxR * 1.3;
  const qx = cx + questionR * Math.cos(questionAngleRad);
  const qy = cy + questionR * Math.sin(questionAngleRad);
  const [accessX, accessY] = polarPoint(
    cx,
    cy,
    levelRadius(
      mode === "leo" ? leo.levels.access : maya.levels.access,
      maxR
    ),
    0
  );
  const [practiceX, practiceY] = polarPoint(
    cx,
    cy,
    levelRadius(
      mode === "leo" ? leo.levels.practice : maya.levels.practice,
      maxR
    ),
    2
  );

  const showMaya = mode === "maya" || mode === "overlay";
  const showLeo = mode === "leo" || mode === "overlay";

  const svgLabel = isOverlay
    ? "Overlay of Maya and Leo's schematic 2D topic-specific competence maps"
    : mode === "maya"
      ? "Maya's schematic 2D topic-specific competence map"
      : "Leo's schematic 2D topic-specific competence map";

  const hatchMayaId = `sk-hatch-maya-${uid}`;
  const hatchLeoId = `sk-hatch-leo-${uid}`;

  return (
    <svg
      className="sk-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={svgLabel}
    >
      <defs>
        <pattern
          id={hatchMayaId}
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#65d9ed"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
        </pattern>
        <pattern
          id={hatchLeoId}
          width="6"
          height="6"
          patternTransform="rotate(-45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#90a8ff"
            strokeOpacity="0.45"
            strokeWidth="2"
          />
        </pattern>
      </defs>

      {/* Active topic sector highlight */}
      <path
        d={sectorPath(cx, cy, 4, maxR + 6, selectedIndex, 28)}
        fill="rgba(101, 217, 237, 0.08)"
        stroke="rgba(101, 217, 237, 0.25)"
        strokeWidth="1"
      />

      {/* Concentric categorical tier rings (1, 2, 3) */}
      {[1, 2, 3].map((tier) => (
        <circle
          key={tier}
          cx={cx}
          cy={cy}
          r={levelRadius(tier, maxR)}
          fill="none"
          stroke="#1d3c52"
          strokeWidth="1"
          strokeDasharray={tier === 3 ? undefined : "3 4"}
        />
      ))}

      {/* Six radial spokes */}
      {TOPICS.map((topic, index) => {
        const [sx, sy] = polarPoint(cx, cy, maxR + 6, index);
        const isSelected = topic.id === selectedTopic;
        return (
          <line
            key={topic.id}
            x1={cx}
            y1={cy}
            x2={sx}
            y2={sy}
            stroke={isSelected ? "#58b6d0" : "#22445e"}
            strokeWidth={isSelected ? "1.6" : "1"}
          />
        );
      })}

      {/* Solid / unchanged starting baseline contours */}
      {showMaya && (
        <polygon
          points={mayaPolygon}
          fill="rgba(101, 217, 237, 0.14)"
          stroke="#65d9ed"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      )}
      {showLeo && (
        <polygon
          points={leoPolygon}
          fill="rgba(144, 168, 255, 0.13)"
          stroke="#90a8ff"
          strokeWidth="2.4"
          strokeDasharray="10 3 2 3"
          strokeLinejoin="round"
        />
      )}

      {/* Dashed borrowed understanding regions (never alters solid baseline) */}
      {showMaya &&
        mayaBorrowed.map((topicId) => {
          const idx = TOPICS.findIndex((t) => t.id === topicId);
          if (idx < 0) return null;
          const baseR = levelRadius(maya.levels[topicId] ?? 1, maxR);
          const borrowedR = Math.min(maxR * 1.13, baseR + maxR * 0.24);
          const [bx, by] = polarPoint(cx, cy, borrowedR, idx);
          return (
            <g key={`borrowed-maya-${topicId}`}>
              <path
                d={sectorPath(cx, cy, baseR, borrowedR, idx, 16)}
                fill={`url(#${hatchMayaId})`}
                stroke="#65d9ed"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <circle
                cx={bx}
                cy={by}
                r="4"
                fill="#06121e"
                stroke="#65d9ed"
                strokeWidth="1.8"
                strokeDasharray="2 2"
              />
            </g>
          );
        })}

      {showLeo &&
        leoBorrowed.map((topicId) => {
          const idx = TOPICS.findIndex((t) => t.id === topicId);
          if (idx < 0) return null;
          const baseR = levelRadius(leo.levels[topicId] ?? 1, maxR);
          const borrowedR = Math.min(maxR * 1.13, baseR + maxR * 0.24);
          const [bx, by] = polarPoint(cx, cy, borrowedR, idx);
          return (
            <g key={`borrowed-leo-${topicId}`}>
              <path
                d={sectorPath(cx, cy, baseR, borrowedR, idx, 16)}
                fill={`url(#${hatchLeoId})`}
                stroke="#90a8ff"
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <rect
                x={bx - 3.5}
                y={by - 3.5}
                width="7"
                height="7"
                fill="#06121e"
                stroke="#90a8ff"
                strokeWidth="1.6"
                strokeDasharray="2 2"
              />
            </g>
          );
        })}

      {/* Visible connection bridge inside overlay when disclosure/exchange occurs */}
      {isOverlay &&
        (state.disclosed.maya ||
          state.disclosed.leo ||
          state.explained.maya ||
          state.explained.leo) && (() => {
          const mayaSchedIdx = TOPICS.findIndex((t) => t.id === "scheduling");
          const leoMeasIdx = TOPICS.findIndex((t) => t.id === "measurement");
          const [mx, my] = polarPoint(
            cx,
            cy,
            levelRadius(maya.levels.scheduling ?? 2, maxR),
            mayaSchedIdx >= 0 ? mayaSchedIdx : 3
          );
          const [lx, ly] = polarPoint(
            cx,
            cy,
            levelRadius(leo.levels.measurement ?? 2, maxR),
            leoMeasIdx >= 0 ? leoMeasIdx : 5
          );
          return (
            <path
              d={`M ${mx.toFixed(1)} ${my.toFixed(1)} Q ${cx} ${cy} ${lx.toFixed(1)} ${ly.toFixed(1)}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={grounded ? "2.1" : "1.6"}
              strokeDasharray={grounded ? undefined : "5 4"}
            />
          );
        })()}

      {/* Vertex markers on starting baseline contours */}
      {TOPICS.map((topic, index) => {
        const isShared = sharedTopics.includes(topic.id);
        const [mx, my] = polarPoint(
          cx,
          cy,
          levelRadius(maya.levels[topic.id] ?? 1, maxR),
          index
        );
        const [lx, ly] = polarPoint(
          cx,
          cy,
          levelRadius(leo.levels[topic.id] ?? 1, maxR),
          index
        );
        return (
          <g key={`markers-${topic.id}`}>
            {showMaya && (
              <circle
                cx={mx}
                cy={my}
                r="4"
                fill="#65d9ed"
                stroke="#06121e"
                strokeWidth="1.4"
              />
            )}
            {showLeo && (
              <rect
                x={lx - 3.6}
                y={ly - 3.6}
                width="7.2"
                height="7.2"
                fill="#90a8ff"
                stroke="#06121e"
                strokeWidth="1.3"
              />
            )}
            {isShared && (
              <circle
                cx={polarPoint(cx, cy, maxR + 10, index)[0]}
                cy={polarPoint(cx, cy, maxR + 10, index)[1]}
                r="4"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}
          </g>
        );
      })}

      {/* Disclosure anchors on individual and overlay maps */}
      {showMaya && state.disclosed.maya && (() => {
        const schedIdx = TOPICS.findIndex((t) => t.id === "scheduling");
        const [bx, by] = polarPoint(
          cx,
          cy,
          levelRadius(maya.levels.scheduling ?? 3, maxR),
          schedIdx >= 0 ? schedIdx : 3
        );
        return (
          <circle
            cx={bx}
            cy={by}
            r="8"
            fill="rgba(101, 217, 237, 0.16)"
            stroke="#65d9ed"
            strokeWidth="1.5"
          />
        );
      })()}
      {showLeo && state.disclosed.leo && (() => {
        const measIdx = TOPICS.findIndex((t) => t.id === "measurement");
        const [bx, by] = polarPoint(
          cx,
          cy,
          levelRadius(leo.levels.measurement ?? 3, maxR),
          measIdx >= 0 ? measIdx : 5
        );
        return (
          <circle
            cx={bx}
            cy={by}
            r="8"
            fill="rgba(144, 168, 255, 0.16)"
            stroke="#90a8ff"
            strokeWidth="1.5"
          />
        );
      })()}

      {/* Joint frontier shown as a labelled dashed question link, NOT proof */}
      {state.questionAligned && (
        <g>
          <line
            x1={accessX}
            y1={accessY}
            x2={qx}
            y2={qy}
            stroke="#f472b6"
            strokeWidth="1.8"
            strokeDasharray="5 4"
          />
          {isOverlay && (
            <line
              x1={practiceX}
              y1={practiceY}
              x2={qx}
              y2={qy}
              stroke="#f472b6"
              strokeWidth="1.3"
              strokeDasharray="4 4"
              strokeOpacity="0.7"
            />
          )}
          <circle
            cx={qx}
            cy={qy}
            r="11"
            fill="rgba(244, 114, 182, 0.08)"
            stroke="#f472b6"
            strokeWidth="1.7"
            strokeDasharray="3 3"
          />
          <text
            x={qx}
            y={qy + 4}
            textAnchor="middle"
            fill="#fbcfe8"
            fontSize="12"
            fontWeight="700"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            ?
          </text>
          <text
            x={qx}
            y={qy - 16}
            textAnchor="middle"
            fill="#fbcfe8"
            fontSize="10.5"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {result ? "Question (tested)" : "Joint question?"}
          </text>
        </g>
      )}

      {/* Spoke labels + accessible click/keyboard hit wedges */}
      {TOPICS.map((topic, index) => {
        const [lx, ly] = polarPoint(cx, cy, labelR, index);
        const anchor =
          index === 0 || index === 3
            ? "middle"
            : index === 1 || index === 2
              ? "start"
              : "end";
        const dy = index === 0 ? -4 : index === 3 ? 11 : 4;
        const isSelected = topic.id === selectedTopic;
        return (
          <g
            key={`spoke-btn-${topic.id}`}
          >
            <path
              d={sectorPath(cx, cy, 0, maxR + 30, index, 28)}
              fill="transparent"
            />
            <text
              className="sk-svg-label-full"
              x={lx}
              y={ly + dy}
              textAnchor={anchor}
              fill={isSelected ? "#ffffff" : "#b8d0e0"}
              fontSize={isSelected ? "12" : "11.5"}
              fontWeight={isSelected ? "700" : "500"}
            >
              {topic.label}
            </text>
            <text
              className="sk-svg-label-num"
              x={lx}
              y={ly + dy}
              textAnchor="middle"
              fill={isSelected ? "#65d9ed" : "#c7deed"}
              fontSize="14"
              fontWeight="700"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {index + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function SharedKnowledgeExplorer() {
  const [state, setState] = useState<SharedKnowledgeState>(() =>
    createInitialState()
  );
  const [selectedTopic, setSelectedTopic] = useState<TopicId>(DEFAULT_TOPIC);
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW);
  const [liveNotice, setLiveNotice] = useState<string>(
    "Showing starting competence maps for Maya and Leo. Access and Practice are shared topics, not yet checked."
  );

  const stageTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const maya = PEOPLE.find((p) => p.id === "maya") ?? PEOPLE[0];
  const leo = PEOPLE.find((p) => p.id === "leo") ?? PEOPLE[1];

  const sharedTopics = getSharedTopics();
  const mayaBorrowed = getBorrowedTopics(state, "maya");
  const leoBorrowed = getBorrowedTopics(state, "leo");
  const grounded = hasGroundedExchange(state);
  const result = getResult(state);

  const selectedTopicObj =
    TOPICS.find((t) => t.id === selectedTopic) ?? TOPICS[0];
  const selectedMayaView = TOPIC_VIEWS[selectedTopic].maya;
  const selectedLeoView = TOPIC_VIEWS[selectedTopic].leo;

  const isSelectedShared = sharedTopics.includes(selectedTopic);
  const isSelectedBorrowedByMaya = mayaBorrowed.includes(selectedTopic);
  const isSelectedBorrowedByLeo = leoBorrowed.includes(selectedTopic);

  const selectTopic = (topicId: TopicId) => {
    setSelectedTopic(topicId);
    const label = TOPICS.find((t) => t.id === topicId)?.label ?? topicId;
    setLiveNotice(`Inspecting topic: ${label}.`);
  };

  const setStage = (stage: Stage) => {
    setState((prev) => transition(prev, { type: "stage", stage }));
    const stageMeta = STAGES.find((s) => s.id === stage);
    if (stageMeta) {
      setLiveNotice(`Stage 0${stage + 1}: ${stageMeta.label}.`);
    }
  };

  const handleReset = () => {
    setState((prev) => transition(prev, { type: "reset" }));
    setSelectedTopic(DEFAULT_TOPIC);
    setViewMode(DEFAULT_VIEW);
    setLiveNotice(
      "Reset complete: starting maps, topic selection (Access), and side-by-side view restored."
    );
  };

  const handleStageKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = ((index + 1) % STAGES.length) as Stage;
      setStage(next);
      stageTabRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = ((index - 1 + STAGES.length) % STAGES.length) as Stage;
      setStage(prev);
      stageTabRefs.current[prev]?.focus();
    }
  };

  const handleDisclose = (person: PersonId) => {
    const wasDisclosed = state.disclosed[person];
    const other: PersonId = person === "maya" ? "leo" : "maya";
    const hadDependent =
      wasDisclosed &&
      (state.explained[other] ||
        state.understood[other] ||
        state.questionAligned ||
        state.trialId !== null ||
        state.note !== null);

    setState((prev) => transition(prev, { type: "disclose", person }));
    const personName = person === "maya" ? maya.name : leo.name;
    if (wasDisclosed) {
      setLiveNotice(
        hadDependent
          ? `${personName} withdrew their note. Dependent explanation, check, and downstream steps were cleared while starting maps stayed intact.`
          : `${personName} withdrew their private note.`
      );
    } else {
      setLiveNotice(`${personName} shared their private context note.`);
    }
  };

  const handleExplain = (learner: PersonId) => {
    if (!canExplain(state, learner)) return;
    setState((prev) => transition(prev, { type: "explain", learner }));
    const explainerName = learner === "leo" ? maya.name : leo.name;
    const learnerName = learner === "leo" ? leo.name : maya.name;
    setLiveNotice(
      `${explainerName} explained their context to ${learnerName}. Initial understanding check is now unlocked.`
    );
  };

  const handleAnswer = (learner: PersonId, optionId: string) => {
    if (!canAnswer(state, learner)) return;
    const prevUnderstood = state.understood[learner];
    const check = CHECKS[learner];
    const chosen = check.options.find((o) => o.id === optionId);
    const isCorrect = optionId === check.correctId;
    setState((prev) => transition(prev, { type: "answer", learner, optionId }));
    const learnerName = learner === "maya" ? maya.name : leo.name;
    if (isCorrect) {
      setLiveNotice(
        `${learnerName} reconstructed the key point: initial borrowed context added (not mastery).`
      );
    } else if (prevUnderstood) {
      setLiveNotice(
        `${learnerName} changed answer to an unverified option; dependent alignment and downstream steps were cleared.`
      );
    } else if (chosen) {
      setLiveNotice(`${learnerName}'s answer needs revision: ${chosen.feedback}`);
    }
  };

  const handleAlign = () => {
    if (!canAlign(state)) return;
    setState((prev) => transition(prev, { type: "align" }));
    setLiveNotice(
      "Aligned on the joint question while keeping Maya and Leo's distinct perspectives attributable."
    );
  };

  const handleHypothesis = (id: HypothesisId) => {
    if (!canTest(state)) return;
    const hadDownstream = state.reviewed || state.note !== null;
    setState((prev) => transition(prev, { type: "hypothesis", id }));
    const label = HYPOTHESES.find((h) => h.id === id)?.label ?? id;
    setLiveNotice(
      hadDownstream
        ? `Hypothesis changed to "${label}". Prior review and provisional note were cleared.`
        : `Selected hypothesis: ${label}.`
    );
  };

  const handleTrial = (id: TrialId) => {
    if (!canTest(state)) return;
    const hadDownstream = state.reviewed || state.note !== null;
    setState((prev) => transition(prev, { type: "trial", id }));
    const label = TRIALS.find((t) => t.id === id)?.label ?? id;
    setLiveNotice(
      hadDownstream
        ? `Inspected synthetic trial "${label}". Prior review and provisional note were cleared.`
        : `Inspected synthetic trial: ${label}.`
    );
  };

  const handleReview = () => {
    if (!canReview(state)) return;
    setState((prev) => transition(prev, { type: "review" }));
    setLiveNotice(
      "Source, scope, and remaining unknown examined together. Preparing a local provisional note is now unlocked."
    );
  };

  const handlePrepare = () => {
    if (!canPrepare(state)) return;
    setState((prev) => transition(prev, { type: "prepare" }));
    setLiveNotice(
      "Prepared local illustrative provisional note (not published or uploaded)."
    );
  };

  const currentStageMeta = STAGES[state.stage] ?? STAGES[0];
  const currentHypothesis =
    HYPOTHESES.find((h) => h.id === state.hypothesisId) ?? HYPOTHESES[0];

  const bridgeLabel = state.questionAligned
    ? "Joint question?"
    : grounded
      ? "Initial exchange checked"
      : state.explained.maya || state.explained.leo
        ? "Context explained"
        : state.disclosed.maya || state.disclosed.leo
          ? "Note shared"
          : "Not yet bridged";

  return (
    <section
      id="explorer"
      className="sk-explorer-section"
      aria-label="Interactive competence maps and exchange"
    >
      <div className="sk-shell">
        {/* Stage navigation bar (preview any stage, prerequisites enforced) */}
        <div className="sk-stage-bar">
          <div
            className="sk-stage-tabs"
            role="tablist"
            aria-label="Worked exchange stages"
          >
            {STAGES.map((stageItem, idx) => {
              const isSelected = state.stage === stageItem.id;
              return (
                <button
                  key={stageItem.id}
                  ref={(el) => {
                    stageTabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  tabIndex={isSelected ? 0 : -1}
                  aria-selected={isSelected}
                  id={`sk-tab-${stageItem.id}`}
                  aria-controls="sk-active-panel"
                  onClick={() => setStage(stageItem.id)}
                  onKeyDown={(e) => handleStageKeyDown(e, idx)}
                >
                  <span>0{idx + 1}</span>
                  <strong>{stageItem.label}</strong>
                </button>
              );
            })}
          </div>
          <div className="sk-stage-meta">
            <p className="sk-stage-desc">{currentStageMeta.description}</p>
            <div className="sk-stage-actions">
              <button
                type="button"
                disabled={state.stage === 0}
                onClick={() =>
                  setStage(Math.max(0, state.stage - 1) as Stage)
                }
              >
                &larr; Prev
              </button>
              <button
                type="button"
                disabled={state.stage === STAGES.length - 1}
                onClick={() =>
                  setStage(
                    Math.min(STAGES.length - 1, state.stage + 1) as Stage
                  )
                }
              >
                Next &rarr;
              </button>
              <button
                type="button"
                className="sk-reset-btn"
                onClick={handleReset}
              >
                Reset all
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-column workspace */}
        <div className="sk-workspace">
          {/* Left column: Visual Stage + Native HTML Topic Buttons */}
          <div className="sk-visual-column">
            <div className="sk-toolbar">
              <div
                className="sk-view-toggle"
                role="group"
                aria-label="Competence map layout"
              >
                <button
                  type="button"
                  aria-pressed={viewMode === "side-by-side"}
                  onClick={() => {
                    setViewMode("side-by-side");
                    setLiveNotice("Switched to side-by-side competence maps.");
                  }}
                >
                  Separate maps
                </button>
                <button
                  type="button"
                  aria-pressed={viewMode === "overlay"}
                  onClick={() => {
                    setViewMode("overlay");
                    setLiveNotice("Switched to overlay competence map.");
                  }}
                >
                  Overlay view
                </button>
              </div>
              <span
                className={`sk-status-pill ${grounded ? "sk-status-pill--grounded" : ""}`}
              >
                {grounded
                  ? "Two specific notes understood"
                  : "Shared topics: Access, Practice · not yet checked"}
              </span>
            </div>

            {viewMode === "side-by-side" ? (
              <div className="sk-maps-pair">
                <div className="sk-map-card">
                  <div className="sk-map-card-head">
                    <span className="sk-person-name sk-person-name--maya">
                      {maya.name}
                    </span>
                    <span className="sk-person-role">{maya.role}</span>
                  </div>
                  <CompetenceSvg
                    mode="maya"
                    state={state}
                    selectedTopic={selectedTopic}
                    maya={maya}
                    leo={leo}
                    sharedTopics={sharedTopics}
                    mayaBorrowed={mayaBorrowed}
                    leoBorrowed={leoBorrowed}
                  />
                </div>

                <div className="sk-bridge-lane" aria-label="Exchange bridge status">
                  <span
                    className={`sk-bridge-line ${
                      state.disclosed.maya || state.disclosed.leo
                        ? "sk-bridge-line--active"
                        : ""
                    }`}
                  />
                  <span
                    className={`sk-bridge-badge ${
                      state.questionAligned ? "sk-bridge-badge--question" : ""
                    }`}
                  >
                    {bridgeLabel}
                  </span>
                  <span
                    className={`sk-bridge-line ${
                      state.disclosed.maya || state.disclosed.leo
                        ? "sk-bridge-line--active"
                        : ""
                    }`}
                  />
                </div>

                <div className="sk-map-card">
                  <div className="sk-map-card-head">
                    <span className="sk-person-name sk-person-name--leo">
                      {leo.name}
                    </span>
                    <span className="sk-person-role">{leo.role}</span>
                  </div>
                  <CompetenceSvg
                    mode="leo"
                    state={state}
                    selectedTopic={selectedTopic}
                    maya={maya}
                    leo={leo}
                    sharedTopics={sharedTopics}
                    mayaBorrowed={mayaBorrowed}
                    leoBorrowed={leoBorrowed}
                  />
                </div>
              </div>
            ) : (
              <div className="sk-map-card sk-map-card--overlay">
                <div className="sk-map-card-head">
                  <span className="sk-person-name sk-person-name--maya">
                    {maya.name} &amp;{" "}
                    <span className="sk-person-name--leo">{leo.name}</span>
                  </span>
                  <span className="sk-person-role">
                    Superimposed schematic view
                  </span>
                </div>
                <CompetenceSvg
                  mode="overlay"
                  state={state}
                  selectedTopic={selectedTopic}
                  maya={maya}
                  leo={leo}
                  sharedTopics={sharedTopics}
                  mayaBorrowed={mayaBorrowed}
                  leoBorrowed={leoBorrowed}
                />
              </div>
            )}

            {/* Concise Legend */}
            <div className="sk-legend" aria-label="Map legend">
              <span className="sk-legend-item">
                <i className="sk-swatch sk-swatch--maya" aria-hidden="true" />
                Maya starting familiarity (solid)
              </span>
              <span className="sk-legend-item">
                <i className="sk-swatch sk-swatch--leo" aria-hidden="true" />
                Leo starting familiarity (dash-dot)
              </span>
              <span className="sk-legend-item">
                <i className="sk-swatch sk-swatch--borrowed" aria-hidden="true" />
                Dashed borrowed context (not mastery)
              </span>
              <span className="sk-legend-item">
                <i className="sk-swatch sk-swatch--frontier" aria-hidden="true" />
                Joint question? (dashed link, not proof)
              </span>
            </div>
            <p className="sk-scale-note">
              These fictional maps show relative familiarity with six topics.
              Their size is illustrative, not a measured score.
            </p>

            {/* Accessible Native HTML Topic Buttons (min 44px, readable on 320px) */}
            <div className="sk-topics-panel">
              <div className="sk-topics-heading">
                <h3>Choose a topic to compare</h3>
              </div>
              <div
                className="sk-topic-grid"
                role="group"
                aria-label="Topic spokes"
              >
                {TOPICS.map((topic, idx) => {
                  const isShared = sharedTopics.includes(topic.id);
                  const borrowedCount =
                    (mayaBorrowed.includes(topic.id) ? 1 : 0) +
                    (leoBorrowed.includes(topic.id) ? 1 : 0);
                  const metaText = isShared
                    ? "Common topic"
                    : borrowedCount > 0
                      ? "Borrowed context"
                      : "Distinct focus";
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className="sk-topic-btn"
                      aria-pressed={selectedTopic === topic.id}
                      onClick={() => selectTopic(topic.id)}
                    >
                      <span className="sk-topic-btn-top">
                        <span className="sk-topic-index">{idx + 1}</span>
                        <span>{topic.label}</span>
                      </span>
                      <span className="sk-topic-meta">{metaText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Contextual Provenance Inspector & Active Stage Controls */}
          <div className={`sk-inspector-column ${state.stage === 0 ? "sk-inspector-column--compare" : ""}`}>
            {/* Provenance Inspector */}
            <details
              className="sk-inspector-card"
              key={state.stage}
              open={state.stage === 0}
            >
              <summary>Compare perspectives · {selectedTopicObj.label}</summary>
              <div className="sk-inspector-head">
                <h3>{selectedTopicObj.label}</h3>
                {isSelectedShared ? (
                  <span
                    className="sk-topic-badge sk-topic-badge--shared"
                  >
                    Common topic · compare the meanings
                  </span>
                ) : isSelectedBorrowedByMaya || isSelectedBorrowedByLeo ? (
                  <span className="sk-topic-badge sk-topic-badge--borrowed">
                    Borrowed initial context (
                    {[
                      isSelectedBorrowedByMaya ? maya.name : null,
                      isSelectedBorrowedByLeo ? leo.name : null,
                    ]
                      .filter(Boolean)
                      .join(" & ")}
                    )
                  </span>
                ) : (
                  <span className="sk-topic-badge">Distinct familiarity</span>
                )}
              </div>

              <div className="sk-provenance-pair">
                <div className="sk-person-view">
                  <div className="sk-person-view-head">
                    <strong className="sk-person-name sk-person-name--maya">
                      {maya.name}
                    </strong>
                    <span className="sk-tier-label">
                      {levelLabel(maya.levels[selectedTopic])}
                    </span>
                  </div>
                  <dl className="sk-dl">
                    <div className="sk-dl-row">
                      <dt>Claim</dt>
                      <dd>{selectedMayaView.claim}</dd>
                    </div>
                    <div className="sk-dl-row">
                      <dt>Provenance</dt>
                      <dd>{selectedMayaView.provenance}</dd>
                    </div>
                    <div className="sk-dl-row">
                      <dt>Assumption</dt>
                      <dd>{selectedMayaView.assumption}</dd>
                    </div>
                    <div className="sk-dl-row">
                      <dt>Unknown</dt>
                      <dd>{selectedMayaView.unknown}</dd>
                    </div>
                  </dl>
                </div>

                <div className="sk-person-view sk-person-view--leo">
                  <div className="sk-person-view-head">
                    <strong className="sk-person-name sk-person-name--leo">
                      {leo.name}
                    </strong>
                    <span className="sk-tier-label">
                      {levelLabel(leo.levels[selectedTopic])}
                    </span>
                  </div>
                  <dl className="sk-dl">
                    <div className="sk-dl-row">
                      <dt>Claim</dt>
                      <dd>{selectedLeoView.claim}</dd>
                    </div>
                    <div className="sk-dl-row">
                      <dt>Provenance</dt>
                      <dd>{selectedLeoView.provenance}</dd>
                    </div>
                    <div className="sk-dl-row">
                      <dt>Assumption</dt>
                      <dd>{selectedLeoView.assumption}</dd>
                    </div>
                    <div className="sk-dl-row">
                      <dt>Unknown</dt>
                      <dd>{selectedLeoView.unknown}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </details>

            {/* Active Stage Panel */}
            <div
              className="sk-stage-panel"
              role="tabpanel"
              id="sk-active-panel"
              aria-labelledby={`sk-tab-${state.stage}`}
            >
              <div className="sk-stage-panel-head">
                <p className="sk-eyebrow">
                  Stage 0{state.stage + 1} · {currentStageMeta.label}
                </p>
              </div>

              {state.stage === 0 && (
                <>
                  <div className="sk-subpanel">
                    <h4>What the starting maps show</h4>
                    <p>
                      Maya and Leo both care why neighbourhood learners open a
                      lesson and leave before trying the exercise. Both recognise{" "}
                      <strong>Access</strong> and <strong>Practice</strong>,
                      yet their provenance and assumptions differ.
                    </p>
                    <div className="sk-note-box sk-note-box--amber">
                      <p>
                        <strong>Common topic &ne; checked understanding:</strong>{" "}
                        seeing both contours reach working familiarity on{" "}
                        <em>Access</em> only tells you they use the same word—not
                        that they mean the same thing, share a question, or
                        agree on a claim.
                      </p>
                    </div>
                    <div className="sk-btn-row">
                      <button
                        type="button"
                        className="sk-primary-btn"
                        onClick={() => setStage(1)}
                      >
                        Continue to 02 · Exchange &rarr;
                      </button>
                    </div>
                  </div>
                </>
              )}

              {state.stage === 1 && (
                <>
                  {/* Step A: Voluntary Disclosure */}
                  <div className="sk-subpanel">
                    <h4>1. Choose what to share</h4>
                    <p>
                      Each person has context the other has not seen. Choose
                      whether to bring it into the conversation. You can withdraw
                      a note and restart the exchange.
                    </p>
                    <div className="sk-btn-row">
                      <button
                        type="button"
                        aria-pressed={state.disclosed.maya}
                        onClick={() => handleDisclose("maya")}
                      >
                        {state.disclosed.maya
                          ? "Maya: Withdraw workshop note"
                          : "Maya: Share workshop note"}
                      </button>
                      <button
                        type="button"
                        aria-pressed={state.disclosed.leo}
                        onClick={() => handleDisclose("leo")}
                      >
                        {state.disclosed.leo
                          ? "Leo: Withdraw website note"
                          : "Leo: Share website note"}
                      </button>
                    </div>

                    {state.disclosed.maya ? (
                      <div className="sk-note-box">
                        <p>
                          <strong>Maya&apos;s shared note:</strong>{" "}
                          {PRIVATE_NOTES.maya.summary}
                        </p>
                        <p>
                          <em>Provenance:</em> {PRIVATE_NOTES.maya.provenance} ·{" "}
                          <em>Unknown:</em> {PRIVATE_NOTES.maya.unknown}
                        </p>
                      </div>
                    ) : (
                      <p className="sk-disabled-reason">
                        Maya&apos;s workshop context is currently withheld.
                      </p>
                    )}

                    {state.disclosed.leo ? (
                      <div className="sk-note-box sk-note-box--leo">
                        <p>
                          <strong>Leo&apos;s shared note:</strong>{" "}
                          {PRIVATE_NOTES.leo.summary}
                        </p>
                        <p>
                          <em>Provenance:</em> {PRIVATE_NOTES.leo.provenance} ·{" "}
                          <em>Unknown:</em> {PRIVATE_NOTES.leo.unknown}
                        </p>
                      </div>
                    ) : (
                      <p className="sk-disabled-reason">
                        Leo&apos;s event-schema context is currently withheld.
                      </p>
                    )}
                  </div>

                  {/* Step B: Reciprocal Explain & Reconstruct */}
                  {(["leo", "maya"] as const).map((learner) => {
                    const explainer: PersonId =
                      learner === "leo" ? "maya" : "leo";
                    const learnerName =
                      learner === "leo" ? leo.name : maya.name;
                    const explainerName =
                      explainer === "maya" ? maya.name : leo.name;
                    const explainAllowed = canExplain(state, learner);
                    const answerAllowed = canAnswer(state, learner);
                    const check = CHECKS[learner];
                    const selectedAnswerId = state.answers[learner];
                    const selectedOption = check.options.find(
                      (o) => o.id === selectedAnswerId
                    );
                    const isCorrect = state.understood[learner];

                    return (
                      <div key={learner} className="sk-subpanel">
                        <h4>
                          2. {explainerName} explains &rarr; {learnerName}{" "}
                          reconstructs
                        </h4>
                        <div className="sk-btn-row">
                          <button
                            type="button"
                            disabled={!explainAllowed || state.explained[learner]}
                            aria-pressed={state.explained[learner]}
                            onClick={() => handleExplain(learner)}
                          >
                            {state.explained[learner]
                              ? `${explainerName} explained to ${learnerName}`
                              : `${explainerName} explains context to ${learnerName}`}
                          </button>
                        </div>
                        {!explainAllowed && !state.explained[learner] && (
                          <p className="sk-disabled-reason">
                            Disabled: {explainerName} must share their note
                            above before explaining it to {learnerName}.
                          </p>
                        )}
                        {state.explained[learner] && !isCorrect && (
                          <p className="sk-feedback">
                            Explained—hearing an explanation does not establish
                            understanding. Ask {learnerName} to reconstruct the
                            point below.
                          </p>
                        )}
                        {state.explained[learner] && isCorrect && (
                          <p className="sk-feedback sk-feedback--ok">
                            Explained and initially reconstructed (borrowed
                            context added; starting maps stay unchanged).
                          </p>
                        )}

                        {answerAllowed && <fieldset className="sk-fieldset">
                          <legend>{check.prompt}</legend>
                          {check.options.map((option, oIdx) => (
                            <button
                              key={option.id}
                              type="button"
                              className="sk-option-btn"
                              disabled={!answerAllowed}
                              aria-pressed={selectedAnswerId === option.id}
                              onClick={() => handleAnswer(learner, option.id)}
                            >
                              <span className="sk-option-marker">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{option.label}</span>
                            </button>
                          ))}
                        </fieldset>}
                        {!answerAllowed && (
                          <p className="sk-disabled-reason">
                            Disabled: {explainerName} must share and explain
                            their context to {learnerName} first.
                          </p>
                        )}
                        {selectedOption && (
                          <p
                            className={`sk-feedback ${
                              isCorrect
                                ? "sk-feedback--ok"
                                : "sk-feedback--warn"
                            }`}
                          >
                            {selectedOption.feedback}{" "}
                            {isCorrect
                              ? "This adds a dashed borrowed-context arc on the map—not personal mastery."
                              : "Starting maps remain unchanged; try another reconstruction."}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="sk-btn-row">
                    <button
                      type="button"
                      className="sk-primary-btn"
                      onClick={() => setStage(2)}
                    >
                      Continue to 03 · Align on a question &rarr;
                    </button>
                  </div>
                </>
              )}

              {state.stage === 2 && (
                <div className="sk-subpanel">
                  <h4>Align on a joint question and method</h4>
                  <p>
                    After both initial understanding checks pass, Maya and Leo
                    can coordinate on a testable question without erasing their
                    different roles or agreeing in advance that an intervention
                    will work.
                  </p>
                  <div className="sk-question-card">
                    <p>{SHARED_QUESTION}</p>
                  </div>
                  <div className="sk-btn-row">
                    <button
                      type="button"
                      className="sk-primary-btn"
                      disabled={!canAlign(state) || state.questionAligned}
                      aria-pressed={state.questionAligned}
                      onClick={handleAlign}
                    >
                      {state.questionAligned
                        ? "Joint question aligned"
                        : "Align on this joint question"}
                    </button>
                    {!grounded && (
                      <button type="button" onClick={() => setStage(1)}>
                        Go to 02 · Exchange
                      </button>
                    )}
                  </div>
                  {!canAlign(state) && !state.questionAligned && (
                    <p className="sk-disabled-reason">
                      Disabled: both Maya and Leo need to share their notes,
                      explain, and pass each other&apos;s initial
                      reconstruction check in Stage 02 first.
                    </p>
                  )}
                  {state.questionAligned && (
                    <>
                      <p className="sk-feedback sk-feedback--ok">
                        Aligned on question and method. Notice on the map that
                        the joint frontier is drawn as a dashed{" "}
                        <strong>?</strong> link—coordination, not proof.
                      </p>
                      <div className="sk-btn-row">
                        <button
                          type="button"
                          className="sk-primary-btn"
                          onClick={() => setStage(3)}
                        >
                          Continue to 04 · Try &amp; revise &rarr;
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {state.stage === 3 && (
                <>
                  <div className="sk-subpanel">
                    <h4>1. Choose a hypothesis to examine</h4>
                    <div
                      className="sk-btn-row"
                      role="group"
                      aria-label="Choose hypothesis"
                    >
                      {HYPOTHESES.map((hyp) => (
                        <button
                          key={hyp.id}
                          type="button"
                          disabled={!canTest(state)}
                          aria-pressed={state.hypothesisId === hyp.id}
                          onClick={() => handleHypothesis(hyp.id)}
                        >
                          {hyp.label}
                        </button>
                      ))}
                    </div>
                    {!canTest(state) && (
                      <div className="sk-btn-row">
                        <p className="sk-disabled-reason">
                          Disabled: align on the joint question in Stage 03
                          before testing hypotheses.
                        </p>
                        <button type="button" onClick={() => setStage(2)}>
                          Go to 03 · Align on a question
                        </button>
                      </div>
                    )}
                    <p>
                      <strong>Prediction:</strong>{" "}
                      {currentHypothesis.prediction}
                    </p>
                  </div>

                  <div className="sk-subpanel">
                    <h4>
                      2. Explore a possible outcome
                    </h4>
                    <div
                      className="sk-btn-row"
                      role="group"
                      aria-label="Synthetic follow-up scenarios"
                    >
                      {TRIALS.map((trial) => (
                        <button
                          key={trial.id}
                          type="button"
                          disabled={!canTest(state)}
                          aria-pressed={state.trialId === trial.id}
                          onClick={() => handleTrial(trial.id)}
                        >
                          {trial.label}
                        </button>
                      ))}
                    </div>
                    {!canTest(state) && (
                      <p className="sk-disabled-reason">
                        Disabled: requires aligned joint question from Stage 03.
                      </p>
                    )}
                    {state.trialId && (
                      <div className="sk-note-box">
                        <p>
                          <strong>Fictional observation:</strong>{" "}
                          {
                            TRIALS.find((t) => t.id === state.trialId)
                              ?.observation
                          }
                        </p>
                      </div>
                    )}
                    {result && (
                      <div className="sk-result-card">
                        <span
                          className={`sk-status-chip sk-status-chip--${result.status}`}
                        >
                          {RESULT_STATUS_LABELS[result.status]}
                        </span>
                        <p>
                          <strong>Finding:</strong> {result.finding}
                        </p>
                        <p>
                          <strong>Scope:</strong> {result.scope}
                        </p>
                        <p>
                          <strong>Remaining unknown:</strong> {result.unknown}
                        </p>
                        <p className="sk-scale-note">
                          Changing hypothesis or trial clears any prior review
                          and provisional note.
                        </p>
                      </div>
                    )}
                    <div className="sk-btn-row">
                      <button
                        type="button"
                        className="sk-primary-btn"
                        onClick={() => setStage(4)}
                      >
                        Continue to 05 · Contribute &rarr;
                      </button>
                    </div>
                  </div>
                </>
              )}

              {state.stage === 4 && (
                <>
                  <div className="sk-subpanel">
                    <h4>1. Examine source, scope &amp; unknowns together</h4>
                    <p>
                      Any outcome—including a <strong>not-supported</strong> or{" "}
                      <strong>mixed</strong> result—can become an examined
                      provisional note once both partners inspect its source,
                      scope, and remaining unknown.
                    </p>
                    <div className="sk-btn-row">
                      <button
                        type="button"
                        className="sk-primary-btn"
                        disabled={!canReview(state) || state.reviewed}
                        aria-pressed={state.reviewed}
                        onClick={handleReview}
                      >
                        {state.reviewed
                          ? "Source, scope & unknowns examined"
                          : "Examine source, scope & unknowns together"}
                      </button>
                      {!canReview(state) && !state.reviewed && (
                        <button type="button" onClick={() => setStage(3)}>
                          Go to 04 · Try &amp; revise
                        </button>
                      )}
                    </div>
                    {!canReview(state) && !state.reviewed && (
                      <p className="sk-disabled-reason">
                        Disabled: align on the question (Stage 03) and inspect a
                        synthetic follow-up scenario (Stage 04) first.
                      </p>
                    )}
                    {state.reviewed && (
                      <p className="sk-feedback sk-feedback--ok">
                        Examined together. You can now prepare an illustrative
                        provisional note below.
                      </p>
                    )}
                  </div>

                  <div className="sk-subpanel">
                    <h4>2. Keep a provisional note</h4>
                    <div className="sk-btn-row">
                      <button
                        type="button"
                        className="sk-primary-btn"
                        disabled={!canPrepare(state) || state.note !== null}
                        aria-pressed={state.note !== null}
                        onClick={handlePrepare}
                      >
                        {state.note !== null
                          ? "Provisional note prepared (local)"
                          : "Prepare a provisional note"}
                      </button>
                    </div>
                    {!canPrepare(state) && state.note === null && (
                      <p className="sk-disabled-reason">
                        Disabled: complete the joint examination step above
                        first.
                      </p>
                    )}
                    {state.note !== null && (
                      <p className="sk-disabled-reason">
                        Change the scenario or reset to explore another case.
                      </p>
                    )}

                    {state.note && (
                      <article
                        className="sk-contribution-card"
                        aria-label="Prepared illustrative provisional note"
                      >
                        <span className="sk-status-chip sk-status-chip--supported-in-example">
                          {state.note.status} · Local preview only
                        </span>
                        <h4>{state.note.title}</h4>
                        <p>
                          <strong>Question:</strong> {state.note.question}
                        </p>
                        <p>
                          <strong>Hypothesis:</strong> {state.note.hypothesis}
                        </p>
                        <p>
                          <strong>Finding:</strong> {state.note.finding}
                        </p>
                        <p>
                          <strong>Scope:</strong> {state.note.scope}
                        </p>
                        <p>
                          <strong>Remaining unknown:</strong>{" "}
                          {state.note.unknown}
                        </p>
                        <p>
                          <strong>Contributors:</strong>{" "}
                          {state.note.contributors.join(" · ")}
                        </p>
                        <p>
                          <strong>Provenance:</strong>{" "}
                          {state.note.provenance.join(" · ")}
                        </p>
                        <p className="sk-scale-note">
                          This is a preview for this visit only. Nothing is published.
                        </p>
                      </article>
                    )}
                  </div>
                </>
              )}

              <div className="sk-live-region" aria-live="polite">
                {liveNotice}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
