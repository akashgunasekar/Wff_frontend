import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

export function Lightbox({ isOpen, onClose, imageUrl, altText = "Image" }: LightboxProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-wff-deep-navy/95 backdrop-blur p-4 md:p-8">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-wff-gold transition-colors z-[70] p-2 bg-black/20 rounded-full"
      >
        <X size={32} />
      </button>
      <div className="relative w-full max-w-6xl max-h-full flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={altText} 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl ring-1 ring-wff-border/20"
        />
      </div>
    </div>
  );
}
