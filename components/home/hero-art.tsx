"use client";

import Image from "next/image";
import * as m from "motion/react-m";
import { Check, Clock3, MapPin } from "lucide-react";
import { AppLogo } from "../app-logos";
import { SiGo, SiPython, SiTypescript } from "react-icons/si";
import portrait from "@/public/images/nafhan.png";

const float = (delay: number, distance = 8, duration = 5) => ({
  animate: { y: [0, -distance, 0] },
  transition: { duration, delay, repeat: Infinity, ease: "easeInOut" as const },
});

const pop = (delay: number) => ({
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

/** Portrait with floating glass cards that show results, not claims. */
export function HeroArt() {
  return (
    <div className="relative mx-auto h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]">
      <Image
        src={portrait}
        alt="Illustration of Ghifari Nafhan"
        priority
        sizes="(min-width: 640px) 260px, 200px"
        className="absolute bottom-[6%] left-1/2 w-[200px] -translate-x-1/2 select-none sm:w-[260px]"
      />

      {/* location */}
      <m.div {...pop(0.2)} className="absolute -top-1 right-[4%]">
        <m.span {...float(0, 6, 4.5)} className="lg-sm flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.78rem]">
          <span className="size-1.5 rounded-full bg-[var(--ok)]" />
          <MapPin size={12} aria-hidden /> Yogyakarta, ID
        </m.span>
      </m.div>

      {/* result: hours to minutes */}
      <m.div {...pop(0.45)} className="absolute left-[-6%] top-[24%] sm:left-[-14%]">
        <m.div {...float(0.6, 9, 5.5)} className="glass w-[150px] rounded-2xl px-3 py-2.5 text-[0.75rem] sm:w-[170px]">
          <div className="flex items-center gap-1.5 text-ink-3">
            <Clock3 size={12} aria-hidden /> Weekly grading
          </div>
          <div className="mt-1 text-[0.95rem] font-medium">
            <span className="text-ink-3 line-through">3 hours</span> → 3 min
          </div>
        </m.div>
      </m.div>

      {/* result: many inboxes, one board */}
      <m.div {...pop(0.7)} className="absolute bottom-[14%] right-[-6%] sm:right-[-14%]">
        <m.div {...float(1.2, 10, 6)} className="glass w-[160px] rounded-2xl px-3 py-2.5 text-[0.75rem] sm:w-[180px]">
          <div className="flex items-center gap-1.5 text-ink-2">
            {["whatsapp", "gmail", "slack", "discord"].map((a) => (
              <AppLogo key={a} app={a} size={12} />
            ))}
            <span className="ml-0.5 whitespace-nowrap text-ink-3">→ one list</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="lg-ok flex size-4 items-center justify-center rounded-full">
              <Check size={10} strokeWidth={3} />
            </span>
            <span className="font-medium">Nothing slips through</span>
          </div>
        </m.div>
      </m.div>

      {/* stack */}
      <m.div {...pop(0.95)} className="absolute bottom-[-2%] left-[2%]">
        <m.span {...float(0.3, 7, 4.8)} className="lg-sm flex items-center gap-2 rounded-full px-3 py-1.5">
          <SiPython size={13} aria-hidden />
          <SiTypescript size={13} aria-hidden />
          <SiGo size={18} aria-hidden />
        </m.span>
      </m.div>

    </div>
  );
}
