import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

const PIPELINE_STEPS = [
  { label: "QUOTE", sub: "Board A generates", color: "text-accent-blue" },
  { label: "PMOD", sub: "4-bit link", color: "text-yellow-400" },
  { label: "quote_book", sub: "Store bid/ask", color: "text-accent" },
  { label: "feature_compute", sub: "EMA (3 cycles)", color: "text-accent" },
  { label: "strategy_engine", sub: "Mean-reversion", color: "text-accent" },
  { label: "risk_manager", sub: "1-cycle check", color: "text-accent" },
  { label: "order_manager", sub: "Build ORDER", color: "text-accent" },
  { label: "PMOD", sub: "4-bit link", color: "text-yellow-400" },
  { label: "MATCH", sub: "Board A matches", color: "text-accent-blue" },
  { label: "FILL/REJECT", sub: "Response", color: "text-purple-400" },
  { label: "PMOD", sub: "4-bit link", color: "text-yellow-400" },
  { label: "position_tracker", sub: "Update PnL", color: "text-accent" },
  { label: "USB-UART", sub: "→ Dashboard", color: "text-orange-400" },
];

export default function DataFlowDiagram() {
  return (
    <FadeIn className="w-full overflow-x-auto py-4">
      <div className="flex items-center gap-0 min-w-max mx-auto justify-center flex-wrap lg:flex-nowrap">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-16 rounded-lg border border-border-light bg-surface flex items-center justify-center px-2 hover:border-accent/40 transition-colors">
                <span
                  className={`font-mono text-xs font-semibold text-center leading-tight ${step.color}`}
                >
                  {step.label}
                </span>
              </div>
              <span className="text-[10px] text-muted mt-1.5 text-center w-24 leading-tight">
                {step.sub}
              </span>
            </motion.div>
            {i < PIPELINE_STEPS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 + 0.1 }}
                className="text-border-light mx-0.5 text-lg"
              >
                →
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
