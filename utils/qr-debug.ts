/**
 * QR Code Debug Utilities
 * Use these functions to debug QR code issues on production
 */

export const validateBase64QR = (base64String: string | null | undefined): {
  isValid: boolean;
  issues: string[];
  info: Record<string, any>;
} => {
  const issues: string[] = [];
  const info: Record<string, any> = {};

  if (!base64String) {
    issues.push("QR string is null or undefined");
    return { isValid: false, issues, info };
  }

  info.length = base64String.length;
  info.firstChars = base64String.substring(0, 50);
  info.lastChars = base64String.substring(base64String.length - 20);

  // Check if has data URI prefix
  if (!base64String.startsWith("data:image")) {
    issues.push("Missing data URI prefix (data:image/...)");
    info.hasPrefix = false;
  } else {
    info.hasPrefix = true;
    info.mimeType = base64String.split(";")[0];
  }

  // Check if has base64 marker
  if (!base64String.includes("base64,")) {
    issues.push("Missing base64 marker");
    info.hasBase64Marker = false;
  } else {
    info.hasBase64Marker = true;
  }

  // Check minimum length (a valid QR is usually > 1000 chars)
  if (base64String.length < 100) {
    issues.push(`String too short (${base64String.length} chars)`);
    info.isTooShort = true;
  } else {
    info.isTooShort = false;
  }

  // Check if base64 data looks valid (contains typical base64 chars)
  const base64Data = base64String.split("base64,")[1] || base64String;
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  const sample = base64Data.substring(0, 100);
  
  if (!base64Regex.test(sample)) {
    issues.push("Base64 data contains invalid characters");
    info.hasInvalidChars = true;
  } else {
    info.hasInvalidChars = false;
  }

  info.isValid = issues.length === 0;

  return {
    isValid: issues.length === 0,
    issues,
    info,
  };
};

export const logQRDebug = (
  qrData: string | null | undefined,
  context: string = "QR Debug"
) => {
  console.group(`🔍 ${context}`);
  
  const validation = validateBase64QR(qrData);
  
  console.log("Valid:", validation.isValid ? "✅" : "❌");
  console.log("Info:", validation.info);
  
  if (validation.issues.length > 0) {
    console.warn("Issues:", validation.issues);
  }
  
  console.groupEnd();
  
  return validation;
};

export const fixBase64QR = (qrData: string | null | undefined): string | null => {
  if (!qrData) return null;

  let fixed = qrData.trim();

  // Add data URI prefix if missing
  if (!fixed.startsWith("data:image")) {
    // Detect image type from base64 header
    if (fixed.startsWith("iVBOR")) {
      fixed = `data:image/png;base64,${fixed}`;
    } else if (fixed.startsWith("/9j/")) {
      fixed = `data:image/jpeg;base64,${fixed}`;
    } else {
      // Default to PNG
      fixed = `data:image/png;base64,${fixed}`;
    }
  }

  return fixed;
};
