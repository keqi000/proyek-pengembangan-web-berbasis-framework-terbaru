import { loginUser, registerUser } from "@/app/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation(){
  const mutation = useMutation({
    mutationFn: async (data: {username: string, password: string}) => loginUser(data)
  })
  return mutation
}

export function useRegisterMutation(){
  const mutation = useMutation({
    mutationFn: async (data: {username: string, password: string, role: string}) => registerUser(data)
  })
  return mutation
}