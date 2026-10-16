import { useEffect } from "react";

import { ANALYTICS_PRIVATE_ATTRIBUTE } from "../constants/analytics-private-attribute";

/**
 * Keeps the page out of session replays while it is shown: the interviews,
 * reports, resumes and the email typed at sign-in are personal data the
 * cookie policy promises not to record. The marker goes on the body, so
 * dialogs and drawers portalled into it are covered too.
 */
export function useAnalyticsPrivatePage() {
  useEffect(() => {
    document.body.setAttribute(ANALYTICS_PRIVATE_ATTRIBUTE, "");

    return () => {
      document.body.removeAttribute(ANALYTICS_PRIVATE_ATTRIBUTE);
    };
  }, []);
}
