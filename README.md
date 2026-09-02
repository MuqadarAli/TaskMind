# TaskMind

TaskMind is a polished todo workspace built with Next.js, Tailwind CSS,
Framer Motion, Zustand, and CopilotKit.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
