import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPersona, postLearn, PersonaUpdateRequest } from "../lib/api";

export const usePersona = (userId: string) => {
  const queryClient = useQueryClient();

  const personaQuery = useQuery({
    queryKey: ["persona", userId],
    queryFn: () => fetchPersona(userId),
    enabled: Boolean(userId),
  });

  const learnMutation = useMutation({
    mutationFn: (payload: PersonaUpdateRequest) => postLearn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["persona", userId] });
    },
  });

  return { personaQuery, learnMutation };
};

