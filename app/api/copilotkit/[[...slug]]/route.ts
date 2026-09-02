import {
  CopilotKitIntelligence,
  CopilotRuntime,
  InMemoryAgentRunner,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const openAiApiKey = process.env.OPENAI_API_KEY;

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
  apiKey: openAiApiKey,
});

const intelligenceApiKey = process.env.INTELLIGENCE_API_KEY;
const hasIntelligenceKey =
  intelligenceApiKey && !intelligenceApiKey.startsWith("your_");

const copilotRuntime = hasIntelligenceKey
  ? new CopilotRuntime({
      agents: { default: builtInAgent },
      intelligence: new CopilotKitIntelligence({
        apiKey: intelligenceApiKey,
      }),
      // Threads are per-user. Without this, every visitor shares one history.
      identifyUser: (request) => ({
        id: request.headers.get("x-user-id") ?? "anonymous",
        name: request.headers.get("x-user-name") ?? "Anonymous",
      }),
    })
  : new CopilotRuntime({
      agents: { default: builtInAgent },
      runner: new InMemoryAgentRunner(),
      // No Intelligence key: run in OSS/SSE in-memory mode with OPENAI_API_KEY.
      // Add INTELLIGENCE_API_KEY later to enable persistent per-user threads.
    });

const runtimeHandler = createCopilotRuntimeHandler({
  runtime: copilotRuntime,
  basePath: "/api/copilotkit",
});

const missingOpenAiKeyResponse = () =>
  Response.json(
    {
      error: "OPENAI_API_KEY is not configured.",
      message:
        "Set OPENAI_API_KEY in Vercel Project Settings > Environment Variables, then redeploy the project.",
    },
    { status: 500 },
  );

export const GET = runtimeHandler;

export const POST = (request: Request) => {
  if (!openAiApiKey || openAiApiKey.startsWith("your_")) {
    return missingOpenAiKeyResponse();
  }

  return runtimeHandler(request);
};
