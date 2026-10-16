import type { UmamiTracker } from "../types/umami-tracker";

type UmamiCall = (umami: UmamiTracker) => void;

/** Calls made before the tracker script has loaded. */
const pendingCalls: UmamiCall[] = [];

/**
 * Runs a tracker call now, or once the tracker has loaded: the script loads
 * after consent, and the first events and the user's identity come earlier.
 */
export function callUmami(call: UmamiCall) {
  if (window.umami) {
    call(window.umami);

    return;
  }

  pendingCalls.push(call);
}

/** Runs the calls made while the tracker was loading. */
export function flushUmamiCalls() {
  const { umami } = window;

  if (!umami) {
    return;
  }

  pendingCalls.splice(0).forEach((call) => {
    call(umami);
  });
}
