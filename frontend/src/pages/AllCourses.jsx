import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getCourses } from '../api/courseApi'

const COLORS = [
  'from-blue-500 to-blue-600',
  'from-indigo-500 to-indigo-600',
  'from-violet-500 to-violet-600',
  'from-sky-500 to-sky-600',
  'from-cyan-500 to-cyan-600',
]


const CourseViewCard = ({ course }) => {
  const colorClass = COLORS[course.courseName.charCodeAt(0) % COLORS.length]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
     
      <div className={`bg-gradient-to-r ${colorClass} px-5 pt-5 pb-8`}>
        <span className="text-white/80 text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
          {new Date(course.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <h3 className="text-white font-bold text-base mt-3 leading-snug">
          {course.courseName}
        </h3>
      </div>

      
      <div className="p-5 flex flex-col gap-3 flex-1 -mt-3 bg-white rounded-t-2xl relative">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">
            👨‍🏫
          </div>
          <span className="text-sm font-medium text-blue-700">{course.instructor}</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
          {course.courseDescription}
        </p>
      </div>
    </div>
  )
}

const AllCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => loadCourses(), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourses(search)
      setCourses(res.data.courses)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-400 text-sm mt-1">
            Browse all available courses — {courses.length} course{courses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course name or instructor..."
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              &times;
            </button>
          )}
        </div>

        
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              {search ? `No results for "${search}"` : 'No courses available yet'}
            </h3>
            <p className="text-gray-400 text-sm">
              {search ? 'Try a different search term.' : 'Courses will appear here once created.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseViewCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllCourses
