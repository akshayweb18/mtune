'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * useEdgeSwipeBack
 * ─────────────────
 * Detects a horizontal swipe that starts within EDGE_ZONE px from
 * the left OR right screen edge and travels at least MIN_DISTANCE px
 * horizontally with a dominant horizontal direction, then calls router.back().
 *
 * Works like iOS / Android native back gesture.
 */
const EDGE_ZONE   = 40;   // px from edge to start the gesture
const MIN_DIST    = 80;   // min horizontal travel to trigger back
const MAX_V_RATIO = 0.75; // vertical movement must be less than 75% of horizontal

export function useEdgeSwipeBack() {
  const router = useRouter();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let fromEdge = false;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      fromEdge = startX <= EDGE_ZONE || startX >= window.innerWidth - EDGE_ZONE;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!fromEdge) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx >= MIN_DIST && absDy < absDx * MAX_V_RATIO) {
        router.back();
      }
      fromEdge = false;
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend',   onTouchEnd);
    };
  }, [router]);
}
