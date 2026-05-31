import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { BOOKSY_URL } from "@/lib/booking";

export default function Book() {
  useEffect(() => {
    // Redirect after a brief moment so the user sees where they're being sent.
    const t = setTimeout(() => {
      window.location.replace(BOOKSY_URL);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-24 lg:py-32 text-center">
          <p className="font-script text-primary text-3xl">One sec —</p>
          <h1 className="font-heading font-extrabold tracking-tighter text-4xl sm:text-5xl lg:text-6xl mt-2">
            Sending you to Booksy.
          </h1>
          <p className="mt-5 text-foreground/70 max-w-xl mx-auto">
            We use Booksy for live availability and instant confirmations.
            If your browser doesn't redirect automatically, tap the button below.
          </p>
          <div className="mt-8 flex justify-center">
            <a href={BOOKSY_URL} target="_blank" rel="noreferrer">
              <Button data-testid="booksy-redirect-btn" size="lg" className="rounded-none h-12 px-7 text-base">
                Open Booksy <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Or call us at <a href="tel:+16623938902" className="hover:text-primary">(662) 393-8902</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
