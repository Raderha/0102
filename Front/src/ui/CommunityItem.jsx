import React, { useState } from 'react';

export default function CommunityItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <article style={styles.card}>
      <div style={styles.row} onClick={() => setOpen(!open)}>
        <strong style={styles.question}>{item.question}</strong>
        <span style={styles.arrow}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={styles.detail}>
          <p><strong>Score:</strong> {item.score}</p>
          <p><strong>Answer:</strong> {item.answerText}</p>
        </div>
      )}
    </article>
  );
}

const styles = {
  card: {
    padding: 18,
    borderRadius: 14,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    fontSize: 16,
    fontWeight: 700,
  },
  arrow: {
    fontSize: 14,
    opacity: 0.7,
  },
  detail: {
    marginTop: 14,
    color: '#475467',
    lineHeight: '1.5',
  },
};