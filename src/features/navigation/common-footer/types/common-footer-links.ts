import type { LinkComponentProps } from "@tanstack/react-router";

import type { AnalyticsEvent } from "@/lib/umami";

type CommonFooterLinkItemStatic = {
  title: string;
  goal: AnalyticsEvent;
};

type CommonFooterLinkItemLocal = LinkComponentProps;

type CommonFooterLinkItemExternal = {
  href: string;
};

type CommonFooterLinkItemDynamic =
  | CommonFooterLinkItemLocal
  | CommonFooterLinkItemExternal;

type CommonFooterLinkItem = CommonFooterLinkItemStatic &
  CommonFooterLinkItemDynamic;

export type CommonFooterLinksColumn = {
  title: string;
  items: CommonFooterLinkItem[];
};
