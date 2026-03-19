import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const MEMBERS = [
  {
    name: "Kushal Agrawal",
    roles: ["Link Layer", "Board A Logic", "Vivado Build", "XDC Constraints"],
    initials: "KA",
    gradient: "from-accent to-accent-blue",
  },
  {
    name: "Eeshana Hari",
    roles: ["Board B Logic", "Dashboard", "Telemetry"],
    initials: "EH",
    gradient: "from-accent-blue to-purple-400",
  },
];

export default function Team() {
  return (
    <div className="pt-24 pb-16">
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="The Team"
            title="Meet TradeMark"
            description="Two engineers. Two FPGAs. One mission: deterministic, sub-microsecond trading."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {MEMBERS.map((member, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="rounded-2xl border border-border bg-surface/50 p-8 text-center hover:border-accent/20 transition-all hover:translate-y-[-2px]">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} mx-auto flex items-center justify-center mb-6`}
                  >
                    <span className="font-mono text-2xl font-bold text-black">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {member.roles.map((role, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 font-mono text-xs text-accent"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Course Info */}
          <FadeIn delay={0.3}>
            <div className="mt-16 rounded-2xl border border-border bg-surface/50 p-8 sm:p-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6z" />
                </svg>
                <div className="text-left">
                  <p className="font-bold text-white">
                    University of Wisconsin–Madison
                  </p>
                  <p className="text-sm text-muted">
                    College of Engineering
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="font-mono text-sm text-accent-blue">
                  ECE 554 — Digital Engineering Laboratory
                </p>
                <p className="text-sm text-muted">
                  Capstone Course · Spring 2026
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted/60">
                  Advisor / Instructor acknowledgment placeholder
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
