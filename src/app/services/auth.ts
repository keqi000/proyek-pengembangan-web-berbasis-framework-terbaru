import axios from "axios";

type RegisterUserRequestDataType = {
  username: string;
  password: string;
}

type LoginUserRequestDataType = RegisterUserRequestDataType

// TODO: include role
export async function registerUser(data: RegisterUserRequestDataType){
  const response = axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/register`, data)

  return response
}

export async function loginUser(data: LoginUserRequestDataType){
  const response = axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/login`, data)
  
  return response
}