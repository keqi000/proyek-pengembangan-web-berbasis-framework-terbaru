import { fetchUserInfo } from "@/app/services/userInfo"
import { useQuery } from "@tanstack/react-query"

export function useUserInfo(){
  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => fetchUserInfo()
  })
  return query
}