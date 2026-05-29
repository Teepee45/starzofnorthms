import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Scissors } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/#services", label: "Services" },
  { to: "/#gallery", label: "Gallery" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/#contact", label: "Visit" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onAnchor = (href) => {
    setOpen(false);
    if (pathname !== "/") {
      navigate("/" + href.slice(1));
    } else {
      const id = href.split("#")[1];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      data-testid="site-navbar"
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2 group">
          <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
            <Scissors className="w-4 h-4" strokeWidth={1.5} />
          </span>
          <span className="font-heading font-extrabold tracking-tight text-lg">
            STARZ <span className="font-light text-muted-foreground">/ Barber & Beauty</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={() => onAnchor(l.to)}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+16623938902"
            data-testid="navbar-call-btn"
            className="hidden sm:inline text-sm font-medium text-foreground/70 hover:text-foreground"
          >
            (662) 393-8902
          </a>
          <Link to="/book">
            <Button data-testid="navbar-book-btn" className="rounded-none font-medium tracking-wide">
              Book Now
            </Button>
          </Link>
          <button
            data-testid="navbar-mobile-toggle"
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <button
                key={l.to}
                data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                onClick={() => onAnchor(l.to)}
                className="text-left text-base py-1"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
