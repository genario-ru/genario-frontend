import { usePostApiV1AuthEmailOtpSignIn } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useSignInEmailOtp() {
  const trackEvent = useTrackEvent();

  const {
    mutate: signIn,
    isPending: isSignInPending,
    isSuccess: isSignInSuccess,
  } = usePostApiV1AuthEmailOtpSignIn({
    mutation: {
      onSuccess: () => trackEvent("sign-in-success"),
    },
  });

  return {
    signIn,
    isSignInPending,
    isSignInSuccess,
  };
}
