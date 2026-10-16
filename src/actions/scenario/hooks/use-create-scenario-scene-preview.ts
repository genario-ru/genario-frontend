import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1ScenariosChaptersByChapterIdQueryKey,
  usePostApiV1ScenariosScenesBySceneIdPreview,
} from "@/codegen/api/product";
import { isPaymentRequiredError } from "@/lib/api/utils/is-payment-required-error";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

type UseCreateScenarioScenePreviewParams = {
  chapterId: string;
};

export function useCreateScenarioScenePreview({
  chapterId,
}: UseCreateScenarioScenePreviewParams) {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showErrorToast } = useToast();

  const {
    mutate: createScenarioScenePreview,
    isPending: isCreateScenarioScenePreviewPending,
  } = usePostApiV1ScenariosScenesBySceneIdPreview({
    mutation: {
      onError: (error) => {
        const description = isPaymentRequiredError(error)
          ? "Недостаточно кредитов для генерации превью сцены"
          : "Произошла ошибка при создании превью сцены";

        showErrorToast({ description: description });
      },
      onSuccess: () => {
        trackEvent("scene-preview-generation-start");

        queryClient.invalidateQueries({
          queryKey: getApiV1ScenariosChaptersByChapterIdQueryKey({
            chapterId,
          }),
        });
      },
    },
  });

  return {
    createScenarioScenePreview,
    isCreateScenarioScenePreviewPending,
  };
}
