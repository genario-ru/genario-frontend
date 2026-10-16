import { useCallback } from "react";

import { useTrackEvent } from "@/lib/umami";

export function useLandingHeaderLinks() {
  const trackEvent = useTrackEvent();

  const handleClick = useCallback(
    () => trackEvent("landing-header-menu-link-click"),
    [trackEvent],
  );

  return { handleClick };
}
