import { motion } from "framer-motion";
import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const BOARD_A_MODULES = [
  {
    name: "market_sim.sv",
    desc: "LFSR-based price random walk, generates QUOTE frames (bid/ask for up to 4–16 symbols). Configurable step size, base spread, and quote interval per regime.",
  },
  {
    name: "exchange_lite.sv",
    desc: "Order matching engine: compares incoming limit order price against current bid/ask; returns FILL if price is acceptable, REJECT otherwise.",
  },
  {
    name: "tx_arbiter.sv",
    desc: "Strict-priority mux: FILL responses take priority over QUOTE generation (prevents starvation).",
  },
  {
    name: "board_a_axi_regs.sv",
    desc: "AXI-Lite slave for PS configuration (regime select, LFSR seed, thresholds).",
  },
];

const PIPELINE_STAGES = [
  {
    name: "msg_demux.sv",
    desc: "Routes incoming frames by message type (QUOTE vs FILL)",
    cycles: "1",
  },
  {
    name: "quote_book.sv",
    desc: "Stores latest bid/ask per symbol",
    cycles: "1",
  },
  {
    name: "feature_compute.sv",
    desc: "Computes mid-price, spread, and EMA using Q16.16 fixed-point arithmetic and DSP48E2 slices",
    cycles: "3",
  },
  {
    name: "strategy_engine.sv",
    desc: "Mean-reversion: computes deviation = mid − EMA; BUY when price below EMA, SELL when above, scaled by deviation magnitude",
    cycles: "1",
  },
  {
    name: "risk_manager.sv",
    desc: "Three parallel 1-cycle checks: position limit (±100 shares), order rate limit (1000/ms), loss halt (−$16.00). Any failure suppresses the order.",
    cycles: "1",
  },
  {
    name: "order_manager.sv",
    desc: "Assigns order_id, embeds cycle-counter timestamp, builds ORDER frame",
    cycles: "1",
  },
  {
    name: "position_tracker.sv",
    desc: "Updates per-symbol position and 48-bit cash accumulator on FILL",
    cycles: "—",
  },
  {
    name: "latency_histogram.sv",
    desc: "Computes latency = current_cycle − echoed_timestamp, updates 16-bin histogram + min/max/sum/count",
    cycles: "—",
  },
];

const MESSAGE_TYPES = [
  {
    type: "QUOTE",
    direction: "Board A → B",
    header: "0x1",
    fields: "symbol_id, bid_price (Q16.16), ask_price (Q16.16), sequence number",
    color: "border-accent-blue/30",
    textColor: "text-accent-blue",
  },
  {
    type: "ORDER",
    direction: "Board B → A",
    header: "0x2",
    fields: "symbol_id, side (buy/sell), price, quantity, order_id, timestamp (16-bit cycle counter)",
    color: "border-accent/30",
    textColor: "text-accent",
  },
  {
    type: "FILL",
    direction: "Board A → B",
    header: "0x3",
    fields: "symbol_id, side, fill_price, fill_qty, order_id, echoed_timestamp",
    color: "border-purple-400/30",
    textColor: "text-purple-400",
  },
];

const LINK_SPECS = [
  "Custom streaming bus over 2× standard 12-pin PMOD ribbon cables",
  "4-bit data + valid + ready per direction (full duplex)",
  "Mesochronous clocking: both boards use local 100 MHz oscillators, data output held at 50 MHz rate",
  "2-FF synchronizer on receiver for CDC (clock domain crossing)",
  "128-bit universal frame format: 4-bit msg_type header + payload",
  "Zero frame loss via hardware backpressure (valid/ready handshake)",
  "Parameterized: LINK_DATA_W = 4 or 8 (one constant change doubles throughput)",
];

