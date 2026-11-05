---
name: lexiva-project-context
description: "Use when working on Lexiva Intelligence Space, its AI chat workspace, multi-model API integrations, model attribution, UI, product goals, architecture, or project documentation. Read the README and relevant source files before proposing or implementing changes."
user-invocable: true
---
# Lexiva Intelligence Space Project Context

Use this skill when exploring, changing, reviewing, or explaining this project.

## Source of truth

1. Read the project overview and goals in the root `README.md`.
2. Read the relevant implementation files before changing behavior. This skill's structure map is a starting point, not a substitute for checking the current code.
3. If the README, source, and this skill disagree, trust the current implementation for existing behavior and do not claim planned features are already implemented.
4. If the product direction changes, update the README and this skill so they remain aligned.
5. Treat older landing-page and Asana-inspired design notes as historical research only. They are not the Lexiva product specification.
6. Do not copy the branding, UI, copy, artwork, or product identity of ChatGPT, Claude, Gemini, Asana, Notion, Linear, or other existing products.

---

# Product Identity

## Product name

**Lexiva Intelligence Space**

Short brand:

**Lexiva**

Current product category:

**AI Chat Workspace**

Current product focus:

> **A modern space for exploring, comparing, and working with multiple AI models through conversations.**

Lexiva's target is the **AI chat experience**; verify the code before describing it as implemented.

The broader workspace, AI model building, agents, project management, and advanced collaboration features are future directions and should not be treated as currently implemented unless they exist in the codebase.

---

# Current Product Vision

Lexiva should feel like an intelligent space where users can interact with different AI models without needing a separate interface for every provider.

The core experience is:

```text
Discover
   ↓
Choose an AI Model
   ↓
Start a Conversation
   ↓
Explore / Ask / Create
   ↓
Save & Continue
```

The primary product is **conversation-first**.

The user should be able to enter Lexiva and immediately understand:

- What Lexiva is.
- Which AI models are available.
- How to start a conversation.
- How to switch models.
- How to access previous conversations.
- How Lexiva differs from a single-model AI chatbot.

---

# Target Product Scope

## 1. AI Chat

AI Chat is the primary feature.

Users should be able to:

- Start a new conversation.
- Continue existing conversations.
- Send messages.
- Receive AI responses.
- View conversation history.
- Switch between supported AI models.
- Organize conversations.
- Copy useful responses.
- Regenerate responses where supported.
- Attach files/context where implemented.
- Save useful conversations where implemented.

The exact behavior must always follow the current implementation.

Do not invent backend functionality that does not exist.
The current repository is still a landing-page prototype; these chat capabilities are product goals, not implemented functionality until the source code confirms them.

---

# 2. Multi-Model AI

Lexiva should be designed around the idea of **multiple AI models in one space**.

Potential model options may include:

```text
GPT
Claude
Gemini
Other supported models
```

These names should only be presented as available models when the application actually supports them.

The UI should make the currently selected model obvious.

Example:

```text
Model
┌──────────────────┐
│ GPT              │
│ Claude           │
│ Gemini           │
└──────────────────┘
```

The model selector should be easy to access without interrupting the conversation.

---

# 3. Model Comparison

A major future/current capability may be comparing multiple AI models.

Conceptually:

```text
                 User Prompt
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
       GPT          Claude        Gemini
        │             │             │
        └─────────────┼─────────────┘
                      ↓
                Compare Results
```

Comparison UI should clearly identify which response belongs to which model.

Never simulate responses and present them as real provider responses.

If comparison is currently frontend-only/demo functionality, clearly maintain that distinction.

---

# 4. Conversation Workspace

The main workspace should prioritize conversation.

A typical layout may contain:

```text
┌───────────────────────────────────────────┐
│ Lexiva                         Model ▼    │
├──────────────┬────────────────────────────┤
│              │                            │
│ New Chat     │        Conversation        │
│              │                            │
│ Recent       │        AI Response         │
│              │                            │
│ Chat 1       │        AI Response         │
│ Chat 2       │                            │
│ Chat 3       │                            │
│              │                            │
│              │ ┌────────────────────────┐ │
│              │ │ Ask anything...        │ │
│              │ └────────────────────────┘ │
└──────────────┴────────────────────────────┘
```

