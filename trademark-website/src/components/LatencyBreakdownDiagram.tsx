import { motion } from "framer-motion";

const STEPS = [
  { label: "QUOTE serialization", sublabel: "A → cable", ns: 640, color: "#00b4d8" },
  { label: "CDC sync", sublabel: "B side", ns: 20, color: "#eab308" },
  { label: "Board B pipeline", sublabel: "8 stages", ns: 80, color: "#00ff88" },
  { label: "ORDER serialization", sublabel: "B → cable", ns: 640, color: "#00ff88" },
  { label: "CDC sync", sublabel: "A side", ns: 20, color: "#eab308" },
  { label: "Exchange match", sublabel: "1 cycle", ns: 10, color: "#00b4d8" },
  { label: "FILL serialization", sublabel: "A → cable", ns: 640, color: "#a855f7" },
  { label: "CDC sync", sublabel: "B side", ns: 20, color: "#eab308" },
];

const TOTAL = STEPS.reduce((s, step) => s + step.ns, 0);

export default function LatencyBreakdownDiagram() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-end gap-0.5 h-48 sm:h-56">
        {STEPS.map((step, i) => {
          const heightPct = (step.ns / 700) * 100;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max(heightPct, 8)}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex-1 relative group"
            >
              <div
                className="w-full h-full rounded-t-md transition-all group-hover:brightness-125"
                style={{ backgroundColor: step.color + "30", borderTop: `2px solid ${step.color}` }}
              />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                <div className="px-2 py-1 rounded bg-surface border border-border text-center">
                  <p className="font-mono text-[10px] font-bold" style={{ color: step.color }}>
                    {step.ns} ns
                  </p>
                  <p className="text-[9px] text-muted">{step.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-0.5 mt-1">
        {STEPS.map((step, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="font-mono text-[8px] sm:text-[9px] leading-tight truncate" style={{ color: step.color }}>
              {step.sublabel}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <div className="text-center">
          <p className="font-mono text-3xl font-bold text-accent">~{(TOTAL / 1000).toFixed(2)} µs</p>
          <p className="text-xs text-muted mt-1">Total round-trip (4-bit link)</p>
        </div>
        <div className="hidden sm:block w-px h-12 bg-border" />
        <div className="text-center">
          <p className="font-mono text-3xl font-bold text-accent-blue">~1.11 µs</p>
          <p className="text-xs text-muted mt-1">With 8-bit link upgrade</p>
        </div>
        <div className="hidden sm:block w-px h-12 bg-border" />
        <div className="text-center">
          <p className="font-mono text-3xl font-bold text-yellow-400">&lt; 4%</p>
          <p className="text-xs text-muted mt-1">Pipeline vs wire time</p>
        </div>
      </div>
    </div>
  );
}
