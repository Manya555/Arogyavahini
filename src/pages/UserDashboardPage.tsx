import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, MapPin, Hospital, BarChart3, Clock, CheckCircle, Activity } from 'lucide-react';

export default function UserDashboardPage() {
  const stats = [
    { icon: Activity, label: 'Active Calls', value: '12', color: 'emerald' },
    { icon: Clock, label: 'Avg Response', value: '8 min', color: 'blue' },
    { icon: CheckCircle, label: 'Completed', value: '847', color: 'green' },
    { icon: Hospital, label: 'Hospitals', value: '24', color: 'purple' },
  ];

  const recentEmergencies = [
    { id: 1, type: 'Medical', location: 'Main Street', status: 'Arrived', time: '2 min ago' },
    { id: 2, type: 'Cardiac', location: 'Downtown Hospital', status: 'In Transit', time: '5 min ago' },
    { id: 3, type: 'Trauma', location: 'Ring Road', status: 'Resolved', time: '15 min ago' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase italic mb-2">Emergency Response Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)]">Real-time system status and emergency management</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <Link
            to="/sos-booking"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white transition-all hover:shadow-2xl hover:shadow-red-600/30"
          >
            <div className="absolute inset-0 bg-white/10 transform -skew-y-3 origin-left scale-125 opacity-0 group-hover:opacity-100 transition-all" />
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl uppercase italic">SOS Emergency</h3>
                <p className="text-xs font-bold text-red-100 mt-1">Quick ambulance request</p>
              </div>
              <AlertCircle className="w-8 h-8" />
            </div>
          </Link>

          <Link
            to="/live-map"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white transition-all hover:shadow-2xl hover:shadow-blue-600/30"
          >
            <div className="absolute inset-0 bg-white/10 transform -skew-y-3 origin-left scale-125 opacity-0 group-hover:opacity-100 transition-all" />
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl uppercase italic">Live Tracking</h3>
                <p className="text-xs font-bold text-blue-100 mt-1">View ambulance locations</p>
              </div>
              <MapPin className="w-8 h-8" />
            </div>
          </Link>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-4 border-[var(--border-color)]"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-3 bg-${stat.color}-600/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div className="text-2xl font-black text-[var(--text-primary)] mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl border-[var(--border-color)] overflow-hidden"
        >
          <div className="p-6 border-b border-[var(--border-color)] bg-[var(--card-bg-subtle)]">
            <h2 className="text-lg font-black text-[var(--text-primary)] uppercase italic">Recent Emergencies</h2>
          </div>
          
          <div className="divide-y divide-[var(--border-color)]">
            {recentEmergencies.map((emergency, idx) => (
              <motion.div
                key={emergency.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="p-4 hover:bg-[var(--hover-bg)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-3 py-1 rounded-lg bg-red-600/20 text-red-600 text-[8px] font-black uppercase tracking-widest">
                        {emergency.type}
                      </span>
                      <span className="font-bold text-sm text-[var(--text-primary)]">{emergency.location}</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">{emergency.time}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      emergency.status === 'Arrived' ? 'bg-green-600/20 text-green-600' :
                      emergency.status === 'In Transit' ? 'bg-blue-600/20 text-blue-600' :
                      'bg-gray-600/20 text-gray-600'
                    }`}>
                      {emergency.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
