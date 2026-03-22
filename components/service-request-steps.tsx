import { Hand, PenLine, Phone, MailCheck } from "lucide-react";

const DEFAULT_STEPS = [
  {
    id: "choose-service",
    title: "Choose Service",
    desc: "Select the package that fits your travel needs and destination.",
    icon: Hand,
  },
  {
    id: "provide-details",
    title: "Provide Details",
    desc: "Fill in the travellers details and the no of applicants securely.",
    icon: PenLine,
  },
  {
    id: "get-call",
    title: "Get a call from our visa expert",
    desc: "We'll call you to confirm your requirements and guide you through.",
    icon: Phone,
  },
  {
    id: "receive-docs",
    title: "Receive Documents",
    desc: "Your verifiable documents arrive in your inbox within hours.",
    icon: MailCheck,
  },
];

interface ServiceRequestStepsProps {
  title?: string;
  subtitle?: string;
  /** When true, hides the "Choose Service" step */
  hideChooseService?: boolean;
  /** Custom description for "Provide Details" step (e.g. without "no of applicants") */
  provideDetailsDesc?: string;
}

export function ServiceRequestSteps({
  title = "Request your dummy booking",
  subtitle = "Fill out the form below and our visa experts will get in touch with you within 24 hours to guide you through the next steps.",
  hideChooseService = false,
  provideDetailsDesc,
}: ServiceRequestStepsProps) {
  const steps = DEFAULT_STEPS
    .filter((s) => !(hideChooseService && s.id === "choose-service"))
    .map((s) =>
      s.id === "provide-details" && provideDetailsDesc
        ? { ...s, desc: provideDetailsDesc }
        : s
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1C2B3A] md:text-3xl">
        {title}
      </h2>
      <p className="mt-4 text-[#6B7280]">
        {subtitle}
      </p>
      <div className="mt-10 space-y-6 lg:space-y-8">
        {steps.map((item) => (
          <div key={item.title} className="flex gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-[#1C2B3A]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-[#6B7280]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
