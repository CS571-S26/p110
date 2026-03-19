import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";
import PhysicalSetupDiagram from "../components/PhysicalSetupDiagram";
import PipelineDiagram from "../components/PipelineDiagram";
import LatencyBreakdownDiagram from "../components/LatencyBreakdownDiagram";
import { motion } from "framer-motion";

const BOARD_A_MODULES = [
  {
    name: "market_sim.sv",
    desc: "32-bit Galois LFSR price random walk. Maintains per-symbol mid_price and spread arrays. Round-robin quote generation gated by configurable quote_interval. Regime controls step_size and base_spread.",
    resources: "~500 LUTs, 1 DSP48E2",
  },
  {
    name: "exchange_lite.sv",
    desc: "Order matching: BUY fills at ask if limit_price ≥ ask_price, SELL fills at bid if limit_price ≤ bid_price, else REJECT. Echoes order_id and timestamp for latency measurement.",
    resources: "~300 LUTs",
  },
  {
    name: "tx_arbiter.sv",
    desc: "Strict-priority 2:1 frame mux. FILL responses always take priority over QUOTE generation. Prevents starvation — once a quote starts serialization, it completes before preemption.",
    resources: "~100 LUTs",
  },
  {
    name: "board_a_axi_regs.sv",
    desc: "AXI-Lite slave. Config: CTRL, REGIME, QUOTE_INTERVAL, LFSR_SEED, per-symbol INIT_MID/INIT_SPREAD. Status: quotes_sent, orders_rcvd, fills_sent, rejects_sent, link_errors.",
    resources: "~400 LUTs",
  },
  {
    name: "board_a_ctrl.sv",
    desc: "Physical I/O: 4× debounce modules, button edge detection, switch sampling. LED[1:0]=regime, LED[2]=running, LED[4]=link_up. RGB0=regime color, RGB1=link health.",
    resources: "~150 LUTs",
  },
];

const BOARD_B_MODULES = [
  { name: "msg_demux.sv", desc: "Routes frames by msg_type[127:124]: QUOTE (0x1) → pipeline, FILL (0x3) → position tracker", resources: "~50 LUTs" },
  { name: "quote_book.sv", desc: "Per-symbol register file: best_bid, best_ask, bid_size, ask_size", resources: "~NUM_SYM×96 FFs" },
  { name: "feature_compute.sv", desc: "mid, spread, EMA (DSP48E2 MAC), deviation — 3 pipeline stages", resources: "~400 LUTs, 2 DSP" },
  { name: "strategy_engine.sv", desc: "Mean-reversion: deviation vs threshold → BUY/SELL/NONE", resources: "~200 LUTs" },
  { name: "risk_manager.sv", desc: "3 parallel checks: position ±500, rate 1000/window, loss halt $100", resources: "~300 LUTs" },
  { name: "order_manager.sv", desc: "Build ORDER frame, assign order_id + embed cycle counter timestamp", resources: "~200 LUTs" },
  { name: "position_tracker.sv", desc: "Per-symbol position + 48-bit Q32.16 cash accumulator (DSP48E2)", resources: "~300 LUTs, 1 DSP" },
  { name: "latency_histogram.sv", desc: "latency = cycle_counter - ts_echo. 16 bins × 32 cycles. min/max/sum/count.", resources: "~300 LUTs" },
];

const MESSAGE_TYPES = [
  {
    type: "QUOTE",
    code: "0x1",
    direction: "Board A → B",
    fields: [
      { name: "msg_type", bits: "[127:124]", width: "4" },
      { name: "symbol_id", bits: "[123:116]", width: "8" },
      { name: "regime", bits: "[115:114]", width: "2" },
      { name: "bid_price", bits: "[111:80]", width: "32 (Q16.16)" },
      { name: "ask_price", bits: "[79:48]", width: "32 (Q16.16)" },
      { name: "bid_size", bits: "[47:32]", width: "16" },
      { name: "ask_size", bits: "[31:16]", width: "16" },
      { name: "seq_num", bits: "[15:0]", width: "16" },
    ],
    color: "#00b4d8",
  },
  {
    type: "ORDER",
    code: "0x2",
    direction: "Board B → A",
    fields: [
      { name: "msg_type", bits: "[127:124]", width: "4" },
      { name: "symbol_id", bits: "[123:116]", width: "8" },
      { name: "side", bits: "[115]", width: "1" },
      { name: "limit_price", bits: "[111:80]", width: "32 (Q16.16)" },
      { name: "quantity", bits: "[79:64]", width: "16" },
      { name: "order_id", bits: "[63:48]", width: "16" },
      { name: "timestamp", bits: "[47:32]", width: "16" },
    ],
    color: "#00ff88",
  },
  {
    type: "FILL",
    code: "0x3",
    direction: "Board A → B",
    fields: [
      { name: "msg_type", bits: "[127:124]", width: "4" },
      { name: "symbol_id", bits: "[123:116]", width: "8" },
      { name: "side", bits: "[115]", width: "1" },
      { name: "status", bits: "[114:112]", width: "3 (FILLED/REJECTED)" },
      { name: "fill_price", bits: "[111:80]", width: "32 (Q16.16)" },
      { name: "fill_qty", bits: "[79:64]", width: "16" },
      { name: "order_id", bits: "[63:48]", width: "16 (echoed)" },
      { name: "ts_echo", bits: "[47:32]", width: "16 (echoed)" },
    ],
    color: "#a855f7",
  },
];

