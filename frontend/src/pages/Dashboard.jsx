import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CourseCard from '../components/CourseCard'
import CourseModal from '../components/CourseModal'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/courseApi'

const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  // Load courses whenever search changes (with debounce)
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

  const openCreate = () => {
    setEditData(null)
    setModalOpen(true)
  }

  const openEdit = (course) => {
    setEditData(course)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
            <p className="text-sm text-gray-400">{courses.length} course(s)</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded hover:bg-blue-700"
          >
            + Add Course
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by course name or instructor..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-6 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded mb-4">{error}</p>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">
              {search ? `No results for "${search}"` : 'No courses yet. Add one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

export default Dashboard
