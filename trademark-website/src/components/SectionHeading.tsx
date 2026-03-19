import FadeIn from "./FadeIn";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <FadeIn className="text-center mb-16">
      {label && (
        <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent-blue mb-4">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl mx-auto text-muted text-lg leading-relaxed">
          {description}
        </p>
      )}
    </FadeIn>
  );
}
