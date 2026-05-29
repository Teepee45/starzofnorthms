import "@/index.css";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Book from "@/pages/Book";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App;
