import { useState, useCallback } from 'react';
import type { ApprovalCard, SwipeAction } from '../types';
import { ApprovalCardStack } from '../components/ApprovalCardStack';
import { ApprovalDetailModal } from '../components/ApprovalDetailModal';
import type { useGestureSettings } from '../hooks/useGestureSettings';
import './ApprovalsView.css';

/** Mock data: replace with API when backend is ready */
function mockCards(): ApprovalCard[] {
  return [
    {
      id: '1',
      title: 'Schedule team sync',
      priority: 'high',
      context: 'Calendar slot 2pm tomorrow, 5 attendees.',
      contextSummary: 'Create a recurring team sync for the product squad, 30 min, with calendar invite.',
      metrics: { 'Estimated impact': 'Saves ~2h/week', 'Recurrence': 'Weekly' },
      stakeholders: ['Engineering', 'Product'],
      confidence: 92,
      timeline: 'By EOD today',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Send summary email',
      priority: 'medium',
      context: 'Stakeholder summary for Q1 review.',
      contextSummary: 'Draft and send a one-page summary to leadership with key metrics and next steps.',
      metrics: { 'Recipients': '8', 'Deadline': 'Friday' },
      stakeholders: ['Leadership'],
      confidence: 88,
      timeline: 'Within 24h',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Create Jira epic',
      priority: 'low',
      context: 'Epic: Auth v2 migration.',
      contextSummary: 'Create epic and link existing tickets; assign to platform team.',
      metrics: { 'Tickets': '12', 'Sprint': 'Sprint 4' },
      stakeholders: ['Platform'],
      confidence: 95,
      timeline: 'This week',
      createdAt: new Date().toISOString(),
    },
  ];
}

interface ApprovalsViewProps {
  gestureSettings: ReturnType<typeof useGestureSettings>;
}

/**
 * Dedicated swipe-based decision screen.
 * One card at a time; gestures follow Settings; tap expands to detail view.
 */
export function ApprovalsView({ gestureSettings }: ApprovalsViewProps) {
  const [cards, setCards] = useState<ApprovalCard[]>(mockCards);
  const [expandedCard, setExpandedCard] = useState<ApprovalCard | null>(null);
  const [humanReviewFeedback, setHumanReviewFeedback] = useState('');
  const { settings } = gestureSettings;

  const handleSwipe = useCallback(
    (cardId: string, action: SwipeAction) => {
      if (action === 'human_review') {
        const card = cards.find((c) => c.id === cardId);
        if (card) {
          setExpandedCard(card);
          setHumanReviewFeedback('');
          // In real app: open keyboard / focus feedback field in detail view
        }
        return;
      }
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    },
    [cards]
  );

  const handleExpand = useCallback((card: ApprovalCard) => {
    setExpandedCard(card);
  }, []);

  const handleDetailAction = useCallback(
    (cardId: string, _action: 'approve' | 'reject' | 'human_review') => {
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      setExpandedCard(null);
      // In production: send _action + (for human_review) feedback to API
    },
    []
  );

  const handleCloseDetail = useCallback(() => {
    setExpandedCard(null);
    setHumanReviewFeedback('');
  }, []);

  const total = cards.length;
  const currentIndex = total > 0 ? 1 : 0;

  return (
    <div className="approvals-view">
      <header className="approvals-header">
        <h1 className="approvals-title">Approvals</h1>
        <p className="approvals-subtitle">Swipe to decide. Tap a card for details.</p>
      </header>
      <div className="approvals-stack-wrap">
        {cards.length === 0 ? (
          <div className="approvals-empty">
            <p>No pending actions.</p>
            <p className="approvals-empty-hint">New requests will appear here and in Chat.</p>
          </div>
        ) : (
          <ApprovalCardStack
            cards={cards}
            gestureSettings={settings}
            counter={{ current: currentIndex, total }}
            onSwipe={handleSwipe}
            onTap={handleExpand}
          />
        )}
      </div>
      {expandedCard && (
        <ApprovalDetailModal
          card={expandedCard}
          feedback={humanReviewFeedback}
          onFeedbackChange={setHumanReviewFeedback}
          onAction={handleDetailAction}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
