import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MousePointer2, BrainCircuit } from 'lucide-react';
import { triggerMessage } from './InAppMessages';

export const AnalyticsGimmick: React.FC = () => {
  const [clicks, setClicks] = useState(0);
  const location = useLocation();
  const [prediction, setPrediction] = useState({ target: '', prob: 0 });

  // 1. Initial Load Message
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerMessage('실시간 유저 행동 분석 모듈이 활성화되었습니다. 당신의 탐색 패턴을 분석합니다.', 'analytics');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Click Tracker & Milestones
  useEffect(() => {
    const handleClick = () => {
      setClicks((prev) => {
        const newCount = prev + 1;
        
        // Trigger messages on certain milestones
        if (newCount === 5) {
          triggerMessage(`벌써 ${newCount}번 클릭하셨네요! 제 포트폴리오를 꼼꼼히 봐주셔서 감사합니다.`, 'info');
        } else if (newCount === 15) {
          triggerMessage(`클릭 수 ${newCount}회 돌파! 이 정도면 저와 커피챗을 하실 확률이 85% 이상입니다.`, 'prediction');
        } else if (newCount === 30) {
          triggerMessage(`클릭 수 ${newCount}회! 데이터 분석 결과, 당신은 최고의 채용 담당자입니다.`, 'analytics');
        }
        
        return newCount;
      });
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 3. Route-based Prediction Logic
  useEffect(() => {
    let target = '';
    let prob = 0;
    let message = '';

    if (location.pathname === '/') {
      target = 'Projects 메뉴';
      prob = 87;
      message = '데이터 분석 엔진 가동: 다음으로 Projects 페이지를 방문할 확률이 높습니다.';
    } else if (location.pathname === '/about') {
      target = 'Contact 메뉴';
      prob = 92;
      message = '행동 패턴 분석: 제 소개를 읽으셨으니, 다음은 Contact 페이지로 이동하실 확률이 92%입니다.';
    } else if (location.pathname === '/projects') {
      target = '프로젝트 상세 보기';
      prob = 76;
      message = '유저 로그 분석: 특정 프로젝트를 클릭하여 상세 내용을 확인할 확률이 76%입니다.';
    } else if (location.pathname === '/contact') {
      target = '메시지 전송';
      prob = 99;
      message = '전환율 예측: 지금 바로 메시지를 보내실 확률 99%! 기다리고 있겠습니다.';
    } else {
      target = 'Home 메뉴';
      prob = 64;
    }

    setPrediction({ target, prob });

    // Show prediction message after a short delay when entering a new page (except initial load)
    if (message && clicks > 0) {
      const timer = setTimeout(() => {
        triggerMessage(message, 'prediction');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, clicks]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 left-6 z-40 flex-col gap-3 pointer-events-none hidden md:flex"
    >
      {/* Click Counter Widget */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-lg flex items-center gap-3 w-64">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
          <MousePointer2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">Total Clicks</div>
          <div className="text-white font-mono font-bold text-lg leading-none">{clicks}</div>
        </div>
      </div>

      {/* Prediction Engine Widget */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-lg flex items-center gap-3 w-64">
        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
          <BrainCircuit className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">Next Action Prediction</div>
          <div className="text-white text-sm font-medium leading-tight">
            {prediction.target} <span className="text-amber-400 font-mono text-xs ml-1">({prediction.prob}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
