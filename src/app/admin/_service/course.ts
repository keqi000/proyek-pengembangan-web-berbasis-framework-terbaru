import { CourseItem, courseItemSchema } from "../_schema/course";

type MataKuliahItem = {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

export async function getAllCourse(){
  const response = await fetch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`, {
    method: "GET"
  })

  if (!response.ok){
    throw Error(`fetch error: ${response.status}`)
  }

  // TODO: set typing
  const data: CourseItem[] = await response.json()
  for (let _innerData of data){
    try {
        courseItemSchema.parse(_innerData)
    }
    // TODO: fix type
    catch (err) {
      throw err
    }
  }

  // FIXME: don't transform, instead just use CourseItem type
  const newData: MataKuliahItem[] = data.map((item) => ({
    id: item.id.toString(), 
    kode: item.id.toString(), 
    nama: item.name, 
    semester: item.semester.toString(),
    sks: item.credit.toString(),
  }))
  return newData
}

type CreateCourseProps = Omit<CourseItem, "id">

export async function createCourse(courseData: CreateCourseProps){
  const response = await fetch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`, {
    method: "POST",
    body: JSON.stringify({
      'name': courseData.name,
      'description': courseData.description,
      'semester': courseData.semester,
      'credit': courseData.credit
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  

  if (!response.ok){
    throw Error(`Error when creating resource: ${response.status}`)
  }

  // TODO: set typing
  const data: CourseItem = await response.json()
  try {
    courseItemSchema.parse(data)
  }
  catch (err){
    throw err
  }

  return data
}

export async function updateCourse(courseData: CourseItem){
  const response = await fetch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${courseData.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      'name': courseData.name,
      'description': courseData.description,
      'semester': courseData.semester,
      'credit': courseData.credit
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  

  if (!response.ok){
    throw Error(`Error when update resource: ${response.status}`)
  }

  // TODO: set typing
  const data: CourseItem = await response.json()
  try {
    courseItemSchema.parse(data)
  }
  catch (err){
    throw err
  }

  return data
}

export async function deleteCourse(courseId: number){
  const response = await fetch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${courseId}`, {
    method: "DELETE"
  })

  if (!response.ok){
    throw Error(`Error when delete resource: ${response.status}`)
  }

  // TODO: set typing
  const data: CourseItem = await response.json()
  return data
}