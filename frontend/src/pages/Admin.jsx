import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { api, getAdminToken, setAdminToken, clearAdminToken } from "@/lib/api";
import { LogOut, RefreshCw, Trash2 } from "lucide-react";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const statusColor = {
  pending: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  confirmed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  completed: "bg-blue-500/15 text-blue-700 border-blue-500/30",
  cancelled: "bg-red-500/15 text-red-700 border-red-500/30",
};

export default function Admin() {
  const [token, setToken] = useState(getAdminToken());
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => ({ "x-admin-token": token }), [token]);

  const load = async () => {
    setLoading(true);
    try {
      const [appts, svcs, brbs] = await Promise.all([
        api.get("/admin/appointments", { headers }),
        api.get("/services"),
        api.get("/barbers"),
      ]);
      setAppointments(appts.data);
      setServices(svcs.data);
      setBarbers(brbs.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Failed to load.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) load(); /* eslint-disable-next-line */ }, [token]);

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { password });
      setAdminToken(res.data.token);
      setToken(res.data.token);
      toast.success("Welcome back, Starz.");
    } catch {
      toast.error("Wrong password.");
    }
  };

  const logout = () => { clearAdminToken(); setToken(""); };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}`, { status }, { headers });
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast.success(`Marked ${status}`);
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteAppt = async (id) => {
    if (!window.confirm("Delete this appointment permanently?")) return;
    try {
      await api.delete(`/admin/appointments/${id}`, { headers });
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [filter, appointments]);

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  }), [appointments]);

  const serviceById = (id) => services.find((s) => s.id === id);
  const barberById = (id) => barbers.find((b) => b.id === id);

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16 px-6">
          <form onSubmit={onLogin} data-testid="admin-login-form" className="w-full max-w-sm border border-border p-8 bg-card">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Staff Access</p>
            <h1 className="font-heading font-extrabold text-3xl tracking-tight">Admin login</h1>
            <p className="text-sm text-foreground/70 mt-2 mb-6">Enter your staff password to manage appointments.</p>
            <Label htmlFor="password">Password</Label>
            <Input id="password" data-testid="admin-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-none mt-2 mb-6" />
            <Button data-testid="admin-login-btn" type="submit" className="rounded-none w-full">Sign in</Button>
            <Link to="/" className="block text-xs text-muted-foreground mt-4 hover:text-foreground">← Back to site</Link>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Control Room</p>
            <h1 className="font-heading font-extrabold tracking-tighter text-4xl sm:text-5xl">Appointments</h1>
          </div>
          <div className="flex gap-2">
            <Button data-testid="admin-refresh-btn" variant="outline" className="rounded-none" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}/> Refresh
            </Button>
            <Button data-testid="admin-logout-btn" variant="outline" className="rounded-none" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2"/> Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Confirmed", value: stats.confirmed },
            { label: "Completed", value: stats.completed },
          ].map((s) => (
            <div key={s.label} data-testid={`stat-${s.label.toLowerCase()}`} className="border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="font-heading font-extrabold text-3xl mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {["all", ...STATUSES].map((f) => (
            <button
              key={f}
              data-testid={`filter-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest border ${filter === f ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary/40"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Specialist</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No appointments to show.</TableCell></TableRow>
              )}
              {filtered.map((a) => {
                const svc = serviceById(a.service_id);
                const brb = barberById(a.barber_id);
                return (
                  <TableRow key={a.id} data-testid={`appt-row-${a.id}`}>
                    <TableCell className="font-medium">
                      <div>{a.date}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{a.customer_name}</div>
                      {a.notes && <div className="text-xs text-muted-foreground truncate max-w-xs">{a.notes}</div>}
                    </TableCell>
                    <TableCell>{svc?.name || a.service_id.slice(0,6)}</TableCell>
                    <TableCell>{brb?.name || a.barber_id.slice(0,6)}</TableCell>
                    <TableCell className="text-sm">{a.customer_phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-none border ${statusColor[a.status]}`}>{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                          <SelectTrigger data-testid={`status-select-${a.id}`} className="w-[130px] rounded-none h-8 text-xs">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button data-testid={`delete-${a.id}`} variant="outline" size="icon" className="rounded-none h-8 w-8" onClick={() => deleteAppt(a.id)}>
                          <Trash2 className="w-3.5 h-3.5"/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
