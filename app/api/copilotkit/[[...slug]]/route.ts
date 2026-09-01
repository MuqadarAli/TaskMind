import {
  CopilotKitIntelligence,
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from "@copilotkit/runtime/v2";
import { BuiltInAgent } from "@copilotkit/runtime/v2";

const builtInAgent = new BuiltInAgent({
  model: "openai:gpt-5.4-mini",
});

const intelligenceApiKey = process.env.INTELLIGENCE_API_KEY;
const hasIntelligenceKey =
  intelligenceApiKey && !intelligenceApiKey.startsWith("your_");

const runtime = hasIntelligenceKey
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
      // No Intelligence key: run in OSS/SSE in-memory mode with OPENAI_API_KEY.
      // Add INTELLIGENCE_API_KEY later to enable persistent per-user threads.
    });

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