export default function Architecture() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-4 block">
              Technical Deep-Dive
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter">
              System Architecture
            </h1>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              Two FPGAs, one cable, zero software in the critical path.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Physical Setup */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Physical Setup"
            title="Hardware Topology"
          />
          <FadeIn>
            <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-10 overflow-x-auto">
              <pre className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre">
{`     ┌─────────────────┐    2× PMOD cables    ┌─────────────────┐
     │   Board A        │◄────────────────────►│   Board B        │
     │   (Exchange)     │                      │   (Trader)       │
     │   AUP-ZU3 #1    │                      │   AUP-ZU3 #2    │
     └─────────────────┘                      └────────┬────────┘
                                                       │ USB-C UART
                                                       ▼
                                               ┌───────────────┐
                                               │    Laptop      │
                                               │  (Dashboard)   │
                                               └───────────────┘`}
              </pre>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Board A Modules */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Board A"
            title="Exchange-Lite Modules"
            description="A simplified exchange that generates quotes and matches orders."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOARD_A_MODULES.map((mod, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="rounded-xl border border-border bg-surface/50 p-6 h-full hover:border-accent-blue/30 transition-colors">
                  <h3 className="font-mono text-sm font-bold text-accent-blue mb-2">
                    {mod.name}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{mod.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Board B Pipeline */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Board B"
            title="Trader Pipeline"
            description="Processes a quote and generates an order in 8 clock cycles (80 ns)."
          />

          <div className="space-y-3">
            {PIPELINE_STAGES.map((stage, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="rounded-xl border border-border bg-surface/50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="font-mono text-xs font-bold text-accent">
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-sm font-bold text-accent">
                        {stage.name}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed mt-0.5">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                  {stage.cycles !== "—" && (
                    <div className="shrink-0 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                      <span className="font-mono text-xs text-accent">
                        {stage.cycles} {parseInt(stage.cycles) === 1 ? "cycle" : "cycles"}
                      </span>
                    </div>
                  )}
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
              <p className="font-mono text-sm text-accent">
                Total pipeline: <span className="font-bold text-lg">8 cycles</span>{" "}
                = <span className="font-bold text-lg">80 ns</span> @ 100 MHz
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Link Layer */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Link Layer"
            title="Inter-FPGA Communication"
            description="Custom streaming protocol over PMOD ribbon cables."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LINK_SPECS.map((spec, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4 hover:border-yellow-400/20 transition-colors">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <p className="text-sm text-gray-300 leading-relaxed">{spec}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Message Formats */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Message Format"
            title="128-bit Frame Types"
            description="Three message types traverse the link layer."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MESSAGE_TYPES.map((msg, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div
                  className={`rounded-xl border ${msg.color} bg-surface/50 p-6 h-full hover:translate-y-[-2px] transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-mono font-bold text-lg ${msg.textColor}`}>
                      {msg.type}
                    </h3>
                    <span className="font-mono text-xs text-muted bg-white/5 px-2 py-0.5 rounded">
                      {msg.header}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-3 font-mono">
                    {msg.direction}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {msg.fields}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Latency Measurement */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Latency"
            title="Hardware Latency Measurement"
          />
          <FadeIn>
            <div className="rounded-2xl border border-border bg-surface/50 p-8 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-mono text-accent text-sm font-bold mt-0.5">01</span>
                    <p className="text-sm text-gray-300">
                      Board B embeds a 16-bit cycle counter in each ORDER as a timestamp
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-mono text-accent text-sm font-bold mt-0.5">02</span>
                    <p className="text-sm text-gray-300">
                      Board A echoes it back in the FILL response
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-mono text-accent text-sm font-bold mt-0.5">03</span>
                    <p className="text-sm text-gray-300">
                      Board B computes round-trip latency entirely in programmable logic:{" "}
                      <span className="font-mono text-accent">
                        latency = current_cycle − echoed_timestamp
                      </span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-mono text-accent text-sm font-bold mt-0.5">04</span>
                    <p className="text-sm text-gray-300">
                      Results stored in a 16-bin hardware histogram (32 cycles per bin = 320 ns)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-mono text-accent text-sm font-bold mt-0.5">05</span>
                    <p className="text-sm text-gray-300">
                      Scalar stats: min, max, sum, count — all in PL registers
                    </p>
                  </div>
                </div>
              </div>
              <blockquote className="border-l-2 border-accent pl-6 py-2 mt-6">
                <p className="font-mono text-accent text-sm leading-relaxed italic">
                  "Latency is measured by the hardware that processes the data, not by
                  the software that displays it."
                </p>
              </blockquote>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Scalability */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Scalability"
            title="Built to Scale"
            description="Compile-time parameters enable effortless scaling."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FadeIn delay={0}>
              <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                <p className="font-mono text-sm text-muted mb-2">NUM_SYMBOLS</p>
                <p className="font-mono text-3xl font-bold text-accent">
                  4 → 256
                </p>
                <p className="text-xs text-muted mt-2">
                  Compile-time parameter, default 4
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                <p className="font-mono text-sm text-muted mb-2">LINK_DATA_W</p>
                <p className="font-mono text-3xl font-bold text-accent">
                  4 ↔ 8
                </p>
                <p className="text-xs text-muted mt-2">
                  One parameter + 4 jumper wires
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                <p className="font-mono text-sm text-muted mb-2">Utilization</p>
                <p className="font-mono text-3xl font-bold text-accent">
                  ~7% LUT
                </p>
                <p className="text-xs text-muted mt-2">
                  Massive headroom for expansion
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
