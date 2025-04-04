"use client"

import { useCourseClientState } from "../hooks/clientStateStore";
import { useDeleteCourse } from "../../_query/course";
import { FaEdit, FaTrash } from "react-icons/fa";

// TODo: rename the attribute
type TempInputData = {
  id?: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

type CourseDataRowInfoType = {
  mataKuliah: TempInputData,
  index: number
}

export default function CourseDataRowInfo({mataKuliah, index}: CourseDataRowInfoType){
  const deleteMutation = useDeleteCourse()
  
  const setEditDialogOpen = useCourseClientState((state) => state.setEditDialogOpen)
  const setSelectedData = useCourseClientState((state) => state.setSelectedData)
  
  return (
    <>
      <tr
        key={mataKuliah.id}
        className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
      >
        <td className="px-4 py-4">{index + 1}</td>
        <td className="px-4 py-4">{mataKuliah.kode}</td>
        <td className="px-4 py-4 font-medium">{mataKuliah.nama}</td>
        <td className="px-4 py-4 text-center">
          Semester {mataKuliah.semester}
        </td>
        <td className="px-4 py-4 text-center">{mataKuliah.sks}</td>
        <td className="px-4 py-4">
          <div className="flex justify-center gap-4">
            <button
              className="text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => {
                setEditDialogOpen(true)
                setSelectedData(mataKuliah)
              }}
              title="Edit"
            >
              <FaEdit size={18} />
            </button>
            <button
              className="text-red-600 hover:text-red-800 transition-colors"
              onClick={() => {
                if (
                  window.confirm(
                    "Yakin ingin menghapus mata kuliah ini?"
                  )
                ) {
                  // deleteMataKuliah(mataKuliah.id);
                  deleteMutation.mutate(+mataKuliah.id!)
                }
              }}
              title="Hapus"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </td>
      </tr>
    </>
  )
}