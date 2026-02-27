import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import CourseModal from '../components/CourseModal'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseApi'
import { useAuth } from '../context/AuthContext'

const DashBoard = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => loadCourses(), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCourses(search)
      // Only show courses created by the logged-in user
      const myCourses = res.data.courses.filter(
        (c) => c.createdBy === user?._id || c.createdBy?._id === user?._id
      )
      setCourses(myCourses)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (form) => {
    const res = await createCourse(form)
    setCourses((prev) => [res.data.course, ...prev])
  }

  const handleEdit = async (form) => {
    const res = await updateCourse(editData._id, form)
    setCourses((prev) =>
      prev.map((c) => (c._id === editData._id ? res.data.course : c))
    )
  }

  const handleDelete = async (id) => {
    await deleteCourse(id)
    setCourses((prev) => prev.filter((c) => c._id !== id))
  }

  const openCreate = () => { setEditData(null); setModalOpen(true) }
  const openEdit = (course) => { setEditData(course); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditData(null) }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-400 text-sm mt-1">
              Courses you've created — {courses.length} course{courses.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-sm whitespace-nowrap"
          >
            <span className="text-base">+</span> Add Course
          </button>
        </div>

        {/* Search + filter */}
        <div className="relative mb-8">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your courses..."
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

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">✏️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              {search ? `No results for "${search}"` : "You haven't created any courses yet"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {search ? 'Try a different search term.' : 'Click the button below to create your first course.'}
            </p>
            {!search && (
              <button
                onClick={openCreate}
                className="bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
              >
                + Create your first course
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CourseModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={editData ? handleEdit : handleCreate}
        editData={editData}
      />
    </div>
  )
}

export default DashBoard
