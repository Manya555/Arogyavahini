import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Hospital, 
  Activity, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Phone,
  Zap,
  Cpu,
  Navigation,
  CheckCircle2,
  Users,
  LayoutDashboard,
  Heart
} from 'lucide-react';
import { useLanguage } from '../context/UIContext';
import { SimulatedGridMap } from '../components/SimulatedGridMap';

export default function LandingPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 lg:pt-40 lg:pb-52 overflow-hidden">
        {/* Background blobs for depth */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-600/5 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[160px] rounded-full" />
          <div className="absolute inset-0 technical-grid opacity-[0.03] dark:opacity-[0.07]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Live Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-[0_0_30px_rgba(239,68,68,0.2)] dark:shadow-[0_0_40px_rgba(239,68,68,0.15)] italic">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                SYTEM_ACTIVE • V9.5 MISSION READY
              </div>

              {/* Major Heading */}
              <h1 className="text-6xl md:text-7xl lg:text-9xl font-black text-[var(--text-primary)] leading-[0.85] mb-10 tracking-tighter italic uppercase">
                SECONDS <br />
                SAVE <span className="text-red-600 block shadow-red-600/20 drop-shadow-2xl">LIVES.</span>
              </h1>

              {/* Subheading/Intro */}
              <div className="relative mb-14">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-transparent rounded-full opacity-50" />
                <p className="text-lg lg:text-xl text-[var(--text-secondary)] pl-8 max-w-xl leading-relaxed font-medium italic">
                  Arogya<span className="text-red-500">Vahini</span> orchestrates the neural network of emergency response. 
                  Synchronizing units, hospitals, and traffic control in nanoseconds.
                </p>
              </div>

              {/* CTA Cluster */}
              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <Link
                  to="/ambulance-booking"
                  className="btn-primary group !px-12 !py-6 !text-xs"
                >
                  <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  INITIATE SOS PROTOCOL
                </Link>
                <Link
                  to="/admin"
                  className="btn-secondary group !px-12 !py-6 !text-xs"
                >
                  <LayoutDashboard className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  COMMAND CENTER
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-4">
                {[
                   { icon: Activity, label: 'Neural Routing' },
                   { icon: Zap, label: 'Signal Sync' },
                   { icon: ShieldCheck, label: 'Secure Link' }
                ].map((pill, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2 bg-[var(--hover-bg)] border border-[var(--border-color)] rounded-xl">
                    <pill.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{pill.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: Map HUD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
               {/* Background Glow */}
               <div className="absolute inset-0 bg-red-600/5 blur-[100px] pointer-events-none" />

               {/* Main Dashboard Card */}
               <div className="relative z-10 glass-panel rounded-[3.5rem] p-8 transition-all hover:translate-y-[-8px]">
                   {/* Card Header info */}
                   <div className="flex justify-between items-center mb-8 px-2">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Navigation className="w-5 h-5 text-emerald-500" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">Live Feed</p>
                            <p className="text-xs font-black text-[var(--text-primary)] uppercase italic">Sector_04 Active Monitoring</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-mono text-emerald-500 font-bold">STABLE CONNECTION</p>
                         <p className="text-[9px] font-mono text-slate-600 font-bold mt-1">LATENCY: 14MS</p>
                      </div>
                   </div>

                   {/* Map Component */}
                   <div className="aspect-[4/3] mb-8 shadow-2xl relative group cursor-crosshair">
                      <SimulatedGridMap />
                      <div className="absolute inset-0 border border-[var(--border-color)] pointer-events-none rounded-3xl" />
                   </div>

                   {/* Quick Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                     {[
                        { label: 'Response', val: '< 42s', icon: Clock, color: 'text-emerald-500' },
                        { label: 'Precision', val: '99.2%', icon: CheckCircle2, color: 'text-blue-500' },
                        { label: 'Vectors', val: '128', icon: Truck, color: 'text-red-500' }
                     ].map((stat, i) => (
                       <div key={i} className="p-4 bg-[var(--hover-bg)] rounded-3xl border border-[var(--border-color)] group hover:border-[var(--border-strong)] transition-all flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                             <stat.icon className={`w-3 h-3 ${stat.color}`} />
                             <p className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-none">{stat.label}</p>
                          </div>
                          <p className="text-xl font-mono font-bold italic text-[var(--text-primary)] leading-none">{stat.val}</p>
                       </div>
                     ))}
                  </div>
               </div>
               
               {/* Floating Data Nodes */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute -right-8 top-1/4 px-4 py-3 glass-panel rounded-2xl z-20 hidden xl:flex items-center gap-3"
               >
                  <Activity className="w-4 h-4 text-red-500" />
                  <span className="text-[9px] font-mono font-bold text-[var(--text-muted)]">VITALS_LINK: UP</span>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                 className="absolute -left-12 bottom-1/4 px-4 py-3 glass-panel rounded-2xl z-20 hidden xl:flex items-center gap-3"
               >
                  <Hospital className="w-4 h-4 text-emerald-500" />
                  <span className="text-[9px] font-mono font-bold text-[var(--text-muted)]">BED_SYNC: ACTIVE</span>
               </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Summary Row */}
      <section className="relative z-20 -mt-16 mb-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'Ambulances Active', val: '247', icon: Truck, detail: 'Operational units' },
              { label: 'Lives Saved', val: '12.4k', icon: Heart, detail: 'Neural coordination' },
              { label: 'Avg Arrival', val: '4:12', icon: Clock, detail: 'Minutes : Seconds' },
              { label: 'Connected', val: '84', icon: Hospital, detail: 'Trauma Centers' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 lg:p-8 rounded-[2.5rem] hover:border-[var(--border-strong)] transition-all hover:bg-[var(--hover-bg)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20">
                    <stat.icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="h-1 w-8 bg-slate-800 rounded-full" />
                </div>
                <p className="text-4xl lg:text-5xl font-mono font-bold text-[var(--text-primary)] mb-2 italic">{stat.val}</p>
                <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</p>
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                   <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em]">{stat.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-40 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="absolute inset-0 bg-red-600/[0.02] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 text-red-600 mb-6">
                <Cpu className="w-6 h-6 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Intelligence Architecture</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-[var(--text-primary)] tracking-tighter mb-8 italic uppercase leading-none">
                THE NEURAL <br />
                <span className="text-[var(--text-muted)]">INFRASTRUCTURE.</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg lg:text-xl leading-relaxed max-w-2xl italic font-medium">
                We've replaced manual dispatch with an autonomous neural sync. 
                Real-time traffic override meets predictive hospital loading.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="px-8 py-4 bg-[var(--hover-bg)] rounded-2xl border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  MILITARY GRADE SECURITY
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Activity, title: 'NEURAL ROUTING', desc: 'Continuous telemetry analysis from 500+ data nodes synchronized with traffic flow density.' },
              { icon: Users, title: 'TRIAGE SYNC', desc: 'Automated data pipeline between ambulane units and trauma teams for live vitals preview.' },
              { icon: Zap, title: 'SIGNAL PRE-EMPTION', desc: 'Secure blockchain-verified traffic signal control for zero-stop emergency transit.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-10 lg:p-14 glass-panel rounded-[3rem] hover:bg-[var(--hover-bg)] transition-all group relative"
              >
                <div className="w-16 h-16 rounded-3xl bg-red-600/10 text-red-600 flex items-center justify-center mb-10 border border-red-600/20 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-6 tracking-tight uppercase italic">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-base lg:text-lg leading-relaxed italic">{feature.desc}</p>
                
                <div className="absolute bottom-8 right-8 text-slate-800/20 group-hover:text-red-600/20 transition-colors uppercase font-black text-6xl italic select-none">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="py-20 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
             {['NHAI', 'MINISTRY OF HEALTH', 'TRAFFIC POLICE', 'RED CROSS', 'AIIMS'].map(brand => (
               <span key={brand} className="text-xl font-black tracking-tighter italic text-[var(--text-muted)] font-mono">{brand}</span>
             ))}
          </div>
        </div>
      </section>

      {/* Call to Action Container */}
      <section className="py-32 lg:py-52 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
           <h2 className="text-6xl lg:text-8xl font-black text-[var(--text-primary)] tracking-tighter lg:mb-12 uppercase italic leading-none">
              READY TO <br />
              <span className="text-red-600">COMMAND?</span>
           </h2>
           <p className="text-xl text-[var(--text-secondary)] mb-16 max-w-2xl mx-auto italic">
              Join the network that saves lives through absolute precision. 
              The future of emergency response is autonomous.
           </p>
           <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link to="/booking" className="btn-primary !px-16 !py-8 !text-base">
                INITIATE PROTOCOL
             </Link>
             <Link to="/login/hospital" className="btn-secondary !px-16 !py-8 !text-base">
                REGISTER HOSPITAL
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}

