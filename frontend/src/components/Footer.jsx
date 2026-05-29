import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="border-t border-border bg-background mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
              <Scissors className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <span className="font-heading font-extrabold tracking-tight text-xl">
              STARZ Barber & Beauty
            </span>
          </div>
          <p className="text-sm text-foreground/70 max-w-md leading-relaxed">
            Quality precision cuts. Family atmosphere. Welcoming everyone.
            Horn Lake's most loved chair.
          </p>
          <p className="text-xs text-muted-foreground mt-4">LGBTQ+ friendly · All textures welcome</p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Visit</h4>
          <p className="text-sm text-foreground/80 leading-relaxed">
            1731 Dancy Blvd<br />Horn Lake, MS 38637
          </p>
          <a href="tel:+16623938902" className="text-sm text-foreground/80 mt-2 inline-block hover:text-primary">
            (662) 393-8902
          </a>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link to="/book" className="hover:text-primary">Book Online</Link></li>
            <li><a href="#services" className="hover:text-primary">Services</a></li>
            <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
            <li><Link to="/admin" className="hover:text-primary">Staff</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Starz Barber & Beauty</span>
          <span>Made with precision in Horn Lake, MS</span>
        </div>
      </div>
    </footer>
  );
}
