# TaskMind

TaskMind is a polished todo workspace built with Next.js, Tailwind CSS,
Framer Motion, Zustand, and CopilotKit, powered by AI to help users create,
organize, update, and remove tasks through a native chat popup.

## Features

- Animated todo dashboard with Inbox, Today, Overdue, Upcoming, and Completed views.
- Fast local task state with Zustand and localStorage persistence.
- Smooth Framer Motion interactions for adding, completing, deleting, and reordering tasks.
- Dark mode by default with full light mode support.
- CopilotKit AI chat popup wired to task tools for create, update, and delete actions.
- Vercel-ready Copilot runtime using an OpenAI API key.

## AI Examples

Try these prompts in the TaskMind AI chat:

```text
Create a high priority task called Review launch checklist due tomorrow.
```

```text
Update the billing dashboard task to high priority and add the tag planning.
```

```text
Delete the finance emails task.
```

```text
Show me which tasks are still open.
```

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Environment

Create `.env.local` for local development:

```bash
OPENAI_API_KEY=your_openai_api_key
```

For Vercel, add `OPENAI_API_KEY` in Project Settings > Environment Variables
for Production, Preview, and Development, then redeploy.

`INTELLIGENCE_API_KEY` and `NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY` are optional.
Without them, CopilotKit runs in SSE/in-memory mode.

## CI / CD

GitHub Actions runs lint and production build checks on pull requests and every
push to `main` using `.github/workflows/ci-cd.yml`.

Deployment is handled by the Vercel Git integration:

- Push to `main` to trigger a production deployment.
- Open a pull request to trigger a preview deployment.
- If AI chat fails only on Vercel, check `/api/copilotkit/info` and confirm
  `OPENAI_API_KEY` is configured in Vercel environment variables.
