import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitApplication } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

/* ─────────────────────────── LOAN TIERS ─────────────────────────── */
const LOAN_TIERS = [
  {
    id: 1,
    amount: "$500",
    rate: "3%",
    term: "3 months",
    monthly: "$170",
    label: "Starter",
  },
  {
    id: 2,
    amount: "$1,000",
    rate: "3.5%",
    term: "6 months",
    monthly: "$174",
    label: "Basic",
  },
  {
    id: 3,
    amount: "$2,500",
    rate: "4%",
    term: "9 months",
    monthly: "$287",
    label: "Growth",
  },
  {
    id: 4,
    amount: "$5,000",
    rate: "4.5%",
    term: "12 months",
    monthly: "$432",
    label: "Standard",
  },
  {
    id: 5,
    amount: "$10,000",
    rate: "5%",
    term: "18 months",
    monthly: "$593",
    label: "Advanced",
  },
  {
    id: 6,
    amount: "$25,000",
    rate: "5.5%",
    term: "24 months",
    monthly: "$1,105",
    label: "Premium",
  },
  {
    id: 7,
    amount: "$50,000",
    rate: "6%",
    term: "36 months",
    monthly: "$1,521",
    label: "Elite",
  },
];

/* ─────────────────────────── TESTIMONIALS ─────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Marcus Okonkwo",
    location: "Lagos, Nigeria",
    loanAmount: "$5,000",
    quote:
      "I used the $5,000 loan to expand my import business. Within 8 months I doubled my inventory. The approval was fast and repayment was easy with small monthly installments.",
    avatar: "MO",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    loanAmount: "$2,500",
    quote:
      "Got a $2,500 loan to invest in my online boutique. The interest rate was incredibly fair — I paid everything back in 9 months and my business is now thriving. Highly recommend.",
    avatar: "PS",
    rating: 5,
  },
  {
    name: "David Mensah",
    location: "Accra, Ghana",
    loanAmount: "$10,000",
    quote:
      "The $10,000 helped me purchase equipment for my agribusiness. The team was transparent about every cost. I cleared my loan 3 months early with no penalties!",
    avatar: "DM",
    rating: 5,
  },
  {
    name: "Amara Diallo",
    location: "Dakar, Senegal",
    loanAmount: "$1,000",
    quote:
      "Starting small with $1,000 was the best decision. Low interest, flexible terms, and a team that actually cares. I've now applied for my second loan for further expansion.",
    avatar: "AD",
    rating: 5,
  },
  {
    name: "Chen Wei",
    location: "Kuala Lumpur, Malaysia",
    loanAmount: "$25,000",
    quote:
      "I secured $25,000 to invest in tech equipment for my startup. The process took less than 48 hours. This platform made growth possible when banks said no.",
    avatar: "CW",
    rating: 5,
  },
  {
    name: "Fatima Al-Hassan",
    location: "Dubai, UAE",
    loanAmount: "$50,000",
    quote:
      "The $50,000 Elite package transformed my real estate side business. 36 months gave me breathing room and the 6% rate was far better than anything I found elsewhere.",
    avatar: "FA",
    rating: 5,
  },
];

/* ─────────────────────────── STEP DATA ─────────────────────────── */
const STEPS = [
  {
    icon: <Zap className="w-7 h-7" />,
    step: "01",
    title: "Apply Online",
    desc: "Fill out our simple form with your details, desired loan amount, and investment purpose. Takes under 5 minutes.",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    step: "02",
    title: "Get Approved",
    desc: "Our team reviews your application and contacts you within 24 hours. No complex credit checks or lengthy procedures.",
  },
  {
    icon: <Clock className="w-7 h-7" />,
    step: "03",
    title: "Receive Funds",
    desc: "Once approved, funds are transferred to your account within 48 hours. Start investing immediately.",
  },
];

