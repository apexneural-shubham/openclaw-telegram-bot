import { useState, useCallback, useRef, useEffect } from 'react';
import type { ApprovalCard, GestureSettings, SwipeAction } from '../types';
import './ApprovalCardStack.css';

interface Counter {
  current: number;
  total: number;
}

interface ApprovalCardStackProps {
  cards: ApprovalCard[];
  gestureSettings: GestureSettings;
  counter: Counter;
  onSwipe: (cardId: string, action: SwipeAction) => void;
  onTap: (card: ApprovalCard) => void;
}

const SWIPE_THRESHOLD = 80;
const SWIPE_VERTICAL_THRESHOLD = 60;

export function ApprovalCardStack({
  cards,
  gestureSettings,
  counter,
  onSwipe,
  onTap,
}: ApprovalCardStackProps) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  const topCard = cards[0];
  if (!topCard) return null;

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startRef.current = { x: clientX, y: clientY };
      dragRef.current = { x: 0, y: 0 };
      setIsDragging(true);
      setDrag({ x: 0, y: 0 });
    },
    []
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - startRef.current.x;
      const y = clientY - startRef.current.y;
      dragRef.current = { x, y };
      setDrag({ x, y });
    },
    []
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const { x, y } = dragRef.current;

    if (Math.abs(y) > SWIPE_VERTICAL_THRESHOLD && Math.abs(y) >= Math.abs(x)) {
      const action: SwipeAction = y < 0 ? gestureSettings.swipeUp : gestureSettings.swipeDown;
      onSwipe(topCard.id, action);
      setDrag({ x: 0, y: 0 });
      return;
    }

    if (Math.abs(x) > SWIPE_THRESHOLD) {
      const action: SwipeAction = x > 0 ? gestureSettings.swipeRight : gestureSettings.swipeLeft;
      onSwipe(topCard.id, action);
    }
    setDrag({ x: 0, y: 0 });
  }, [isDragging, topCard.id, gestureSettings, onSwipe]);

  // On laptop: track mouse globally so drag still works when cursor leaves the card
  useEffect(() => {
    if (!isDragging) return;
    const onDocMove = (e: MouseEvent) => handleMove(e as unknown as React.MouseEvent);
    const onDocUp = () => handleEnd();
    document.addEventListener('mousemove', onDocMove);
    document.addEventListener('mouseup', onDocUp);
    return () => {
      document.removeEventListener('mousemove', onDocMove);
      document.removeEventListener('mouseup', onDocUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handleClick = useCallback(
    (_e: React.MouseEvent) => {
      if (Math.abs(drag.x) < 5 && Math.abs(drag.y) < 5) onTap(topCard);
    },
    [drag, topCard, onTap]
  );

  const priorityClass = `approval-card-priority--${topCard.priority}`;

  return (
    <div className="approval-stack">
      {/* Back card (peek) */}
      {cards.length > 1 && (
        <div className="approval-card approval-card-back" aria-hidden>
          <span className="approval-card-title">{cards[1].title}</span>
        </div>
      )}
      <div
        className="approval-card approval-card-top"
        style={{
          transform: `translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.03}deg)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseLeave={handleEnd}
        onMouseUp={handleEnd}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Approval ${counter.current} of ${counter.total}: ${topCard.title}. Swipe or tap for details.`}
      >
        <span className={`approval-card-priority-tag ${priorityClass}`}>{topCard.priority}</span>
        <h2 className="approval-card-title">{topCard.title}</h2>
        <p className="approval-card-context">{topCard.context}</p>
        <p className="approval-card-counter">
          {counter.current} of {counter.total}
        </p>
      </div>
    </div>
  );
}
