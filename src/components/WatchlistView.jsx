import React, { useState, useMemo } from 'react';
import { Bookmark, Play, Trash2, Info, Film, Tv, Calendar } from 'lucide-react';

export function WatchlistView({
  watchlistIds = [],
  allMovies = [],
  onPlayMovie,
  onOpenDetails,
  onRemoveFromWatchlist,
  onNavigateTab,
}) {
  const [filterType, setFilterType] = useState('all');

  // Filter all shows that are currently in the watchlist
  const watchlistShows = useMemo(() => {
    const items = allMovies.filter((show) => watchlistIds.includes(show.id));
    const uniqueMap = new Map();
    items.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  }, [watchlistIds, allMovies]);

  const filteredItems = useMemo(() => {
    if (filterType === 'all') return watchlistShows;
    if (filterType === 'live') {
      return watchlistShows.filter(
        (m) => m.isLive || m.duration?.toLowerCase() === 'live now' || m.category?.toLowerCase() === 'on now'
      );
    }
    return watchlistShows.filter((m) => !m.isLive);
  }, [watchlistShows, filterType]);

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 py-8 animate-in fade-in duration-300 bg-black min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Bookmark className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Watchlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            {watchlistShows.length} {watchlistShows.length === 1 ? 'title' : 'titles'} saved to watch on any device
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            All ({watchlistShows.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('shows')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              filterType === 'shows'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            Shows
          </button>
          <button
            type="button"
            onClick={() => setFilterType('live')}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              filterType === 'live'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-[#141414] text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            Live TV
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#111111] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all shadow-xl group flex flex-col justify-between"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <img
                  src={movie.backdrop || movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Live badge if live broadcast */}
                {(movie.isLive || movie.duration?.toLowerCase() === 'live now' || movie.category?.toLowerCase() === 'on now') && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>LIVE</span>
                  </span>
                )}

                {/* Duration badge */}
                <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                  {movie.duration}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base mb-1 line-clamp-1">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                    {movie.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
                    <span className="text-emerald-400 font-semibold">{movie.matchScore || 98}% Match</span>
                    <span>•</span>
                    <span>{movie.year || 2026}</span>
                    <span>•</span>
                    <span className="border border-neutral-700 px-1 rounded text-[10px] text-neutral-300">
                      {movie.rating || '13+'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => onPlayMovie && onPlayMovie(movie)}
                    className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold text-xs py-2 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenDetails && onOpenDetails(movie)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors cursor-pointer"
                    title="Details"
                    aria-label="View Details"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveFromWatchlist && onRemoveFromWatchlist(movie.id)}
                    className="p-2 bg-neutral-800 hover:bg-red-950/80 hover:text-red-400 text-neutral-400 rounded-md transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
                    title="Remove from Watchlist"
                    aria-label="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Watchlist State */
        <div className="max-w-lg mx-auto py-16 text-center text-neutral-400">
          <div className="w-16 h-16 rounded-full bg-[#141414] border border-neutral-800 flex items-center justify-center mx-auto mb-4 text-neutral-500">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Watchlist is Empty</h2>
          <p className="text-sm text-neutral-400 mb-8 max-w-sm mx-auto">
            Explore shows, podcasts, and live broadcasts on African Diaspora Channels (ADC) and add them to your watchlist to watch later.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('Shows')}
              className="bg-[#141414] hover:bg-neutral-800 border border-neutral-800 text-white p-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer group"
            >
              <Film className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Browse Shows</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('Live TV')}
              className="bg-[#141414] hover:bg-neutral-800 border border-neutral-800 text-white p-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer group"
            >
              <Tv className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Watch Live TV</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('Events')}
              className="bg-[#141414] hover:bg-neutral-800 border border-neutral-800 text-white p-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-2 transition-all cursor-pointer group"
            >
              <Calendar className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
              <span>Explore Events</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
