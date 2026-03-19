import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroBackground from "../components/HeroBackground";
import PhysicalSetupDiagram from "../components/PhysicalSetupDiagram";
import DataFlowDiagram from "../components/DataFlowDiagram";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const SPECS = [
  { value: "≤ 8 cycles", unit: "80 ns @ 100 MHz", label: "Pipeline Latency" },
  { value: "0 cycles", unit: "Deterministic", label: "Pipeline Jitter" },
  { value: "~2.07 µs", unit: "4-bit link", label: "Round-Trip Latency" },
  { value: "~1.47M", unit: "frames/sec (4-bit)", label: "Link Throughput" },
  { value: "0", unit: "Hardware backpressure", label: "Frame Loss" },
  { value: "10 ns", unit: "1 clock cycle", label: "Latency Resolution" },
  { value: "1 cycle", unit: "10 ns — 3 parallel checks", label: "Risk Check" },
  { value: "≥ 10 min", unit: "Per stress regime", label: "Sustained Operation" },
];

const SOLUTIONS = [
  {
    title: "Board A — Exchange-Lite",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    desc: "LFSR-based market simulator generates synthetic quotes (bid/ask for 4 symbols). Exchange matches incoming orders — BUY fills at ask if limit ≥ ask, SELL fills at bid if limit ≤ bid. TX arbiter prioritizes fills over quotes.",
    analogy: "Real-world analogy: a simplified NASDAQ",
    modules: ["market_sim.sv", "exchange_lite.sv", "tx_arbiter.sv"],
    color: "border-accent-blue/30 hover:border-accent-blue/60",
    glow: "bg-accent-blue/5",
  },
  {
    title: "Board B — Trader Engine",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    desc: "8-stage fully pipelined RTL: msg_demux → quote_book → feature_compute (EMA via DSP48E2) → strategy_engine (mean-reversion) → risk_manager (3 parallel checks) → order_manager. Measures round-trip latency in hardware with 16-bin histogram.",
    analogy: "Real-world analogy: a trading firm's FPGA engine",
    modules: ["msg_demux.sv", "feature_compute.sv", "risk_manager.sv", "latency_histogram.sv"],
    color: "border-accent/30 hover:border-accent/60",
    glow: "bg-accent/5",
  },
  {
    title: "Laptop — Dashboard",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    desc: "8-panel Plotly Dash display refreshed at 20 Hz. Board B PS reads AXI-Lite registers, streams JSON over USB-UART (115200 baud, FTDI FT2232HQ). Dashboard computes rates from counter deltas and p50/p99 from histogram bins.",
    analogy: "Real-time telemetry at 20 Hz",
    modules: ["telemetry_server.py", "dashboard.py", "serial_reader.py"],
    color: "border-purple-400/30 hover:border-purple-400/60",
    glow: "bg-purple-400/5",
  },
];

