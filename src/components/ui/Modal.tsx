import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wff-deep-navy/80 backdrop-blur-sm transition-opacity">
      <div 
        className={cn(
          "bg-wff-surface w-full max-w-lg rounded-2xl shadow-xl border border-wff-border overflow-hidden flex flex-col max-h-[90vh]",
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-wff-border">
          {title && <h3 className="font-heading text-xl uppercase tracking-wide">{title}</h3>}
          <button 
            onClick={onClose}
            className="text-wff-muted hover:text-wff-text-primary transition-colors rounded-full p-1 hover:bg-wff-bg"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
