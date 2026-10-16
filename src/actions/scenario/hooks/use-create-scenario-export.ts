import { usePostApiV1ScenariosByScenarioIdExport } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useCreateScenarioExport() {
  const trackEvent = useTrackEvent();

  const {
    mutate: createScenarioExport,
    isPending: isCreateScenarioExportPending,
  } = usePostApiV1ScenariosByScenarioIdExport({
    mutation: {
      onSuccess: () => trackEvent("scenario-export-request"),
    },
  });

  return {
    createScenarioExport,
    isCreateScenarioExportPending,
  };
}
