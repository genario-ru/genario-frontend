import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1OnboardingQueryKey,
  getApiV1ProfilesMyQueryKey,
  usePostApiV1Profiles,
} from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showSuccessToast, showErrorToast } = useToast();

  const { mutate: createProfile, isPending: isCreateProfilePending } =
    usePostApiV1Profiles({
      mutation: {
        onSuccess: ({ data }) => {
          trackEvent("profile-create-success");

          queryClient.invalidateQueries({
            queryKey: getApiV1ProfilesMyQueryKey(),
          });

          queryClient.invalidateQueries({
            queryKey: getApiV1OnboardingQueryKey(),
          });

          showSuccessToast({
            title: "Профиль создан",
            description: `Профиль "${data.name}" успешно создан`,
          });
        },
        onError: () => {
          showErrorToast({
            description: `Произошла ошибка при создании профиля. Попробуйте еще раз немного позже`,
          });
        },
      },
    });

  return { createProfile, isCreateProfilePending };
}
