import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCourse, getAllCourse, updateCourse } from "../_service/course"
import { CourseItem } from "../_schema/course"

export function useCourseInfo(){
  return useQuery({
    queryKey: ["course"],
    queryFn: () => getAllCourse()
  })
}

type CreateCourseProps = Omit<CourseItem, "id">

export function useCreateCourse(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['course'],
    mutationFn: (data: CreateCourseProps) => createCourse(data),
    onSuccess: (data, variable, context) => {
      console.log("Success to create course")
      queryClient.invalidateQueries({queryKey: ['course']})
    },
    onError: (error, variable, context) => {
      console.error(error.message)
    },
    onSettled: (data, error, variable) => {
      queryClient.invalidateQueries({queryKey: ['course']})
    }
  })
}

export function useUpdateCourse(){
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['course'],
    mutationFn: (updateData: CourseItem) => updateCourse(updateData),
    onSuccess: (data, variable, context) => {
      console.log("Success to update course")
      queryClient.invalidateQueries({queryKey: ['course']})
    },
    onError: (error, variable, context) => {
      console.error(error.message)
    },
    onSettled: (data, error, variable) => {
      queryClient.invalidateQueries({queryKey: ['course']})
    }
  })
}