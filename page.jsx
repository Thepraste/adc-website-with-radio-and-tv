import React, { useState, useMemo } from 'react';
import { AdcNav } from './components/AdcNav';
import { HeroBanner } from './components/HeroBanner';
import { VideoRow } from './components/VideoRow';
import { Footer } from './components/Footer';
import { MovieDetailModal } from './components/MovieDetailModal';
import { WatchlistView } from './components/WatchlistView';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { LiveTvView } from './components/LiveTvView';
import { ShowsView } from './components/ShowsView';
import { EventsView } from './components/EventsView';
import { ContactView } from './components/ContactView';
import { RadioView } from './components/RadioView';
import { RadioRow } from './components/RadioRow';
import { RadioPlayer } from './components/RadioPlayer';
import { RADIO_STATIONS } from './data/radioData';

// Curated data with variable names strictly matching current front-end texts
import {
  heroShows,
  onNowShows,
  tvShows,
  podcasts,
  upcomingEventsShows,
  upcomingCrackUpComedyShows,
  allShows,
} from './data/showsData';

import { Check, Search, ArrowLeft } from 'lucide-react';

export default function AdcStreamingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedShow, setSelectedShow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchlist, setWatchlist] = useState([
    'adc-hero-morning-brew',
    'on-now-1',
    'tv-show-1',
    'comedy-1',
  ]);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedCategoryView, setSelectedCategoryView] = useState(null);

  // Persistent Radio Player State
  const [radioStation, setRadioStation] = useState(null);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);

  // Modals for profile & settings
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleWatchlist = (showId) => {
    if (watchlist.includes(showId)) {
      setWatchlist((prev) => prev.filter((id) => id !== showId));
      showToast('Removed from Watchlist');
    } else {
      setWatchlist((prev) => [...prev, showId]);
      showToast('Added to Watchlist');
    }
  };

  const handlePlayShow = (show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (show) => {
    setSelectedShow(show);
    setIsModalOpen(true);
  };

  // Radio Station Handlers
  const handlePlayStation = (station) => {
    setRadioStation(station);
    setIsRadioPlaying(true);
    showToast(`Streaming ${station.name} (${station.frequency})`);
  };

  const handleToggleRadioPlay = () => {
    setIsRadioPlaying((prev) => !prev);
  };

  const handleCloseRadio = () => {
    setIsRadioPlaying(false);
    setRadioStation(null);
  };

  // Helper search filter
  const filterByQuery = (list) => {
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.genres && item.genres.some((g) => g.toLowerCase().includes(query)))
    );
  };

  // Section filtered lists matching front-end section texts
  const filteredOnNowShows = useMemo(() => filterByQuery(onNowShows), [searchQuery]);
  const filteredTvShows = useMemo(() => filterByQuery(tvShows), [searchQuery]);
  const filteredPodcasts = useMemo(() => filterByQuery(podcasts), [searchQuery]);
  const filteredUpcomingEventsShows = useMemo(
    () => filterByQuery(upcomingEventsShows),
    [searchQuery]
  );
  const filteredUpcomingCrackUpComedyShows = filteredUpcomingEventsShows;

  // Total matching search count
  const totalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return filterByQuery(allShows).length;
  }, [searchQuery]);

  // Shows for "See more >" category drill-down
  const categoryDrillDownShows = useMemo(() => {
    if (!selectedCategoryView) return [];
    if (selectedCategoryView === 'On Now') return filteredOnNowShows;
    if (selectedCategoryView === 'TV Shows' || selectedCategoryView === 'Popular TV Shows') {
      return filteredTvShows;
    }
    if (
      selectedCategoryView === 'Podcasts' ||
      selectedCategoryView === 'Podcasts & Talk Shows'
    ) {
      return filteredPodcasts;
    }
    if (
      selectedCategoryView === 'Upcoming Events' ||
      selectedCategoryView === 'Upcoming Crack Up Comedy'
    ) {
      return filteredUpcomingEventsShows;
    }

    return allShows.filter(
      (s) =>
        s.category &&
        s.category.toLowerCase().includes(selectedCategoryView.toLowerCase())
    );
  }, [
    selectedCategoryView,
    filteredOnNowShows,
    filteredTvShows,
    filteredPodcasts,
    filteredUpcomingEventsShows,
  ]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* ADC Navigation Bar */}
      <AdcNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategoryView(null);
          showToast(`Navigated to ${tab}`);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => {
          setActiveTab('Watchlist');
          setSelectedCategoryView(null);
        }}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Active Search Notification Banner */}
      {searchQuery && (
        <div className="bg-[#111111] border-b border-neutral-800 px-4 md:px-12 py-3 flex items-center justify-between sticky top-[58px] sm:top-[70px] z-30">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Search className="w-4 h-4 text-red-500" />
            <span>Search results for:</span>
            <span className="font-bold text-white">&ldquo;{searchQuery}&rdquo;</span>
            <span className="text-neutral-400">({totalSearchResults} titles found)</span>
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-white hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Main Content Body: Responsive, proportional, never overstretched */}
      <main className={`flex-1 bg-black w-full ${
        activeTab === 'Home' && !selectedCategoryView && !searchQuery
          ? 'pt-12 sm:pt-0'
          : 'pt-[58px] sm:pt-[70px]'
      }`}>
        {selectedCategoryView ? (
          /* "See more >" Detailed Category View */
          <div className="max-w-[1920px] mx-auto px-3 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-8 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedCategoryView(null)}
              className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white hover:underline mb-4 sm:mb-6 cursor-pointer font-semibold py-2 px-1 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {activeTab}</span>
            </button>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 sm:mb-6">
              {selectedCategoryView}
            </h1>

            <div className={`grid ${
              selectedCategoryView === 'Upcoming Events' || selectedCategoryView === 'Upcoming Crack Up Comedy'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7'
                : selectedCategoryView === 'On Now'
                ? 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6'
            }`}>
              {categoryDrillDownShows.map((show) => (
                <div
                  key={show.id}
                  onClick={() => handleOpenDetails(show)}
                  className="bg-[#111111] rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 hover:scale-[1.02] transition-all cursor-pointer shadow-xl active:scale-99"
                >
                  <div className={`${
                    selectedCategoryView === 'On Now' ? 'aspect-square p-2.5 flex items-center justify-center bg-[#1b222c]' : 'aspect-[16/9]'
                  } relative overflow-hidden`}>
                    <img
                      src={show.backdrop || show.image}
                      alt={show.title}
                      className={`w-full h-full ${
                        selectedCategoryView === 'On Now' ? 'object-contain max-h-[80%] max-w-[85%] drop-shadow' : 'object-cover object-center'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    {(selectedCategoryView === 'On Now' || show.isLive || show.duration?.toLowerCase() === 'live now') && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>LIVE</span>
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1 truncate">{show.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{show.description}</p>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="text-emerald-400 font-semibold">{show.matchScore || 98}% Match</span>
                      <span>{show.duration}</span>
                      <span className="border border-neutral-700 px-1 rounded text-neutral-300">{show.rating || '13+'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'Live TV' ? (
          /* Live TV View */
          <LiveTvView
            onPlayMovie={handlePlayShow}
            onOpenDetails={handleOpenDetails}
            onShowToast={showToast}
          />
        ) : activeTab === 'Radio' ? (
          /* Radio Stations View */
          <RadioView
            currentStation={radioStation}
            isPlaying={isRadioPlaying}
            onPlayStation={handlePlayStation}
            onShowToast={showToast}
          />
        ) : activeTab === 'Shows' ? (
          /* Shows View */
          <ShowsView
            onPlayMovie={handlePlayShow}
            onOpenDetails={handleOpenDetails}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSeeMore={(cat) => setSelectedCategoryView(cat)}
            searchQuery={searchQuery}
          />
        ) : activeTab === 'Events' ? (
          /* Events View */
          <EventsView
            onPlayMovie={handlePlayShow}
            onOpenDetails={handleOpenDetails}
            onShowToast={showToast}
          />
        ) : activeTab === 'Contact' ? (
          /* Contact View */
          <ContactView onShowToast={showToast} />
        ) : activeTab === 'Watchlist' ? (
          /* Watchlist View */
          <WatchlistView
            watchlistIds={watchlist}
            allMovies={allShows}
            onPlayMovie={handlePlayShow}
            onOpenDetails={handleOpenDetails}
            onRemoveFromWatchlist={(id) => handleToggleWatchlist(id)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setSelectedCategoryView(null);
            }}
          />
        ) : (
          /* Home Page: Hero Banner directly followed by Content Rows with Proportional Layout */
          <div className="w-full pb-12 animate-in fade-in duration-300 bg-black">
            {/* Hero Banner Section (Proportional sizing on all views, Videos & Pictures) */}
            {!searchQuery && (
              <HeroBanner
                movies={heroShows}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}

            {/* Content Rows Section: Proportional container that does not stretch */}
            <div className="max-w-[1920px] mx-auto pt-2 pb-8 space-y-2 md:space-y-4">
              {/* Row 1: "On Now" */}
              <VideoRow
                title="On Now"
                movies={filteredOnNowShows}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSeeMore={(title) => setSelectedCategoryView(title)}
              />

              {/* Row 2: "TV Shows" */}
              <VideoRow
                title="TV Shows"
                movies={filteredTvShows}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSeeMore={(title) => setSelectedCategoryView(title)}
              />

              {/* Row 3: "Podcasts" */}
              <VideoRow
                title="Podcasts"
                movies={filteredPodcasts}
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSeeMore={(title) => setSelectedCategoryView(title)}
              />

              {/* Row 4: "Radio For You" (between Podcasts and Upcoming Events) */}
              <RadioRow
                title="Radio For You"
                currentStation={radioStation}
                isRadioPlaying={isRadioPlaying}
                onPlayStation={handlePlayStation}
                onSeeMoreRadio={() => {
                  setActiveTab('Radio');
                  setSelectedCategoryView(null);
                }}
              />

              {/* Row 5: "Upcoming Events" */}
              <VideoRow
                title="Upcoming Events"
                movies={filteredUpcomingEventsShows}
                cardSize="large"
                onPlayMovie={handlePlayShow}
                onOpenDetails={handleOpenDetails}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSeeMore={(title) => setSelectedCategoryView(title)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigateTab={(tab) => {
        setActiveTab(tab);
        setSelectedCategoryView(null);
      }} />

      {/* Persistent Live Radio Player Bar */}
      <RadioPlayer
        station={radioStation}
        isPlaying={isRadioPlaying}
        onTogglePlay={handleToggleRadioPlay}
        onClose={handleCloseRadio}
        onSelectStation={handlePlayStation}
      />

      {/* Show Details / Playback Modal */}
      <MovieDetailModal
        movie={selectedShow}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isInWatchlist={selectedShow ? watchlist.includes(selectedShow.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onShowToast={showToast}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedCategoryView(null);
        }}
      />

      {/* ADC Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-neutral-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