The interface should feel focused and uncluttered.

Avoid turning the target product into a project-management dashboard.

---

# 5. Conversation History

Users should have an easy way to return to previous conversations.

Possible structure:

```text
Today
├── Building a React application
├── Understanding AI agents
└── Website ideas

Yesterday
├── Database architecture
└── Product research
```

The exact grouping and persistence behavior depends on the current implementation.

---

# 6. AI-First Navigation

The target navigation should prioritize AI interaction.

Possible structure:

```text
LEXIVA

New Chat

Chats
├── Recent
├── Saved
└── Search

Models
├── GPT
├── Claude
├── Gemini
└── Other Models

Compare

Library

Settings
```

Do not add routes simply because they appear in this conceptual structure.

Always inspect the current project before implementing navigation changes.

---

# Current Pages

| Route | Current behavior |
| --- | --- |
| `/` | Lexiva concept landing page and workflow overview |
| `/chat` | Local-only message preview; no AI provider calls or generated replies |
| `/models` | Provider setup guidance; no connected provider is claimed as available |
| `/compare` | Disabled comparison UI; no simulated or real model responses |
| `/history` | Empty state; conversations are not persisted |

The root layout renders shared navigation and the site-wide Lexiva footer on every route.
These pages communicate target product structure but do not imply that model APIs, accounts, comparison, or persistence are implemented.

---

# Target Homepage

The homepage should primarily introduce Lexiva as an **AI Chat Workspace**. The repository currently renders a marketing-page prototype, so do not claim a working AI chat or provider integration until implemented.

The homepage should quickly communicate:

### What Lexiva is

A space for interacting with multiple AI models.

### Why Lexiva exists

Instead of jumping between different AI interfaces, users can explore AI from one focused workspace.

### Core message

```text
Multiple AI models.
One intelligent space.
```

Possible homepage messaging:

> **Meet your intelligent space for AI.**

> **Explore multiple AI models in one place.**

> **One space to think, explore, and create with AI.**

> **Your conversations. Your models. One space.**

The final copy should be original and should match the current product implementation.

---

# Future Product Direction

The following concepts are **future roadmap items**, not current product requirements unless they already exist in the implementation.

## Future: AI Model Building

Lexiva may eventually allow users to:

- Build custom AI models.
- Configure model behavior.
- Create custom assistants.
- Connect knowledge sources.
- Configure prompts.
- Build specialized AI experiences.
- Test models.
- Compare custom models.

Possible future flow:

```text
Create Model
      ↓
Configure
      ↓
Add Knowledge
      ↓
Test
      ↓
Publish
      ↓
Use in Lexiva Chat
```

Do not implement or advertise model-building capabilities as available unless they are actually implemented.

---

# Future: AI Agents

Potential future functionality:

- Autonomous agents.
- Tool use.
- Multi-step workflows.
- Scheduled tasks.
- Research agents.
- Coding agents.
- Specialized assistants.

These are future possibilities only.

---

# Future: Broader Workspace

Lexiva may eventually expand beyond chat into:

```text
AI Chat
   ↓
Projects
   ↓
Tasks
   ↓
Knowledge
   ↓
Team
   ↓
Automation
```

Potential future features:

- Projects
- Tasks
- Team collaboration
- Shared knowledge
- Workspace documents
- AI-generated project plans
- AI-to-task conversion
- Workflow automation
- Team intelligence
- AI-powered project summaries

These should remain roadmap concepts until implemented.

---

# Core Differentiator

Lexiva should not be positioned as simply another ChatGPT clone.

The long-term differentiator is:

> **Multiple AI capabilities brought together into one evolving intelligence space.**

The product can eventually grow from:

```text
AI Chat
   ↓
Multi-Model Workspace
   ↓
AI Knowledge
   ↓
AI Agents
   ↓
Model Building
   ↓
Intelligent Workflows
```

