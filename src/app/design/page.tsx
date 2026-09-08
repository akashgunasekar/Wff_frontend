"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DesignShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container className="py-20">
      <SectionHeader 
        title="Premium Design System"
        subtitle="The royal and athletic federation standard for WFF Tamil Nadu."
        eyebrow="Internal Showcase"
      />

      {/* Typography */}
      <section className="mb-16">
        <h3 className="font-heading text-2xl mb-6 text-wff-gold border-b border-wff-border pb-2">1. Typography Hierarchy</h3>
        <div className="space-y-6">
          <div>
            <div className="text-xs text-wff-muted mb-1 font-mono">Display / Oswald / Uppercase</div>
            <h1 className="font-heading text-6xl md:text-8xl uppercase tracking-wide">WFF Championship</h1>
          </div>
          <div>
            <div className="text-xs text-wff-muted mb-1 font-mono">H1 / Oswald / Uppercase</div>
            <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-wide">National Qualifications</h1>
          </div>
          <div>
            <div className="text-xs text-wff-muted mb-1 font-mono">H2 / Oswald / Uppercase</div>
            <h2 className="font-heading text-3xl uppercase tracking-wide">Premium Athlete Care</h2>
          </div>
          <div>
            <div className="text-xs text-wff-muted mb-1 font-mono">H3 / Oswald / Uppercase</div>
            <h3 className="font-heading text-xl uppercase tracking-wide">Professional Platform</h3>
          </div>
          <div>
            <div className="text-xs text-wff-muted mb-1 font-mono">Body / Inter / Regular</div>
            <p className="text-wff-text-body text-base max-w-2xl leading-relaxed">
              Our federation is dedicated to providing the most premium, transparent, and rewarding platform for natural bodybuilding athletes across Tamil Nadu. Evaluated by WFF India certified officials ensuring 100% transparency and standard scoring.
            </p>
          </div>
        </div>
      </section>

      {/* Buttons & Badges */}
      <section className="mb-16">
        <h3 className="font-heading text-2xl mb-6 text-wff-gold border-b border-wff-border pb-2">2. Buttons & Badges</h3>
        <div className="flex flex-wrap gap-6 items-center mb-8">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="gold">Register Now</Button>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <Badge variant="navy">Official</Badge>
          <Badge variant="gold">Premium</Badge>
          <Badge variant="outline">Upcoming</Badge>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-16">
        <h3 className="font-heading text-2xl mb-6 text-wff-gold border-b border-wff-border pb-2">3. Surfaces & Cards</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-wff-bg flex items-center justify-center mb-4 border border-wff-border">
              <span className="text-wff-gold font-bold">1</span>
            </div>
            <h4 className="font-heading text-xl uppercase mb-3">Athletic Excellence</h4>
            <p className="text-wff-muted text-sm">Cards feature a premium white or dark surface with subtle borders and elegant hover states.</p>
          </Card>
          <Card className="p-8 flex flex-col items-center text-center border-wff-gold shadow-[0_4px_20px_rgba(198,161,91,0.1)]">
            <Badge variant="gold" className="mb-4">Featured</Badge>
            <h4 className="font-heading text-xl uppercase mb-3">Gold Accent Card</h4>
            <p className="text-wff-muted text-sm">Can be used to highlight premium events or championship categories.</p>
          </Card>
          <Card className="p-8 bg-wff-navy text-white border-wff-deep-navy">
            <h4 className="font-heading text-xl uppercase mb-3 text-white">Inverted Surface</h4>
            <p className="text-slate-300 text-sm mb-6">Deep navy backgrounds provide striking contrast for high-impact content.</p>
            <Button variant="gold" size="sm" className="w-full">Explore</Button>
          </Card>
        </div>
      </section>

      {/* Form Elements */}
      <section className="mb-16">
        <h3 className="font-heading text-2xl mb-6 text-wff-gold border-b border-wff-border pb-2">4. Forms & Inputs</h3>
        <Card className="p-8 max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-wff-text-primary uppercase tracking-wider mb-2">Athlete Name</label>
              <Input placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-wff-text-primary uppercase tracking-wider mb-2">Category</label>
              <Select>
                <option>Men's Physique</option>
                <option>Classic Bodybuilding</option>
                <option>Bikini Model</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-wff-text-primary uppercase tracking-wider mb-2">Bio / Achievements</label>
              <Textarea placeholder="Tell us about your fitness journey..." />
            </div>
          </div>
        </Card>
      </section>

      {/* Utilities */}
      <section className="mb-16">
        <h3 className="font-heading text-2xl mb-6 text-wff-gold border-b border-wff-border pb-2">5. Utilities (Modal & Skeleton)</h3>
        <div className="flex gap-6 items-start">
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Open Test Modal</Button>
          
          <div className="w-64 space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Federation Rules">
        <div className="space-y-4 text-wff-text-body">
          <p>This is a demonstration of the premium modal component. It uses a deep navy backdrop blur to maintain the premium feel while keeping focus on the content.</p>
          <div className="p-4 bg-wff-bg rounded-lg border border-wff-border">
            <p className="text-sm font-semibold">Rule 1.1</p>
            <p className="text-sm text-wff-muted mt-1">All athletes must comply with the WFF natural standard testing protocols.</p>
          </div>
          <Button variant="primary" className="w-full mt-4" onClick={() => setIsModalOpen(false)}>Acknowledge</Button>
        </div>
      </Modal>

    </Container>
  );
}
