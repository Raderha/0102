import React from 'react';
import './MyPage.css';

export default function MyPageComponent() {
  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h1 className="mypage-title">Dashboard</h1>
      </div>

      {/* KPI Cards Section */}
      <div className="mypage-kpi-grid">
        <div className="mypage-kpi-card mypage-kpi-card-pink">
          <div className="mypage-kpi-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="mypage-kpi-content">
            <div className="mypage-kpi-number">1259</div>
            <div className="mypage-kpi-label">Total Employees</div>
          </div>
        </div>

        <div className="mypage-kpi-card mypage-kpi-card-yellow">
          <div className="mypage-kpi-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="#5b5ce2" strokeWidth="2"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#5b5ce2" strokeWidth="2"/>
            </svg>
          </div>
          <div className="mypage-kpi-content">
            <div className="mypage-kpi-number">23</div>
            <div className="mypage-kpi-label">Job Opening</div>
          </div>
        </div>

        <div className="mypage-kpi-card mypage-kpi-card-green">
          <div className="mypage-kpi-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11V21" stroke="#5b5ce2" strokeWidth="2" strokeLinecap="round"/>
              <rect x="6" y="19" width="12" height="2" rx="1" fill="#5b5ce2"/>
            </svg>
          </div>
          <div className="mypage-kpi-content">
            <div className="mypage-kpi-number">123</div>
            <div className="mypage-kpi-label">New Applicant</div>
          </div>
        </div>

        <div className="mypage-kpi-card mypage-kpi-card-event">
          <div className="mypage-kpi-content">
            <div className="mypage-event-title">Upcoming Company Event</div>
            <div className="mypage-event-subtitle">Watch a thriller</div>
          </div>
          <div className="mypage-event-circle"></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mypage-charts-grid">
        {/* Visitor Statistics */}
        <div className="mypage-chart-card">
          <div className="mypage-chart-header">
            <h3 className="mypage-chart-title">Visitor statistics</h3>
            <div className="mypage-chart-date">Nov - July</div>
          </div>
          <div className="mypage-line-chart">
            <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7ef" strokeWidth="1"/>
              <line x1="40" y1="180" x2="360" y2="180" stroke="#e5e7ef" strokeWidth="1"/>
              
              {/* Y-axis labels */}
              <text x="35" y="185" fontSize="10" fill="#525f7a" textAnchor="end">0</text>
              <text x="35" y="145" fontSize="10" fill="#525f7a" textAnchor="end">25</text>
              <text x="35" y="105" fontSize="10" fill="#525f7a" textAnchor="end">50</text>
              <text x="35" y="65" fontSize="10" fill="#525f7a" textAnchor="end">100</text>
              
              {/* X-axis labels */}
              <text x="80" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">Dec</text>
              <text x="120" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">Jan</text>
              <text x="160" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">Feb</text>
              <text x="200" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">Mar</text>
              <text x="240" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">Apr</text>
              <text x="280" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">May</text>
              <text x="320" y="195" fontSize="10" fill="#525f7a" textAnchor="middle">Jun</text>
              
              {/* Previous line (green) */}
              <polyline
                points="80,140 120,130 160,120 200,100 240,110 280,105 320,90"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              
              {/* Last 6 months line (blue) */}
              <polyline
                points="80,100 120,60 160,70 200,50 240,80 280,90 320,70"
                fill="none"
                stroke="#5b5ce2"
                strokeWidth="2"
              />
            </svg>
            <div className="mypage-chart-legend">
              <div className="mypage-legend-item">
                <span className="mypage-legend-dot mypage-legend-dot-blue"></span>
                <span className="mypage-legend-label">LAST 6 MONTHS</span>
                <span className="mypage-legend-value">475 273</span>
              </div>
              <div className="mypage-legend-item">
                <span className="mypage-legend-dot mypage-legend-dot-green"></span>
                <span className="mypage-legend-label">PREVIOUS</span>
                <span className="mypage-legend-value">782 396</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="mypage-chart-card">
          <div className="mypage-chart-header">
            <h3 className="mypage-chart-title">Tasks</h3>
            <div className="mypage-chart-dropdown">
              <span>Show: This month</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="mypage-donut-chart">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e5e7ef"
                strokeWidth="20"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#10b981"
                strokeWidth="20"
                strokeDasharray={`${2 * Math.PI * 80 * 0.6} ${2 * Math.PI * 80}`}
                strokeDashoffset={-2 * Math.PI * 80 * 0.25}
                transform="rotate(-90 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="20"
                strokeDasharray={`${2 * Math.PI * 80 * 0.2} ${2 * Math.PI * 80}`}
                strokeDashoffset={-2 * Math.PI * 80 * 0.45}
                transform="rotate(-90 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="20"
                strokeDasharray={`${2 * Math.PI * 80 * 0.2} ${2 * Math.PI * 80}`}
                strokeDashoffset={-2 * Math.PI * 80 * 0.65}
                transform="rotate(-90 100 100)"
              />
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="32" fontWeight="700" fill="#10b981">60%</text>
            </svg>
            <div className="mypage-donut-legend">
              <div className="mypage-legend-item">
                <span className="mypage-legend-dot mypage-legend-dot-orange"></span>
                <span className="mypage-legend-label">Active</span>
              </div>
              <div className="mypage-legend-item">
                <span className="mypage-legend-dot mypage-legend-dot-green"></span>
                <span className="mypage-legend-label">Completed</span>
              </div>
              <div className="mypage-legend-item">
                <span className="mypage-legend-dot mypage-legend-dot-red"></span>
                <span className="mypage-legend-label">Ended</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite to Office Meet-up */}
      <div className="mypage-task-card">
        <div className="mypage-task-content">
          <h3 className="mypage-task-title">Invite to office meet-up</h3>
          <div className="mypage-task-due">Due date: December 23, 2018</div>
          <div className="mypage-task-participant">
            <div className="mypage-avatar">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#e5e7ef"/>
                <path d="M16 10C17.6569 10 19 11.3431 19 13C19 14.6569 17.6569 16 16 16C14.3431 16 13 14.6569 13 13C13 11.3431 14.3431 10 16 10Z" fill="#525f7a"/>
                <path d="M16 18C18.7614 18 21 20.2386 21 23V24H11V23C11 20.2386 13.2386 18 16 18Z" fill="#525f7a"/>
              </svg>
            </div>
            <span className="mypage-participant-name">Rebecca Moore</span>
          </div>
        </div>
        <div className="mypage-task-actions">
          <button className="mypage-action-btn">Call</button>
          <div className="mypage-status-dots">
            <span className="mypage-status-dot mypage-status-dot-orange"></span>
            <span className="mypage-status-dot mypage-status-dot-green"></span>
            <span className="mypage-status-dot mypage-status-dot-white"></span>
          </div>
          <button className="mypage-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.3333 1.33333H4.66667C3.74619 1.33333 3 2.07952 3 3V13C3 13.9205 3.74619 14.6667 4.66667 14.6667H11.3333C12.2538 14.6667 13 13.9205 13 13V3C13 2.07952 12.2538 1.33333 11.3333 1.33333Z" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 4.66667H10" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 8H10" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 11.3333H8" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="mypage-icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66667 2V6" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.33333 2V6" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.33333 4L4 13.3333C4 13.6869 4.14048 14.0261 4.39052 14.2761C4.64057 14.5262 4.97971 14.6667 5.33333 14.6667H10.6667C11.0203 14.6667 11.3594 14.5262 11.6095 14.2761C11.8595 14.0261 12 13.6869 12 13.3333L12.6667 4" stroke="#525f7a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="mypage-btn-ended">Ended</button>
        </div>
      </div>
    </div>
  );
}

