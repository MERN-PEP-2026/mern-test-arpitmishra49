import { useState } from 'react'

const CourseCard = ({ course, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800">{course.courseName}</h3>
        <span className="text-xs text-gray-400">
          {new Date(course.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-blue-600">👨‍🏫 {course.instructor}</p>
      <p className="text-sm text-gray-500 flex-1">{course.courseDescription}</p>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(course)}
          className="flex-1 text-sm bg-gray-100 text-gray-700 py-1.5 rounded hover:bg-gray-200"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (confirmDelete) onDelete(course._id)
            else setConfirmDelete(true)
          }}
          onBlur={() => setConfirmDelete(false)}
          className={`flex-1 text-sm py-1.5 rounded ${
            confirmDelete
              ? 'bg-red-600 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          {confirmDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

export default CourseCard
