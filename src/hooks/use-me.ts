import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/lib/user-api";

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    enabled,
    refetchOnWindowFocus: false,
  });
}