const REGIMES = [
  {
    name: "CALM",
    code: "2'b00",
    behavior: "Small price moves, moderate quote rate (~100K qps)",
    response: "Steady PnL, low rejects, stable throughput",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    name: "VOLATILE",
    code: "2'b01",
    behavior: "Large price swings, wider spreads",
    response: "PnL oscillates wildly, position limits hit more often",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    name: "BURST",
    code: "2'b10",
    behavior: "Maximum quote rate (~1M+/sec), link at ~68% utilization",
    response: "Throughput gauge spikes, FIFO fill levels rise",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    name: "ADVERSARIAL",
    code: "2'b11",
    behavior: "Extreme volatility + tight risk limits",
    response: "Risk rejects spike, loss halt may trigger → HALTED state",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/60 to-[#0a0a0a]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-light bg-surface/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs text-muted">
                ECE 554 Capstone · Spring 2026 · UW–Madison
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter">
              <span className="gradient-text">Trade</span>
              <span className="text-white">Mark</span>
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl mx-auto font-light">
              Dual-FPGA Deterministic Low-Latency Trading Engine
            </p>

            <p className="mt-6 font-mono text-sm sm:text-base text-accent/80 max-w-3xl mx-auto leading-relaxed">
              Sub-microsecond trading decisions. Zero jitter.
              <br className="hidden sm:block" />
              Hardware-measured. Hardware-enforced.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/architecture"
              className="px-8 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            >
              View Architecture
            </Link>
            <Link
              to="/design-review"
              className="px-8 py-3 border border-border-light text-white font-semibold rounded-lg hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              Design Review
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-20 flex justify-center"
          >
            <div className="animate-bounce text-muted">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="The Problem"
            title="Why Software Trading Fails"
            description="Modern electronic trading demands deterministic, sub-microsecond decision-making. General-purpose CPUs cannot guarantee this."
          />

          <FadeIn delay={0.2}>
            <div className="relative rounded-2xl border border-border bg-surface/50 p-8 sm:p-12">
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                OS scheduling, cache misses, and interrupts introduce unpredictable
                jitter — typically{" "}
                <span className="font-mono text-accent font-semibold">10–100 µs</span>{" "}
                — making software-based latency measurement unreliable and
                software-based trading non-deterministic. Production FPGA firms achieve{" "}
                <span className="font-mono text-accent-blue font-semibold">50–300 ns</span>{" "}
                tick-to-trade — our 80 ns internal pipeline is competitive.
              </p>
              <blockquote className="border-l-2 border-accent pl-6 py-2">
                <p className="font-mono text-accent text-sm sm:text-base leading-relaxed italic">
                  "The OS is both the problem and the measuring instrument — we
                  eliminate both by moving everything to hardware."
                </p>
              </blockquote>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-white/[0.02] p-4 border border-border">
                  <p className="font-mono text-xs text-muted mb-1">Why two FPGAs?</p>
                  <p className="text-sm text-gray-300">Physical link design, real CDC, demo credibility — not a simulation</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] p-4 border border-border">
                  <p className="font-mono text-xs text-muted mb-1">No CPU in the critical path</p>
                  <p className="text-sm text-gray-300">PS handles config + telemetry. PL handles all latency-critical logic.</p>
                </div>
                <div className="rounded-lg bg-white/[0.02] p-4 border border-border">
                  <p className="font-mono text-xs text-muted mb-1">Custom link layer</p>
                  <p className="text-sm text-gray-300">PL-to-PL over PMOD, not Ethernet/TCP — zero frame loss by design</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Physical Setup */}
      <section className="py-24 sm:py-32 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Physical Setup"
            title="Hardware Topology"
            description="Two FPGAs, two PMOD cables, one USB-UART to the laptop. Hover for details."
          />
          <FadeIn>
            <PhysicalSetupDiagram />
          </FadeIn>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Solution"
            title="Three Physical Components"
            description="A complete hardware trading ecosystem: exchange, trader engine, and monitoring dashboard."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOLUTIONS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div
                  className={`rounded-2xl border ${s.color} ${s.glow} p-8 h-full transition-all duration-300 hover:translate-y-[-2px]`}
                >
                  <div className="text-accent mb-4">{s.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.modules.map((m, j) => (
                      <span key={j} className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted border border-border">
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-accent/60">{s.analogy}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Key Specs */}
      <section className="py-24 sm:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Performance"
            title="Key Specifications"
            description="Every number is hardware-measured, not estimated."
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SPECS.map((spec, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                  <p className="font-mono text-2xl sm:text-3xl font-bold text-accent">
                    {spec.value}
                  </p>
                  <p className="font-mono text-xs text-accent-blue mt-1">
                    {spec.unit}
                  </p>
                  <p className="text-sm text-muted mt-3">{spec.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Data Flow"
            title="End-to-End Pipeline"
            description="From quote generation to dashboard display — the complete data lifecycle."
          />
          <DataFlowDiagram />
        </div>
      </section>

      {/* Stress Regimes */}
      <section className="py-24 sm:py-32 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Stress Testing"
            title="Market Regimes"
            description="Switched live during demo via hardware switches (SW[1:0]) — the audience watches the dashboard respond."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REGIMES.map((r, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className={`rounded-xl border ${r.border} ${r.bg} p-6 h-full transition-all duration-300 hover:translate-y-[-2px]`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${r.color.replace("text-", "bg-")}`} />
                    <h3 className={`font-mono font-bold text-lg ${r.color}`}>
                      {r.name}
                    </h3>
                  </div>
                  <p className="font-mono text-[10px] text-muted mb-4">{r.code}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">
                        Behavior
                      </p>
                      <p className="text-sm text-gray-300">{r.behavior}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">
                        Dashboard Response
                      </p>
                      <p className="text-sm text-gray-300">{r.response}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-4 block">
              Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              AMD Zynq UltraScale+
            </h2>
            <p className="font-mono text-sm text-muted mb-2">
              2× AUP-ZU3 (XCZU3EG-2SFVC784E)
            </p>
            <p className="text-xs text-muted/60 mb-8">
              154K logic cells · 70K LUTs · 141K FFs · 360 DSP48E2 · 7.6 Mb BRAM
            </p>
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-border bg-surface/50 p-8">
              <div className="text-center">
                <p className="font-mono text-4xl font-bold text-accent">~4.6%</p>
                <p className="text-xs text-muted mt-1">LUT Utilization (Board B)</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-mono text-4xl font-bold text-accent">~1.6%</p>
                <p className="text-xs text-muted mt-1">FF Utilization</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-mono text-4xl font-bold text-accent">~0.8%</p>
                <p className="text-xs text-muted mt-1">DSP Usage</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-mono text-4xl font-bold text-accent">~1%</p>
                <p className="text-xs text-muted mt-1">BRAM Usage</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted/60">
              23 core modules · 5 stretch modules · Room for neural network strategy at &lt;10% utilization
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
