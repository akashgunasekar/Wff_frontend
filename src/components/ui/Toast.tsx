"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "error" | "success" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(message: string, type: ToastType = "info", options?: { title?: string; duration?: number }) {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const newToast: ToastItem = {
      id,
      type,
      title: options?.title,
      message,
      duration: options?.duration ?? 4500,
    };

    // Keep max 4 toasts visible at once to prevent clutter
    this.toasts = [newToast, ...this.toasts.slice(0, 3)];
    this.notify();
    return id;
  }

  error(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "error", { title: options?.title || "Error", ...options });
  }

  success(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "success", { title: options?.title || "Success", ...options });
  }

  warning(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "warning", { title: options?.title || "Warning", ...options });
  }

  info(message: string, options?: { title?: string; duration?: number }) {
    return this.show(message, "info", { title: options?.title || "Notification", ...options });
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toast = new ToastManager();

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => toast.dismiss(id),
    error: (msg: string, opt?: { title?: string; duration?: number }) => toast.error(msg, opt),
    success: (msg: string, opt?: { title?: string; duration?: number }) => toast.success(msg, opt),
    warning: (msg: string, opt?: { title?: string; duration?: number }) => toast.warning(msg, opt),
    info: (msg: string, opt?: { title?: string; duration?: number }) => toast.info(msg, opt),
  };
}

interface ToastCardProps {
  toastItem: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ toastItem, onDismiss }: ToastCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const duration = toastItem.duration || 4500;

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toastItem.id);
    }, 200);
  }, [onDismiss, toastItem.id]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const config = {
    error: {
      border: "border-red-500/40 hover:border-red-500/60",
      accent: "bg-red-500",
      glow: "shadow-[0_12px_40px_rgba(239,68,68,0.22)]",
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />,
      titleColor: "text-red-400",
      progressBg: "bg-red-500",
    },
    success: {
      border: "border-emerald-500/40 hover:border-emerald-500/60",
      accent: "bg-emerald-500",
      glow: "shadow-[0_12px_40px_rgba(16,185,129,0.22)]",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      titleColor: "text-emerald-400",
      progressBg: "bg-emerald-500",
    },
    warning: {
      border: "border-amber-500/40 hover:border-amber-500/60",
      accent: "bg-amber-500",
      glow: "shadow-[0_12px_40px_rgba(245,158,11,0.22)]",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      titleColor: "text-amber-400",
      progressBg: "bg-amber-500",
    },
    info: {
      border: "border-[#C9A44A]/40 hover:border-[#C9A44A]/60",
      accent: "bg-[#C9A44A]",
      glow: "shadow-[0_12px_40px_rgba(201,164,74,0.22)]",
      icon: <Info className="w-5 h-5 text-[#C9A44A] shrink-0 mt-0.5" />,
      titleColor: "text-[#C9A44A]",
      progressBg: "bg-[#C9A44A]",
    },
  }[toastItem.type];

  return (
    <div
      role="alert"
      className={`relative group overflow-hidden w-full max-w-sm sm:max-w-md bg-[#0A101D]/95 backdrop-blur-md text-white rounded-xl border p-4 shadow-2xl transition-all duration-300 transform ${
        config.border
      } ${config.glow} ${
        isExiting
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-in slide-in-from-top-4 fade-in"
      }`}
    >
      {/* Left Accent Stripe */}
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${config.accent}`} />

      <div className="flex items-start gap-3.5 pl-2 pr-6">
        {config.icon}
        <div className="flex-1 min-w-0">
          {toastItem.title && (
            <h5
              className={`font-heading text-xs uppercase tracking-wider font-extrabold mb-0.5 ${config.titleColor}`}
            >
              {toastItem.title}
            </h5>
          )}
          <p className="text-sm font-medium text-white/90 leading-snug break-words">
            {toastItem.message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
          <div
            className={`h-full ${config.progressBg}`}
            style={{
              animation: `toastProgress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-[calc(100vw-2.5rem)] pointer-events-auto items-end"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toastItem={item} onDismiss={dismiss} />
      ))}
    </div>
  );
}
