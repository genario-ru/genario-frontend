import { useEffect } from "react";

import type { AuthenticatedSessionSchema } from "@/codegen/api/product";

import { callUmami } from "../utils/call-umami";
import { useUmamiConfig } from "./use-umami-config";

type UseAnalyticsIdentifyParams = {
  sessionData: AuthenticatedSessionSchema;
};

/**
 * Tells Umami who is signed in, once the cookies are consented to: only the
 * account id, never the email.
 */
export function useAnalyticsIdentify({
  sessionData,
}: UseAnalyticsIdentifyParams) {
  const umamiConfig = useUmamiConfig();
  const userId = sessionData.user.id;

  useEffect(() => {
    if (!umamiConfig.enabled) {
      return;
    }

    // The account id goes in as session data, not as Umami's distinct id: a
    // distinct id is part of the session hash, so the visit would split into
    // two visitors at sign-in, one before it and one after.
    callUmami((umami) => {
      void umami.identify({ accountId: userId });
    });
  }, [userId, umamiConfig]);
}