const LINK_SPECS = [
  { label: "Physical", value: "2× 12-pin PMOD ribbon cables (LVCMOS33)" },
  { label: "Data Width", value: "4-bit data + valid + ready per direction (full duplex)" },
  { label: "Clocking", value: "Mesochronous: independent 100 MHz oscillators, data at 50 MHz rate" },
  { label: "CDC", value: "2-FF synchronizer on RX — only clock domain crossing in entire design" },
  { label: "Frame Size", value: "128-bit universal format, 32 nibbles MSB-first" },
  { label: "Backpressure", value: "valid/ready handshake — zero frame loss guaranteed" },
  { label: "Parameterized", value: "LINK_DATA_W = 4 or 8 — one parameter change doubles throughput" },
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
              23 core RTL modules. Two FPGAs. One single-clock domain per board. Zero software in the critical path.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Physical Setup Diagram */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Topology" title="Physical Setup" description="Hover over components for details." />
          <FadeIn>
            <PhysicalSetupDiagram />
          </FadeIn>
        </div>
      </section>

      {/* Board A Modules */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Board A" title="Exchange-Lite Modules" description="4-state FSM: RESET → IDLE → RUNNING ↔ STOPPED" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOARD_A_MODULES.map((mod, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="rounded-xl border border-border bg-surface/50 p-5 h-full hover:border-accent-blue/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-mono text-sm font-bold text-accent-blue group-hover:text-accent-blue/90">{mod.name}</h3>
                    <span className="font-mono text-[10px] text-muted bg-white/5 px-2 py-0.5 rounded">{mod.resources}</span>
                  </div>
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
            description="5-state FSM: RESET → IDLE → ARMED → TRADING → HALTED. 8-stage pipeline processes quote to order in 80 ns."
          />
          <PipelineDiagram />

          <FadeIn delay={0.3}>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
              {BOARD_B_MODULES.map((mod, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-4 py-3 hover:border-accent/20 transition-colors"
                >
                  <span className="font-mono text-xs font-bold text-accent shrink-0">{mod.name}</span>
                  <span className="text-xs text-muted flex-1">{mod.desc}</span>
                  <span className="font-mono text-[9px] text-muted/60 shrink-0">{mod.resources}</span>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Link Layer */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Link Layer" title="Inter-FPGA Communication" description="Custom streaming protocol over PMOD ribbon cables." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LINK_SPECS.map((spec, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4 hover:border-yellow-400/20 transition-colors">
                  <span className="shrink-0 mt-0.5 font-mono text-[10px] font-bold text-yellow-400 w-20">{spec.label}</span>
                  <p className="text-sm text-gray-300 leading-relaxed">{spec.value}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Message Formats */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Message Format" title="128-bit Frame Types" description="Three message types traverse the link — all fixed-width for simple serialization." />
          <div className="space-y-6">
            {MESSAGE_TYPES.map((msg, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="rounded-xl border bg-surface/50 p-6" style={{ borderColor: msg.color + "30" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-lg font-bold" style={{ color: msg.color }}>{msg.type}</span>
                    <span className="font-mono text-xs text-muted bg-white/5 px-2 py-0.5 rounded">{msg.code}</span>
                    <span className="text-xs text-muted">{msg.direction}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                      {msg.fields.map((field, j) => (
                        <div
                          key={j}
                          className="rounded-md border px-3 py-2 text-center hover:brightness-125 transition-all"
                          style={{ borderColor: msg.color + "25", backgroundColor: msg.color + "08" }}
                        >
                          <p className="font-mono text-[10px] font-bold" style={{ color: msg.color }}>{field.name}</p>
                          <p className="font-mono text-[9px] text-muted mt-0.5">{field.bits}</p>
                          <p className="font-mono text-[9px] text-muted/60">{field.width}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Latency */}
      <section className="py-16 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Latency" title="Round-Trip Breakdown" description="Hover over bars to see per-step latency." />
          <LatencyBreakdownDiagram />
          <FadeIn delay={0.3}>
            <blockquote className="mt-8 border-l-2 border-accent pl-6 py-2 max-w-2xl mx-auto">
              <p className="font-mono text-accent text-sm leading-relaxed italic">
                "Latency is measured by the hardware that processes the data, not by
                the software that displays it."
              </p>
            </blockquote>
          </FadeIn>
        </div>
      </section>

      {/* Scalability */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading label="Scalability" title="Built to Scale" description="Compile-time parameters in hft_pkg.sv — no architectural changes needed." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FadeIn delay={0}>
              <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                <p className="font-mono text-sm text-muted mb-2">NUM_SYMBOLS</p>
                <p className="font-mono text-3xl font-bold text-accent">4 → 256</p>
                <p className="text-xs text-muted mt-2">+208 FFs per symbol (~0.15% of device)</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                <p className="font-mono text-sm text-muted mb-2">LINK_DATA_W</p>
                <p className="font-mono text-3xl font-bold text-accent">4 ↔ 8</p>
                <p className="text-xs text-muted mt-2">1 param + 4 jumper wires → 2× throughput</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="rounded-xl border border-border bg-surface/50 p-6 text-center hover:border-accent/30 transition-colors">
                <p className="font-mono text-sm text-muted mb-2">Strategies</p>
                <p className="font-mono text-3xl font-bold text-accent">1 → 3+</p>
                <p className="text-xs text-muted mt-2">Hot-swappable slot — FSM unchanged</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
