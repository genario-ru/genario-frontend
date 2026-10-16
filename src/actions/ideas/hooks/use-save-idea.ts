import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1IdeasListsByIdeasListIdQueryKey,
  usePatchApiV1IdeasByIdeaIdSave,
} from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

export function useSaveIdea() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showErrorToast } = useToast();

  const { mutate: saveIdea, isPending: isSaveIdeaPending } =
    usePatchApiV1IdeasByIdeaIdSave({
      mutation: {
        onError: () => {
          showErrorToast({
            description:
              "Произошла ошибка при сохранении идеи. Попробуйте еще раз чуть позже",
          });
        },
        onSuccess: ({ data }) => {
          if (data.saved) {
            trackEvent("idea-save");
          }

          queryClient.invalidateQueries({
            queryKey: getApiV1IdeasListsByIdeasListIdQueryKey({
              ideasListId: data.ideasListId,
            }),
          });
        },
      },
    });

  return {
    saveIdea,
    isSaveIdeaPending,
  };
}
