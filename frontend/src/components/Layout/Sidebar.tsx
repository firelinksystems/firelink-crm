import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  PoundSterling,
  Settings 
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Scheduling', href: '/scheduling', icon: Calendar },
    { name: 'Financial', href: '/financial', icon: PoundSterling },
  ]

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary-600">FireLink System</h1>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
