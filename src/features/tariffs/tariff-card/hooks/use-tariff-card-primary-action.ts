import { useCallback } from "react";

import { useTrackEvent } from "@/lib/umami";

export function useTariffCardPrimaryAction() {
  const trackEvent = useTrackEvent();

  const handleClick = useCallback(
    () => trackEvent("tariff-card-primary-button-click"),
    [trackEvent],
  );

  return { handleClick };
}
