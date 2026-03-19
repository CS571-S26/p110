import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const DASHBOARD_PANELS = [
  {
    title: "Throughput Gauges",
    desc: "quotes/sec, orders/sec, fills/sec — circular gauge widgets showing real-time throughput",
    icon: "📊",
  },
  {
    title: "Latency Histogram",
    desc: "16-bin bar chart with p50/p99/max annotated, showing round-trip latency distribution",
    icon: "📈",
  },
  {
    title: "Position Bars",
    desc: "Per-symbol position display (green = long, red = short) tracking inventory",
    icon: "📉",
  },
  {
    title: "PnL Line Chart",
    desc: "Running profit/loss over time with regime transition markers",
    icon: "💹",
  },
  {
    title: "Regime Indicator",
    desc: "Current stress mode label with color coding — CALM, VOLATILE, BURST, ADVERSARIAL",
    icon: "🎯",
  },
  {
    title: "Risk Reject Counters",
    desc: "Per-category counters: position limit, order rate limit, loss halt triggers",
    icon: "🛡️",
  },
  {
    title: "Link Health",
    desc: "TX/RX frame counts, FIFO max fill level, error counters for link monitoring",
    icon: "🔗",
  },
  {
    title: "Scalar Stats",
    desc: "min/max/mean latency, total trades, uptime — key summary statistics",
    icon: "📋",
  },
];

const DEMO_STEPS = [
  {
    step: "01",
    title: "Power On",
    desc: "Boot both boards — LEDs confirm link lock and synchronization",
    color: "text-accent",
  },
  {
    step: "02",
    title: "CALM Regime",
    desc: "Dashboard shows steady trading with stable PnL and low reject rates",
    color: "text-green-400",
  },
  {
    step: "03",
    title: "VOLATILE Regime",
    desc: "PnL oscillates as strategy adapts to wider spreads and price swings",
    color: "text-yellow-400",
  },
  {
    step: "04",
    title: "BURST Regime",
    desc: "Throughput spikes to 1M+ quotes/sec — system handles maximum load",
    color: "text-orange-400",
  },
  {
    step: "05",
    title: "ADVERSARIAL Regime",
    desc: "Risk rejects spike, loss halt may trigger — system protects against adverse conditions",
    color: "text-red-400",
  },
  {
    step: "06",
    title: "Reset & Repeat",
    desc: "Deterministic: same seed = same results. Identical trade sequence every time.",
    color: "text-accent-blue",
  },
];

const HIGHLIGHTS = [
  {
    title: "Physical Hardware",
    desc: "Two physical FPGAs with a visible cable carrying live data — not a simulation",
    gradient: "from-accent/20 to-transparent",
  },
  {
    title: "No CPU in Critical Path",
    desc: "Hardware-only trading path: no CPU, no OS, no interrupts in the latency-critical pipeline",
    gradient: "from-accent-blue/20 to-transparent",
  },
  {
    title: "Zero Jitter Proof",
    desc: "Latency histogram shows all samples in one bin — deterministic by design",
    gradient: "from-purple-400/20 to-transparent",
  },
  {
    title: "Real-Time Regime Switching",
    desc: "Live regime changes with visible dashboard response — audience watches it happen",
    gradient: "from-yellow-400/20 to-transparent",
  },
  {
    title: "Fully Deterministic",
    desc: "Identical seed + regime sequence = identical trade sequence, every single time",
    gradient: "from-orange-400/20 to-transparent",
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
            description="Refreshed at 20 Hz via USB-UART JSON telemetry from Board B."
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
            title="What Happens During Demo"
            description="A scripted walkthrough of the system under different market conditions."
          />

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {DEMO_STEPS.map((step, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-6 relative">
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center z-10`}
                    >
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
          <SectionHeading
            label="Highlights"
            title="What Makes This Impressive"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIGHLIGHTS.map((h, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className={`relative overflow-hidden rounded-xl border border-border p-6 h-full hover:translate-y-[-2px] transition-all`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${h.gradient} opacity-50`}
                  />
                  <div className="relative">
                    <h3 className="font-semibold text-white mb-2">{h.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {h.desc}
                    </p>
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