However, the product should remain focused on delivering an excellent AI chat experience.

---

# Design Direction

Lexiva should have its own visual identity.

The design should feel:

- Intelligent
- Premium
- Minimal
- Modern
- Calm
- Futuristic
- Human
- Focused

Avoid making the interface look like a generic AI dashboard.

Avoid excessive:

- Neon effects
- Generic AI gradients
- Robot illustrations
- Overly futuristic sci-fi graphics
- Excessive glassmorphism
- Copying existing AI product interfaces

Use original visual patterns.

---

# AI Chat UI Principles

## Conversation first

The conversation should remain the primary focus.

Avoid unnecessary panels and controls competing with the message area.

## Model visibility

Always make the active model clear.

## Composer

The message composer should be prominent and easy to use.

Potential controls:

```text
Attach
Model
Context
Send
```

Only show controls that actually work.

## Loading state

Use meaningful loading states while waiting for responses.

## Streaming

If real streaming is implemented, communicate it naturally.

If streaming is not implemented, do not fake streaming behavior.

## Error handling

AI/API errors should be clearly communicated.

Example:

> Unable to generate a response. Please try again.

Avoid hiding technical failures behind misleading success messages.

---

# Conversation Context

Future versions may allow users to reference:

```text
@Chat
@File
@Knowledge
@Model
```

This can eventually become the foundation for contextual AI.

For example:

```text
@Project
Summarize this information.
```

or:

```text
@File
Explain this code.
```

Only implement context references when the underlying functionality exists.

---

# File and Knowledge Support

Lexiva may eventually allow users to attach:

- PDFs
- Documents
- Images
- Code
- Text files
- Other supported formats

The AI could then use these as conversation context.

Until implemented, do not imply that Lexiva can analyze uploaded files.

If file upload is implemented only on the frontend, clearly distinguish local/demo behavior from real AI processing.

---

# Technical Architecture

The current repository is the source of truth.

The project currently uses or may use:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Sass
- Framer Motion
- GSAP

Before adding or removing dependencies, inspect:

```text
package.json
```

and the relevant source files.

Do not assume a technology is available solely because it is listed in this skill.

---

# AI Provider Architecture

When real AI APIs are introduced, avoid tightly coupling the frontend to one provider.

Prefer an abstraction similar to:

```text
Chat UI
   ↓
AI Service
   ↓
Model Provider Adapter
   ├── GPT
   ├── Claude
   ├── Gemini
   └── Future Providers
```

This makes it possible to add or replace AI providers without rebuilding the chat interface.

Provider API keys must never be exposed in client-side code.

---

# Security

Never expose secret API keys in:

- React components
- Browser requests
- Public environment variables
- Git repositories
- Client-side configuration

Real AI provider requests should use appropriate server-side infrastructure.

Do not store sensitive conversation data insecurely.

When authentication is introduced, protect user conversations and files according to authorization rules.

---

# Responsive Design

Lexiva must work across:

- Desktop
- Laptop
- Tablet
- Mobile

The AI chat interface is especially important on mobile.

Mobile should provide:

- Accessible chat history.
- Easy model selection.
- Large message composer.
- Comfortable touch targets.
- Proper keyboard behavior.
- No unnecessary horizontal scrolling.

---

# Accessibility

Preserve:

- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible labels.
- Appropriate contrast.
- Screen-reader support.
- Reduced-motion support.

Interactive controls must be usable without relying exclusively on hover.

---

# Motion

Framer Motion and GSAP may be used for restrained motion.

Use animation to communicate:

- Page transitions.
- Chat states.
- Model switching.
- Content hierarchy.
- Loading.
- Context changes.
- Product storytelling.

Do not animate everything.

Respect:

```text
prefers-reduced-motion
```

---

# Honest Product Behavior

The UI must accurately represent what the application actually does.

For example, do not display:

> "Response generated by Claude"

unless the application actually generated the response using Claude.

Do not display:

> "Conversation saved"

unless it has actually been persisted.

Do not display:

