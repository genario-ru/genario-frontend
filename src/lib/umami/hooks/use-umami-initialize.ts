import { useEffect } from "react";

import { loadUmami } from "../utils/load-umami";
import { useUmamiConfig } from "./use-umami-config";

/**
 * Loads analytics once the cookies are consented to. Nothing reaches the
 * Umami server before that.
 */
export function useUmamiInitialize() {
  const umamiConfig = useUmamiConfig();

  useEffect(() => {
    if (!umamiConfig.enabled) {
      return;
    }

    loadUmami({ url: umamiConfig.url, websiteId: umamiConfig.websiteId });
  }, [umamiConfig]);
}
