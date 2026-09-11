import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaDownload, FaPhoneAlt } from "react-icons/fa";
import Logo from "../../../public/logo.jpg";
import Resume from "../../../public/Resume.pdf";
import Button from "../../Pages/Button/Button";
import { HiOutlineMail } from "react-icons/hi";
import { FaTelegram, FaWhatsapp } from "react-icons/fa6";

/* ── Canvas particle field ── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * (W || 800),
      y: Math.random() * (H || 600),
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(164,63,219,${0.18 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(164,63,219,0.5)";
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
};

/* ── Ambient orb ── */
const Orb = ({ className, delay = 0, duration = 7 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ y: [0, -22, 0], scale: [1, 1.07, 1] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ── Social icon button ── */
const SocialLink = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    whileHover={{ scale: 1.18, y: -4 }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg
               bg-white/70 dark:bg-white/5 border border-primary/20
               text-gray-700 dark:text-gray-300 hover:text-primary
               hover:border-primary hover:shadow-lg hover:shadow-primary/20
               backdrop-blur-sm transition-all duration-300"
  >
    {icon}
  </motion.a>
);

//   const [visibleLines, setVisibleLines] = useState(0);

//   useEffect(() => {
//     if (visibleLines >= codeLines.length) return;
//     const t = setTimeout(() => setVisibleLines((v) => v + 1), 320);
//     return () => clearTimeout(t);
//   }, [visibleLines]);

//   return (
//     <div className="hidden md:flex flex-col items-center justify-center relative z-10 mx-4 select-none">
//       {/* Top vertical line with flowing dot */}
//       <div className="relative w-px h-16 bg-gradient-to-b from-transparent via-primary/40 to-primary/70 mb-3">
//         <motion.div
//           className="absolute w-1.5 h-1.5 rounded-full bg-primary left-1/2 -translate-x-1/2"
//           animate={{ y: [0, 56, 0] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//         />
//       </div>

//       {/* Code card */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: false, amount: 0.3 }}
//         transition={{ duration: 0.6 }}
//         className="bg-[#0d1117] border border-primary/30 rounded-2xl shadow-2xl shadow-primary/10
//                    w-52 overflow-hidden"
//       >
//         {/* Window bar */}
//         <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#161b22] border-b border-white/5">
//           <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
//           <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
//           <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
//           <span className="ml-2 text-[10px] text-gray-500 font-mono">dev.js</span>
//         </div>

//         {/* Code lines */}
//         <div className="px-3 py-3 font-mono text-[11px] leading-5 min-h-[170px]">
//           {codeLines.slice(0, visibleLines).map((line, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, x: -8 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.25 }}
//               className={`${line.color} whitespace-pre`}
//             >
//               {line.text || "\u00A0"}
//             </motion.div>
//           ))}
//           {/* Blinking cursor */}
//           {visibleLines < codeLines.length && (
//             <motion.span
//               animate={{ opacity: [1, 0, 1] }}
//               transition={{ duration: 0.8, repeat: Infinity }}
//               className="inline-block w-1.5 h-3.5 bg-primary align-middle ml-0.5"
//             />
//           )}
//         </div>
//       </motion.div>

//       {/* Bottom vertical line with flowing dot */}
//       <div className="relative w-px h-16 bg-gradient-to-b from-primary/70 via-primary/40 to-transparent mt-3">
//         <motion.div
//           className="absolute w-1.5 h-1.5 rounded-full bg-primary left-1/2 -translate-x-1/2"
//           animate={{ y: [0, 56, 0] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//         />
//       </div>
//     </div>
//   );
// };
const CodeDivider = () => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center relative z-10 mx-6 select-none">
      {/* Top vertical line with flowing dot */}
      <div className="relative w-px h-24 bg-gradient-to-b from-transparent via-primary/40 to-primary/70 mb-4">
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-primary left-1/2 -translate-x-1/2"
          animate={{ y: [0, 80, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Modern Tag Divider with Sequential Dot Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-5 font-mono text-3xl font-extrabold text-gray-500/80"
      >
        {/* Same sized tags */}
        <span className="leading-none text-base font-semibold">&lt;&gt;</span>

        <div className="flex flex-col gap-4">
          {/* Red Dot with Pulse */}
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0,
            }}
            className="w-3 h-3 rounded-full bg-red-500/90 shadow-lg shadow-red-500/20"
          />
          {/* Yellow Dot with Pulse */}
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-lg shadow-yellow-500/20"
          />
          {/* Green Dot with Pulse */}
          <motion.span
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="w-3 h-3 rounded-full bg-green-500/90 shadow-lg shadow-green-500/20"
          />
        </div>

        <span className="leading-none text-base font-semibold">&lt;/&gt;</span>
      </motion.div>

      {/* Bottom vertical line with flowing dot */}
      <div className="relative w-px h-24 bg-gradient-to-b from-primary/70 via-primary/40 to-transparent mt-4">
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-primary left-1/2 -translate-x-1/2"
          animate={{ y: [0, 80, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};
/* ══════════════════════════════════════ */
const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex flex-col md:flex-row items-center justify-center
                 px-6 sm:px-10 lg:px-20 py-10 pb-16 pt-24 sm:pt-32
                "
    >
      <ParticleCanvas />
      <Orb
        className="w-72 h-72 bg-primary/20 top-[-4rem] left-[-4rem]"
        delay={0}
        duration={7}
      />
      <Orb
        className="w-96 h-96 bg-secondary/15 bottom-[-5rem] right-[-5rem]"
        delay={1.5}
        duration={9}
      />
      <Orb
        className="w-40 h-40 bg-primary/10 top-1/2 left-1/3"
        delay={3}
        duration={6}
      />

      {/* ── Profile column ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.9, type: "spring", stiffness: 80 }}
        className="flex flex-col items-center mb-10 md:mb-0 relative z-10"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #A43FDB 0%, #6366f1 40%, transparent 60%, #A43FDB 100%)",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full opacity-25"
            style={{
              background:
                "conic-gradient(from 180deg, #A43FDB 0%, transparent 50%, #6366f1 100%)",
            }}
          />
          <motion.img
            whileHover={{ scale: 1.06 }}
            src={Logo}
            alt="Nishat Jahan"
            className="relative w-36 h-36 md:w-52 md:h-52 rounded-full object-cover
                       border-4 border-white dark:border-[#0B1120] shadow-2xl z-10"
          />
        </div>
      </motion.div>

      {/* ── Code Divider (desktop only) ── */}
      <CodeDivider />

      {/* ── Text column ── */}
      <div className="text-center lg:text-left z-10 max-w-xl">
        {/* Role chip */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-[16px] font-medium px-4 py-1.5
                     rounded-full mb-5 bg-primary/10 dark:bg-primary/20
                     text-primary border border-primary/25"
        >
          <span>👩‍💻</span>
          Jr. Full Stack Developer · MERN Stack 
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.65 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight poppins
                     text-gray-900 dark:text-white tracking-tight"
        >
          Hi, I'm{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-primary  via-purple-500 to-secondary bg-clip-text text-transparent">
              Nishat
            </span>
            <motion.svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
            >
              <motion.path
                d="M2 8 Q50 2 100 8 Q150 14 198 8"
                stroke="url(#squiggle)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="squiggle" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A43FDB" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </motion.svg>
          </span>{" "}
          Jahan
        </motion.h1>

        {/* Description */}
       {/* Description */}
<motion.p
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: false, amount: 0.5 }}
  transition={{ duration: 0.7, delay: 0.3 }}
  className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg"
> A  <span className="text-primary font-medium"> junior Full-Stack developer</span>{" "} working with the{" "}
<span className="text-secondary font-medium">MERN stack</span>, diving
deeper into{" "}
<span className="text-primary font-medium">backend architecture</span> and
databases, and actively building an{" "}
<span className="text-secondary font-medium">engineering mindset.</span>
</motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center md:justify-start gap-4"
        >
          <Button
            href={Resume}
            download="Nishat_Jahan_Resume.pdf"
            icon={FaDownload}
          >
            Get Resume
          </Button>
          <Button href="#projects">View Projects</Button>
        </motion.div>

        {/* Socials */}
        <div className="flex justify-center md:justify-start gap-3 mt-8">
          {[
            {
              href: "https://github.com/nishatjahan62",
              icon: <FaGithub />,
              label: "GitHub",
            },
            {
              href: "https://www.linkedin.com/in/nishatjahan62/",
              icon: <FaLinkedin />,
              label: "LinkedIn",
            },
            {
              href: "https://t.me/nishatjahan62",
              icon: <FaTelegram />,
              label: "Telegram",
            },
            {
              href: "mailto:nishatjahan62@gmail.com",
              icon: <HiOutlineMail />,
              label: "Email",
            },
            {
              href: "https://wa.me/8801830322562",
              icon: <FaWhatsapp />,
              label: "WhatsApp",
            },
          ].map((social, index) => (
            <motion.div
              key={index}
              animate={{
                // Dhire dhire color change hobe
                color: ["#9ca3af", "#A43FDB", "#9ca3af"],
                borderColor: [
                  "rgba(164,63,219,0.1)",
                  "rgba(164,63,219,0.8)",
                  "rgba(164,63,219,0.1)",
                ],
                boxShadow: [
                  "0px 0px 0px rgba(164,63,219,0)",
                  "0px 0px 15px rgba(164,63,219,0.2)",
                  "0px 0px 0px rgba(164,63,219,0)",
                ],
              }}
              transition={{
                duration: 3, // Duration bariye 3s kora hoyeche jate slow hoy
                repeat: Infinity,
                repeatDelay: 1, // Ekta cycle shesh hobar por 1s gap thakbe
                delay: index * 0.8, // Sequential gap-tao ektu bariye deya hoyeche
                ease: "easeInOut",
              }}
              className="rounded-xl border"
            >
              <SocialLink
                href={social.href}
                icon={social.icon}
                label={social.label}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
