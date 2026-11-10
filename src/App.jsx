import { useEffect, useRef, useState } from "react";
import {
  profile,
  experience,
  education,
  skills,
  strengths,
  languages,
} from "./data.js";

const NAV = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function Reveal({ children, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}

function Marquee() {
  const items = skills.concat(skills);
  return (
    <div className="marquee" aria-label="Key skills">
      <div className="marquee-track" aria-hidden="true">
        {items.map((s, i) => (
          <span key={i}>
            {s}
            <i />
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function SectionHead({ num, label, title, intro }) {
  return (
    <Reveal className="section-head">
      <p className="eyebrow">
        {num} — {label}
      </p>
      <h2>{title}</h2>
      {intro && <p className="lede">{intro}</p>}
    </Reveal>
  );
}

function useActiveSection(ids) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

const NAV_IDS = NAV.map((n) => n.id);

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap header-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          Tahseena<span>{profile.title}</span>
        </a>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="main-nav" className={open ? "open" : ""} aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={active === n.id ? "active" : ""}
              aria-current={active === n.id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="blobs" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="blob b4" />
      </div>
      <div className="wrap hero-grid">
        <Reveal className="hero-photo">
          <div className="frame">
            <span className="corner tl" aria-hidden="true" />
            <span className="corner tr" aria-hidden="true" />
            <span className="corner bl" aria-hidden="true" />
            <span className="corner br" aria-hidden="true" />
            <img
              src="/tahseena.jpg"
              alt="Portrait of Tahseena Reyaz"
              width="735"
              height="732"
            />
          </div>
          <p className="fig">Fig. 01 — Tahseena, Banking Professional, Kulgam</p>
        </Reveal>
        <Reveal className="hero-copy">
          <h1 aria-label="Welcome">
            {"Welcome".split("").map((c, i) => (
              <span key={i} aria-hidden="true" style={{ "--i": i }}>
                {c}
              </span>
            ))}
          </h1>
          <h2 className="sub">Let&apos;s talk <mark>banking</mark>
          </h2>
          <p className="intro">
            I&apos;m Tahseena - a banking professional with six months of
            experience as a Relationship Manager at ICICI Bank. I help
            customers with their banking needs through clear communication and
            attentive client handling.
          </p>
          <div className="orbs">
            <a className="orb green" href="#resume">
              Resume
            </a>
            <a className="orb slate" href="#experience">
              Experience
            </a>
            <a className="orb black" href="#contact">
              Let&apos;s talk
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section tone-warm">
      <div className="wrap">
        <SectionHead
          num="01"
          label="About"
          title="Motivated, responsible and service-minded"
        />
        <Reveal>
          <p className="about-text">{profile.summary}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section id="resume" className="section tone-mint">
      <div className="wrap">
        <SectionHead
          num="02"
          label="Resume"
          title="Experience & education"
          intro="Where I have worked, and the training behind it."
        />
        <a className="dl" href="/Tahseena-Reyaz-Resume.pdf" download>
          Download resume (PDF) ↓
        </a>

        <div className="resume-grid">
          <div>
            <p id="experience" className="eyebrow sub">02.1 — Experience</p>
            {experience.map((job) => (
              <Reveal key={job.role} className="card">
                <div className="card-top">
                  <div>
                    <h3>{job.role}</h3>
                    <p className="muted">{job.company}</p>
                  </div>
                  <span className="pill">{job.duration}</span>
                </div>
                <ul className="ticks">
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <div>
            <p className="eyebrow sub">02.2 — Education</p>
            <ol className="timeline">
              {education.map((e) => (
                <Reveal as="li" key={e.title}>
                  <h3>{e.title}</h3>
                  <p className="muted">{e.place}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section tone-sky">
      <div className="wrap">
        <SectionHead
          num="03"
          label="Skills"
          title="What I bring"
          intro="Practical banking and client-service skills, backed by a computer applications diploma."
        />

        <Reveal>
          <ul className="chips">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Reveal>

        <div className="two-col">
          <Reveal className="card">
            <p className="eyebrow sub">03.1 — Strengths</p>
            <ul className="ticks">
              {strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="card">
            <p className="eyebrow sub">03.2 — Languages</p>
            <dl className="lang">
              {languages.map((l) => (
                <div key={l.mode}>
                  <dt>{l.mode}</dt>
                  <dd>{l.list}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // No backend needed: this opens the visitor's email app with the message filled in.
  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="section tone-blush">
      <div className="wrap">
        <SectionHead
          num="04"
          label="Contact"
          title="Let’s connect"
          intro="Open to banking and client-service opportunities. References available on request."
        />

        <div className="contact-grid">
          <Reveal>
            <form className="form" onSubmit={submit}>
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  autoComplete="name"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={update}
                  required
                />
              </label>
              <button className="btn primary" type="submit">
                Send message
              </button>
              <p className="fine">
                This opens your email app with the message ready to send.
              </p>
            </form>
          </Reveal>

          <Reveal className="card details">
            <dl>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={profile.phoneHref}>{profile.phone}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Nationality</dt>
                <dd>{profile.nationality}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName}.
          All rights reserved.
        </p>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Resume />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
