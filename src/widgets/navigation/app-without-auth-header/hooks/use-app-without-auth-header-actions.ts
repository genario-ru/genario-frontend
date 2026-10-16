import { useCallback } from "react";

import { useGetSession } from "@/actions/auth/hooks/use-get-session";
import { useSignOut } from "@/actions/auth/hooks/use-sign-out";
import { useTrackEvent } from "@/lib/umami";
import { NBSP, RUBLE_SIGN } from "@/shared/constants/unicode";
import { useBreakpoints } from "@/shared/hooks/use-breakpoints";

export function useAppWithoutAuthHeaderActions() {
  const signOut = useSignOut();
  const trackEvent = useTrackEvent();
  const { isMobile } = useBreakpoints();
  const { sessionData, isSessionLoading } = useGetSession();

  const homeButtonContent = isMobile ? "ЛК" : "Личный кабинет";

  const tryButtonContent = isMobile
    ? "3 дня за 1 ₽"
    : `Попробовать 3 дня за 1${NBSP}${RUBLE_SIGN}`;

  const isLoggedIn = Boolean(sessionData);

  const handleLoginClick = useCallback(
    () => trackEvent("login-link-click"),
    [trackEvent],
  );

  return {
    isSessionLoading,
    isLoggedIn,
    homeButtonContent,
    tryButtonContent,
    signOut,
    handleLoginClick,
  };
}
