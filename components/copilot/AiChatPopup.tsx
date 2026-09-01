"use client";

import { CopilotPopup } from "@copilotkit/react-core/v2";

export function AiChatPopup() {
  return (
    <CopilotPopup
      agentId="default"
      defaultOpen={false}
      width="min(420px, calc(100vw - 2rem))"
      height="min(620px, calc(100vh - 6rem))"
      clickOutsideToClose
      labels={{
        modalHeaderTitle: "TaskMind AI",
        welcomeMessageText:
          "Ask me for planning advice, prioritization ideas, or help thinking through your tasks.",
        chatInputPlaceholder: "Ask TaskMind AI...",
        chatToggleOpenLabel: "Open TaskMind AI chat",
        chatToggleCloseLabel: "Close TaskMind AI chat",
      }}
    />
  );
}
