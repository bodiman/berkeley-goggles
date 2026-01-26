Love@Berkeley — Product & Architecture Plan
Project Name

Love@Berkeley

Strategic Role in Ecosystem

Love@Berkeley is the preference-profiling and onboarding surface for an asymmetric dating system. While Berkeley Goggles serves as the active ranking and visibility engine (primarily male-facing), Love@Berkeley serves as the values, intent, and preference capture layer (primarily female-facing).


Love@Berkeley users will fill out a questionaire before being added to the same user base as berkeleygoggles. Then, they will be prompted to complete 25 rankings of male berkeleygoggles users.

The two systems share:

The same card objects

The same comparison engine

The same backend ranking pipeline

But they differ in:

Data usage

Visibility

Core Behavior
Phase 1 — Rapid Questionnaire (10 Questions, ~3–4 min)

Collects structured relationship preferences, boundaries, and intent signals

Responses are:

Stored in a separate table

Not used for ranking, trophies, or leaderboards

Reserved for future matching, filtering, and compatibility scoring

Phase 2 — Shared Card Comparison

Users are shown the exact same cards as Berkeley Goggles

UI + logic is powered by the shared Comparison Engine

Comparison results:

Flow through the same backend ranking service

Affect the global rating model

Do NOT generate trophies or Love@Berkeley leaderboards

Are tagged with source = "love"

This allows Love@Berkeley users to shape the visibility and ordering of Berkeley Goggles cards without participating in gamification mechanics.

Architectural Principles
Asymmetric Power Design

Love@Berkeley = Signal Input Layer

Berkeley Goggles = Signal Amplification Layer

Backend = Unified Ranking Authority

This enables:

Preference-driven matchmaking later

Soft moderation of rankings

Bias correction

Gender-segmented UX without forked infrastructure

Data Model
Questionnaire Table
love_questionnaire_responses
- id
- user_id
- session_id
- answers JSONB
- created_at
- version
Ranking Attribution

All ranking writes include:

source: "goggles" | "love" | "future"

This enables:

Weighting or filtering by source later

A/B testing asymmetric effects

Match quality analytics

Shared Frontend Component
<ComparisonEngine
  sessionId="..."
  cards={Card[]}
  source="love"
  mode="dating"
  onSubmit={(payload) => POST /api/rankings/submit}
/>
Deployment Model

Web-first

Same auth stack as Berkeley Goggles

Separate route or domain:

/love or love.berkeleygoggles.com

Long-Term Evolution Path

This architecture supports:

Compatibility scoring

Soft “shadow matching”

Preference-filtered card feeds

Selective visibility boosting

Private mutual matches without public leaderboards

High-Impact Design Questions (For Future Iteration)
Identity & Visibility

Love@Berkeley users become a part of the berkeleygoggles user pool and vice versa.