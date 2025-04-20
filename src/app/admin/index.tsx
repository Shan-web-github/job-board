import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
}

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: ''
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/signin')
      return
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (res.status === 401) {
          localStorage.removeItem('token')
          router.push('/signin')
          return
        }

        const data = await res.json()
        setJobs(data)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [router])

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newJob)
      })

      if (res.ok) {
        const createdJob = await res.json()
        setJobs([...jobs, createdJob])
        setNewJob({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          description: ''
        })
      }
    } catch (error) {
      console.error('Failed to add job:', error)
    }
  }

  const handleDeleteJob = async (id: number) => {
    const token = localStorage.getItem('token')
    
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.ok) {
        setJobs(jobs.filter(job => job.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  if (loading) return <div className="flex justify-center mt-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Dashboard</title>
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem('token')
              router.push('/signin')
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
          <form onSubmit={handleAddJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newJob.type}
                  onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Job
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Posted Jobs</h2>
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-center py-8">No jobs posted yet</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <div className="flex items-center mt-1 text-gray-600">
                        <span>{job.company}</span>
                        <span className="mx-2">•</span>
                        <span>{job.location}</span>
                        <span className="mx-2">•</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {job.type}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{job.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}