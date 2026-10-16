import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1ScenariosByScenarioIdMetadataQueryKey,
  usePostApiV1ScenariosByScenarioIdMetadataRegenerate,
} from "@/codegen/api/product";
import { isPaymentRequiredError } from "@/lib/api/utils/is-payment-required-error";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

export function useRegenerateScenarioMetadata() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showErrorToast } = useToast();

  const {
    mutate: regenerateScenarioMetadata,
    isPending: isRegenerateScenarioMetadataPending,
  } = usePostApiV1ScenariosByScenarioIdMetadataRegenerate({
    mutation: {
      onSuccess: (_data, variables) => {
        trackEvent("scenario-metadata-regenerate");

        queryClient.invalidateQueries({
          queryKey: getApiV1ScenariosByScenarioIdMetadataQueryKey({
            scenarioId: variables.scenarioId,
          }),
        });
      },
      onError: (error) => {
        const description = isPaymentRequiredError(error)
          ? "Недостаточно кредитов для повторной генерации метаданных"
          : "Не удалось запустить повторную генерацию метаданных";

        showErrorToast({
          title: "Ошибка",
          description,
        });
      },
    },
  });

  return {
    regenerateScenarioMetadata,
    isRegenerateScenarioMetadataPending,
  };
}
