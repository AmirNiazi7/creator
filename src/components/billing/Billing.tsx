import React, { useState } from 'react';
import { CreditCard, Check, Zap, Calendar, Download } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      'Basic viral content discovery',
      'Limited analytics (5 channels/month)',
      'Script analyzer (3 scripts/month)',
      'Community support'
    ],
    limitations: [
      'No competitor finder',
      'No script rewriter',
      'No manual posting'
    ]
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    popular: true,
    features: [
      'Unlimited viral content discovery',
      'Unlimited analytics',
      'Unlimited script analysis & rewriting',
      'Competitor finder',
      'Manual posting to all platforms',
      'Advanced search filters',
      'Priority support',
      'Export data & reports'
    ]
  },
  {
    name: 'Agency',
    price: 99,
    period: 'month',
    features: [
      'Everything in Pro',
      'Manage up to 10 team members',
      'White-label reports',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Custom training sessions'
    ]
  }
];

const BILLING_HISTORY = [
  { id: 1, date: 'Nov 11, 2024', amount: 29.00, status: 'Paid', invoice: 'INV-2024-001' },
  { id: 2, date: 'Oct 11, 2024', amount: 29.00, status: 'Paid', invoice: 'INV-2024-002' },
  { id: 3, date: 'Sep 11, 2024', amount: 29.00, status: 'Paid', invoice: 'INV-2024-003' },
];

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState('Pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = (planName: string) => {
    alert(`Redirecting to Stripe Checkout for ${planName} plan...`);
    // In production: window.location.href = stripeCheckoutUrl;
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of the billing period.')) {
      alert('Subscription cancelled. You will have access until Dec 11, 2024.');
    }
  };

  const handleUpdateCard = () => {
    alert('Redirecting to Stripe to update payment method...');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="fade-in">
        <h1 className="mb-2">Billing & Subscription</h1>
        <p className="text-gray-400">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 p-6 text-white slide-in-up">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6" />
              <h2 className="text-white">Current Plan: {currentPlan}</h2>
            </div>
            <p className="text-blue-100 mb-4">Billed monthly at $29.00/month</p>
            <div className="flex items-center gap-2 text-blue-100">
              <Calendar className="w-4 h-4" />
              <span>Next billing date: December 11, 2024</span>
            </div>
          </div>
          <div className="text-right space-y-2">
            <button
              onClick={handleUpdateCard}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
            >
              Update Card
            </button>
            <button
              onClick={handleCancelSubscription}
              className="block w-full px-6 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-all"
            >
              Cancel Plan
            </button>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex bg-zinc-800/50 rounded-lg p-1 border border-zinc-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-lg transition-all ${
              billingCycle === 'yearly'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Yearly
            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = billingCycle === 'yearly' && plan.price > 0
            ? Math.floor(plan.price * 12 * 0.8)
            : plan.price;
          const period = billingCycle === 'yearly' && plan.price > 0 ? 'year' : plan.period;

          return (
            <div
              key={plan.name}
              className={`bg-zinc-900/50 backdrop-blur-xl rounded-xl border-2 p-6 card-hover ${
                plan.popular
                  ? 'border-blue-500/50 relative shadow-lg shadow-blue-500/20'
                  : 'border-zinc-800/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30">
                  Most Popular
                </div>
              )}

              <h3 className="text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-white text-4xl">${price}</span>
                <span className="text-gray-400">/{period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-500 line-through">
                    <span className="w-5 h-5 flex-shrink-0"></span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={currentPlan === plan.name}
                className={`w-full py-3 rounded-lg transition-all ${
                  currentPlan === plan.name
                    ? 'bg-zinc-800/50 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white hover:shadow-lg hover:shadow-blue-500/30'
                    : 'bg-blue-500/80 text-white hover:bg-blue-600/80 hover:shadow-lg hover:shadow-blue-500/30'
                }`}
              >
                {currentPlan === plan.name ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Method */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
        <h2 className="mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border border-zinc-700 rounded-lg bg-zinc-800/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white">•••• •••• •••• 4242</p>
              <p className="text-gray-400">Expires 12/2025</p>
            </div>
          </div>
          <button
            onClick={handleUpdateCard}
            className="px-6 py-2 bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl border border-zinc-800/50 p-6 card-hover">
        <h2 className="mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-gray-300">Date</th>
                <th className="text-left py-3 px-4 text-gray-300">Amount</th>
                <th className="text-left py-3 px-4 text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-gray-300">Invoice</th>
                <th className="text-left py-3 px-4 text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {BILLING_HISTORY.map((bill) => (
                <tr key={bill.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-all">
                  <td className="py-4 px-4 text-gray-400">{bill.date}</td>
                  <td className="py-4 px-4 text-white">${bill.amount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">{bill.invoice}</td>
                  <td className="py-4 px-4">
                    <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
