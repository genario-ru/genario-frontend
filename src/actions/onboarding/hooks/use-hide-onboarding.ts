import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  getApiV1AuthSessionQueryKey,
  type GetApiV1AuthSessionQueryResponse,
  usePatchApiV1AuthUser,
} from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

type HideOnboardingContext = {
  previousSessionData?: GetApiV1AuthSessionQueryResponse;
};

export function useHideOnboarding() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showErrorToast } = useToast();
  const sessionQueryKey = getApiV1AuthSessionQueryKey();

  const { mutate: hideOnboarding, isPending: isHideOnboardingPending } =
    usePatchApiV1AuthUser<HideOnboardingContext>({
      mutation: {
        onMutate: async () => {
          await queryClient.cancelQueries({ queryKey: sessionQueryKey });

          const previousSessionData =
            queryClient.getQueryData<GetApiV1AuthSessionQueryResponse>(
              sessionQueryKey,
            );

          queryClient.setQueryData<GetApiV1AuthSessionQueryResponse>(
            sessionQueryKey,
            (currentSessionData) => {
              if (!currentSessionData) return currentSessionData;

              return {
                ...currentSessionData,
                user: {
                  ...currentSessionData.user,
                  hideOnboarding: true,
                },
              };
            },
          );

          return { previousSessionData };
        },
        onSuccess: () => {
          trackEvent("onboarding-hide");
        },
        onError: (_error, _variables, context) => {
          if (context?.previousSessionData) {
            queryClient.setQueryData(
              sessionQueryKey,
              context.previousSessionData,
            );
          }

          showErrorToast({
            description: "Не удалось скрыть онбординг. Попробуйте еще раз",
          });
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: sessionQueryKey });
        },
      },
    });

  const handleHideOnboarding = useCallback(() => {
    hideOnboarding({ data: { hideOnboarding: true } });
  }, [hideOnboarding]);

  return { isHideOnboardingPending, handleHideOnboarding };
}
