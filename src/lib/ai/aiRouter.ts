// ======================================================
// SUB AI ROUTER — 100% LOCAL, NO API KEYS, NO INTERNET
// ======================================================

import type { AIRequest, AIResponse } from "./types";
import { getSubAIResponse } from "./subAiBrain";

export async function getSmartResponse(
  request: AIRequest
): Promise<AIResponse> {

  try {

    const message = request.message ?? "";

    const local = getSubAIResponse(message);

    return {
      text: local.text,
      confidence: local.confidence,
      source: "bitzy",
    };

  } catch (error) {

    console.error("Sub AI Router Error:", error);

    return {
      text:
`⚠️ Sorry! Sub AI ko thoda issue aa gaya.

Try again after a few seconds.

You can still ask me:
• HTML, CSS, JavaScript
• React, Python, SQL, Git
• Bitzy XP & Arena 🚀`,
      confidence: 0,
      source: "bitzy",
    };

  }

}
