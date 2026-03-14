'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'  // ✅ Changed to client import
import { 
  User, CreditCard, Bell, Shield, LogOut, ArrowLeft,
  Mail, Calendar, Crown, Clock, Check, X, Download,
  AlertCircle, ChevronRight, Settings as SettingsIcon
} from 'lucide-react'

interface SettingsContentProps {
  user: any
  subscription: any
  payments: any[]
  trialInfo: {
    daysLeft: number
    endsAt: Date
    inTrial: boolean
  }
}

export function SettingsContent({ user, subscription, payments, trialInfo }: SettingsContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'notifications'>('account')
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()  // ✅ Now using client supabase
    router.push('/login')
  }

  // ... rest of the component stays exactly the same
  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ]

  const hasActiveSubscription = subscription?.status === 'active'
  const subscriptionExpired = subscription?.status === 'active' && 
    new Date(subscription.current_period_end) < new Date()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-C6QJQ6KGNJ');
        `}}></script>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Address</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.email_confirmed_at 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">User ID</p>
                      <p className="text-sm text-gray-600 font-mono">{user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h2>
              
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-3 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-red-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-red-700">Sign Out</p>
                    <p className="text-xs text-red-600">Sign out of your account</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-red-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Subscription Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Status</h2>
              
              {hasActiveSubscription && !subscriptionExpired ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Crown className="h-8 w-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 text-lg mb-2">LeadVett Pro - Active</h3>
                      <div className="space-y-2 text-sm text-green-800">
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Plan: <strong>{subscription.plan === 'pro' ? 'Professional' : subscription.plan}</strong>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Amount: <strong>${(subscription.amount / 100).toFixed(2)}/month</strong>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Next billing: <strong>{new Date(subscription.current_period_end).toLocaleDateString()}</strong>
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          Status: <strong className="text-green-700">Active & Unlimited Access</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : trialInfo.inTrial ? (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 text-lg mb-2">
                        Free Trial - {trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? 'Day' : 'Days'} Left
                      </h3>
                      <div className="space-y-2 text-sm text-blue-800 mb-4">
                        <p>Trial ends: <strong>{trialInfo.endsAt.toLocaleDateString()}</strong></p>
                        <p>You have full access to all features during your trial period.</p>
                      </div>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        Subscribe Now - $49/month
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-8 w-8 text-orange-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900 text-lg mb-2">
                        {subscriptionExpired ? 'Subscription Expired' : 'Trial Expired'}
                      </h3>
                      <p className="text-sm text-orange-800 mb-4">
                        {subscriptionExpired 
                          ? 'Your subscription has ended. Renew to continue using LeadVett.'
                          : 'Your 3-day trial has ended. Subscribe to continue qualifying leads.'
                        }
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                      >
                        {subscriptionExpired ? 'Renew Subscription' : 'Subscribe Now'} - $49/month
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                {payments.length > 0 && (
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                )}
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No payment history yet</p>
                  <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Description</th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="py-4 text-sm text-gray-900">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-sm text-gray-900">
                            LeadVett Pro - Monthly Subscription
                          </td>
                          <td className="py-4 text-sm font-semibold text-gray-900">
                            ${(payment.amount / 100).toFixed(2)}
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {payment.status === 'completed' && <Check className="h-3 w-3" />}
                              {payment.status === 'failed' && <X className="h-3 w-3" />}
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-500 font-mono">
                            {payment.dodo_reference?.substring(0, 16)}...
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Information</h2>
              
              <div className="space-y-4">
                <div className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">Plan Pricing</p>
                    <p className="text-2xl font-bold text-gray-900">$49<span className="text-base font-normal text-gray-600">/month</span></p>
                  </div>
                  <p className="text-sm text-gray-600">Billed monthly • Cancel anytime</p>
                </div>

                {hasActiveSubscription && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-blue-900 mb-1">Secure Payments</p>
                        <p className="text-blue-700">
                          All payments are processed securely through Dodo Payments. Your payment information is encrypted and never stored on our servers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">New Lead Notifications</p>
                  <p className="text-sm text-gray-600">Get notified when a new lead submits your form</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Enabled
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Payment Confirmations</p>
                  <p className="text-sm text-gray-600">Receive receipts for successful payments</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Enabled
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Subscription Updates</p>
                  <p className="text-sm text-gray-600">Important updates about your subscription</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Enabled
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Tips, updates, and product announcements</p>
                </div>
                <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Disabled
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Critical account and billing notifications cannot be disabled for security reasons.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}