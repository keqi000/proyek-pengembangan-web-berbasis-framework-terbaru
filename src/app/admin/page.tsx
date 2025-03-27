import { redirect } from "next/navigation";

export default function AdminTemporaryPage(){
  // TODO: set checker in middleware and probably in this pages
  redirect('/admin/home')  
}