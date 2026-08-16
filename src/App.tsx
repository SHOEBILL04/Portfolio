import { useState, useEffect, useRef, type ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCard { label: string; value: number; suffix: string; prefix?: string; accent: 'purple' | 'cyan' }
interface Project { title: string; desc: string; tags: string[]; github: string; live?: string; color: string }
interface Contest { rank: string; event: string; year: string; type: 'national' | 'icpc' | 'intra' | 'collaborative' }

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS: StatCard[] = [
  { label: 'Problems Solved', value: 1000, suffix: '+', accent: 'purple' },
  { label: 'ICPC Dhaka Regional 2025', value: 44, suffix: 'th Place', prefix: '', accent: 'cyan' },
  { label: 'CGPA (AUST CSE)', value: 3.63, suffix: '/4.00', accent: 'purple' },
  { label: 'Full-Stack Systems', value: 3, suffix: '+', accent: 'cyan' },
]

const TECH_STACK = [
  { name: 'C++', icon: '⚡' },
  { name: 'Python', icon: '🐍' },
  { name: 'JavaScript', icon: '🟨' },
  { name: 'TypeScript', icon: '💙' },
  { name: 'React.js', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'Express.js', icon: '🚂' },
  { name: 'Laravel', icon: '🔴' },
  { name: 'PHP', icon: '🐘' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'MySQL', icon: '🐬' },
  { name: 'MSSQL', icon: '🗄️' },
  { name: 'Linux', icon: '🐧' },
]

const PROJECTS: Project[] = [
  {
    title: 'TurfChai',
    desc: 'Full-stack sports turf booking & slot management system built with React, Spring Boot, PostgreSQL/PLpgSQL, and custom CSS.',
    tags: ['JavaScript 44.3%', 'Java 43.4%', 'CSS 8.9%', 'PL/pgSQL 2.6%'],
    github: 'https://github.com/SHOEBILL04/TurfChai',
    color: '#8b5cf6',
  },
  {
    title: 'EcoCycle',
    desc: 'Smart waste management & eco-friendly recycling reward platform promoting efficient disposal and sustainability tracking.',
    tags: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS'],
    github: 'https://github.com/SHOEBILL04/EcoCycle',
    color: '#10b981',
  },
  {
    title: 'Lantern',
    desc: 'Student study & habit tracker with real-time timers, JWT authentication, and comprehensive study file management.',
    tags: ['React', 'Vite', 'Laravel', 'SQL', 'REST API'],
    github: 'https://github.com/SHOEBILL04/lantern',
    color: '#a855f7',
  },
  {
    title: 'Mela',
    desc: 'Fair Management System handling stall allocation, logistics pipeline, and role-based access control for large-scale public events.',
    tags: ['Laravel', 'MSSQL', 'PHP', 'JavaScript'],
    github: 'https://github.com/SHOEBILL04/MELA',
    color: '#06b6d4',
  },
]

const CONTESTS: Contest[] = [
  { rank: '44th', event: 'ICPC Dhaka Regional Site', year: '2025', type: 'icpc' },
  { rank: '17th', event: 'BUBT IUPC Programming Contest', year: '2025', type: 'collaborative' },
  { rank: '25th', event: 'NWU CSE Fest Programming Contest', year: '2025', type: 'national' },
  { rank: '82nd', event: 'CUET IUPC National Programming Contest', year: '2025', type: 'national' },
  { rank: '2nd Runner-up', event: 'Intra-AUST Programming Contest (Carnival 6.0)', year: '2025', type: 'intra' },
  { rank: 'Runner-up', event: 'Intra-AUST Programming Contest (PIC) Spring', year: '2025', type: 'intra' },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, decimals = 0, inView = false) {
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((eased * target).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration, decimals])

  return count
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function GlassCard({ children, className = '', glow = false, style = {} }: {
  children: ReactNode; className?: string; glow?: boolean; style?: React.CSSProperties
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:border-white/20 ${glow ? 'glass-card-glow' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

function StatCounter({ stat, inView }: { stat: StatCard; inView: boolean }) {
  const isDecimal = stat.value % 1 !== 0
  const count = useCountUp(stat.value, 1800, isDecimal ? 2 : 0, inView)
  const accentColor = stat.accent === 'purple' ? '#8b5cf6' : '#06b6d4'

  return (
    <div
      className="glass-card rounded-2xl p-5 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.02] cursor-default relative overflow-hidden"
      style={{ borderColor: `${accentColor}30` }}
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${accentColor}, transparent 70%)` }}
      />
      <div className="font-mono text-3xl font-bold" style={{ color: accentColor }}>
        {stat.prefix ?? ''}{isDecimal ? count.toFixed(2) : Math.floor(count)}{stat.suffix}
      </div>
      <div className="text-sm text-slate-400 font-medium leading-tight">{stat.label}</div>
    </div>
  )
}

function TechBadge({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/10 text-sm font-mono text-slate-300 whitespace-nowrap mr-3 hover:border-purple-500/40 transition-all duration-200">
      <span className="text-base">{icon}</span>
      <span>{name}</span>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className="pin-card rounded-2xl overflow-hidden relative cursor-pointer group"
      onClick={() => window.open(project.github, '_blank', 'noopener,noreferrer')}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? project.color + '40' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? `0 0 40px ${project.color}20, 0 20px 60px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.4s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent bar */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }} />

      {/* Glow orb */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${project.color}20, transparent 70%)`, opacity: hovered ? 1 : 0.4 }}
      />

      <div className="p-6 flex flex-col gap-4 h-full">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-xs text-slate-500 mb-1">PROJECT_{String(index + 1).padStart(2, '0')}</div>
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: project.color + '20', color: project.color, border: `1px solid ${project.color}40` }}
          >
            ↗
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed flex-1">{project.desc}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-0.5 rounded-full"
                style={{ background: project.color + '15', color: project.color, border: `1px solid ${project.color}25` }}
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 shrink-0 ml-2"
            style={{ background: project.color + '20', color: project.color, border: `1px solid ${project.color}40` }}
            onClick={e => e.stopPropagation()}
          >
            GitHub ↗
          </a>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${project.color}60, transparent)`, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }} />
    </div>
  )
}

