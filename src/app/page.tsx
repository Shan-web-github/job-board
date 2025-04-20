"use client";

import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  description: string
  user: {
    name: string
  }
}

const Home: NextPage = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    location: ''
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const query = new URLSearchParams()
        if (filters.type) query.append('type', filters.type)
        if (filters.location) query.append('location', filters.location)
        
        const res = await fetch(`/api/jobs?${query.toString()}`)
        const data = await res.json()
        setJobs(data)
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filters])

  if (loading) return <div className="flex justify-center mt-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Job Board</title>
        <meta name="description" content="Find your next job opportunity" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Job Board</h1>
        
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                className="border rounded p-2"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="border rounded p-2"
                placeholder="Filter by location"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center py-8">No jobs found</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold">{job.title}</h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <span>{job.company}</span>
                  <span className="mx-2">•</span>
                  <span>{job.location}</span>
                  <span className="mx-2">•</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {job.type}
                  </span>
                </div>
                <p className="mt-4 text-gray-700">{job.description}</p>
                {job.user?.name && (
                  <p className="mt-2 text-sm text-gray-500">Posted by: {job.user.name}</p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default Home