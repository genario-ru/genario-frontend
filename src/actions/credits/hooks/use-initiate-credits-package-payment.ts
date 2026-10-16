import { usePostApiV1CreditsPackagesInitiatePayment } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useInitiateCreditsPackagePayment() {
  const trackEvent = useTrackEvent();

  const {
    mutate: initiateCreditsPackagePayment,
    isPending: isInitiateCreditsPackagePaymentPending,
    isError: isInitiateCreditsPackagePaymentError,
    isSuccess: isInitiateCreditsPackagePaymentSuccess,
  } = usePostApiV1CreditsPackagesInitiatePayment({
    mutation: {
      onSuccess: () => trackEvent("credits-package-payment-start"),
    },
  });

  return {
    isInitiateCreditsPackagePaymentPending,
    isInitiateCreditsPackagePaymentError,
    isInitiateCreditsPackagePaymentSuccess,
    initiateCreditsPackagePayment,
  };
}
