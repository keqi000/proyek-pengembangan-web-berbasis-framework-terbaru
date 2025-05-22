import axios from "axios";

export interface LoginUserRequestDataType {
  username: string;
  password: string;
}

export interface RegisterUserRequestDataType extends LoginUserRequestDataType{
  username: string;
  password: string;
  role: string
}

// TODO: include role
export async function registerUser(data: RegisterUserRequestDataType){
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/register`, data)

  return response.data
}

export async function loginUser(data: LoginUserRequestDataType){
  const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/login`, data)
  
  return response.data
}