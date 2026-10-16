/**
 * The tracker's path on the Umami server. It is renamed from the default
 * `script.js` (TRACKER_SCRIPT_NAME), which ad blockers match.
 */
export const UMAMI_TRACKER_PATH = "/p.js";

/** Session replay and heatmaps; Umami serves it under this fixed name. */
export const UMAMI_RECORDER_PATH = "/recorder.js";
