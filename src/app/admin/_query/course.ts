import { useQuery } from "@tanstack/react-query"
import { getAllCourse } from "../_service/course"

export function useCourseInfo(){
  return useQuery({
    queryKey: ["course"],
    queryFn: () => getAllCourse()
  })
}