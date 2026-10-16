import { TanstackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { CookieConsentBanner } from "@/features/cookie-consent/components/cookie-consent-banner";
import { useUmamiInitialize } from "@/lib/umami";
import { Toaster } from "@/shared/components/ui/toaster";

export function RootComponent() {
  useUmamiInitialize();

  return (
    <>
      <HeadContent />
      <Scripts />
      <Outlet />
      <CookieConsentBanner />
      <Toaster />
      <TanstackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: "React Query",
            render: <ReactQueryDevtools />,
          },
        ]}
      />
    </>
  );
}
