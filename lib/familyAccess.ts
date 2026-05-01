import { createHash, createHmac, timingSafeEqual } from "crypto";

export const FAMILY_ACCESS_COOKIE = "casa_mimosa_family_access";

const TOKEN_PAYLOAD = "casa-mimosa-family-access-v1";

export function getConfiguredFamilyCode() {
  return process.env.FAMILY_ACCESS_CODE?.trim();
}

export function isFamilyCodeValid(code: string, configuredCode = getConfiguredFamilyCode()) {
  if (!configuredCode) {
    return false;
  }

  const receivedHash = createHash("sha256").update(code.trim()).digest();
  const expectedHash = createHash("sha256").update(configuredCode).digest();

  return timingSafeEqual(receivedHash, expectedHash);
}

export function createFamilyAccessToken(configuredCode = getConfiguredFamilyCode()) {
  if (!configuredCode) {
    throw new Error("FAMILY_ACCESS_CODE is not configured.");
  }

  return createHmac("sha256", configuredCode).update(TOKEN_PAYLOAD).digest("hex");
}

export function isFamilyAccessTokenValid(
  token: string | undefined,
  configuredCode = getConfiguredFamilyCode(),
) {
  if (!token || !configuredCode) {
    return false;
  }

  const expected = createFamilyAccessToken(configuredCode);
  const received = Buffer.from(token, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (received.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(received, expectedBuffer);
}
