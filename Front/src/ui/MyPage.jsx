import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './MyPage.css';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MyPageComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);  
  const userId = localStorage.getItem("user_id");  
  // 백엔드 API URL (환경 변수에서 가져오기)
  // 개발 환경에서는 프록시를 사용하므로 빈 문자열, 프로덕션에서는 전체 URL 사용
  const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://jobready-backend-282796839955.asia-northeast3.run.app');


  const encouragementMessages = [
    "잘 하고 계세요! 지금처럼 훌륭하게 계속해 주세요!",
    "아무리 작은 것이라도, 앞으로 나아가는 모든 발걸음이 발전입니다.",
    "자신과 당신의 모든 것을 믿으세요. 당신은 해낼 수 있습니다!",
    "성공은 끝이 아니며, 실패는 치명적이지 않습니다. 중요한 것은 계속하려는 용기입니다.",
    "위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것입니다.",
    "당신의 노력과 헌신은 분명히 성과를 낼 것입니다.",
    "시계를 쳐다보지 마세요. 시계처럼 움직이세요. 계속 나아가세요.",
    "미래는 자신의 꿈의 아름다움을 믿는 사람들의 것입니다.",
    "당신은 놀라운 일들을 해낼 능력이 있습니다!",
    "집중력을 유지하고 꿈을 포기하지 마세요."
  ];

  useEffect(() => {
    // 페이지 로드 시 랜덤 격려 문구 설정
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
    setEncouragementMessage(encouragementMessages[randomIndex]);
  }, []); 

  useEffect(() => {
    if (!userId) {
      console.warn("사용자 ID가 없습니다.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${userId}/stats`);
        setUserInfo(res.data);
      } catch (error) {
        console.error("마이페이지 로딩 실패:", error);
        // 에러 발생 시 빈 데이터로 초기화하여 UI가 깨지지 않도록
        setUserInfo({
          total_questions: 0,
          total_score: 0,
          submitted_reports: 0,
          job_field: '',
          recent_scores: []
        });
      }
    };

    fetchUserData();
  }, [userId, API_BASE_URL]);


  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const today = new Date(); // 오늘 날짜를 위한 Date 객체

  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);

  let calendarDays = [];
  const startDay = startDate.getDay();
  const endDay = endDate.getDate();

  // 이전달 빈 칸
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ date: "", isCurrentMonth: false, isToday: false });
  }

  // 이번달 날짜
  for (let i = 1; i <= endDay; i++) {
    const isToday =
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth() &&
      i === today.getDate();
    calendarDays.push({ date: i, isCurrentMonth: true, isToday: isToday });
  }

  // 다음달 빈 칸
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push({ date: "", isCurrentMonth: false, isToday: false });
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Chart.js 데이터 준비 (Hook은 항상 같은 순서로 호출되어야 하므로 early return 전에 위치)
  const chartData = useMemo(() => {
    if (!userInfo || !userInfo.recent_scores || userInfo.recent_scores.length === 0) {
      return null;
    }

    const labels = userInfo.recent_scores.map(rs => {
      const date = new Date(rs.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    // 점수를 0~5 범위로 클리핑 (5점 만점이므로)
    const scores = userInfo.recent_scores.map(rs => Math.max(0, Math.min(5, rs.score)));
    const questions = userInfo.recent_scores.map(rs => rs.question);

    return {
      labels,
      datasets: [
        {
          label: '면접 점수',
          data: scores,
          borderColor: '#5b5ce2',
          backgroundColor: 'rgba(91, 92, 226, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0, // 직선으로 표시
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#5b5ce2',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#5b5ce2',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3,
          clip: { left: 5, top: 5, right: 5, bottom: 5 } // 차트 영역 밖으로 나가는 부분 제거
        }
      ],
      questions // tooltip에서 사용하기 위해 저장
    };
  }, [userInfo?.recent_scores]);

  if (!userInfo) return <div>Loading...</div>;

  // 평균 점수 계산 (총 점수 / 총 질문 수)
  const averageScore = userInfo.total_questions > 0 
    ? Math.round(userInfo.total_score / userInfo.total_questions) 
    : 0;

  // Chart.js 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: (tooltipItems) => {
            return `날짜: ${tooltipItems[0].label}`;
          },
          label: (context) => {
            const index = context.dataIndex;
            const question = chartData?.questions[index] || '';
            return [
              `점수: ${context.parsed.y}점`,
              question ? `질문: ${question}` : ''
            ].filter(Boolean);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: -0.2, // 하단 여유 공간
        max: 5.2, // 상단 여유 공간 (5점이 끝에 걸리지 않도록)
        offset: true, // Y축에 여유 공간 추가
        ticks: {
          stepSize: 1,
          max: 5, // 라벨은 5까지만 표시
          min: 0, // 라벨은 0부터 표시
          callback: function(value) {
            // 0~5 범위의 정수만 표시
            if (value >= 0 && value <= 5 && Number.isInteger(value)) {
              return value;
            }
            return '';
          },
          font: {
            size: 11,
            color: '#525f7a'
          },
          color: '#525f7a',
          padding: 10 // 틱 라벨에 패딩 추가
        },
        grid: {
          color: '#e5e7ef',
          lineWidth: 1,
          drawBorder: false,
          drawOnChartArea: true
        }
      },
      x: {
        ticks: {
          font: {
            size: 11,
            color: '#525f7a'
          },
          color: '#525f7a'
        },
        grid: {
          display: false
        }
      }
    }
  };

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
            <div className="mypage-kpi-number">{userInfo.total_questions}</div> 
            <div className="mypage-kpi-label">총 답변한 질문 수</div>
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
            <div className="mypage-kpi-number">{averageScore}</div>
            <div className="mypage-kpi-label">평균 점수</div>
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
            <div className="mypage-kpi-number">{userInfo.submitted_reports}</div>
            <div className="mypage-kpi-label">제출한 이력서 수</div>
          </div>
        </div>

        <div className="mypage-kpi-card mypage-kpi-card-event">
          <div className="mypage-kpi-content">
            <div className="mypage-event-title">{userInfo.job_field || '직종 미선택'}</div>
            <div className="mypage-event-subtitle">직종</div>
          </div>
          <div className="mypage-event-circle"></div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mypage-charts-grid">
        {/* Visitor Statistics (첫 번째 카드 그대로) */}
        <div className="mypage-chart-card">
            <div className="mypage-chart-header">
            <h3 className="mypage-chart-title">최근 면접 점수</h3>
            <div className="mypage-chart-date">최근 5개 면접</div>
          </div>

          <div className="mypage-line-chart" style={{ height: '300px', position: 'relative' }}>
            {chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                아직 면접 기록이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="mypage-chart-card">
          <div className="mypage-chart-header">
            <h3 className="mypage-chart-title">Interview Calendar</h3>
          </div>
          <div className="calendar-container">
            <div className="calendar-header">
              <button onClick={prevMonth}>&lt;</button>
              <div>{currentYear}년 {currentMonth + 1}월</div>
              <button onClick={nextMonth}>&gt;</button>
            </div>

            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="calendar-day-header">{d}</div>
              ))}

              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day.isCurrentMonth ? "" : "other-month"} ${day.isToday ? "today" : ""}`}
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 격려 문구 카드: 문구만 남기고 정리됨 */}
      <div className="mypage-task-card">
        <div className="mypage-task-content">
          <h3 className="mypage-task-title">{encouragementMessage}</h3> 
        </div>
        {/* 숨겨진 요소: .mypage-task-due, .mypage-task-participant, .mypage-task-actions는 CSS로 제어됨 */}
      </div>
    </div>
  );
}