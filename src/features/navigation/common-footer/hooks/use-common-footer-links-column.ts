import { useMemo } from "react";

import { useTrackEvent } from "@/lib/umami";

import type { CommonFooterLinksColumn } from "../types/common-footer-links";

export function useCommonFooterLinksColumn(
  items: CommonFooterLinksColumn["items"],
) {
  const trackEvent = useTrackEvent();

  return useMemo(
    () =>
      items.map(({ goal, ...link }) => ({
        link,
        handleClick: () => trackEvent(goal),
      })),
    [items, trackEvent],
  );
}
