import { envs } from "@/shared/constants/envs";
import { isCookieConsentAccepted } from "@/shared/utils/cookie-consent";

import type { UmamiConfig } from "../types/umami-config";

export function getUmamiConfig(): UmamiConfig {
  const url = envs.VITE_UMAMI_URL;
  const websiteId = envs.VITE_UMAMI_WEBSITE_ID;
  const isProduction = envs.MODE === "production";
  const isConsentAccepted = isCookieConsentAccepted();

  if (url && websiteId && isConsentAccepted && isProduction) {
    return {
      enabled: true,
      url,
      websiteId,
    };
  }

  return {
    enabled: false,
  };
}
