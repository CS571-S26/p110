import { motion } from "framer-motion";
import { useState } from "react";

const PULSE_ANIM = {
  animate: { opacity: [0.3, 1, 0.3] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
};

interface TooltipInfo {
  label: string;
  detail: string;
}

export default function PhysicalSetupDiagram() {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const showTip = (info: TooltipInfo) => setTooltip(info);
  const hideTip = () => setTooltip(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {tooltip && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 px-4 py-2 rounded-lg bg-surface border border-accent/30 shadow-lg shadow-accent/10 pointer-events-none">
          <p className="font-mono text-xs text-accent font-bold">{tooltip.label}</p>
          <p className="text-xs text-muted mt-0.5">{tooltip.detail}</p>
        </div>
      )}

      <svg viewBox="0 0 800 320" className="w-full h-auto" fill="none">
        {/* Board A */}
        <motion.g
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseEnter={() => showTip({ label: "Board A — Exchange-Lite", detail: "AUP-ZU3 #1 · Generates quotes, matches orders" })}
          onMouseLeave={hideTip}
          className="cursor-pointer"
        >
          <rect x="40" y="60" width="240" height="140" rx="12" stroke="#00b4d8" strokeWidth="2" fill="#00b4d8" fillOpacity="0.05" />
          <text x="160" y="95" textAnchor="middle" fill="#00b4d8" fontFamily="JetBrains Mono, monospace" fontSize="14" fontWeight="700">Board A</text>
          <text x="160" y="118" textAnchor="middle" fill="#888" fontFamily="Inter, sans-serif" fontSize="11">Exchange-Lite</text>
          <text x="160" y="140" textAnchor="middle" fill="#555" fontFamily="JetBrains Mono, monospace" fontSize="9">AUP-ZU3 #1</text>
          <text x="160" y="160" textAnchor="middle" fill="#555" fontFamily="JetBrains Mono, monospace" fontSize="9">XCZU3EG-2SFVC784E</text>

          <rect x="70" y="170" width="80" height="20" rx="4" fill="#00b4d8" fillOpacity="0.15" stroke="#00b4d8" strokeWidth="0.5" />
          <text x="110" y="184" textAnchor="middle" fill="#00b4d8" fontFamily="JetBrains Mono, monospace" fontSize="8">market_sim</text>

          <rect x="170" y="170" width="80" height="20" rx="4" fill="#00b4d8" fillOpacity="0.15" stroke="#00b4d8" strokeWidth="0.5" />
          <text x="210" y="184" textAnchor="middle" fill="#00b4d8" fontFamily="JetBrains Mono, monospace" fontSize="8">exchange_lite</text>
        </motion.g>

        {/* Board B */}
        <motion.g
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onMouseEnter={() => showTip({ label: "Board B — Trader Engine", detail: "AUP-ZU3 #2 · 8-stage pipeline, risk checks, telemetry" })}
          onMouseLeave={hideTip}
          className="cursor-pointer"
        >
          <rect x="520" y="60" width="240" height="140" rx="12" stroke="#00ff88" strokeWidth="2" fill="#00ff88" fillOpacity="0.05" />
          <text x="640" y="95" textAnchor="middle" fill="#00ff88" fontFamily="JetBrains Mono, monospace" fontSize="14" fontWeight="700">Board B</text>
          <text x="640" y="118" textAnchor="middle" fill="#888" fontFamily="Inter, sans-serif" fontSize="11">Trader Engine</text>
          <text x="640" y="140" textAnchor="middle" fill="#555" fontFamily="JetBrains Mono, monospace" fontSize="9">AUP-ZU3 #2</text>
          <text x="640" y="160" textAnchor="middle" fill="#555" fontFamily="JetBrains Mono, monospace" fontSize="9">XCZU3EG-2SFVC784E</text>

          <rect x="545" y="170" width="60" height="20" rx="4" fill="#00ff88" fillOpacity="0.15" stroke="#00ff88" strokeWidth="0.5" />
          <text x="575" y="184" textAnchor="middle" fill="#00ff88" fontFamily="JetBrains Mono, monospace" fontSize="7">pipeline</text>

          <rect x="615" y="170" width="50" height="20" rx="4" fill="#00ff88" fillOpacity="0.15" stroke="#00ff88" strokeWidth="0.5" />
          <text x="640" y="184" textAnchor="middle" fill="#00ff88" fontFamily="JetBrains Mono, monospace" fontSize="7">risk</text>

          <rect x="675" y="170" width="60" height="20" rx="4" fill="#00ff88" fillOpacity="0.15" stroke="#00ff88" strokeWidth="0.5" />
          <text x="705" y="184" textAnchor="middle" fill="#00ff88" fontFamily="JetBrains Mono, monospace" fontSize="7">telemetry</text>
        </motion.g>

        {/* PMOD Cables */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onMouseEnter={() => showTip({ label: "2× PMOD Ribbon Cables", detail: "4-bit data + valid + ready per direction · Full duplex · 128-bit frames" })}
          onMouseLeave={hideTip}
          className="cursor-pointer"
        >
          {/* Cable 1: A→B */}
          <line x1="280" y1="110" x2="520" y2="110" stroke="#00b4d8" strokeWidth="2" strokeDasharray="6 4" />
          <motion.circle cx="400" cy="110" r="3" fill="#00b4d8" {...PULSE_ANIM} />
          <polygon points="510,106 520,110 510,114" fill="#00b4d8" />
          <text x="400" y="100" textAnchor="middle" fill="#00b4d8" fontFamily="JetBrains Mono, monospace" fontSize="8" opacity="0.8">QUOTE + FILL →</text>

          {/* Cable 2: B→A */}
          <line x1="520" y1="150" x2="280" y2="150" stroke="#00ff88" strokeWidth="2" strokeDasharray="6 4" />
          <motion.circle cx="400" cy="150" r="3" fill="#00ff88" {...PULSE_ANIM} />
          <polygon points="290,146 280,150 290,154" fill="#00ff88" />
          <text x="400" y="168" textAnchor="middle" fill="#00ff88" fontFamily="JetBrains Mono, monospace" fontSize="8" opacity="0.8">← ORDER</text>

          <text x="400" y="130" textAnchor="middle" fill="#555" fontFamily="Inter, sans-serif" fontSize="9">2× PMOD cables</text>
        </motion.g>

        {/* Laptop */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onMouseEnter={() => showTip({ label: "Laptop — Dashboard", detail: "8-panel Plotly Dash display · 20 Hz refresh via USB-UART" })}
          onMouseLeave={hideTip}
          className="cursor-pointer"
        >
          <rect x="560" y="240" width="160" height="60" rx="8" stroke="#a855f7" strokeWidth="1.5" fill="#a855f7" fillOpacity="0.05" />
          <text x="640" y="265" textAnchor="middle" fill="#a855f7" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600">Laptop</text>
          <text x="640" y="282" textAnchor="middle" fill="#888" fontFamily="Inter, sans-serif" fontSize="9">Dashboard (Plotly Dash)</text>
        </motion.g>

        {/* USB-UART line */}
        <motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <line x1="640" y1="200" x2="640" y2="240" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
          <motion.circle cx="640" cy="220" r="2.5" fill="#a855f7" {...PULSE_ANIM} />
          <text x="665" y="224" fill="#a855f7" fontFamily="JetBrains Mono, monospace" fontSize="8" opacity="0.7">USB-UART</text>
        </motion.g>
      </svg>
    </div>
  );
}
