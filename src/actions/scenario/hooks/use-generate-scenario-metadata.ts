import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1ScenariosByScenarioIdMetadataQueryKey,
  usePostApiV1ScenariosByScenarioIdMetadataGenerate,
} from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

export function useGenerateScenarioMetadata() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showErrorToast } = useToast();

  const {
    mutate: generateScenarioMetadata,
    isPending: isGenerateScenarioMetadataPending,
  } = usePostApiV1ScenariosByScenarioIdMetadataGenerate({
    mutation: {
      onSuccess: (_data, variables) => {
        trackEvent("scenario-metadata-generation-start");

        queryClient.invalidateQueries({
          queryKey: getApiV1ScenariosByScenarioIdMetadataQueryKey({
            scenarioId: variables.scenarioId,
          }),
        });
      },
      onError: () => {
        showErrorToast({
          title: "Ошибка",
          description: "Не удалось запустить генерацию метаданных",
        });
      },
    },
  });

  return {
    generateScenarioMetadata,
    isGenerateScenarioMetadataPending,
  };
}
