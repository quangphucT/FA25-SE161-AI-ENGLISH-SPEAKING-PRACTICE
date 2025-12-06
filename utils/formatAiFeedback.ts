const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatLine = (line: string) => {
  const bolded = line.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="font-weight:700;color:#1e40af;background:linear-gradient(135deg,#3b82f6 0%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">$1</strong>'
  );

  if (bolded.trim().startsWith("###")) {
    const text = bolded.replace(/^###\s*/, "");
    return `<h3 style="font-size:1.4em;font-weight:700;color:#1e40af;margin-top:1.2em;margin-bottom:0.6em;padding-bottom:0.4em;border-bottom:2px solid #e0e7ff;">${text}</h3>`;
  }

  if (/^\d+\.\s/.test(bolded)) {
    return `<div style="margin:0.8em 0;padding:1em 1.2em;padding-left:1.5em;font-size:1.05em;background:linear-gradient(to right,rgba(59,130,246,0.1),rgba(99,102,241,0.05));border-left:4px solid #3b82f6;border-radius:10px;box-shadow:0 2px 6px rgba(15,23,42,0.08);">${bolded}</div>`;
  }

  if (/^(\*|•|-)\s+/.test(bolded)) {
    const text = bolded.replace(/^(\*|•|-)\s+/, "");
    return `<div style="display:flex;align-items:flex-start;gap:0.6em;margin:0.4em 0;padding:0.4em 0.6em;border-radius:8px;background:rgba(99,102,241,0.05);"><span style="color:#6366f1;font-weight:700;">•</span><span>${text}</span></div>`;
  }

  const colonIndex = bolded.indexOf(":");
  if (colonIndex > 0 && colonIndex < 80) {
    const label = bolded.slice(0, colonIndex);
    const rest = bolded.slice(colonIndex + 1).trim();
    return `<p style="margin:0.6em 0;line-height:1.8;"><span style="font-weight:600;color:#334155;">${label}:</span> ${rest}</p>`;
  }

  return `<p style="margin:0.6em 0;line-height:1.8;">${bolded}</p>`;
};

/**
 * Convert a raw AI feedback string into beautiful HTML with subtle styling.
 */
export const formatAiFeedbackHtml = (feedback?: string | null) => {
  if (!feedback || !String(feedback).trim()) {
    return "";
  }

  const normalized = escapeHtml(String(feedback).trim())
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Ensure numbered/bullet sections break lines even when returned on one line
    .replace(/(\d+\.\s)/g, "\n$1")
    .replace(/(\*\s)/g, "\n$1")
    .replace(/(-\s)/g, "\n$1");

  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(formatLine)
    .join("");
};

