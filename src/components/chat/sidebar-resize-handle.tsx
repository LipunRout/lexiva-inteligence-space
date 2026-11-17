'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';

export const DEFAULT_SIDEBAR_WIDTH = 288;
export const MIN_SIDEBAR_WIDTH = 220;
export const MAX_SIDEBAR_WIDTH = 420;

interface Props {
  width: number;
  onWidthChange: (width: number) => void;
  onResizingChange: (resizing: boolean) => void;
}

function clampWidth(width: number) {
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width));
}

export function SidebarResizeHandle({ width, onWidthChange, onResizingChange }: Props) {
  const [dragging, setDragging] = useState(false);

  function startResize(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    onResizingChange(true);
  }

  function resize(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    onWidthChange(clampWidth(event.clientX - 4));
  }

  function stopResize(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    onResizingChange(false);
  }

  function adjustWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const change = event.shiftKey ? 40 : 16;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onWidthChange(clampWidth(width - change));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onWidthChange(clampWidth(width + change));
    } else if (event.key === 'Home') {
      event.preventDefault();
      onWidthChange(MIN_SIDEBAR_WIDTH);
    } else if (event.key === 'End') {
      event.preventDefault();
      onWidthChange(MAX_SIDEBAR_WIDTH);
    }
  }

  return (
    <div
      role="separator"
      aria-label="Resize sidebar"
      aria-orientation="vertical"
      aria-controls="conversation-sidebar workspace-panel"
      aria-valuemin={MIN_SIDEBAR_WIDTH}
      aria-valuemax={MAX_SIDEBAR_WIDTH}
      aria-valuenow={Math.round(width)}
      aria-valuetext={`${Math.round(width)} pixels`}
      tabIndex={0}
      onPointerDown={startResize}
      onPointerMove={resize}
      onPointerUp={stopResize}
      onPointerCancel={stopResize}
      onKeyDown={adjustWithKeyboard}
      className={`group hidden w-2 shrink-0 cursor-col-resize touch-none items-center justify-center outline-none lg:flex ${
        dragging ? 'bg-[#c5b9ff]/10' : 'hover:bg-white/[0.04] focus-visible:bg-white/[0.06]'
      }`}
    >
      <span className={`h-12 w-[3px] rounded-full transition-colors ${
        dragging ? 'bg-[#c5b9ff]' : 'bg-white/15 group-hover:bg-white/45 group-focus-visible:bg-white/55'
      }`} />
    </div>
  );
}
