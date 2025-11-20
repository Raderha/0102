import React from 'react';

export default function CommunityFilter({ selectedJob, onChange }) {
  const jobCategories = [
    { code: 'WD', name: 'Web Developer' },
    { code: 'DS', name: 'Data Scientist' },
    { code: 'PM', name: 'Product Manager' },
    { code: 'UX', name: 'UX Designer' },
    { code: 'SE', name: 'Sales Engineer' },
    { code: 'AC', name: 'Accountant' },
  ];

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>Filter by Job Category</label>

      <select
        value={selectedJob}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        <option value="">All</option>
        {jobCategories.map((job) => (
          <option key={job.code} value={job.code}>
            {job.name}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  wrapper: {
    margin: '20px 0 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 15,
    color: '#475467',
    fontWeight: 600,
  },
  select: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #d0d5dd',
    background: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};