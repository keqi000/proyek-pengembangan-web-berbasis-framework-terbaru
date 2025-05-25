import axios from "axios";

export interface LoginUserRequestDataType {
  username: string;
  password: string;
}

export interface RegisterUserRequestDataType extends LoginUserRequestDataType {
  username: string;
  password: string;
  role: string;
}

// TODO: include role
export async function registerUser(data: RegisterUserRequestDataType) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/register`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

export async function loginUser(data: LoginUserRequestDataType) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/login`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
