import FadeIn from "../components/FadeIn";
import SectionHeading from "../components/SectionHeading";

const DOCUMENTS = [
  {
    title: "Design Specification Document",
    description:
      "Full design specification document covering system architecture, module interfaces, timing constraints, and verification plan.",
    placeholder: "Full design specification document will be uploaded here.",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Presentation Slides",
    description:
      "Design review presentation slides covering system overview, implementation details, test results, and demo plan.",
    placeholder: "Design review presentation slides will be uploaded here.",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: "Design Report",
    description:
      "Comprehensive LaTeX-compiled report with detailed analysis, resource utilization data, performance benchmarks, and conclusions.",
    placeholder: "Design report will be uploaded here.",
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.233 1.121 5.5 2.625C12.767 19.121 14.669 18 17 18a8.987 8.987 0 013-.512V4.262A8.967 8.967 0 0017 3.75a8.967 8.967 0 00-5 2.292z" />
      </svg>
    ),
  },
];

export default function DesignReview() {
  return (
    <div className="pt-24 pb-16">
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Documentation"
            title="Design Review Materials"
            description="Supporting documents for the TradeMark design review."
          />

          <div className="space-y-6">
            {DOCUMENTS.map((doc, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="rounded-2xl border border-border bg-surface/50 p-8 sm:p-10 hover:border-accent/20 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="text-accent shrink-0">{doc.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted leading-relaxed mb-6">
                        {doc.description}
                      </p>
                      <div className="rounded-xl border border-dashed border-border-light bg-[#0a0a0a] p-8 text-center">
                        <svg
                          className="w-12 h-12 mx-auto text-border-light mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                          />
                        </svg>
                        <p className="text-sm text-muted">{doc.placeholder}</p>
                        <button className="mt-4 px-6 py-2.5 rounded-lg border border-border-light text-sm text-muted hover:text-white hover:border-accent/40 transition-colors cursor-not-allowed opacity-60">
                          Download (Coming Soon)
                        </button>
                      </div>
                    </div>
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
