import { usePostApiV1SubscriptionsInitiatePayment } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useInitiateSubscriptionPayment() {
  const trackEvent = useTrackEvent();

  const {
    mutate: initiateSubscriptionPayment,
    isPending: isInitiateSubscriptionPaymentPending,
    isError: isInitiateSubscriptionPaymentError,
    isSuccess: isInitiateSubscriptionPaymentSuccess,
  } = usePostApiV1SubscriptionsInitiatePayment({
    mutation: {
      onSuccess: (_data, variables) => {
        const goal = variables.data.trialTariffSlug
          ? "trial-payment-start"
          : "subscription-payment-start";

        trackEvent(goal);
      },
    },
  });

  return {
    isInitiateSubscriptionPaymentPending,
    isInitiateSubscriptionPaymentError,
    isInitiateSubscriptionPaymentSuccess,
    initiateSubscriptionPayment,
  };
}
