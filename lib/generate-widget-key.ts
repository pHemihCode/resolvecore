// lib/generate-widget-key.ts
import crypto from "crypto";

export function generateWidgetKey(): string {
  const randomBytes = crypto.randomBytes(16).toString("hex");
  return `wk_${randomBytes}`;
}

export function generateShortWidgetKey(): string {
  const randomBytes = crypto.randomBytes(8).toString("hex");
  return `wk_${randomBytes}`;
}