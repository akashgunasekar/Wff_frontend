import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeHtml(html: string | null | undefined): string {
  if (!html) return "";
  let str = html;
  let prev = "";
  let count = 0;
  while (str !== prev && count < 5) {
    prev = str;
    str = str
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/gi, "'")
      .replace(/&#39;/gi, "'")
      .replace(/&nbsp;/gi, " ");
    count++;
  }
  return str;
}
export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    
    // Check if already loaded
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function formatEventDateRange(
  startDateStr: string,
  endDateStr?: string | null,
  dateType?: 'single' | 'multi' | string
): string {
  if (!startDateStr) return '';
  const s = new Date(startDateStr);
  if (isNaN(s.getTime())) return startDateStr;

  const isMulti = (dateType === 'multi' || !!endDateStr) && !!endDateStr && endDateStr !== startDateStr;
  if (!isMulti || !endDateStr) {
    return s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const e = new Date(endDateStr);
  if (isNaN(e.getTime())) {
    return s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    const startDay = s.toLocaleDateString('en-IN', { day: 'numeric' });
    const endFormatted = e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startDay} – ${endFormatted}`;
  }

  if (sameYear) {
    const startPart = s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const endPart = e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startPart} – ${endPart}`;
  }

  return `${s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} – ${e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

export function getEventDateParts(
  startDateStr: string,
  endDateStr?: string | null,
  dateType?: 'single' | 'multi' | string
): { dayText: string; monthYearText: string; isMulti: boolean } {
  if (!startDateStr) return { dayText: '', monthYearText: '', isMulti: false };
  const s = new Date(startDateStr);
  if (isNaN(s.getTime())) return { dayText: startDateStr, monthYearText: '', isMulti: false };

  const isMulti = (dateType === 'multi' || !!endDateStr) && !!endDateStr && endDateStr !== startDateStr;
  if (!isMulti || !endDateStr) {
    return {
      dayText: s.toLocaleDateString('en-IN', { day: 'numeric' }),
      monthYearText: s.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      isMulti: false,
    };
  }

  const e = new Date(endDateStr);
  if (isNaN(e.getTime())) {
    return {
      dayText: s.toLocaleDateString('en-IN', { day: 'numeric' }),
      monthYearText: s.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      isMulti: false,
    };
  }

  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();

  if (sameMonth) {
    return {
      dayText: `${s.toLocaleDateString('en-IN', { day: 'numeric' })}–${e.toLocaleDateString('en-IN', { day: 'numeric' })}`,
      monthYearText: s.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      isMulti: true,
    };
  }

  return {
    dayText: `${s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
    monthYearText: `${s.getFullYear()}`,
    isMulti: true,
  };
}
