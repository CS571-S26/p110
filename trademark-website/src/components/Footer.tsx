import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-mono font-bold text-2xl text-accent">TM</span>
            <p className="mt-2 text-sm text-muted">
              Dual-FPGA Deterministic Low-Latency Trading Engine
            </p>
            <p className="mt-1 text-xs text-muted/60">
              ECE 554 Capstone · Spring 2026
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Pages</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/architecture", label: "Architecture" },
                { to: "/design-review", label: "Design Review" },
                { to: "/demo", label: "Demo" },
                { to: "/team", label: "Team" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Links</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                GitHub Repository
              </a>
              <a
                href="https://www.engr.wisc.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                UW–Madison Engineering
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/60">
            © 2026 TradeMark · University of Wisconsin–Madison
          </p>
          <p className="text-xs text-muted/60">
            ECE 554 — Digital Engineering Laboratory
          </p>
        </div>
      </div>
    </footer>
  );
}
