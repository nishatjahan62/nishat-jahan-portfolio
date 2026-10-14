
import React, { useState, useEffect, useRef } from "react";
import { FaRegSun } from "react-icons/fa6";
import { FaMoon, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const primaryLinks = [
  { id: "hero", title: "Home" },
  { id: "about-me", title: "About" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
];

const moreLinks = [
  { id: "education", title: "Education" },
  { id: "contact", title: "Contact" },
  { id: "services", title: "Services" },
];

const allLinks = [...primaryLinks, ...moreLinks];

const Navbar = () => {
  const [active, setActive] = useState("hero");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMoreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef(null);

  const navbarHeight = 72;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollPos = window.scrollY + navbarHeight / 2;
      allLinks.forEach((link) => {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
          setActive(link.id);
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const y = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActive(id);
      setDropdownOpen(false);
      setMoreOpen(false);
    }
  };

  const isMoreActive = moreLinks.some((l) => l.id === active);

  // MATCHED TO HERO BG
  const glassStyle = {
    background: theme === "dark" 
      ? "rgba(10,15,30,0.4)" 
      : "rgba(255, 255, 255, 0.25)", 
    backdropFilter: "blur(10px) saturate(180%)",
    WebkitBackdropFilter: "blur(10px) saturate(180%)",
    borderBottom: theme === "dark" 
      ? "1px solid rgba(255,255,255,0.08)" 
      : "1px solid rgba(164, 63, 219, 0.15)",
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-700">
        <div
          className={`transition-all duration-700 ${scrolled ? "lg:opacity-0 lg:-translate-y-full lg:pointer-events-none" : "lg:opacity-100 lg:translate-y-0"}`}
          style={glassStyle}
        >
          <div className="flex items-center justify-between px-8 lg:px-20 h-[72px] relative">
            {/* Logo */}
            <button onClick={() => handleScrollTo("hero")} className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border border-primary/20" />
              <span className="font-bold text-gray-900 dark:text-white tracking-wide text-lg">Nishat Jahan</span>
            </button>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-6">
              {primaryLinks.map((link) => (
                <li key={link.id}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleScrollTo(link.id)}
                    className={`text-sm font-medium transition-colors duration-300 ${active === link.id ? "text-primary" : "text-gray-700 dark:text-gray-300 hover:text-primary"}`}
                  >
                    {link.title}
                  </motion.button>
                </li>
              ))}

              {/* More dropdown */}
              <li ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${isMoreActive ? "text-primary" : "text-gray-700 dark:text-gray-300 hover:text-primary"}`}
                >
                  More
                  <FaChevronDown className={`text-[10px] transition-transform duration-300 ${isMoreOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute top-full right-0 mt-3 w-44 rounded-2xl overflow-hidden py-1.5 shadow-xl"
                      style={{
                        background: theme === "dark" ? "rgba(15, 20, 35, 0.9)" : "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(164,63,219,0.2)",
                      }}
                    >
                      {moreLinks.map((link) => (
                        <li key={link.id}>
                          <button
                            onClick={() => handleScrollTo(link.id)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-all duration-200 ${active === link.id ? "text-primary bg-primary/5" : "text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5"}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${active === link.id ? "bg-primary" : "bg-gray-400 dark:bg-gray-600"}`} />
                            {link.title}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <label className="swap swap-rotate cursor-pointer text-primary">
                <input type="checkbox" onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} checked={theme === "dark"} />
                <FaMoon className="swap-on text-xl" />
                <FaRegSun className="swap-off text-xl" />
              </label>

              <button
                className="lg:hidden p-2 rounded-xl hover:bg-primary/10"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 rounded-full bg-primary transition-all duration-300 ${isDropdownOpen ? "rotate-45 translate-y-[7px]" : "w-5"}`} />
                  <span className={`block h-0.5 rounded-full bg-primary transition-all duration-300 ${isDropdownOpen ? "opacity-0" : "w-3.5"}`} />
                  <span className={`block h-0.5 rounded-full bg-primary transition-all duration-300 ${isDropdownOpen ? "-rotate-45 -translate-y-[7px]" : "w-5"}`} />
                </div>
              </button>
            </div>

             {/* Bottom line animation — only when not scrolled */}         {!scrolled && (
            <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
             <motion.div
               animate={{ x: ["-100%", "100%"] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
             />
           </div>
         )}
          </div>

          {/* Mobile dropdown */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-400 ${isDropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            style={{
              background: theme === "dark" ? "rgba(10, 15, 30, 0.95)" : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
            }}
          >
            <ul className="flex flex-col gap-1 px-6 py-3">
              {allLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleScrollTo(link.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${active === link.id ? "text-primary bg-primary/10" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── SCROLLED PILL — MATCHED TO HERO ── */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: -20, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: -20, x: "-50%", opacity: 0 }}
            className="hidden lg:block fixed top-5 left-1/2 z-[100]"
          >
            <div 
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border shadow-lg backdrop-blur-md"
              style={{ 
                background: theme === "dark" ? "rgba(10, 15, 30, 0.6)" : "rgba(255, 255, 255, 0.35)",
                borderColor: theme === "dark" ? "rgba(164, 63, 219, 0.4)" : "rgba(164, 63, 219, 0.25)"
              }}
            >
              {/* Logo section in the floating pill */}
<button 
  onClick={() => handleScrollTo("hero")} 
  className="flex items-center justify-center"
>
  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 bg-white/50 flex items-center justify-center">
    <img 
      src="/logo.jpg" 
      alt="Logo" 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback if the image doesn't load
        e.target.src = "https://ui-avatars.com/api/?name=NJ&background=A43FDB&color=fff";
      }}
    />
  </div>
</button>
              {allLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.id)}
                  className={`relative px-3 py-1 text-xs font-bold transition-all duration-300 ${active === link.id ? "text-white" : "text-gray-700 dark:text-gray-300 hover:text-primary"}`}
                >
                  {active === link.id && (
                    <motion.span layoutId="activePill" className="absolute inset-0 bg-primary rounded-full -z-10" />
                  )}
                  {link.title}
                </button>
              ))}
              <div className="w-[1px] h-4 bg-primary/20 mx-1" />
              <label className="swap swap-rotate cursor-pointer text-primary text-sm ml-2">
                <input type="checkbox" onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} checked={theme === "dark"} />
                <FaMoon className="swap-on" />
                <FaRegSun className="swap-off" />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;