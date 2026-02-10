import type { ApprovalCard } from '../types';
import './ApprovalDetailModal.css';

interface ApprovalDetailModalProps {
  card: ApprovalCard;
  feedback: string;
  onFeedbackChange: (value: string) => void;
  onAction: (cardId: string, action: 'approve' | 'reject' | 'human_review') => void;
  onClose: () => void;
}

/**
 * Expanded decision view: context summary, metrics, stakeholders, confidence, timeline, action buttons.
 * Human review flow: user can type feedback and submit.
 */
export function ApprovalDetailModal({
  card,
  feedback,
  onFeedbackChange,
  onAction,
  onClose,
}: ApprovalDetailModalProps) {
  const priorityClass = `approval-detail-priority--${card.priority}`;

  return (
    <div className="approval-detail-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="approval-detail-backdrop" onClick={onClose} aria-hidden />
      <div className="approval-detail-modal">
        <button type="button" className="approval-detail-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <header className="approval-detail-header">
          <span className={`approval-detail-priority ${priorityClass}`}>{card.priority}</span>
          <h2 id="detail-title" className="approval-detail-title">{card.title}</h2>
        </header>
        <div className="approval-detail-body">
          {card.contextSummary && (
            <section>
              <h3 className="approval-detail-section-title">Context</h3>
              <p className="approval-detail-text">{card.contextSummary}</p>
            </section>
          )}
          {card.metrics && Object.keys(card.metrics).length > 0 && (
            <section>
              <h3 className="approval-detail-section-title">Metrics</h3>
              <ul className="approval-detail-list">
                {Object.entries(card.metrics).map(([k, v]) => (
                  <li key={k}><strong>{k}:</strong> {v}</li>
                ))}
              </ul>
            </section>
          )}
          {card.stakeholders && card.stakeholders.length > 0 && (
            <section>
              <h3 className="approval-detail-section-title">Stakeholders</h3>
              <p className="approval-detail-text">{card.stakeholders.join(', ')}</p>
            </section>
          )}
          {card.confidence != null && (
            <section>
              <h3 className="approval-detail-section-title">Confidence</h3>
              <p className="approval-detail-text">{card.confidence}%</p>
            </section>
          )}
          {card.timeline && (
            <section>
              <h3 className="approval-detail-section-title">Timeline</h3>
              <p className="approval-detail-text">{card.timeline}</p>
            </section>
          )}
          <section>
            <h3 className="approval-detail-section-title">Human review feedback (optional)</h3>
            <textarea
              className="approval-detail-feedback"
              placeholder="Add notes for human review..."
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              rows={3}
              aria-label="Feedback for human review"
            />
          </section>
        </div>
        <footer className="approval-detail-actions">
          <button
            type="button"
            className="approval-detail-btn approval-detail-btn--reject"
            onClick={() => onAction(card.id, 'reject')}
          >
            Reject
          </button>
          <button
            type="button"
            className="approval-detail-btn approval-detail-btn--review"
            onClick={() => onAction(card.id, 'human_review')}
          >
            Mark for review
          </button>
          <button
            type="button"
            className="approval-detail-btn approval-detail-btn--approve"
            onClick={() => onAction(card.id, 'approve')}
          >
            Approve
          </button>
        </footer>
      </div>
    </div>
  );
}
