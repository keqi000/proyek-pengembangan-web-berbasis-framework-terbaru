import { redirect } from "next/navigation";

export default function UserTempPage(){
  // TODO: check the user in middleware
  redirect('/user/home')
}