/* ─────────────────────────── NAVBAR ─────────────────────────── */
function Navbar({ onApplyClick }: { onApplyClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-b border-border/50" />
      <nav className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
            <span className="text-sm font-display font-black text-primary-foreground">
              IL
            </span>
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Invest<span className="text-gold">Loan</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            data-ocid="nav.link"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#loans"
            data-ocid="nav.link"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Loan Options
          </a>
          <a
            href="#testimonials"
            data-ocid="nav.link"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <button
            type="button"
            onClick={onApplyClick}
            data-ocid="nav.primary_button"
            className="px-5 py-2 rounded-lg bg-gold text-primary-foreground text-sm font-semibold hover:bg-gold-light transition-colors shadow-glow-sm"
          >
            Apply Now
          </button>
          <Link
            to="/admin"
            className="text-xs text-muted-foreground hover:text-muted-foreground/70 transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          <div
            className="w-5 h-0.5 bg-current mb-1.5 transition-all"
            style={{
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <div
            className="w-5 h-0.5 bg-current mb-1.5 transition-all"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <div
            className="w-5 h-0.5 bg-current transition-all"
            style={{
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden relative bg-card border-b border-border px-6 py-4 flex flex-col gap-4"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.location.hash = "how-it-works";
              }}
              data-ocid="nav.link"
              className="text-sm text-muted-foreground text-left"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.location.hash = "loans";
              }}
              data-ocid="nav.link"
              className="text-sm text-muted-foreground text-left"
            >
              Loan Options
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                window.location.hash = "testimonials";
              }}
              data-ocid="nav.link"
              className="text-sm text-muted-foreground text-left"
            >
              Testimonials
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onApplyClick();
              }}
              data-ocid="nav.primary_button"
              className="px-5 py-2 rounded-lg bg-gold text-primary-foreground text-sm font-semibold"
            >
              Apply Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */
