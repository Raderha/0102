import React from 'react';
import CommunityItem from './CommunityItem.jsx';

export default function CommunityList({ data, selectedJob }) {
  const filteredData = selectedJob
    ? data.filter(d => d.job_field === selectedJob)
    : data;

  return (
    <div style={{ marginTop: 20 }}>
      {filteredData.length === 0 && (
        <div style={{ padding: 20, color: "#777" }}>
          등록된 게시글이 없습니다.
        </div>
      )}

      {filteredData.map(post => (
        <div
          key={post.post_id}
          style={{
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <h3 style={{ marginBottom: 6 }}>{post.question}</h3>

          <div style={{ fontSize: 14, color: "#666" }}>
            작성자: {post.writer_name || "익명"}
          </div>

          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            직종: {post.job_field}
          </div>

          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            조회수: {post.views}
          </div>

          <p style={{ marginTop: 10 }}>{post.answer}</p>
        </div>
      ))}
    </div>
  );
}