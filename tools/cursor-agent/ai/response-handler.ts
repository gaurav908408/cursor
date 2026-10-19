import type { GenerateContentResponse } from "@google/genai";

export interface CleanedResponse {
  rawText: string;
  jsonText: string;
  finishReason?: string;
}

export function extractJsonFromResponse(
  response: GenerateContentResponse,
  maxOutputTokens?: number
): CleanedResponse {
  const candidate = response.candidates?.[0];
  const finishReason = candidate?.finishReason;

  // cut off mid-generation
  if (finishReason === "MAX_TOKENS") {
    const limitInfo = maxOutputTokens ? ` (${maxOutputTokens} tokens)` : "";
    throw new Error(
      `Gemini reached the maximum output token limit${limitInfo}. ` +
      `The response was truncated mid-generation, resulting in incomplete code. ` +
      `Please narrow your task (e.g., request changes to a specific file or break the task into smaller steps).`
    );
  }

  if (finishReason && !["STOP", "FINISH_REASON_UNSPECIFIED"].includes(finishReason)) {
    throw new Error(
      `Gemini generation did not finish normally. Finish reason: ${finishReason}.`
    );
  }

  const rawText = response.text || "";

  if (!rawText.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  const jsonText = cleanJsonText(rawText);

  return {
    rawText,
    jsonText,
    finishReason: finishReason || "STOP",
  };
}

export function cleanJsonText(text: string): string {
  let cleaned = text.trim();

  // strip ```json fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\r?\n?/, "");
    cleaned = cleaned.replace(/\r?\n?```\s*$/, "");
    cleaned = cleaned.trim();
  }

  return cleaned;
}

export function parseJsonSafely<T = unknown>(jsonText: string): T {
  try {
    return JSON.parse(jsonText) as T;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // looks like truncation
    if (
      errorMessage.includes("Unterminated string") ||
      errorMessage.includes("Unexpected end of JSON input") ||
      errorMessage.includes("JSON.parse: unterminated string")
    ) {
      const tailPreview = jsonText.slice(-120).trim();
      throw new Error(
        `Gemini output was cut off or contained an unterminated string in JSON.\n` +
        `Truncated tail preview: "...${tailPreview}"\n` +
        `Resolution: The requested change was likely too large for the model's output buffer. ` +
        `Try breaking the task into smaller, focused file edits.`
      );
    }

    throw new Error(`Failed to parse Gemini response as JSON: ${errorMessage}`);
  }
}