function CapabilityCard({ title, desc, icon, color, delay }: {
  title: string; desc: string; icon: string; color: string; delay: number
}) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-6 flex flex-col gap-4 transition-all duration-500 hover:border-white/20 hover:scale-[1.02] group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.6s ease ${delay}ms`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: color + '15', border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-2 group-hover:text-opacity-100">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ContestBadge({ type }: { type: Contest['type'] }) {
  const map = {
    icpc: { label: 'ICPC', color: '#8b5cf6' },
    national: { label: 'NATIONAL', color: '#06b6d4' },
    collaborative: { label: 'COLLABORATIVE', color: '#38bdf8' },
    intra: { label: 'INTRA', color: '#a855f7' },
  }
  const { label, color } = map[type]
  return (
    <span className="font-mono text-xs px-2 py-0.5 rounded-full shrink-0"
      style={{ background: color + '15', color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { ref: statsRef, inView: statsInView } = useInView(0.2)

  const copyEmail = () => {
    navigator.clipboard.writeText('rakibulislamemon04@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Nav scroll spy
  useEffect(() => {
    const sections = ['home', 'projects', 'contests', 'contact']
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.3 }
    )
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  const navLinks = [
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contests', href: '#contests' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <div className="min-h-screen relative" style={{ background: '#030014' }}>
      {/* Dot grid background */}
      <div className="dot-grid fixed inset-0 pointer-events-none" />

      {/* Ambient orbs */}
      <div className="fixed pointer-events-none" style={{
        top: '-200px', left: '20%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div className="fixed pointer-events-none" style={{
        bottom: '-100px', right: '10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      {/* ── Floating Navbar ── */}
      <nav className="fixed top-5 left-1/2 z-50" style={{ transform: 'translateX(-50%)' }}>
        <div
          className="flex items-center gap-1 px-3 py-2 rounded-full"
          style={{
            background: 'rgba(3,0,20,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.1)',
          }}
        >
          <a
            href="#home"
            className="px-4 py-1.5 rounded-full font-semibold text-sm text-white transition-all duration-200"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            Rakibul <span className="text-purple-400">.</span>
          </a>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1.5 rounded-full text-sm text-slate-400 hover:text-white transition-all duration-200 hover:bg-white/5 hidden sm:block"
            >
              {label}
            </a>
          ))}
          <a
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-sm font-mono transition-all duration-200 hover:scale-105 ml-1"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}
          >
            Resume ↗
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-4xl w-full text-center flex flex-col items-center gap-8">

          {/* Subtitle badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs text-slate-300"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 20px rgba(139,92,246,0.1)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Pragmatic, systems-driven&nbsp;&nbsp;|&nbsp;&nbsp;Full-Stack Development & Algorithms
          </div>

          {/* Main headline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="gradient-text">Rakibul Islam Emon</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 font-medium">
              Software Developer & Competitive Programmer
            </p>
          </div>

          {/* Bio line */}
          <p className="max-w-2xl text-slate-500 leading-relaxed text-base">
            Building reliable, performant systems at the intersection of full-stack engineering and algorithmic problem solving.
            Currently at <span className="text-purple-400 font-medium">AUST CSE</span>, ranked{' '}
            <span className="text-cyan-400 font-medium font-mono">44th</span> at ICPC Dhaka Regional 2025.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              className="shimmer-btn px-6 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
            >
              View Projects
            </a>
            <button
              onClick={copyEmail}
              className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 flex items-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: copied ? '#22d3ee' : '#e2e8f0',
              }}
            >
              {copied ? '✓ Copied!' : '📧 Copy Email'}
            </button>
            <a
              href="./resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                color: '#06b6d4',
              }}
            >
              Download CV ↗
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="max-w-4xl w-full mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map(stat => (
            <StatCounter key={stat.label} stat={stat} inView={statsInView} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="font-mono text-xs text-slate-500">scroll</div>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section id="education" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="font-mono text-xs text-purple-400">// BACKGROUND</div>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>

          <div className="bento-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto' }}>

            {/* Education card — spans 2 cols */}
            <GlassCard className="col-span-2 relative overflow-hidden" style={{ gridColumn: 'span 2' }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top right, rgba(139,92,246,0.12), transparent 70%)' }} />
              <div className="font-mono text-xs text-purple-400 mb-4 flex items-center gap-2">
                <span>🎓</span> EDUCATION
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-1 rounded-full shrink-0 self-stretch"
                    style={{ background: 'linear-gradient(to bottom, #8b5cf6, #06b6d4)' }} />
                  <div>
                    <div className="text-white font-semibold">Ahsanullah University of Science & Technology</div>
                    <div className="text-slate-400 text-sm mt-0.5">B.Sc. in Computer Science & Engineering</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-mono text-xs text-purple-400 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                        CGPA 3.63 / 4.00
                      </span>
                      <span className="text-slate-500 text-xs font-mono">2023 — Present</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 rounded-full shrink-0 self-stretch"
                    style={{ background: 'linear-gradient(to bottom, #06b6d4, transparent)' }} />
                  <div>
                    <div className="text-white font-semibold">Dhaka City College</div>
                    <div className="text-slate-400 text-sm mt-0.5">Higher Secondary Certificate (HSC)</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-mono text-xs text-cyan-400 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                        GPA 5.00 / 5.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Contact card */}
            <GlassCard className="relative overflow-hidden flex flex-col gap-4" glow>
              <div className="font-mono text-xs text-cyan-400 mb-1 flex items-center gap-2">
                <span>📬</span> QUICK CONTACT
              </div>
              <button
                onClick={copyEmail}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-[1.02] group w-full text-left"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                <span className="text-purple-400 flex-1 font-mono text-xs truncate">
                  rakibulislamemon04@gmail.com
                </span>
                <span className="text-purple-400 text-xs">{copied ? '✓' : '⎘'}</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-cyan-400 font-mono text-xs">+880 1879 020129</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 rounded-lg font-mono text-xs transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#06b6d4' }}>
                  LinkedIn ↗
                </a>
                <a href="https://github.com/SHOEBILL04" target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center py-1.5 rounded-lg font-mono text-xs transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6' }}>
                  GitHub ↗
                </a>
              </div>
            </GlassCard>

            {/* Tech stack marquee — full width */}
            <div className="glass-card rounded-2xl py-5 overflow-hidden relative col-span-3"
              style={{ gridColumn: 'span 3' }}>
              <div className="font-mono text-xs text-slate-500 px-6 mb-3">// TECH STACK — PRIMARY</div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, #030014, transparent)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                  style={{ background: 'linear-gradient(to left, #030014, transparent)' }} />
                <div className="overflow-hidden">
                  <div className="marquee-track flex">
                    {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                      <TechBadge key={i} {...tech} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-mono text-xs text-cyan-400">// FEATURED PROJECTS</div>
            <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Things I've Built</h2>
          <p className="text-slate-500 text-sm mb-10">Full-stack systems shipped from idea to deployment.</p>

          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-mono text-xs text-purple-400">// CAPABILITIES</div>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-10">Domains & Expertise</h2>

          <div className="caps-grid grid gap-4" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <CapabilityCard
              icon="🏗️"
              title="Full-Stack Engineering"
              desc="MERN stack, Laravel backend services, RESTful API architecture, and responsive React/Next.js interfaces."
              color="#8b5cf6"
              delay={0}
            />
            <CapabilityCard
              icon="🗄️"
              title="Database Architecture"
              desc="Complex relational schema design, cascading operations, and indexing with MSSQL, MySQL, and MongoDB."
              color="#06b6d4"
              delay={100}
            />
            <CapabilityCard
              icon="⚡"
              title="Algorithmic Problem Solving"
              desc="Competitive programming in C++, advanced data structures, graph theory, and dynamic programming."
              color="#a855f7"
              delay={200}
            />
            <CapabilityCard
              icon="🎯"
              title="Leadership & Community"
              desc="Coordinator at AUST Programming & Informatics Club."
              color="#22d3ee"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ── Competitive Programming ── */}
      <section id="contests" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-mono text-xs text-purple-400">// COMPETITIVE PROGRAMMING</div>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-10">Contest Journey</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Rating shelf */}
            <GlassCard>
              <div className="font-mono text-xs text-slate-500 mb-4">ONLINE JUDGES — RATINGS</div>
              <div className="flex flex-col gap-3">
                {[
                  { platform: 'Codeforces', rating: '1262', label: 'Max Rating', color: '#8b5cf6', icon: 'CF', url: 'https://codeforces.com/profile/SHOEBILL' },
                  { platform: 'CodeChef', rating: '3-Star', label: 'Rank', color: '#06b6d4', icon: 'CC', url: 'https://www.codechef.com/users/shoebill' },
                  { platform: 'AtCoder', rating: '664', label: 'Rating', color: '#a855f7', icon: 'AT', url: 'https://atcoder.jp/users/SHOEBILL_04' },
                ].map(({ platform, rating, label, color, icon, url }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    style={{ background: color + '08', border: `1px solid ${color}20` }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                      style={{ background: color + '20', color }}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold flex items-center gap-1">
                        {platform} <span className="text-xs opacity-60">↗</span>
                      </div>
                      <div className="text-slate-500 text-xs">{label}</div>
                    </div>
                    <div className="font-mono font-bold text-sm" style={{ color }}>{rating}</div>
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Contest timeline */}
            <div className="flex flex-col gap-1">
              <div className="font-mono text-xs text-slate-500 mb-3 px-1">CONTEST ACHIEVEMENTS — 2025</div>
              {CONTESTS.map((contest, i) => (
                <div key={i} className="flex gap-3 items-start py-3 px-4 rounded-xl transition-all duration-200 hover:bg-white/3 group">
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: contest.type === 'icpc' ? '#8b5cf6' : contest.type === 'national' ? '#06b6d4' : '#a855f7' }} />
                    {i < CONTESTS.length - 1 && <div className="w-px flex-1 h-8 bg-white/5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-mono font-bold text-white text-sm">{contest.rank}</span>
                      <ContestBadge type={contest.type} />
                    </div>
                    <div className="text-slate-400 text-xs leading-snug">{contest.event}</div>
                  </div>
                  <div className="font-mono text-xs text-slate-600 shrink-0">{contest.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: 'rgba(139,92,246,0.05)',
              border: '1px solid rgba(139,92,246,0.2)',
              boxShadow: '0 0 60px rgba(139,92,246,0.12), 0 0 120px rgba(139,92,246,0.06)',
            }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08), transparent 70%)' }} />

            <div className="relative">
              <div className="font-mono text-xs text-purple-400 mb-4">// LET'S CONNECT</div>
              <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
                Let's build reliable software{' '}
                <span className="gradient-text">together.</span>
              </h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Open to interesting problems, collaborative projects, and full-time opportunities.
                Drop me a message or find me on socials.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={copyEmail}
                  className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105 shimmer-btn text-white"
                  style={{ boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}
                >
                  {copied ? '✓ Email Copied!' : '📧 Get in Touch'}
                </button>
                <a href="https://github.com/SHOEBILL04" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}>
                  GitHub →
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
                  LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Rakibul <span className="text-purple-400">.</span></span>
            <span className="text-slate-600 text-sm font-mono">/ SHOEBILL04</span>
          </div>
          <div className="text-center text-slate-600 text-xs font-mono">
            Software Developer & Competitive Programmer — AUST CSE '23
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-xs font-mono">
            <a href="https://github.com/SHOEBILL04" target="_blank" rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors">LinkedIn</a>
            <span>rakibulislamemon04@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
