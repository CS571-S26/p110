import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const DASHBOARD_PANELS = [
  {
    title: "Throughput Gauges",
    desc: "quotes/sec, orders/sec, fills/sec — computed from counter deltas. Red zone at >80% link capacity (~1.18M fps).",
    icon: "📊",
  },
  {
    title: "Latency Histogram",
    desc: "16-bin bar chart, each bin = 32 cycles × 10 ns = 320 ns. p50/p99/max annotated as vertical lines. Computed from cumulative bin walk.",
    icon: "📈",
  },
  {
    title: "Position Bars",
    desc: "Per-symbol signed position (green = long, red = short, gray = flat). Auto-scales to NUM_SYMBOLS from JSON array length.",
    icon: "📉",
  },
  {
    title: "PnL Line Chart",
    desc: "Running profit/loss from 48-bit Q32.16 cash accumulator. Green when positive, red when negative. Last 5 min of history.",
    icon: "💹",
  },
  {
    title: "Regime Indicator",
    desc: "Current stress mode from Board A switches: CALM (green), VOLATILE (yellow), BURST (orange), ADVERSARIAL (red). Shows FSM state name.",
    icon: "🎯",
  },
  {
    title: "Risk Reject Counters",
    desc: "Per-category counters: position limit, order rate limit, loss halt. Sparkline shows reject rate over time.",
    icon: "🛡️",
  },
  {
    title: "Link Health",
    desc: "Green = 0 errors, Yellow = errors detected, Red = link down. Shows link_errors count and link_up status.",
    icon: "🔗",
  },
  {
    title: "Scalar Stats",
    desc: "Min/mean/max latency in nanoseconds (from lat_min × 10, lat_sum/lat_count × 10, lat_max × 10). Active strategy, FSM state.",
    icon: "📋",
  },
];

const DEMO_STEPS = [
  {
    step: "01",
    title: "Power On + Boot",
    desc: "Both AUP-ZU3 boards boot PYNQ Linux (~30s). Connect USB-C cables for SSH and UART. PMOD ribbons already connected.",
    color: "text-muted",
  },
  {
    step: "02",
    title: "Configure Board A",
    desc: "SSH in, run config_exchange.py — loads overlay, writes LFSR seed, init prices, regime. FSM: RESET → IDLE → RUNNING. Quotes flow.",
    color: "text-accent-blue",
  },
  {
    step: "03",
    title: "Configure Board B",
    desc: "SSH in, run telemetry_server.py — loads overlay, writes threshold/EMA α/risk limits. FSM: RESET → IDLE → (link_up) → ARMED. JSON streaming begins.",
    color: "text-accent",
  },
  {
    step: "04",
    title: "Launch Dashboard",
    desc: "On laptop: python dashboard.py --port COMy. Browser opens localhost:8050. Shows ARMED state, EMA converging, no orders yet.",
    color: "text-purple-400",
  },
  {
    step: "05",
    title: "Go Live — CALM",
    desc: "Flip SW[0] on Board B (trading_enable = 1). FSM: ARMED → TRADING. Orders flow, fills return, PnL updates, histogram fills. Steady trading.",
    color: "text-green-400",
  },
  {
    step: "06",
    title: "Switch to VOLATILE",
    desc: "Flip SW[1:0] on Board A. Quote behavior changes immediately — spread widens, PnL swings larger, position limits hit more often.",
    color: "text-yellow-400",
  },
  {
    step: "07",
    title: "Switch to BURST",
    desc: "Quote rate spikes to ~1M+ quotes/sec. Throughput gauges near max, FIFO fill levels rise. System handles maximum load without frame loss.",
    color: "text-orange-400",
  },
  {
    step: "08",
    title: "Switch to ADVERSARIAL",
    desc: "Risk rejects spike. Loss halt may trigger → HALTED state (circuit breaker). Dashboard shows red risk status. Only reset clears halt.",
    color: "text-red-400",
  },
  {
    step: "09",
    title: "Return to CALM",
    desc: "System stabilizes, proves resilience. Highlight: link_errors = 0 across all regimes. Same seed = same results — deterministic.",
    color: "text-accent-blue",
  },
];

const HIGHLIGHTS = [
  {
    title: "Physical Hardware",
    desc: "Two physical FPGAs with a visible cable carrying live data — not a simulation. Real CDC, real wire latency.",
    gradient: "from-accent/20 to-transparent",
  },
  {
    title: "No CPU in Critical Path",
    desc: "Pure RTL pipeline: no OS, no cache, no interrupts. PS only handles config + telemetry — never touches the data path.",
    gradient: "from-accent-blue/20 to-transparent",
  },
  {
    title: "Zero Jitter Proof",
    desc: "Latency histogram concentrates in 1-2 bins — 0 cycles of pipeline jitter. Hardware determinism by design.",
    gradient: "from-purple-400/20 to-transparent",
  },
  {
    title: "Live Regime Switching",
    desc: "Hardware switches change market behavior instantly. Dashboard responds in real time — audience watches it happen.",
    gradient: "from-yellow-400/20 to-transparent",
  },
  {
    title: "Fully Deterministic",
    desc: "Same LFSR seed + same regime sequence = identical trade sequence, every single time. Reproducible results.",
    gradient: "from-orange-400/20 to-transparent",
  },
  {
    title: "Circuit Breaker",
    desc: "5-state FSM includes HALTED — a one-way circuit breaker when PnL crosses -max_loss. Only reset can resume trading.",
    gradient: "from-red-400/20 to-transparent",
  },
];

export default function Demo() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-4 block">
              Live Demonstration
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">
              Demo Day
            </h1>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              Watch the trading engine respond to market regimes in real time.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Dashboard"
            title="8-Panel Real-Time Display"
            description="Plotly Dash app refreshed at 20 Hz via USB-UART JSON telemetry from Board B PS."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DASHBOARD_PANELS.map((panel, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="rounded-xl border border-border bg-surface/50 p-5 h-full hover:border-accent/20 transition-colors group">
                  <div className="text-2xl mb-3">{panel.icon}</div>
                  <h3 className="font-semibold text-sm text-white mb-1.5 group-hover:text-accent transition-colors">
                    {panel.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {panel.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Flow */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Demo Flow"
            title="Scripted Demo Sequence"
            description="End-to-end workflow: power on → configure → trade → stress test → verify."
          />

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {DEMO_STEPS.map((step, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-6 relative">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center z-10">
                      <span className={`font-mono text-xs font-bold ${step.color}`}>
                        {step.step}
                      </span>
                    </div>
                    <div className="pb-2">
                      <h3 className={`font-semibold text-lg ${step.color}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Impressive */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Highlights" title="What Makes This Impressive" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="relative overflow-hidden rounded-xl border border-border p-6 h-full hover:translate-y-[-2px] transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br ${h.gradient} opacity-50`} />
                  <div className="relative">
                    <h3 className="font-semibold text-white mb-2">{h.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
