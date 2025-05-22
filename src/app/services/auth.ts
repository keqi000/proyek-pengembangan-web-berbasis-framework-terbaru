import axios from "axios";

type RegisterUserRequestDataType = {
  username: string;
  password: string;
}

export async function registerUser(data: RegisterUserRequestDataType){
  const response = axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/register`, data)

  return response
}