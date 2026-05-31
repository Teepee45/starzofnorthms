import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Clock, ArrowUpRight, Heart, Sparkles, Scissors, Coffee, Smile, Baby, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { BOOKSY_URL } from "@/lib/booking";

const HERO_IMG = "https://customer-assets.emergentagent.com/job_grooming-starz/artifacts/huc8tmn3_IMG_2947.jpeg";
const G_WAITING = "https://customer-assets.emergentagent.com/job_grooming-starz/artifacts/plj7x22c_IMG_3189.jpeg";
const G_EXTERIOR = "https://customer-assets.emergentagent.com/job_grooming-starz/artifacts/gh4r3hc4_IMG_2931.jpeg";
const G_SALON = "https://customer-assets.emergentagent.com/job_grooming-starz/artifacts/ribqz3k9_IMG_2323.jpeg";

const OWNER_IMG = "https://images.unsplash.com/photo-1625241152315-4a698f74ceb7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwyfHxkaXZlcnNlJTIwd2VsY29taW5nJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDB8fHx8MTc4MDA3Mzk0Nnww&ixlib=rb-4.1.0&q=85";

const REVIEWS = [
  { name: "Tasha M.", neighborhood: "Horn Lake regular", rating: 5, text: "Quality precision cuts, family atmosphere. Personable owner and staff. I won't go anywhere else." },
  { name: "Andre J.", neighborhood: "Southaven", rating: 5, text: "Friendly environment and couldn't ask for better service. They take their time, never rushed." },
  { name: "Marisol R.", neighborhood: "Mom of three", rating: 5, text: "Great atmosphere, great customer service. My kids actually ASK to come back. That's never happened." },
  { name: "Ethan B.", neighborhood: "Memphis", rating: 5, text: "Best fade in north Mississippi — no exaggeration. Marcus is an artist." },
  { name: "Devin O.", neighborhood: "First-timer", rating: 5, text: "Inclusive, welcoming, sharp. Walked in nervous, walked out feeling brand new." },
  { name: "Priya N.", neighborhood: "Olive Branch", rating: 5, text: "Jasmine did my color and I cried (happy tears). Stylist for life." },
];

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        {/* HERO */}
        <section data-testid="hero-section" className="relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-12 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7 fade-up">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="rounded-none px-3 py-1 font-medium tracking-wide">
                  Est. Horn Lake, MS
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="ml-1 font-medium">4.9</span>
                  <span className="text-muted-foreground">· 45 Google reviews</span>
                </div>
              </div>
              <p className="font-script text-primary text-3xl sm:text-4xl leading-none mb-3">
                Hey, glad you stopped by —
              </p>
              <h1 className="font-heading font-extrabold tracking-tighter text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
                Quality cuts.<br />
                <span className="text-primary">Family</span> chair.<br />
                Everyone welcome.
              </h1>
              <p className="mt-6 max-w-xl text-base lg:text-lg text-foreground/70 leading-relaxed">
                We're a small, hard-working shop in Horn Lake. Precision cuts, hot-towel shaves,
                color, kids' cuts — all done by people who'll remember your name on the second visit.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild data-testid="hero-book-btn" size="lg" className="rounded-none h-12 px-7 text-base tracking-wide hover:-translate-y-0.5 transition-transform">
                  <a href={BOOKSY_URL} target="_top" rel="noopener noreferrer">
                    Book Now
                    <ArrowUpRight className="w-4 h-4 ml-1" strokeWidth={2} />
                  </a>
                </Button>
                <a href="tel:+16623938902">
                  <Button data-testid="hero-call-btn" variant="outline" size="lg" className="rounded-none h-12 px-7 text-base">
                    <Phone className="w-4 h-4 mr-2" strokeWidth={1.5} /> (662) 393-8902
                  </Button>
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-foreground/70">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" strokeWidth={1.5}/> 1731 Dancy Blvd</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" strokeWidth={1.5}/> Open · Closes 6 PM</span>
                <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-primary" strokeWidth={1.5}/> LGBTQ+ friendly</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={HERO_IMG} alt="J. Wise sculpting a client's beard at Starz" className="w-full h-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background border border-border p-5 max-w-[240px] hidden sm:block">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Loved for</p>
                <p className="font-heading font-bold text-lg mt-1 leading-snug">"Quality precision cuts & family atmosphere."</p>
                <p className="text-xs text-muted-foreground mt-2">— Google review</p>
              </div>
            </div>
          </div>

        </section>

        {/* FIRST TIME — friendly checklist */}
        <section data-testid="first-time-section" className="bg-secondary/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="font-script text-primary text-3xl">First time?</p>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">Here's what to expect.</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">No surprises. No pressure. Just a good cut and a better conversation.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Smile, title: "A real hello", text: "We greet you by name (or learn it on the spot)." },
                { icon: Coffee, title: "Coffee & water", text: "On the house, every visit. Hot or iced." },
                { icon: Baby, title: "Kids welcome", text: "Patient, gentle cuts for the little ones." },
                { icon: CheckCircle2, title: "We listen first", text: "Quick chat about your hair before any clipper turns on." },
              ].map((item, i) => (
                <div key={i} className="bg-background border border-border p-6">
                  <item.icon className="w-5 h-5 text-primary mb-4" strokeWidth={1.5}/>
                  <p className="font-heading font-bold text-lg">{item.title}</p>
                  <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" data-testid="services-section" className="bg-secondary/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">The Menu</p>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-xl">
                  Honest pricing.<br/>Editorial precision.
                </h2>
              </div>
              <Button asChild data-testid="services-book-btn" className="rounded-none">
                <a href={BOOKSY_URL} target="_top" rel="noopener noreferrer">Book Now <ArrowUpRight className="w-4 h-4 ml-1"/></a>
              </Button>
            </div>

            <div className="divide-y divide-border border-t border-b border-border bg-background">
              {services.map((s) => (
                <div
                  key={s.id}
                  data-testid={`service-row-${s.id}`}
                  className="grid grid-cols-12 gap-4 py-5 px-4 sm:px-6 items-center hover:bg-secondary/40 transition-colors"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <p className="font-heading font-bold text-lg sm:text-xl">{s.name}</p>
                    <p className="text-xs uppercase tracking-widest text-primary mt-1">{s.category}</p>
                  </div>
                  <div className="col-span-8 sm:col-span-4 text-sm text-foreground/70 leading-relaxed">
                    {s.description}
                  </div>
                  <div className="col-span-2 sm:col-span-1 text-sm text-muted-foreground text-center">{s.duration_min}m</div>
                  <div className="col-span-2 sm:col-span-2 text-right">
                    <p className="font-heading font-extrabold text-xl">${s.price.toFixed(0)}</p>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">Loading services…</div>
              )}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" data-testid="gallery-section" className="bg-secondary/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <div className="mb-14 flex items-end justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Recent Work</p>
                <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">The gallery.</h2>
              </div>
              <Sparkles className="w-8 h-8 text-primary hidden sm:block" strokeWidth={1.5} />
            </div>
            <div className="grid grid-cols-6 grid-rows-2 gap-4 h-[700px]">
              <div className="col-span-3 row-span-2 overflow-hidden">
                <img src={G_WAITING} alt="Starz waiting area" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="col-span-3 row-span-1 overflow-hidden">
                <img src={G_EXTERIOR} alt="Starz Barber & Beauty storefront on Dancy Blvd" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="col-span-2 row-span-1 overflow-hidden">
                <img src={G_SALON} alt="Beauty salon chair at Starz" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="col-span-1 row-span-1 bg-primary text-primary-foreground p-5 flex flex-col justify-between">
                <Scissors className="w-6 h-6" strokeWidth={1.5}/>
                <p className="font-heading font-bold text-lg leading-tight">Walk-ins welcome, when chairs are open.</p>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" data-testid="reviews-section" className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">From the chair</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                Real people.<br/>Real stories.
              </h2>
              <p className="mt-5 text-foreground/70 max-w-sm">
                A few words from the folks who keep coming back.
              </p>
              <p className="mt-4 font-script text-primary text-3xl">Thank you, Horn Lake.</p>
              <div className="mt-6 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-primary text-primary"/>
                ))}
                <span className="ml-3 font-heading font-bold text-2xl">4.9</span>
              </div>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {REVIEWS.map((r, i) => (
                <div key={i} data-testid={`review-card-${i}`} className={`border border-border p-6 bg-background ${i % 2 === 0 ? "rotate-[-0.4deg]" : "rotate-[0.4deg]"}`}>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary"/>
                    ))}
                  </div>
                  <p className="text-foreground/85 leading-relaxed text-sm">"{r.text}"</p>
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                    <p className="font-heading font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.neighborhood}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" data-testid="contact-section" className="bg-foreground text-background border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Visit us</p>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
                See you in the chair.
              </h2>
              <p className="mt-4 font-script text-primary text-3xl">Door's always open.</p>
              <div className="mt-10 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-background/60">Address</p>
                  <p className="mt-1 text-lg">1731 Dancy Blvd<br/>Horn Lake, MS 38637</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-background/60">Phone</p>
                  <a href="tel:+16623938902" data-testid="contact-call-btn" className="mt-1 text-lg block hover:text-primary">(662) 393-8902</a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-background/60">Hours</p>
                  <p className="mt-1 text-lg">Mon – Sat · 9 AM – 6 PM<br/>Sun · Closed</p>
                </div>
              </div>
              <div className="mt-10 flex gap-3">
                <Button asChild data-testid="contact-book-btn" className="rounded-none h-12 px-7 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <a href={BOOKSY_URL} target="_top" rel="noopener noreferrer">
                    Book Now <ArrowUpRight className="w-4 h-4 ml-1"/>
                  </a>
                </Button>
                <a href="https://maps.google.com/?q=1731+Dancy+Blvd,+Horn+Lake,+MS+38637" target="_top" rel="noreferrer">
                  <Button data-testid="contact-directions-btn" variant="outline" className="rounded-none h-12 px-7 border-background/30 text-background hover:bg-background hover:text-foreground bg-transparent">
                    Get directions
                  </Button>
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="aspect-[4/3] w-full overflow-hidden border border-background/20">
                <iframe
                  title="Starz Barber Map"
                  src="https://www.google.com/maps?q=1731+Dancy+Blvd,+Horn+Lake,+MS+38637&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(0.4) contrast(0.95)" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
