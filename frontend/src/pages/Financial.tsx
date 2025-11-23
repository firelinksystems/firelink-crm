import React from 'react'
import { TrendingUp, TrendingDown, FileText, CreditCard } from 'lucide-react'

const Financial: React.FC = () => {
  const financialStats = [
    {
      name: 'Monthly Revenue',
      value: '£24,500',
      change: '+8.2%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      name: 'Outstanding Invoices',
      value: '£12,300',
      change: '-3.1%',
      changeType: 'negative',
      icon: TrendingDown
    },
    {
      name: 'Profit Margin',
      value: '32.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      name: 'Average Job Value',
      value: '£1,250',
      change: '+5.8%',
      changeType: 'positive',
      icon: TrendingUp
    }
  ]

  const recentInvoices = [
    {
      id: 'INV-001',
      customer: 'ABC Security Ltd',
      amount: 2500.00,
      dueDate: '2024-02-15',
      status: 'Sent',
      job: 'Fire Alarm Installation'
    },
    {
      id: 'INV-002',
      customer: 'XYZ Manufacturing',
      amount: 1200.00,
      dueDate: '2024-02-10',
      status: 'Paid',
      job: 'Emergency Lighting Service'
    },
    {
      id: 'INV-003',
      customer: 'Tech Solutions Ltd',
      amount: 850.00,
      dueDate: '2024-02-05',
      status: 'Overdue',
      job: 'CCTV Maintenance'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-800',
      Sent: 'bg-blue-100 text-blue-800',
      Paid: 'bg-green-100 text-green-800',
      Overdue: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial</h1>
        <div className="flex space-x-3">
          <button className="btn-secondary">Export</button>
          <button className="btn-primary">New Invoice</button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {financialStats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.name} className="card">
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
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Invoices */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Invoices</h3>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{invoice.id}</p>
                    <p className="text-sm text-gray-500">{invoice.customer}</p>
                    <p className="text-xs text-gray-400">{invoice.job}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    £{invoice.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center justify-end space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="w-full btn-secondary">
              View All Invoices
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <span className="font-medium text-gray-900">Create Invoice</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <span className="font-medium text-gray-900">Process Payment</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-gray-400 mr-3" />
                <span className="font-medium text-gray-900">View P&L Report</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <span className="font-medium text-gray-900">VAT Return</span>
              </div>
              <div className="text-gray-400">→</div>
            </button>
          </div>
        </div>
      </div>

      {/* Profit & Loss Summary */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profit & Loss Summary (This Month)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">£24,500</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Costs</p>
            <p className="text-2xl font-semibold text-red-600">£16,580</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gross Profit</p>
            <p className="text-2xl font-semibold text-green-600">£7,920</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Profit Margin</p>
            <p className="text-2xl font-semibold text-green-600">32.4%</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
            <div className="space-y-2">
              {[
                { name: 'Labour', amount: 8500, percentage: 51.3 },
                { name: 'Materials', amount: 4500, percentage: 27.1 },
                { name: 'Travel', amount: 1200, percentage: 7.2 },
                { name: 'Subcontractors', amount: 1800, percentage: 10.9 },
                { name: 'Other', amount: 580, percentage: 3.5 }
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      £{item.amount.toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top Performing Jobs</h4>
            <div className="space-y-3">
              {[
                { job: 'Office Fire Alarm Install', profit: 2150, margin: 48.2 },
                { job: 'CCTV System Upgrade', profit: 1800, margin: 42.1 },
                { job: 'Emergency Lighting Service', profit: 950, margin: 35.8 }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.job}</p>
                    <p className="text-sm text-gray-500">Margin: {item.margin}%</p>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    £{item.profit.toLocaleString('en-GB')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Financial
