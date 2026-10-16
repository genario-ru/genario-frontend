import type { AnalyticsEventData } from "./analytics-event";

/**
 * The `window.umami` object of the tracker script.
 * @see https://umami.is/docs/tracker-functions
 */
export type UmamiTracker = {
  track: (event: string, data?: AnalyticsEventData) => Promise<void>;
  identify: (
    idOrData: string | AnalyticsEventData,
    data?: AnalyticsEventData,
  ) => Promise<void>;
};
