import { motion } from "framer-motion";
import { useState } from "react";

const STAGES = [
  { id: 1, name: "msg_demux", cycles: 1, desc: "Route frame by msg_type [127:124]\nQUOTE → quote path\nFILL → fill path\nUnknown → discard + error", color: "#00b4d8" },
  { id: 2, name: "quote_book", cycles: 1, desc: "Update per-symbol register file\nbest_bid[sym], best_ask[sym]\nbid_size[sym], ask_size[sym]", color: "#00b4d8" },
  { id: 3, name: "feature_compute", cycles: 3, desc: "Cycle 1: mid = (bid+ask)>>1, spread = ask-bid\nCycles 2-3: EMA via DSP48E2 MAC\ndeviation = mid - ema (signed Q16.16)", color: "#00ff88" },
  { id: 4, name: "strategy_engine", cycles: 1, desc: "Mean-reversion: deviation > +threshold → SELL at bid\ndeviation < -threshold → BUY at ask\nElse → no trade", color: "#00ff88" },
  { id: 5, name: "risk_manager", cycles: 1, desc: "3 parallel checks in 1 cycle:\n• Position limit (±500 shares)\n• Order rate limit (1000/window)\n• Loss halt ($100 Q16.16)\napproved = all pass & order_enable", color: "#ef4444" },
  { id: 6, name: "order_manager", cycles: 1, desc: "Build 128-bit ORDER frame\nAssign order_id (wrapping 16-bit)\nEmbed timestamp = cycle_counter[15:0]", color: "#a855f7" },
];

export default function PipelineDiagram() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const totalCycles = STAGES.reduce((sum, s) => sum + s.cycles, 0);

  return (
    <div className="w-full">
      {/* Pipeline visualization */}
      <div className="flex items-stretch gap-1 sm:gap-2 overflow-x-auto pb-4">
        {STAGES.map((stage, i) => {
          const widthPct = (stage.cycles / totalCycles) * 100;
          const isActive = activeStage === stage.id;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onMouseEnter={() => setActiveStage(stage.id)}
              onMouseLeave={() => setActiveStage(null)}
              className="flex flex-col items-center cursor-pointer group"
              style={{ flex: `${widthPct} 0 0%`, minWidth: "80px" }}
            >
              {/* Stage block */}
              <div
                className={`w-full rounded-lg border p-3 transition-all duration-200 ${
                  isActive
                    ? "border-opacity-80 scale-[1.02] shadow-lg"
                    : "border-opacity-30 hover:border-opacity-50"
                }`}
                style={{
                  borderColor: stage.color,
                  backgroundColor: isActive ? `${stage.color}15` : `${stage.color}08`,
                  boxShadow: isActive ? `0 0 20px ${stage.color}20` : "none",
                }}
              >
                <p className="font-mono text-[10px] sm:text-xs font-bold truncate" style={{ color: stage.color }}>
                  {stage.name}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="font-mono text-[10px] text-muted">
                    {stage.cycles === 1 ? "1 cycle" : `${stage.cycles} cycles`}
                  </span>
                </div>
              </div>

              {/* Arrow connector */}
              {i < STAGES.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 text-border-light">→</div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel */}
      <motion.div
        className="mt-4 rounded-xl border border-border bg-surface/50 p-5 min-h-[100px]"
        animate={{ borderColor: activeStage ? STAGES.find(s => s.id === activeStage)?.color + "40" : "#222" }}
      >
        {activeStage ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-mono text-sm font-bold" style={{ color: STAGES.find(s => s.id === activeStage)?.color }}>
                Stage {activeStage}: {STAGES.find(s => s.id === activeStage)?.name}.sv
              </h4>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: STAGES.find(s => s.id === activeStage)?.color + "40", color: STAGES.find(s => s.id === activeStage)?.color }}>
                {STAGES.find(s => s.id === activeStage)?.cycles} {STAGES.find(s => s.id === activeStage)?.cycles === 1 ? "cycle" : "cycles"} = {(STAGES.find(s => s.id === activeStage)?.cycles ?? 0) * 10} ns
              </span>
            </div>
            <pre className="font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
              {STAGES.find(s => s.id === activeStage)?.desc}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-muted text-center py-4">
            Hover over a pipeline stage to see details
          </p>
        )}
      </motion.div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="font-mono text-sm text-accent font-bold">
          Total: {totalCycles} cycles = {totalCycles * 10} ns @ 100 MHz
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </div>
    </div>
  );
}
