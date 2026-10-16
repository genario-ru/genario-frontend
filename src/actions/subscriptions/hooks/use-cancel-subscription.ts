import { useQueryClient } from "@tanstack/react-query";

import {
  getApiV1SubscriptionsMyQueryKey,
  usePostApiV1SubscriptionsBySubscriptionIdCancel,
} from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";
import { useToast } from "@/shared/hooks/use-toast";

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const trackEvent = useTrackEvent();
  const { showSuccessToast, showErrorToast } = useToast();

  const { mutate: cancelSubscription, isPending: isCancelSubscriptionPending } =
    usePostApiV1SubscriptionsBySubscriptionIdCancel({
      mutation: {
        onSuccess: () => {
          trackEvent("subscription-cancel");

          queryClient.invalidateQueries({
            queryKey: getApiV1SubscriptionsMyQueryKey(),
          });

          showSuccessToast({
            title: "Подписка отменена",
            description:
              "Доступ сохранится до конца оплаченного периода. Новых списаний не будет",
          });
        },
        onError: () => {
          showErrorToast({
            description: "Не удалось отменить подписку. Попробуйте ещё раз",
          });
        },
      },
    });

  return {
    cancelSubscription,
    isCancelSubscriptionPending,
  };
}
