// Product events sent to Umami. The list is closed: useTrackEvent only accepts
// a value from this union, which gives autocomplete and protection against
// typos. Add an event here before it is used.
export type AnalyticsEvent =
  // Лендинг и аутентификация
  | "sign-in-success"
  | "sign-in-button-click"
  | "login-link-click"
  | "tariff-card-primary-button-click"
  | "tariff-card-secondary-button-click"
  | "trial-tariff-anchor-link-click"
  | "landing-header-menu-link-click"
  | "tg-community-link-click"
  | "support-email-link-click"
  | "legal-document-click"
  // Активация
  | "profile-create-success"
  | "profile-import-start"
  | "ideas-list-generation-start"
  | "ideas-list-more-ideas-request"
  | "idea-save"
  | "ideas-list-export-request"
  | "scenario-generation-start"
  | "scenario-save"
  | "scenario-export-request"
  | "scenario-metadata-generation-start"
  | "scenario-metadata-regenerate"
  | "scene-preview-generation-start"
  // Монетизация
  | "trial-payment-start"
  | "subscription-payment-start"
  | "credits-package-payment-start"
  | "payment-method-add"
  | "subscription-upgrade"
  | "subscription-cancel"
  // Прочее
  | "onboarding-hide"
  | "account-delete-success";

/** Event properties: flat values only, never personal data. */
export type AnalyticsEventData = Record<string, string | number | boolean>;
