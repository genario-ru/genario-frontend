import type { UmamiTracker } from "@/lib/umami";

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
