import { useCallback } from "react";

import { useTrackEvent } from "@/lib/umami";

export function useLandingHeroActions() {
  const trackEvent = useTrackEvent();

  const handleClick = useCallback(
    () => trackEvent("trial-tariff-anchor-link-click"),
    [trackEvent],
  );

  return { handleClick };
}
