import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Building, Mail, Phone } from 'lucide-react'

const Customers: React.FC = () => {
  const customers = [
    {
      id: '1',
      companyName: 'ABC Security Ltd',
      contactName: 'John Smith',
      email: 'john@abcsecurity.com',
      phone: '+441234567890',
      address: '123 Business Park, London, SW1A 1AA',
      jobCount: 12,
      lastJob: '2024-01-15'
    },
    {
      id: '2',
      companyName: 'XYZ Manufacturing',
      contactName: 'Sarah Johnson',
      email: 'sarah@xyzmanufacturing.com',
      phone: '+441234567891',
      address: '456 Industrial Estate, Manchester, M1 1AB',
      jobCount: 8,
      lastJob: '2024-01-10'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Link
          to="/customers/new"
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              className="input-field pl-10"
            />
          </div>
        </div>
        <select className="input-field sm:w-48">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {customer.companyName}
                  </h3>
                  <p className="text-sm text-gray-600">{customer.contactName}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {customer.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {customer.phone}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{customer.address}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {customer.jobCount} jobs • Last: {customer.lastJob}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <Link
                to={`/customers/${customer.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Details
              </Link>
              <Link
                to={`/jobs/new?customer=${customer.id}`}
                className="text-sm text-gray-600 hover:text-gray-700 font-medium"
              >
                New Job
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Customers
