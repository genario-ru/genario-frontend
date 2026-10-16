import { Outlet } from "@tanstack/react-router";

import { useAnalyticsPrivatePage } from "@/lib/umami";
import { ContentLayout } from "@/shared/components/layouts/content-layout";
import { PageLayout } from "@/shared/components/layouts/page-layout";

export function AuthComponent() {
  useAnalyticsPrivatePage();

  return (
    <PageLayout className="h-fit min-h-full md:p-8">
      <ContentLayout className="max-w-6xl flex-1 items-center justify-center">
        <Outlet />
      </ContentLayout>
    </PageLayout>
  );
}
