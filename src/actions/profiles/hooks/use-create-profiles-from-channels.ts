import { usePostApiV1ProfilesChannels } from "@/codegen/api/product";
import { useTrackEvent } from "@/lib/umami";

export function useCreateProfilesFromChannels() {
  const trackEvent = useTrackEvent();

  const {
    mutate: createProfilesFromChannels,
    isPending: isCreateProfilesFromChannelsPending,
    isError: isCreateProfilesFromChannelsError,
  } = usePostApiV1ProfilesChannels({
    mutation: {
      onSuccess: () => trackEvent("profile-import-start"),
    },
  });

  return {
    createProfilesFromChannels,
    isCreateProfilesFromChannelsPending,
    isCreateProfilesFromChannelsError,
  };
}
