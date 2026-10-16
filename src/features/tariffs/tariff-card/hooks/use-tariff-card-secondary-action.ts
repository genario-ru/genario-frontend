import { useCallback } from "react";

import { useTrackEvent } from "@/lib/umami";

export function useTariffCardSecondaryAction() {
  const trackEvent = useTrackEvent();

  const handleClick = useCallback(
    () => trackEvent("tariff-card-secondary-button-click"),
    [trackEvent],
  );

  return { handleClick };
}
