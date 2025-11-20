import React from 'react';
import CommunityItem from './CommunityItem.jsx';

export default function CommunityList({ data, selectedJob }) {
  const filtered = selectedJob
    ? data.filter(d => d.jobCode === selectedJob)
    : data;

  return (
    <div style={styles.list}>
      {filtered.map(item => (
        <CommunityItem key={item.id} item={item} />
      ))}
    </div>
  );
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  }
};