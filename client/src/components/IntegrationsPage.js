import React from 'react';
import { Mail, MessageSquare, Calendar, Database, Zap, CheckCircle, XCircle } from 'lucide-react';

const IntegrationsPage = ({ darkMode }) => {
  const integrations = [
    {
      name: 'Gmail',
      description: 'Send and receive emails directly from SentinelX',
      icon: <Mail size={32} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      connected: false,
      features: ['Auto-reply', 'Email tracking', 'Templates']
    },
    {
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace',
      icon: <MessageSquare size={32} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      connected: true,
      features: ['Real-time alerts', 'Team mentions', 'Custom channels']
    },
    {
      name: 'Google Calendar',
      description: 'Sync meetings and calls with your calendar',
      icon: <Calendar size={32} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      connected: false,
      features: ['Auto-schedule', 'Reminders', 'Availability sync']
    },
    {
      name: 'HubSpot',
      description: 'Sync leads and contacts with your CRM',
      icon: <Database size={32} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      connected: false,
      features: ['Two-way sync', 'Custom fields', 'Deal tracking']
    },
    {
      name: 'Zapier',
      description: 'Connect to 5000+ apps and automate workflows',
      icon: <Zap size={32} />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      connected: false,
      features: ['Unlimited zaps', 'Custom triggers', 'Multi-step workflows']
    },
    {
      name: 'Twilio',
      description: 'Send SMS messages and make calls to leads',
      icon: <MessageSquare size={32} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      connected: false,
      features: ['SMS campaigns', 'Voice calls', 'Phone numbers']
    }
  ];

  const handleConnect = (integrationName) => {
    alert(`Connect to ${integrationName} - Implement OAuth flow`);
  };

  const handleDisconnect = (integrationName) => {
    if (window.confirm(`Disconnect ${integrationName}?`)) {
      alert(`Disconnected ${integrationName}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Integrations
        </h2>
        <p className="text-gray-600 mt-1">
          Connect SentinelX with your favorite tools
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <div
            key={index}
            className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6 hover:shadow-lg transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`${integration.bgColor} ${integration.color} p-3 rounded-xl`}>
                  {integration.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {integration.name}
                  </h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              {integration.connected ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                  <CheckCircle size={16} />
                  Connected
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                  <XCircle size={16} />
                  Not Connected
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
              <div className="flex flex-wrap gap-2">
                {integration.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {integration.connected ? (
                <>
                  <button
                    onClick={() => handleDisconnect(integration.name)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Configure
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration.name)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md font-medium"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API Access */}
      <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-md border p-6`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          API Access
        </h3>
        <p className="text-gray-600 mb-4">
          Use the SentinelX API to build custom integrations
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex gap-3">
              <input
                type="text"
                value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                Copy
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                Regenerate
              </button>
            </div>
          </div>
          <a
            href="#"
            className="inline-block text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            View API Documentation →
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;