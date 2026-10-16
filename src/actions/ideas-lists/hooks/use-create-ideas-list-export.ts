import { usePostApiV1IdeasListsByIdeasListIdExport } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useCreateIdeasListExport() {
  const trackEvent = useTrackEvent();

  const {
    mutate: createIdeasListExport,
    isPending: isCreateIdeasListExportPending,
  } = usePostApiV1IdeasListsByIdeasListIdExport({
    mutation: {
      onSuccess: () => trackEvent("ideas-list-export-request"),
    },
  });

  return {
    createIdeasListExport,
    isCreateIdeasListExportPending,
  };
}
