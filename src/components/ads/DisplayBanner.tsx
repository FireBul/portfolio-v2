import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, MousePointerClick, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSdkState, SEGMENT_MESSAGES, type UserSegment } from '../../data/adSdk';
import { runAuction, trackAdEvent, type AuctionResult } from '../../data/adEngine';
import { PROJECTS } from '../../constants';

export function DisplayBanner() {
  const [auction, setAuction] = useState<AuctionResult | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sdk = getSdkState();
    const segment: UserSegment = sdk.userProfile?.segment || 'casual';
    const result = runAuction('home_banner', 'display', undefined, segment);
    setAuction(result);
  }, []);

  if (dismissed || !auction || !auction.winnerId) return null;

  const project = PROJECTS.find((p) => p.id === auction.winnerProjectId);
  if (!project) return null;

  const sdk = getSdkState();
  const segment: UserSegment = sdk.userProfile?.segment || 'casual';
  const message = SEGMENT_MESSAGES[segment];

  const handleClick = () => {
    trackAdEvent('click', auction.winnerId!, 'home_banner');
    navigate(project.link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative mx-auto max-w-4xl my-6"
      >
        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent backdrop-blur-sm">
          {/* Sponsored label */}
          <div className="absolute top-2 left-3 flex items-center gap-1 text-[10px] font-mono text-amber-500/70 uppercase tracking-wider">
            <Monitor className="w-3 h-3" />
            Sponsored · Display Ad
          </div>

          {/* Close button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 p-1 text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Content */}
          <button
            onClick={handleClick}
            className="w-full text-left px-4 pt-8 pb-4 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 group-hover:text-amber-400 transition-colors truncate">
                  {project.title}
                </p>
                <p className="text-xs text-white/50 mt-1 line-clamp-1">{message}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500/60 shrink-0">
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>자세히 보기</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex gap-4 mt-3">
              {project.metrics.slice(0, 3).map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-mono text-amber-400">{m.value}</p>
                  <p className="text-[10px] text-white/40">{m.label}</p>
                </div>
              ))}
            </div>
          </button>

          {/* Bid info bar */}
          <div className="border-t border-white/5 px-4 py-1.5 flex items-center gap-3 text-[10px] font-mono text-white/25">
            <span>CPC ₩{auction.secondPrice}</span>
            <span>·</span>
            <span>QS {auction.participants[0]?.qualityScore.toFixed(1)}</span>
            <span>·</span>
            <span>입찰 {auction.participants.length}건</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
