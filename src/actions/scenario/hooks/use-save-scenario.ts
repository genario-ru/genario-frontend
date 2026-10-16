import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1ScenariosByScenarioIdQueryKey,
  usePatchApiV1ScenariosByScenarioIdSave,
} from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

export function useSaveScenario() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showErrorToast } = useToast();

  const { mutate: saveScenario, isPending: isSaveScenarioPending } =
    usePatchApiV1ScenariosByScenarioIdSave({
      mutation: {
        onError: () => {
          showErrorToast({
            description:
              "Произошла ошибка при сохранении сценария. Попробуйте еще раз чуть позже",
          });
        },
        onSuccess: ({ data }) => {
          if (data.saved) {
            trackEvent("scenario-save");
          }

          queryClient.invalidateQueries({
            queryKey: getApiV1ScenariosByScenarioIdQueryKey({
              scenarioId: data.id,
            }),
          });
        },
      },
    });

  return {
    saveScenario,
    isSaveScenarioPending,
  };
}
