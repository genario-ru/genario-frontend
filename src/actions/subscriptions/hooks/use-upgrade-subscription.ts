import { usePostApiV1SubscriptionsUpgrade } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useUpgradeSubscription() {
  const trackEvent = useTrackEvent();

  const {
    mutate: upgradeSubscription,
    isPending: isUpgradeSubscriptionPending,
    isError: isUpgradeSubscriptionError,
    isSuccess: isUpgradeSubscriptionSuccess,
  } = usePostApiV1SubscriptionsUpgrade({
    mutation: {
      onSuccess: () => trackEvent("subscription-upgrade"),
    },
  });

  return {
    upgradeSubscription,
    isUpgradeSubscriptionPending,
    isUpgradeSubscriptionError,
    isUpgradeSubscriptionSuccess,
  };
}
