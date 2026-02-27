import { useState } from 'react'

const COLORS = [
  'from-blue-500 to-blue-600',
  'from-indigo-500 to-indigo-600',
  'from-violet-500 to-violet-600',
  'from-sky-500 to-sky-600',
  'from-cyan-500 to-cyan-600',
]

const CourseCard = ({ course, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)

  
  const colorClass = COLORS[course.courseName.charCodeAt(0) % COLORS.length]

  return (
    <div className="card flex flex-col overflow-hidden group">
     
      <div className={`bg-gradient-to-r ${colorClass} px-5 pt-5 pb-8`}>
        <div className="flex justify-between items-start">
          <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
            {new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h3 className="text-white font-bold text-base mt-3 leading-snug">
          {course.courseName}
        </h3>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1 -mt-3 bg-white rounded-t-2xl relative">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
            👨‍🏫
          </div>
          <span className="text-sm font-medium text-blue-700">{course.instructor}</span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2">
          {course.courseDescription}
        </p>

        
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onEdit(course)}
            className="flex-1 text-sm font-medium bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              if (confirmDelete) onDelete(course._id)
              else setConfirmDelete(true)
            }}
            onBlur={() => setConfirmDelete(false)}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition ${
              confirmDelete
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            {confirmDelete ? '✓ Confirm' : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