> "File analyzed"

unless the application actually processed the file.

For frontend-only demonstrations, use clear demo/local language where necessary.

---

# Target vs Future Scope

## Target AI Chat Experience

```text
┌──────────────────────────────┐
│        LEXIVA                │
│   Intelligence Space         │
├──────────────────────────────┤
│                              │
│      AI CHAT WORKSPACE       │
│                              │
│  ├── New Chat                │
│  ├── Conversation History   │
│  ├── Model Selection        │
│  ├── Multi-Model Chat       │
│  ├── Compare                │
│  └── AI-focused UX          │
│                              │
└──────────────────────────────┘
```

## Future

```text
AI Chat
   ↓
Multi-Model Intelligence
   ↓
Knowledge
   ↓
Agents
   ↓
Model Building
   ↓
Projects
   ↓
Team Workspace
   ↓
Automation
```

Do not allow future features to unnecessarily complicate the target AI chat experience.
The above is a product target, not a description of features already present in the current landing-page prototype.

---

# Architecture Map

| Area | Files | Responsibility |
| --- | --- | --- |
| App shell | `src/app/layout.tsx` | Root metadata, global styles, shared navigation and footer |
| Landing page | `src/app/page.tsx` | Hero and workflow overview |
| Chat preview | `src/app/chat/page.tsx` | Local-only chat state and explicit provider-unavailable notice |
| Model status | `src/app/models/page.tsx` | Provider registry empty state and secure setup guidance |
| Compare preview | `src/app/compare/page.tsx` | Disabled comparison UI without fabricated responses |
| History page | `src/app/history/page.tsx` | Empty state for unimplemented persistence |
| Shared footer | `src/components/ui/site-footer.tsx` | Product links and prototype/provider status across routes |
| Brand asset | `public/lexiva-mark.png` | Official standalone gradient circuit mark; pair with the live-text Lexiva wordmark and Intelligence Space tagline |
| Shared page UI | `src/components/ui/product-ui.tsx` | Page headings, prototype notices, and empty states |
| Navigation | `src/components/ui/nav.tsx` | Cross-route navigation and responsive mobile menu |

---

# Development Workflow

Before making changes:

 1. Read the root `README.md`.
 2. Inspect the current homepage.
 3. Check whether AI/chat components exist before assuming they do.
 4. Inspect the current navigation.
 5. Inspect global styles and design tokens.
 6. Check existing state management.
 7. Check existing API/provider integrations.
 8. Check responsive behavior.
 9. Make the smallest reusable change.
10. Preserve the existing design system.
11. Validate accessibility.
12. Test reduced-motion behavior when relevant.
13. Run the smallest relevant validation.
14. Run `npm run build` for meaningful application or TypeScript changes.
15. Update the README when product direction, routes, architecture, or integration status changes.

---

# Important Rules

### Rule 1 — Current implementation wins

If this skill conflicts with the actual code, trust the current implementation for existing behavior.

### Rule 2 — Do not overbuild

Lexiva is currently an **AI Chat Workspace**.

Do not introduce project-management, model-building, agent, or enterprise features simply because they are mentioned in the future roadmap.

### Rule 3 — Keep the architecture extensible

Build today's AI chat experience in a way that can support future multi-model and AI capabilities without unnecessary rewrites.

### Rule 4 — Original identity

Lexiva should have its own branding, copy, visual language, and interaction patterns.

### Rule 5 — No fake AI

Never simulate real model/provider functionality and present it as genuine.

### Rule 6 — Documentation stays aligned

When the product direction changes, update:

- `README.md`
- This `skill.md`
- Relevant architecture documentation
- Homepage copy
- Metadata
- Navigation
- Product terminology

---

# Product North Star

For the current phase:

> **Lexiva is an Intelligence Space for AI conversations.**

The immediate goal is not to build an entire AI operating system.

The immediate goal is to build an **excellent, distinctive, extensible AI chat workspace** that can later grow into a broader intelligence platform.

**Current priority:**

> **Make AI conversation feel like a space, not just a chat box.**