import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, Calendar, PoundSterling } from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Customers',
      value: '124',
      icon: Users,
      change: '+12%',
      changeType: 'positive',
      href: '/customers'
    },
    {
      name: 'Active Jobs',
      value: '18',
      icon: Briefcase,
      change: '+2',
      changeType: 'positive',
      href: '/jobs'
    },
    {
      name: 'Scheduled Today',
      value: '6',
      icon: Calendar,
      change: '-1',
      changeType: 'negative',
      href: '/scheduling'
    },
    {
      name: 'Revenue This Month',
      value: '£24,500',
      icon: PoundSterling,
      change: '+8.2%',
      changeType: 'positive',
      href: '/financial'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'positive'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Jobs */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h3>
          <div className="space-y-4">
            {[
              {
                id: '1',
                title: 'Fire Alarm Service',
                customer: 'ABC Security Ltd',
                status: 'Completed',
                date: '2024-01-15'
              },
              {
                id: '2',
                title: 'CCTV Installation',
                customer: 'XYZ Business Park',
                status: 'In Progress',
                date: '2024-01-16'
              }
            ].map((job) => (
              <div key={job.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.customer}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{job.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            {[
              {
                id: '1',
                time: '09:00 - 12:00',
                job: 'Emergency Lighting Test',
                engineer: 'Mike Engineer',
                location: 'London Office'
              },
              {
                id: '2',
                time: '13:00 - 17:00',
                job: 'Fire Alarm Installation',
                engineer: 'Sarah Technician',
                location: 'Business Park'
              }
            ].map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{schedule.job}</p>
                  <p className="text-sm text-gray-500">{schedule.engineer}</p>
                  <p className="text-sm text-gray-500">{schedule.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{schedule.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
