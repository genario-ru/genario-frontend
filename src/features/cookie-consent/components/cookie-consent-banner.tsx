import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/components/ui/button";
import { Island } from "@/shared/components/ui/island";
import { SPACE } from "@/shared/constants/unicode";

import { useCookieConsentBanner } from "../hooks/use-cookie-consent-banner";

export function CookieConsentBanner() {
  const { hasDecision, handleAccept, handleReject } = useCookieConsentBanner();

  if (hasDecision) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-2 p-4">
      <Island className="bg-neutral-8/80 dark:bg-neutral-8/90 pointer-events-auto mx-auto max-w-xl backdrop-blur-sm">
        <p className="text-neutral-1 text-sm">
          Мы используем веб-аналитику, чтобы понимать, как люди пользуются
          сервисом. Без вашего согласия ничего не собирается. Подробнее — в
          {SPACE}
          <Link
            to="/legal/$slug"
            params={{ slug: "cookie-policy" }}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-2 underline underline-offset-2"
          >
            политике cookie
          </Link>
          .
        </p>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            className="w-full flex-1 justify-center"
            onClick={handleReject}
          >
            Отклонить
          </Button>
          <Button
            variant="accent"
            priority="primary"
            className="w-full flex-1 justify-center"
            onClick={handleAccept}
          >
            Принять
          </Button>
        </div>
      </Island>
    </div>
  );
}
