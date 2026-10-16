type UmamiEnabledConfig = {
  enabled: true;
  url: string;
  websiteId: string;
};

type UmamiDisabledConfig = {
  enabled: false;
};

export type UmamiConfig = UmamiEnabledConfig | UmamiDisabledConfig;
