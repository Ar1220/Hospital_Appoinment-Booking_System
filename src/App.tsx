import {
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactElement,
  type SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";
import { api, type ApiAppointmentType, type CreatedAppointment } from "./api";

type IconName =
  | "activity"
  | "arrow"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "close"
  | "cross"
  | "diagnostics"
  | "download"
  | "emergency"
  | "mail"
  | "menu"
  | "phone"
  | "pin"
  | "scalpel"
  | "shield"
  | "stethoscope"
  | "user";

type FormValues = {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  appointmentType: string;
  doctor: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  emergencyName: string;
  emergencyPhone: string;
  notes: string;
};

type FormField = keyof FormValues;

type DoctorView = {
  id: string;
  initials: string;
  name: string;
  specialty: string;
  experience: string;
  availability: string;
  status: string;
  education: string;
  languages: string;
  rating: string;
  hue: string;
  portrait: string;
};

const facilities = [
  {
    title: "Surgical Wing",
    floor: "Floor 03 · Theatre 09",
    image: "/images/requiem/operating-theatre.jpg",
    className: "facility-tall",
  },
  {
    title: "Observation Ward",
    floor: "Floor 02 · Night Watch",
    image: "/images/requiem/patient-ward.avif",
    className: "facility-wide",
  },
  {
    title: "East Corridor",
    floor: "Level 01 · Intake Route",
    image: "/images/requiem/fluorescent-corridor.png",
    className: "",
  },
  {
    title: "Imaging Suite",
    floor: "Basement · Diagnostics",
    image: "/images/requiem/mri-suite.png",
    className: "",
  },
  {
    title: "Preparation Bay",
    floor: "Floor 03 · Sterile Access",
    image: "/images/requiem/surgical-prep.png",
    className: "facility-wide",
  },
  {
    title: "Monitoring Station",
    floor: "Floor 02 · Observation",
    image: "/images/requiem/observation-ward.png",
    className: "",
  },
];

const services: Array<{
  number: string;
  title: string;
  description: string;
  icon: IconName;
  detail: string;
}> = [
  {
    number: "01",
    title: "Emergency intake",
    description: "Immediate assessment in a calm, highly equipped clinical environment.",
    icon: "emergency",
    detail: "24 / 7 response",
  },
  {
    number: "02",
    title: "Precision surgery",
    description: "Specialist surgical pathways with uncompromising attention to detail.",
    icon: "scalpel",
    detail: "Theatre level 03",
  },
  {
    number: "03",
    title: "Diagnostics",
    description: "Advanced imaging, monitoring, and lab-led answers when every detail matters.",
    icon: "diagnostics",
    detail: "Results in 24 hrs",
  },
  {
    number: "04",
    title: "Specialist consults",
    description: "Private, considered care with multidisciplinary clinical teams.",
    icon: "stethoscope",
    detail: "Six departments",
  },
];

const seedDoctors = [
  {
    id: "voss",
    initials: "LK",
    name: "Leon S. Kennedy",
    specialty: "Neurosurgery",
    experience: "15 years in complex care",
    availability: "Available today",
    status: "available",
    education: "St. Catherin Institute",
    languages: "English · German",
    rating: "4.9 clinical rating",
    hue: "teal",
    portrait: "/images/requiem/leon-s-kennedy.jpg",
  },
  {
    id: "morrow",
    initials: "AW",
    name: "Ada Wong",
    specialty: "Diagnostic Medicine",
    experience: "12 years in imaging",
    availability: "Available at 16:30",
    status: "available",
    education: "Harrow School of Medicine",
    languages: "English · French",
    rating: "4.8 clinical rating",
    hue: "blue",
    portrait: "/images/requiem/ada-wong.jpg",
  },
  {
    id: "gideon",
    initials: "VG",
    name: "Dr. Victor Gideon",
    specialty: "Trauma Surgery",
    experience: "18 years in emergency care",
    availability: "On surgical duty",
    status: "busy",
    education: "Westbridge University",
    languages: "English · Japanese",
    rating: "5.0 clinical rating",
    hue: "red",
    portrait: "/images/requiem/dr-victor-gideon.jpg",
  },
  {
    id: "haos",
    initials: "HA",
    name: "HAOS",
    specialty: "Internal Medicine",
    experience: "10 years in patient care",
    availability: "Available tomorrow",
    status: "available",
    education: "Mercer Medical College",
    languages: "English · Spanish",
    rating: "4.9 clinical rating",
    hue: "red",
    portrait: "/images/requiem/haos.jpg",
  },
];

const testimonials = [
  {
    quote:
      "“The entire process felt precise, private, and surprisingly calm. Every step was explained before it happened.”",
    name: "L. Carter",
    treatment: "Diagnostics / Record 1024",
  },
  {
    quote:
      "“From the first call to follow-up, the team made a difficult week feel controlled and considered.”",
    name: "M. Reyes",
    treatment: "Specialist consult / Record 0821",
  },
  {
    quote:
      "“They found the answer quickly, gave me a clear plan, and never made me feel like a number.”",
    name: "A. Morgan",
    treatment: "Emergency intake / Record 1173",
  },
];

const timeSlots = [
  { value: "09:00", label: "09:00", available: true },
  { value: "10:30", label: "10:30", available: false },
  { value: "12:00", label: "12:00", available: true },
  { value: "14:15", label: "14:15", available: true },
  { value: "16:30", label: "16:30", available: false },
  { value: "18:00", label: "18:00", available: true },
];

const initialForm: FormValues = {
  fullName: "",
  dob: "",
  email: "",
  phone: "",
  appointmentType: "",
  doctor: "",
  preferredDate: "",
  preferredTime: "",
  reason: "",
  emergencyName: "",
  emergencyPhone: "",
  notes: "",
};

function Icon({
  name,
  className,
  ...props
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  const paths: Record<IconName, ReactElement> = {
    activity: (
      <>
        <path d="M3 12h4l2.2-6 4.1 12 2.1-6H21" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 10h18" />
      </>
    ),
    check: <path d="m5 12 4.2 4L19 6" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    cross: <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />,
    diagnostics: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
        <path d="M5 19v2h14v-2" />
      </>
    ),
    emergency: (
      <>
        <path d="M12 2 3 20h18L12 2Z" />
        <path d="M12 8v5m0 4h.01" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    phone: (
      <path d="M6.5 3.5 9 6l-1.5 3c1.1 2.2 2.7 3.8 5 5L15 12.5l2.5 2.5-1.3 4c-5.8-.8-10.4-5.4-11.2-11.2l1.5-4.3Z" />
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    scalpel: (
      <>
        <path d="m5 19 9.5-9.5m-4-4L15 10m-7 7L4 13l4-4 4 4-4 4Z" />
        <path d="m14 5 4-2 2 2-2 4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.3-8 10-4.5-1.7-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.3 2.3 4.8-5" />
      </>
    ),
    stethoscope: (
      <>
        <path d="M6 4v5a6 6 0 0 0 12 0V4m-12 0h3m6 0h3" />
        <path d="M12 15v2a3 3 0 0 0 6 0v-1" />
        <circle cx="18" cy="14" r="2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 21c.8-4 3.2-6 7.5-6s6.7 2 7.5 6" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...common} {...props}>
      {paths[name]}
    </svg>
  );
}

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function getFieldError(name: FormField, values: FormValues): string {
  const value = values[name].trim();
  const phonePattern = /^[+]?[\d\s()\-]{7,}$/;

  if (!value && name !== "notes") {
    return "This field is required.";
  }

  if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }

  if ((name === "phone" || name === "emergencyPhone") && !phonePattern.test(value)) {
    return "Enter a valid phone number.";
  }

  if (name === "dob" && value >= getToday()) {
    return "Date of birth must be before today.";
  }

  if (name === "preferredDate" && value < getToday()) {
    return "Choose a future appointment date.";
  }

  if (name === "reason" && value.length < 12) {
    return "Please share a little more about your reason for visiting.";
  }

  return "";
}

function formatDate(date: string) {
  if (!date) return "Date pending";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialForm);
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [heroLight, setHeroLight] = useState({ x: 72, y: 44 });
  const [doctorList, setDoctorList] = useState<DoctorView[]>(seedDoctors);
  const [appointmentTypes, setAppointmentTypes] = useState<ApiAppointmentType[]>([]);
  const [booked, setBooked] = useState<CreatedAppointment | null>(null);
  const [bookedSummary, setBookedSummary] = useState<{
    firstName: string;
    appointmentType: string;
    doctorName: string;
    preferredDate: string;
    preferredTime: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState("");
  const confirmationDialog = useRef<HTMLDivElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Hydrate clinicians + appointment types from the MySQL-backed API.
  // If the backend is offline, the static seed data keeps the page usable.
  useEffect(() => {
    let cancelled = false;

    Promise.all([api.doctors(), api.appointmentTypes()])
      .then(([rows, types]) => {
        if (cancelled) return;

        setDoctorList(
          rows.map((row) => {
            const local = seedDoctors.find((doctor) => doctor.id === row.id);
            return {
              id: row.id,
              initials: row.initials,
              name: row.name,
              specialty: row.specialty,
              experience: row.experience ?? local?.experience ?? "",
              availability: row.availability_note ?? local?.availability ?? "",
              status: row.status,
              education: row.education ?? local?.education ?? "",
              languages: row.languages ?? local?.languages ?? "",
              rating: `${Number(row.rating).toFixed(1)} clinical rating`,
              hue: row.hue ?? local?.hue ?? "teal",
              portrait: local?.portrait ?? row.portrait_url ?? "",
            };
          }),
        );
        setAppointmentTypes(types);
      })
      .catch(() => {
        /* backend offline — keep static fallback */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isConfirmed) return;

    const closeButton =
      confirmationDialog.current?.querySelector<HTMLButtonElement>("[data-dialog-close]");
    closeButton?.focus();
  }, [isConfirmed]);

  const updateField = (field: FormField, value: string) => {
    const nextValues = { ...formValues, [field]: value };
    setFormValues(nextValues);

    if (touched[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: getFieldError(field, nextValues),
      }));
    }
  };

  const touchField = (field: FormField) => {
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: getFieldError(field, formValues),
    }));
  };

  const scrollToBooking = (doctorId?: string) => {
    if (doctorId) {
      updateField("doctor", doctorId);
      setTouched((currentTouched) => ({ ...currentTouched, doctor: true }));
    }
    document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitAppointment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = Object.keys(formValues).reduce<Partial<Record<FormField, string>>>(
      (collectedErrors, field) => {
        const typedField = field as FormField;
        collectedErrors[typedField] = getFieldError(typedField, formValues);
        return collectedErrors;
      },
      {},
    );
    const hasErrors = Object.values(nextErrors).some(Boolean);

    setTouched(
      Object.keys(formValues).reduce<Partial<Record<FormField, boolean>>>(
        (allTouched, field) => ({ ...allTouched, [field]: true }),
        {},
      ),
    );
    setErrors(nextErrors);

    if (hasErrors) {
      document
        .querySelector<HTMLElement>(".field-error:not(:empty)")
        ?.closest(".field")
        ?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          "input, select, textarea",
        )
        ?.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const created = await api.createAppointment({
        fullName: formValues.fullName.trim(),
        dob: formValues.dob,
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        appointmentType: formValues.appointmentType,
        doctor: formValues.doctor,
        preferredDate: formValues.preferredDate,
        preferredTime: formValues.preferredTime,
        reason: formValues.reason.trim(),
        emergencyName: formValues.emergencyName.trim(),
        emergencyPhone: formValues.emergencyPhone.trim(),
        notes: formValues.notes.trim(),
      });

      setBooked(created);
      setBookedSummary({
        firstName: formValues.fullName.trim().split(" ")[0] || "patient",
        appointmentType: formValues.appointmentType,
        doctorName:
          doctorList.find((doctor) => doctor.id === formValues.doctor)?.name ??
          "Assignment pending",
        preferredDate: formValues.preferredDate,
        preferredTime: formValues.preferredTime,
      });
      setIsConfirmed(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The intake service is unreachable. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirmation = () => {
    setIsConfirmed(false);
    setFormValues(initialForm);
    setTouched({});
    setErrors({});
    setSubmitError("");
    window.setTimeout(() => submitButton.current?.focus(), 0);
  };

  const dialogKeyboardHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      closeConfirmation();
      return;
    }

    if (event.key !== "Tab" || !confirmationDialog.current) return;
    const focusable = Array.from(
      confirmationDialog.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled])",
      ),
    );

    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const heroStyle = {
    "--light-x": `${heroLight.x}%`,
    "--light-y": `${heroLight.y}%`,
  } as CSSProperties;

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to booking information
      </a>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Requiem Medical Center home">
          <span className="brand-mark">
            <Icon name="cross" />
          </span>
          <span>
            <strong>REQUIEM</strong>
            <small>Medical Center</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#appointment">Appointments</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="header-book" type="button" onClick={() => scrollToBooking()}>
          Book a visit <Icon name="arrow" />
        </button>

        <button
          className="menu-trigger"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {[
              ["Home", "#home"],
              ["Services", "#services"],
              ["Doctors", "#doctors"],
              ["Appointments", "#appointment"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <Icon name="arrow" />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content">
        <section
          id="home"
          className="hero"
          style={heroStyle}
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            setHeroLight({
              x: ((event.clientX - bounds.left) / bounds.width) * 100,
              y: ((event.clientY - bounds.top) / bounds.height) * 100,
            });
          }}
        >
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-content">
            <div className="eyebrow">
              <span className="pulse-dot" />
              Est. 1978 <span aria-hidden="true">/</span> Sector 09
            </div>
            <h1>
              Your health.
              <br />
              <span>Our obsession.</span>
            </h1>
            <p className="hero-copy">
              Where modern medicine meets the unknown. Precise care, when the path ahead isn’t
              clear.
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => scrollToBooking()}
              >
                Book your appointment <Icon name="arrow" />
              </button>
              <a className="button button-ghost" href="#facilities">
                Explore facilities <Icon name="chevron" />
              </a>
            </div>
          </div>
          <aside className="hero-status" aria-label="Hospital clinical status">
            <span className="status-line">
              <Icon name="activity" /> LIVE CLINICAL STATUS
            </span>
            <strong>ALL SYSTEMS MONITORED</strong>
            <span>Response team on site · 24 / 7</span>
          </aside>
          <span className="hero-scroll">
            Scroll to enter <span />
          </span>
        </section>

        <section id="facilities" className="section facilities-section">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">Facility record / 06</p>
              <h2>
                Inside <em>Requiem.</em>
              </h2>
            </div>
            <p className="heading-copy">
              Every room is designed for a single purpose: clear answers, decisive care, and quiet
              confidence under pressure.
            </p>
          </div>

          <div className="facility-grid">
            {facilities.map((facility, index) => (
              <article
                className={`facility-card reveal ${facility.className}`}
                key={facility.title}
                style={{ transitionDelay: `${Math.min(index * 70, 250)}ms` }}
              >
                <img src={facility.image} alt={`${facility.title} at Requiem Medical Center`} />
                <div className="facility-overlay" />
                <div className="facility-meta">
                  <span>{facility.floor}</span>
                  <h3>{facility.title}</h3>
                </div>
                <span className="facility-index">0{index + 1}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="section-heading compact-heading reveal">
            <div>
              <p className="eyebrow">Clinical capabilities</p>
              <h2>
                Care at the <em>edge of certainty.</em>
              </h2>
            </div>
            <a href="#appointment" className="text-link">
              See appointment types <Icon name="arrow" />
            </a>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article
                className="service-card reveal"
                key={service.title}
                style={{ transitionDelay: `${Math.min(index * 80, 250)}ms` }}
              >
                <span className="service-number">{service.number}</span>
                <Icon name={service.icon} className="service-icon" />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-detail">
                  <span className="status-dot" />
                  {service.detail}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="appointment" className="appointment-section">
          <div className="appointment-bg" aria-hidden="true" />
          <div className="appointment-layout">
            <div className="appointment-intro reveal">
              <p className="eyebrow">Priority channel / intake</p>
              <h2>
                Schedule your <em>visit.</em>
              </h2>
              <p>
                Tell us what brings you in. Your request is reviewed by our clinical coordination
                team before your visit is confirmed.
              </p>
              <div className="assurance-list">
                <span>
                  <Icon name="shield" /> Encrypted intake
                </span>
                <span>
                  <Icon name="clock" /> Response within 1 business day
                </span>
              </div>
            </div>

            <form className="appointment-form reveal" onSubmit={submitAppointment} noValidate>
              <div className="form-heading">
                <div>
                  <span className="form-kicker">Patient intake / 001</span>
                  <h3>Begin your record</h3>
                </div>
                <span className="form-required">* Required</span>
              </div>

              <div className="form-grid">
                <FormFieldWrapper
                  label="Full name"
                  field="fullName"
                  error={touched.fullName ? errors.fullName : ""}
                >
                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Enter full legal name"
                    value={formValues.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    onBlur={() => touchField("fullName")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Date of birth"
                  field="dob"
                  error={touched.dob ? errors.dob : ""}
                >
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    max={getToday()}
                    value={formValues.dob}
                    onChange={(event) => updateField("dob", event.target.value)}
                    onBlur={() => touchField("dob")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Email address"
                  field="email"
                  error={touched.email ? errors.email : ""}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={formValues.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    onBlur={() => touchField("email")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Phone number"
                  field="phone"
                  error={touched.phone ? errors.phone : ""}
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formValues.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    onBlur={() => touchField("phone")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Appointment type"
                  field="appointmentType"
                  error={touched.appointmentType ? errors.appointmentType : ""}
                >
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    value={formValues.appointmentType}
                    onChange={(event) => updateField("appointmentType", event.target.value)}
                    onBlur={() => touchField("appointmentType")}
                  >
                    <option value="">Select type</option>
                    {appointmentTypes.length
                      ? appointmentTypes.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))
                      : [
                          "Emergency intake",
                          "Surgical consultation",
                          "Diagnostic assessment",
                          "Specialist consultation",
                          "Routine check-up",
                        ].map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                  </select>
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Preferred doctor"
                  field="doctor"
                  error={touched.doctor ? errors.doctor : ""}
                >
                  <select
                    id="doctor"
                    name="doctor"
                    value={formValues.doctor}
                    onChange={(event) => updateField("doctor", event.target.value)}
                    onBlur={() => touchField("doctor")}
                  >
                    <option value="">Select clinician</option>
                    {doctorList.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} · {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Preferred date"
                  field="preferredDate"
                  error={touched.preferredDate ? errors.preferredDate : ""}
                >
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    min={getToday()}
                    value={formValues.preferredDate}
                    onChange={(event) => updateField("preferredDate", event.target.value)}
                    onBlur={() => touchField("preferredDate")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Preferred time"
                  field="preferredTime"
                  error={touched.preferredTime ? errors.preferredTime : ""}
                >
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formValues.preferredTime}
                    onChange={(event) => updateField("preferredTime", event.target.value)}
                    onBlur={() => touchField("preferredTime")}
                  >
                    <option value="">Select available slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value} disabled={!slot.available}>
                        {slot.label}
                        {slot.available ? "" : " · booked"}
                      </option>
                    ))}
                  </select>
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Symptoms / reason for visit"
                  field="reason"
                  error={touched.reason ? errors.reason : ""}
                  wide
                >
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    placeholder="Share the symptoms, concern, or care you need."
                    value={formValues.reason}
                    onChange={(event) => updateField("reason", event.target.value)}
                    onBlur={() => touchField("reason")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Emergency contact name"
                  field="emergencyName"
                  error={touched.emergencyName ? errors.emergencyName : ""}
                >
                  <input
                    id="emergencyName"
                    name="emergencyName"
                    autoComplete="name"
                    placeholder="Contact full name"
                    value={formValues.emergencyName}
                    onChange={(event) => updateField("emergencyName", event.target.value)}
                    onBlur={() => touchField("emergencyName")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper
                  label="Emergency contact phone"
                  field="emergencyPhone"
                  error={touched.emergencyPhone ? errors.emergencyPhone : ""}
                >
                  <input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formValues.emergencyPhone}
                    onChange={(event) => updateField("emergencyPhone", event.target.value)}
                    onBlur={() => touchField("emergencyPhone")}
                  />
                </FormFieldWrapper>
                <FormFieldWrapper label="Additional notes" field="notes" error="" wide optional>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    placeholder="Anything else our team should know?"
                    value={formValues.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                  />
                </FormFieldWrapper>
              </div>

              <div className="form-submit-area">
                <p aria-live="polite" className="form-live-message">
                  {Object.values(errors).some(Boolean)
                    ? "Please review the highlighted fields before confirming."
                    : submitError}
                </p>
                <button
                  ref={submitButton}
                  className={`button button-primary form-submit ${isSubmitting ? "is-loading" : ""}`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="button-spinner" /> Securing your request
                    </>
                  ) : (
                    <>
                      Confirm appointment <Icon name="arrow" />
                    </>
                  )}
                </button>
                <span className="form-disclaimer">
                  A coordinator will confirm your final appointment details.
                </span>
              </div>
            </form>
          </div>
        </section>

        <section id="doctors" className="section doctors-section">
          <div className="section-heading reveal">
            <div>
              <p className="eyebrow">Clinical leads / 04</p>
              <h2>
                Meet the <em>specialists.</em>
              </h2>
            </div>
            <p className="heading-copy">
              A measured team of clinicians for the questions that won’t wait.
            </p>
          </div>
          <div className="doctor-grid">
            {doctorList.map((doctor, index) => (
              <article
                className={`doctor-card reveal doctor-${doctor.hue}`}
                key={doctor.id}
                style={{ transitionDelay: `${Math.min(index * 75, 225)}ms` }}
              >
                <div
                  className={`doctor-portrait portrait-${doctor.id} ${doctor.portrait ? "has-photo" : ""}`}
                >
                  <span className="portrait-scan" />
                  <span className="portrait-id">{doctor.initials}</span>
                  {doctor.portrait ? (
                    <img src={doctor.portrait} alt={`Portrait of ${doctor.name}`} />
                  ) : (
                    <Icon name="user" />
                  )}
                  <span className="portrait-code">RMC / {doctor.id.toUpperCase()} / 09</span>
                </div>
                <div className="doctor-info">
                  <div className="doctor-availability">
                    <span className={`availability-dot ${doctor.status}`} />
                    {doctor.availability}
                  </div>
                  <h3>{doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <p className="doctor-experience">{doctor.experience}</p>
                  <div className="doctor-extra">
                    <span>{doctor.education}</span>
                    <span>{doctor.languages}</span>
                    <span>{doctor.rating}</span>
                  </div>
                  <button
                    className="quick-book"
                    type="button"
                    onClick={() => scrollToBooking(doctor.id)}
                  >
                    Request Dr. {doctor.name.split(" ").at(-1)} <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="records-section">
          <div className="section section-records">
            <div className="records-heading reveal">
              <p className="eyebrow">Patient records / redacted</p>
              <h2>
                Quiet confidence <em>in the unknown.</em>
              </h2>
            </div>
            <div className="testimonial-rail">
              {testimonials.map((testimonial, index) => (
                <figure
                  className="testimonial-card reveal"
                  key={testimonial.name}
                  style={{ transitionDelay: `${Math.min(index * 90, 180)}ms` }}
                >
                  <div className="quote-mark">"</div>
                  <blockquote>{testimonial.quote}</blockquote>
                  <figcaption>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.treatment}</span>
                    <span className="rating">5.0 / 5.0</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-details reveal">
            <p className="eyebrow">Find the center</p>
            <h2>
              When the path <em>matters.</em>
            </h2>
            <p className="contact-intro">
              Located at Rhodes Hill Sanatorium, beyond the East Station transit corridor.
            </p>
            <div className="contact-list">
              <a href="https://maps.google.com/?q=Rhodes+Hill+Sanatorium" target="_blank" rel="noreferrer">
                <Icon name="pin" />
                <span>
                  <small>Visit</small>
                  Rhodes Hill Sanatorium
                </span>
              </a>
              <a href="tel:+15550190909">
                <Icon name="phone" />
                <span>
                  <small>Priority line</small>
                  +1 555 019 0909
                </span>
              </a>
              <a href="mailto:intake@requiem.example">
                <Icon name="mail" />
                <span>
                  <small>Secure message</small>
                  intake@requiem.example
                </span>
              </a>
              <div>
                <Icon name="clock" />
                <span>
                  <small>Hours</small>
                  Intake 24 / 7 · Consults 08:00–20:00
                </span>
              </div>
            </div>
          </div>
          <div
            className="site-map reveal"
            aria-label="Illustrated location map of Rhodes Hill Sanatorium"
          >
            <div className="map-grid" />
            <span className="map-road road-one" />
            <span className="map-road road-two" />
            <span className="map-terminal">EAST STATION</span>
            <span className="map-marker">
              <Icon name="cross" />
              <i />
            </span>
            <span className="map-label">
              RHODES HILL
              <br />
              SANATORIUM
            </span>
            <span className="map-coordinates">38° 54' 31.6" N · 77° 02' 11.2" W</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-mark">
                <Icon name="cross" />
              </span>
              <span>
                <strong>REQUIEM</strong>
                <small>Medical Center</small>
              </span>
            </a>
            <p>Precise care when certainty matters most.</p>
            <span className="footer-status">
              <span className="status-dot" /> Intake operating
            </span>
          </div>
          <div className="footer-links">
            <h3>Navigate</h3>
            <a href="#services">Services</a>
            <a href="#doctors">Doctors</a>
            <a href="#appointment">Appointments</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-links">
            <h3>Contact</h3>
            <a href="tel:+15550190909">+1 555 019 0909</a>
            <a href="mailto:intake@requiem.example">intake@requiem.example</a>
            <span>Rhodes Hill Sanatorium</span>
            <span>East District</span>
          </div>
          <div className="footer-newsletter">
            <h3>Clinical dispatch</h3>
            <p>Receive facility updates and care notes.</p>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const input = event.currentTarget.querySelector<HTMLInputElement>(
                  "#newsletter-email",
                );
                const email = input?.value.trim() ?? "";
                if (!email) return;

                try {
                  await api.subscribeNewsletter(email);
                  setNewsletterSent(true);
                  if (input) input.value = "";
                } catch {
                  setNewsletterSent(false);
                }
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input id="newsletter-email" type="email" required placeholder="Email address" />
              <button type="submit" aria-label="Subscribe to clinical dispatch">
                <Icon name={newsletterSent ? "check" : "arrow"} />
              </button>
            </form>
            <span className="newsletter-status" aria-live="polite">
              {newsletterSent ? "Transmission received." : "No noise. Only signal."}
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Requiem Medical Center. Prototype experience.</span>
          <div>
            <a href="#home">Privacy protocol</a>
            <a href="#home">Terms of care</a>
          </div>
        </div>
      </footer>

      <button className="mobile-book-bar" type="button" onClick={() => scrollToBooking()}>
        <Icon name="calendar" /> Book a visit <Icon name="arrow" />
      </button>

      {isConfirmed && (
        <div className="confirmation-backdrop">
          <div
            ref={confirmationDialog}
            className="confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            onKeyDown={dialogKeyboardHandler}
          >
            <button
              data-dialog-close
              className="dialog-close"
              type="button"
              onClick={closeConfirmation}
              aria-label="Close confirmation"
            >
              <Icon name="close" />
            </button>
            <div className="confirmation-symbol">
              <Icon name="check" />
            </div>
            <p className="eyebrow">
              Request received / case {booked?.appointmentNumber ?? "pending"}
            </p>
            <h2 id="confirmation-title">
              Appointment <em>secured.</em>
            </h2>
            <p>
              Thank you, {bookedSummary?.firstName ?? "patient"}. A clinical coordinator will
              confirm the final details of your requested visit.
            </p>
            <dl className="confirmation-details">
              <div>
                <dt>Requested care</dt>
                <dd>{bookedSummary?.appointmentType ?? "Pending"}</dd>
              </div>
              <div>
                <dt>Preferred clinician</dt>
                <dd>{bookedSummary?.doctorName ?? "Assignment pending"}</dd>
              </div>
              <div>
                <dt>Date & time</dt>
                <dd>
                  {formatDate(bookedSummary?.preferredDate ?? "")} ·{" "}
                  {bookedSummary?.preferredTime ?? "Pending"}
                </dd>
              </div>
              <div>
                <dt>Confirmation code</dt>
                <dd>{booked?.confirmationCode ?? "Pending"}</dd>
              </div>
            </dl>
            <div className="confirmation-actions">
              <button className="button button-primary" type="button" onClick={closeConfirmation}>
                Return to center <Icon name="arrow" />
              </button>
              <button className="ticket-button" type="button" onClick={() => window.print()}>
                <Icon name="download" /> Download ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormFieldWrapper({
  label,
  field,
  error,
  wide = false,
  optional = false,
  children,
}: {
  label: string;
  field: FormField;
  error?: string;
  wide?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${wide ? "field-wide" : ""} ${error ? "has-error" : ""}`}>
      <label htmlFor={field}>
        {label} {optional ? <span>Optional</span> : <b aria-hidden="true">*</b>}
      </label>
      <div className="field-control">{children}</div>
      <span className="field-error" role="alert">
        {error}
      </span>
    </div>
  );
}

export default App;
