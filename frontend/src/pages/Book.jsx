import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const ALL_SLOTS = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"];

const STEPS = ["Service", "Specialist", "Date & Time", "Your Details", "Confirm"];

function fmtDate(d) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}
function prettyDate(s) {
  if (!s) return "";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({
    customer_name: "", customer_phone: "", customer_email: "",
    notes: "", hair_texture: "", communication_pref: "Text",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    api.get("/services").then((r) => setServices(r.data));
    api.get("/barbers").then((r) => setBarbers(r.data));
  }, []);

  useEffect(() => {
    if (barberId && date) {
      api.get(`/appointments/availability`, { params: { barber_id: barberId, date: fmtDate(date) } })
        .then((r) => setBookedSlots(r.data.booked || []));
    } else {
      setBookedSlots([]);
    }
  }, [barberId, date]);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const barber = useMemo(() => barbers.find((b) => b.id === barberId), [barbers, barberId]);

  const canNext = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!barberId;
    if (step === 2) return !!date && !!time;
    if (step === 3) return details.customer_name.trim().length > 1 && details.customer_phone.trim().length >= 7;
    return true;
  };

  const onConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = {
        service_id: serviceId,
        barber_id: barberId,
        date: fmtDate(date),
        time,
        ...details,
      };
      const res = await api.post("/appointments", payload);
      setConfirmed(res.data);
      setStep(5);
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">Book online</p>
            <h1 className="font-heading font-extrabold tracking-tighter text-4xl sm:text-5xl lg:text-6xl">
              Reserve your chair.
            </h1>
            <p className="mt-3 text-foreground/70">A few quick steps. We'll text you a confirmation.</p>
          </div>

          {/* Stepper */}
          {step < 5 && (
            <div className="grid grid-cols-5 gap-2 mb-10">
              {STEPS.map((s, i) => (
                <div key={s} className="text-xs">
                  <div className={`h-1 ${i <= step ? "bg-primary" : "bg-border"}`} />
                  <p className={`mt-2 uppercase tracking-widest ${i === step ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                    {i + 1}. {s}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Step 0: Service */}
          {step === 0 && (
            <div data-testid="book-step-service" className="border border-border bg-card divide-y divide-border">
              {services.map((s) => (
                <button
                  key={s.id}
                  data-testid={`select-service-${s.id}`}
                  onClick={() => setServiceId(s.id)}
                  className={`w-full text-left grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-secondary/40 transition-colors ${serviceId === s.id ? "bg-secondary/60" : ""}`}
                >
                  <div className="col-span-12 sm:col-span-6">
                    <p className="font-heading font-bold text-lg">{s.name}</p>
                    <p className="text-xs uppercase tracking-widest text-primary mt-1">{s.category}</p>
                  </div>
                  <div className="col-span-8 sm:col-span-3 text-sm text-foreground/70">{s.duration_min} min</div>
                  <div className="col-span-4 sm:col-span-2 font-heading font-bold text-lg">${s.price.toFixed(0)}</div>
                  <div className="hidden sm:flex sm:col-span-1 justify-end">
                    {serviceId === s.id && <Check className="w-5 h-5 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Specialist */}
          {step === 1 && (
            <div data-testid="book-step-barber" className="grid sm:grid-cols-3 gap-6">
              {barbers.map((b) => (
                <button
                  key={b.id}
                  data-testid={`select-barber-${b.id}`}
                  onClick={() => setBarberId(b.id)}
                  className={`text-left border ${barberId === b.id ? "border-primary" : "border-border"} bg-card hover:bg-secondary/40 transition-colors`}
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={b.image_url} alt={b.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-bold text-lg">{b.name}</p>
                    <p className="text-xs uppercase tracking-widest text-primary mt-1">{b.role}</p>
                    <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{b.bio}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div data-testid="book-step-datetime" className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 border border-border bg-card p-4">
                <Calendar
                  data-testid="booking-calendar"
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setTime(""); }}
                  disabled={(d) => {
                    const today = new Date(); today.setHours(0,0,0,0);
                    return d < today || d.getDay() === 0; // Sundays closed
                  }}
                  className="rounded-none"
                />
              </div>
              <div className="lg:col-span-7">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  {date ? prettyDate(fmtDate(date)) : "Choose a date"}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ALL_SLOTS.map((t) => {
                    const isBooked = bookedSlots.includes(t);
                    const isSelected = time === t;
                    return (
                      <button
                        key={t}
                        data-testid={`slot-${t}`}
                        disabled={!date || isBooked}
                        onClick={() => setTime(t)}
                        className={`py-3 text-sm border transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground border-primary" :
                          isBooked ? "bg-secondary/40 text-muted-foreground border-border line-through cursor-not-allowed" :
                          "bg-background border-border hover:border-primary"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                {!date && <p className="text-sm text-muted-foreground mt-4">Pick a date to see available times.</p>}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div data-testid="book-step-details" className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              <div className="sm:col-span-1">
                <Label htmlFor="customer_name">Full name *</Label>
                <Input id="customer_name" data-testid="input-name" className="rounded-none mt-2" value={details.customer_name} onChange={(e) => setDetails({...details, customer_name: e.target.value})}/>
              </div>
              <div className="sm:col-span-1">
                <Label htmlFor="customer_phone">Phone *</Label>
                <Input id="customer_phone" data-testid="input-phone" className="rounded-none mt-2" value={details.customer_phone} onChange={(e) => setDetails({...details, customer_phone: e.target.value})}/>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="customer_email">Email (optional)</Label>
                <Input id="customer_email" data-testid="input-email" type="email" className="rounded-none mt-2" value={details.customer_email} onChange={(e) => setDetails({...details, customer_email: e.target.value})}/>
              </div>
              <div>
                <Label>Hair texture (optional)</Label>
                <Select value={details.hair_texture} onValueChange={(v) => setDetails({...details, hair_texture: v})}>
                  <SelectTrigger data-testid="select-texture" className="rounded-none mt-2">
                    <SelectValue placeholder="Select texture"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Straight">Straight</SelectItem>
                    <SelectItem value="Wavy">Wavy</SelectItem>
                    <SelectItem value="Curly">Curly</SelectItem>
                    <SelectItem value="Coily">Coily</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preferred contact</Label>
                <Select value={details.communication_pref} onValueChange={(v) => setDetails({...details, communication_pref: v})}>
                  <SelectTrigger data-testid="select-comm" className="rounded-none mt-2">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Text">Text</SelectItem>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Notes for your barber (optional)</Label>
                <Textarea id="notes" data-testid="input-notes" className="rounded-none mt-2 min-h-[100px]" value={details.notes} onChange={(e) => setDetails({...details, notes: e.target.value})} placeholder="Anything we should know — sensitivities, references, etc."/>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div data-testid="book-step-confirm" className="border border-border bg-card p-8 max-w-2xl">
              <h3 className="font-heading font-bold text-2xl mb-6">Review your appointment</h3>
              <dl className="grid grid-cols-3 gap-y-4 text-sm">
                <dt className="text-muted-foreground uppercase tracking-widest text-xs">Service</dt>
                <dd className="col-span-2 font-medium">{service?.name} · ${service?.price?.toFixed(0)}</dd>
                <dt className="text-muted-foreground uppercase tracking-widest text-xs">Specialist</dt>
                <dd className="col-span-2 font-medium">{barber?.name}</dd>
                <dt className="text-muted-foreground uppercase tracking-widest text-xs">When</dt>
                <dd className="col-span-2 font-medium">{prettyDate(fmtDate(date))} @ {time}</dd>
                <dt className="text-muted-foreground uppercase tracking-widest text-xs">Name</dt>
                <dd className="col-span-2 font-medium">{details.customer_name}</dd>
                <dt className="text-muted-foreground uppercase tracking-widest text-xs">Phone</dt>
                <dd className="col-span-2 font-medium">{details.customer_phone}</dd>
                {details.customer_email && (<><dt className="text-muted-foreground uppercase tracking-widest text-xs">Email</dt><dd className="col-span-2 font-medium">{details.customer_email}</dd></>)}
              </dl>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && confirmed && (
            <div data-testid="book-step-success" className="border border-primary bg-primary/5 p-10 max-w-2xl text-center">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1.5}/>
              <h3 className="font-heading font-extrabold text-3xl tracking-tight">You're booked.</h3>
              <p className="mt-3 text-foreground/75">
                We'll see you on <strong>{prettyDate(confirmed.date)}</strong> at <strong>{confirmed.time}</strong> with {barber?.name}.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Confirmation reference: {confirmed.id.slice(0, 8).toUpperCase()}</p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/"><Button data-testid="success-home-btn" className="rounded-none">Back home</Button></Link>
                <Button data-testid="success-another-btn" variant="outline" className="rounded-none" onClick={() => { setStep(0); setServiceId(""); setBarberId(""); setDate(null); setTime(""); setConfirmed(null); setDetails({ customer_name:"", customer_phone:"", customer_email:"", notes:"", hair_texture:"", communication_pref:"Text" }); }}>Book another</Button>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          {step < 5 && (
            <div className="mt-10 flex justify-between">
              <Button
                data-testid="step-back-btn"
                variant="outline"
                className="rounded-none"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                <ArrowLeft className="w-4 h-4 mr-1"/> Back
              </Button>
              {step < 4 ? (
                <Button
                  data-testid="step-next-btn"
                  className="rounded-none"
                  disabled={!canNext()}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next <ArrowRight className="w-4 h-4 ml-1"/>
                </Button>
              ) : (
                <Button
                  data-testid="step-confirm-btn"
                  className="rounded-none"
                  disabled={submitting}
                  onClick={onConfirm}
                >
                  {submitting ? "Booking…" : "Confirm appointment"} <Check className="w-4 h-4 ml-1"/>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
