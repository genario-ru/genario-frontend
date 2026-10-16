import {
  UMAMI_RECORDER_PATH,
  UMAMI_TRACKER_PATH,
} from "../constants/umami-scripts";
import { appendUmamiScript } from "./append-umami-script";
import { flushUmamiCalls } from "./call-umami";

type LoadUmamiParams = {
  url: string;
  websiteId: string;
};

/**
 * Loads the tracker and the session recorder. The tracker reports the first
 * page itself and every route change through the History API. Query strings
 * are dropped: links can carry tokens and emails.
 */
export function loadUmami({ url, websiteId }: LoadUmamiParams) {
  const hostUrl = url.replace(/\/$/, "");

  appendUmamiScript({
    src: `${hostUrl}${UMAMI_TRACKER_PATH}`,
    attributes: {
      "data-website-id": websiteId,
      "data-host-url": hostUrl,
      "data-exclude-search": "true",
      "data-performance": "true",
    },
    onLoad: flushUmamiCalls,
  });

  // Its masking, block selector and sample rate come from the website's
  // settings in Umami.
  appendUmamiScript({
    src: `${hostUrl}${UMAMI_RECORDER_PATH}`,
    attributes: {
      "data-website-id": websiteId,
      "data-host-url": hostUrl,
    },
  });
}
