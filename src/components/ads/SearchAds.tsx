import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSdkState, type UserSegment } from '../../data/adSdk';
import { runAuction, trackAdEvent, type AuctionResult } from '../../data/adEngine';
import { PROJECTS } from '../../constants';

interface SearchAdsProps {
  query: string;
}

export function SearchAds({ query }: SearchAdsProps) {
  const [auction, setAuction] = useState<AuctionResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.length < 1) {
      setAuction(null);
      return;
    }
    const sdk = getSdkState();
    const segment: UserSegment = sdk.userProfile?.segment || 'casual';
    const result = runAuction('search_sponsored', 'search', query, segment);
    setAuction(result);
  }, [query]);

  if (!auction || !auction.winnerId) return null;

  const project = PROJECTS.find((p) => p.id === auction.winnerProjectId);
  if (!project) return null;

  const handleClick = () => {
    trackAdEvent('click', auction.winnerId!, 'search_sponsored');
    navigate(project.link);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-4"
      >
        <button
          onClick={handleClick}
          className="w-full text-left rounded-lg border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-3 group cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Search className="w-3 h-3 text-amber-500/50" />
            <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-wider">
              Sponsored · Search Ad
            </span>
            <span className="text-[10px] font-mono text-white/20 ml-auto">
              CPC ₩{auction.secondPrice}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/90 group-hover:text-amber-400 transition-colors truncate">
                {project.title}
              </p>
              <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{project.description}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-amber-500/60 transition-colors shrink-0 ml-3" />
          </div>

          <div className="flex gap-3 mt-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">
                {tag}
              </span>
            ))}
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
