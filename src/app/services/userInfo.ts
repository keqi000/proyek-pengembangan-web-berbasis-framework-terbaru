import axios from "axios";

type UserInfoData = {
    id: number,
    username: string,
    role: string,
    email_verified_at: null | string,
    created_at: null | string,
    updated_at: null | string
        
}

type UserInfoResponse = {
    message: string,
    data: UserInfoData
}

export const fetchUserInfo = async () => {
  try {
    const response = await axios.get<UserInfoResponse>(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/me`);
    return response?.data;
  } catch (error) {
    console.error("Error user info:", error);
    throw error;
  }
};