import { loginUser } from "@/app/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation(){
  const mutation = useMutation({
    mutationFn: async (data: {username: string, password: string}) => loginUser(data)
  })
  return mutation
}