function HeroSection({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-investment.dim_1600x900.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Decorative floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/6 w-48 h-48 rounded-full bg-green-bright/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-sm font-medium mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Investment Loans with Low Interest Rates
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
          >
            Fast Loans for <span className="text-gradient-gold">Your Big</span>
            <br />
            <span className="text-gradient-gold">Investments</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl"
          >
            Get approved in 24 hours with interest rates as low as 3%. Flexible
            repayment plans from 3 to 36 months. No hidden fees. Built for
            serious investors.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              type="button"
              onClick={onApplyClick}
              data-ocid="hero.primary_button"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold text-primary-foreground font-semibold text-base hover:bg-gold-light transition-all shadow-glow hover:shadow-glow-sm active:scale-[0.98]"
            >
              Apply for a Loan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#loans"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-medium text-base hover:border-gold/50 hover:bg-accent/50 transition-all"
            >
              View Loan Options
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-border/50"
          >
            {[
              { value: "3%", label: "Starting Interest Rate" },
              { value: "24h", label: "Approval Time" },
              { value: "2,800+", label: "Loans Disbursed" },
              { value: "98%", label: "Repayment Rate" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-black text-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── LOAN CARDS ─────────────────────────── */
function LoanOptionsSection({
  onSelectLoan,
}: { onSelectLoan: (amount: string) => void }) {
  return (
    <section id="loans" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-accent/30 text-muted-foreground text-sm mb-6">
            Transparent Pricing
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
            Choose Your <span className="text-gradient-gold">Loan Amount</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Select the tier that fits your investment needs. Click any card to
            pre-fill your application.
          </p>
        </motion.div>

        {/* Loan grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {LOAN_TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              data-ocid={`loan.item.${tier.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              onClick={() => onSelectLoan(tier.amount)}
              className="gradient-card border border-border rounded-2xl p-6 cursor-pointer card-hover group relative overflow-hidden"
            >
              {/* Popular badge for $5k */}
              {tier.id === 4 && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gold text-primary-foreground text-xs font-bold">
                  Popular
                </div>
              )}

              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {tier.label}
                </span>
              </div>

              <p className="font-display text-3xl font-black text-foreground mb-1">
                {tier.amount}
              </p>

              <div className="mt-4 space-y-2.5 border-t border-border/50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Interest Rate
                  </span>
                  <span className="text-sm font-bold text-gold">
                    {tier.rate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Term</span>
                  <span className="text-sm font-semibold">{tier.term}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Monthly Est.
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {tier.monthly}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-gold text-sm font-medium group-hover:gap-2.5 transition-all">
                <span>Select this plan</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── HOW IT WORKS ─────────────────────────── */
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-surface-glow relative">
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-accent/30 text-muted-foreground text-sm mb-6">
            Simple 3-Step Process
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From application to funds in your account — designed to be
            effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Icon circle */}
              <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-glow-sm">
                {step.icon}
              </div>

              <div className="text-xs font-mono text-gold/60 mb-2">
                {step.step}
              </div>
              <h3 className="font-display text-xl font-black mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── TESTIMONIALS ─────────────────────────── */
function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-accent/30 text-muted-foreground text-sm mb-6">
            Real Client Stories
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
            What Our <span className="text-gradient-gold">Clients Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Thousands of investors have used InvestLoan to grow their
            businesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.name}
              data-ocid={`testimonial.item.${i + 1}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="gradient-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-gold/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {["s1", "s2", "s3", "s4", "s5"]
                  .slice(0, t.rating)
                  .map((key) => (
                    <Star key={key} className="w-4 h-4 fill-gold text-gold" />
                  ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold font-display">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location} · Loan: {t.loanAmount}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── APPLICATION FORM ─────────────────────────── */
function ApplicationForm({
  selectedLoanRef,
}: { selectedLoanRef: React.MutableRefObject<string> }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [loanAmount, setLoanAmount] = useState(selectedLoanRef.current || "");
  const [purpose, setPurpose] = useState("");

  const { mutate, isPending, isSuccess, isError, error, reset } =
    useSubmitApplication();

  const handleLoanSelect = (val: string) => {
    setLoanAmount(val);
    selectedLoanRef.current = val;
  };

  // If parent sets the ref, read it on render
  if (selectedLoanRef.current && !loanAmount) {
    setLoanAmount(selectedLoanRef.current);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    mutate({ name, whatsapp, email, loanAmount, purpose });
  };

  if (isSuccess) {
    return (
      <motion.div
        data-ocid="apply.success_state"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-green-bright/10 border border-green-bright/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-bright" />
        </div>
        <h3 className="font-display text-2xl font-black mb-3">
          Application Received!
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your application has been received! We'll contact you shortly via
          WhatsApp or email to discuss next steps.
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setName("");
            setWhatsapp("");
            setEmail("");
            setLoanAmount("");
            setPurpose("");
          }}
          className="px-6 py-2.5 rounded-lg border border-border text-sm hover:bg-accent/50 transition-colors"
        >
          Submit another application
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error state */}
      <AnimatePresence>
        {isError && (
          <motion.div
            data-ocid="apply.error_state"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {error?.message ?? "Something went wrong. Please try again."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="full-name" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="full-name"
          data-ocid="apply.input"
          type="text"
          placeholder="John Mensah"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className="bg-accent/30 border-border focus:border-gold/60 focus:ring-gold/30 h-12"
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp" className="text-sm font-medium">
          WhatsApp Number
        </Label>
        <Input
          id="whatsapp"
          data-ocid="apply.whatsapp.input"
          type="tel"
          placeholder="+1 234 567 8900"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          autoComplete="tel"
          className="bg-accent/30 border-border focus:border-gold/60 focus:ring-gold/30 h-12"
        />
        <p className="text-xs text-muted-foreground">
          Include country code (e.g. +1, +234, +91)
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          data-ocid="apply.email.input"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-accent/30 border-border focus:border-gold/60 focus:ring-gold/30 h-12"
        />
      </div>

      {/* Loan Amount */}
      <div className="space-y-2">
        <Label htmlFor="loan-amount" className="text-sm font-medium">
          Loan Amount
        </Label>
        <Select value={loanAmount} onValueChange={handleLoanSelect} required>
          <SelectTrigger
            id="loan-amount"
            data-ocid="apply.select"
            className="bg-accent/30 border-border focus:border-gold/60 focus:ring-gold/30 h-12"
          >
            <SelectValue placeholder="Select your loan amount" />
          </SelectTrigger>
          <SelectContent>
            {LOAN_TIERS.map((tier) => (
              <SelectItem key={tier.id} value={tier.amount}>
                {tier.amount} — {tier.rate} interest / {tier.term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Purpose */}
      <div className="space-y-2">
        <Label htmlFor="purpose" className="text-sm font-medium">
          Loan Purpose
        </Label>
        <Textarea
          id="purpose"
          data-ocid="apply.textarea"
          placeholder="Describe your investment plan — what will you use this loan for?"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          rows={4}
          className="bg-accent/30 border-border focus:border-gold/60 focus:ring-gold/30 resize-none"
        />
      </div>

      {/* Privacy note */}
      <p className="text-xs text-muted-foreground bg-accent/20 rounded-lg p-3 border border-border/50">
        🔒 Your information is private and secure. Only authorized personnel can
        view your submitted contact details.
      </p>

      {/* Submit */}
      <Button
        type="submit"
        data-ocid="apply.submit_button"
        disabled={isPending}
        className="w-full h-13 bg-gold text-primary-foreground hover:bg-gold-light font-semibold text-base rounded-xl shadow-glow hover:shadow-glow-sm transition-all"
      >
        {isPending ? (
          <span
            data-ocid="apply.loading_state"
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting Application...
          </span>
        ) : (
          <>
            Submit Application
            <ArrowRight className="ml-2 w-5 h-5 inline" />
          </>
        )}
      </Button>
    </form>
  );
}

function ApplySection({
  applyRef,
}: { applyRef: React.RefObject<HTMLElement | null> }) {
  const selectedLoanRef = useRef<string>("");

  return (
    <section
      id="apply"
      ref={applyRef as React.RefObject<HTMLElement>}
      className="py-24 px-6 bg-surface-glow relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 text-gold text-sm font-medium mb-6">
            Start Today
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
            Apply for Your{" "}
            <span className="text-gradient-gold">Investment Loan</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Fill out the form below. Our team will contact you within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="gradient-card border border-border rounded-3xl p-8 md:p-10 shadow-deep"
        >
          <ApplicationForm selectedLoanRef={selectedLoanRef} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <a
              href="/"
              className="flex items-center justify-center md:justify-start gap-2 mb-2"
            >
              <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
                <span className="text-xs font-display font-black text-primary-foreground">
                  IL
                </span>
              </div>
              <span className="font-display font-bold text-base">
                Invest<span className="text-gold">Loan</span>
              </span>
            </a>
            <p className="text-xs text-muted-foreground">
              Smart investment financing for ambitious entrepreneurs.
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © {year}. Built with{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#loans"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Loan Options
            </a>
            <a
              href="#how-it-works"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#apply"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Apply
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── LANDING PAGE ─────────────────────────── */
export default function LandingPage() {
  const applyRef = useRef<HTMLElement | null>(null);

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectLoan = (_amount: string) => {
    // Scroll to apply form first, then set value
    scrollToApply();
    setTimeout(() => {
      const select = document.querySelector(
        '[data-ocid="apply.select"]',
      ) as HTMLElement;
      if (select) select.click();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onApplyClick={scrollToApply} />
      <main>
        <HeroSection onApplyClick={scrollToApply} />
        <LoanOptionsSection onSelectLoan={handleSelectLoan} />
        <HowItWorksSection />
        <TestimonialsSection />
        <ApplySection applyRef={applyRef} />
      </main>
      <Footer />
    </div>
  );
}
