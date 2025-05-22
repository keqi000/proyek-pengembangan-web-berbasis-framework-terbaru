import { loginUser, LoginUserRequestDataType, registerUser, RegisterUserRequestDataType } from "@/app/services/auth";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation(){
  const mutation = useMutation({
    mutationFn: async (data: LoginUserRequestDataType) => loginUser(data)
  })
  return mutation
}

export function useRegisterMutation(){
  const mutation = useMutation({
    mutationFn: async (data: RegisterUserRequestDataType) => registerUser(data)
  })
  return mutation
}