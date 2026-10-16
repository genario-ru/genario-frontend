import { useState } from "react";
import { useEventListener } from "usehooks-ts";

import { COOKIE_CONSENT_CHANGE_EVENT } from "@/shared/constants/window-events";

import { getUmamiConfig } from "../utils/get-umami-config";

/** The tracker's settings, read again whenever the cookie consent changes. */
export function useUmamiConfig() {
  const [umamiConfig, setUmamiConfig] = useState(getUmamiConfig());

  useEventListener(COOKIE_CONSENT_CHANGE_EVENT, () => {
    setUmamiConfig(getUmamiConfig());
  });

  return umamiConfig;
}
