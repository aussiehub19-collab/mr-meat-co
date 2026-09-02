'use client';

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QtyStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  className?: string;
  /**
   * When true (default), the minus button at quantity 1 becomes a trash
   * affordance and decrementing removes the line — used for a stepper bound
   * to a cart line. Set false for a pre-add quantity picker, where 1 is the
   * floor and the minus is simply disabled.
   */
  allowRemove?: boolean;
}

export function QtyStepper({
  quantity,
  onIncrement,
  onDecrement,
  size = 'md',
  className = '',
  allowRemove = true,
}: QtyStepperProps) {
  const btn = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const icon = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  const atFloor = quantity <= 1;
  const showTrash = allowRemove && atFloor;
  const minusDisabled = !allowRemove && atFloor;

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-red-400/30 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#991B1B] text-white shadow-md shadow-red-950/50 ${className}`}
    >
      <button
        type="button"
        disabled={minusDisabled}
        aria-label={showTrash ? 'Remove from cart' : 'Decrease quantity'}
        onClick={stop(onDecrement)}
        className={`${btn} flex items-center justify-center rounded-l-xl transition-colors ${
          minusDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black/20'
        }`}
      >
        {showTrash ? <Trash2 className={icon} /> : <Minus className={icon} />}
      </button>
      <span className="min-w-[2.5ch] text-center text-sm font-black tabular-nums select-none">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={stop(onIncrement)}
        className={`${btn} flex items-center justify-center rounded-r-xl hover:bg-black/20 transition-colors`}
      >
        <Plus className={icon} />
      </button>
    </div>
  );
}
