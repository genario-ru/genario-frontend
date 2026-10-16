import { useCallback } from "react";

import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from "../types/analytics-event";
import { callUmami } from "../utils/call-umami";
import { useUmamiConfig } from "./use-umami-config";

export function useTrackEvent() {
  const umamiConfig = useUmamiConfig();

  return useCallback(
    (event: AnalyticsEvent, data?: AnalyticsEventData) => {
      if (!umamiConfig.enabled) {
        return;
      }

      callUmami((umami) => {
        void umami.track(event, data);
      });
    },
    [umamiConfig],
  );
}
