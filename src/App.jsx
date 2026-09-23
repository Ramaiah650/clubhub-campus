import { useMemo, useState, useEffect } from 'react';
import { INTERESTS, CLUBS } from './data/clubsData';
import { THEMES, DEFAULT_THEME } from './data/themes';
import { useLocalStorage } from './hooks/useLocalStorage';
import AppHeader from './components/AppHeader';
import FilterRail from './components/FilterRail';
import OrgTile from './components/OrgTile';
import DetailPane from './components/DetailPane';
import NoMatches from './components/NoMatches';
import ConceptMap from './components/ConceptMap';
import ApplicationsView from './components/ApplicationsView';
import ProfilePanel from './components/ProfilePanel';
import Toast from './components/Toast';

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  courseYear: '',
  bio: '',
};

function App() {
  const [interest, setInterest] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState('catalog');
  const [toast, setToast] = useState('');

  const [starredIds, setStarredIds] = useLocalStorage('campus_club_starred', []);
  const [applications, setApplications] = useLocalStorage('campus_club_applications', []);
  const [profile, setProfile] = useLocalStorage('campus_club_profile', DEFAULT_PROFILE);
  const [themeId, setThemeId] = useLocalStorage('campus_club_theme', DEFAULT_THEME);

  useEffect(() => {
    const valid = THEMES.some((t) => t.id === themeId) ? themeId : DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', valid);
  }, [themeId]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const counts = useMemo(() => {
    const map = { all: CLUBS.length };
    INTERESTS.forEach((item) => {
      if (item.id !== 'all') {
        map[item.id] = CLUBS.filter((c) => c.interest === item.id).length;
      }
    });
    return map;
  }, []);

  const visible = useMemo(() => {
    let list = [...CLUBS];

    if (interest !== 'all') {
      list = list.filter((c) => c.interest === interest);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const hay = [
          c.name,
          c.blurb,
          c.about,
          c.interestLabel,
          ...c.tags,
          ...c.leads.map((l) => l.name),
        ]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [interest, query]);

  const selectedClub = useMemo(
    () => CLUBS.find((c) => c.id === selectedId) || null,
    [selectedId]
  );

  const interestLabel = INTERESTS.find((i) => i.id === interest)?.label;

  const appliedClubIds = useMemo(
    () => new Set(applications.map((a) => a.clubId)),
    [applications]
  );

  const clearFilters = () => {
    setInterest('all');
    setQuery('');
  };

  const toggleStar = (id) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleViewChange = (next) => {
    setView(next);
    if (next !== 'catalog') setSelectedId(null);
  };

  const handleJoin = (club) => {
    if (appliedClubIds.has(club.id)) return;
    const entry = {
      id: `app-${club.id}-${Date.now()}`,
      clubId: club.id,
      clubName: club.name,
      interest: club.interest,
      interestLabel: club.interestLabel,
      appliedAt: new Date().toISOString(),
      status: 'Pending',
    };
    setApplications((prev) => [...prev, entry]);
    setToast(`Applied to ${club.name} — status: Pending`);
  };

  const handleWithdraw = (appId) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    setToast('Application withdrawn');
  };

  const handleOpenClubFromApps = (clubId) => {
    setView('catalog');
    setSelectedId(clubId);
  };

  const showDetail = view === 'catalog' && selectedClub;

  return (
    <div className={`shell${showDetail ? ' has-detail' : ''}`}>
      <AppHeader
        view={view}
        onViewChange={handleViewChange}
        starredCount={starredIds.length}
        applicationCount={applications.length}
        themeId={themeId}
        onThemeChange={setThemeId}
      />

      <div className="workspace">
        {view === 'catalog' && (
          <>
            <FilterRail
              interests={INTERESTS}
              activeInterest={interest}
              onInterestChange={setInterest}
              query={query}
              onQueryChange={setQuery}
              counts={counts}
            />

            <main className="catalog">
              <div className="catalog-head">
                <div>
                  <h1>Campus clubs</h1>
                  <p className="catalog-sub">
                    Showing <strong>{visible.length}</strong>{' '}
                    {visible.length === 1 ? 'club' : 'clubs'}
                    {interest !== 'all' && (
                      <>
                        {' '}
                        in <strong>{interestLabel}</strong>
                      </>
                    )}
                    {query && (
                      <>
                        {' '}
                        matching <em>“{query}”</em>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {visible.length > 0 ? (
                <div className="org-grid">
                  {visible.map((club) => (
                    <OrgTile
                      key={club.id}
                      club={club}
                      isStarred={starredIds.includes(club.id)}
                      isSelected={selectedId === club.id}
                      onSelect={(c) => setSelectedId(c.id)}
                      onToggleStar={toggleStar}
                    />
                  ))}
                </div>
              ) : (
                <NoMatches
                  query={query}
                  interestLabel={interestLabel}
                  onClear={clearFilters}
                />
              )}

              <ConceptMap />
            </main>

            {selectedClub && (
              <DetailPane
                club={selectedClub}
                isStarred={starredIds.includes(selectedClub.id)}
                hasApplied={appliedClubIds.has(selectedClub.id)}
                onClose={() => setSelectedId(null)}
                onToggleStar={toggleStar}
                onJoin={handleJoin}
              />
            )}
          </>
        )}

        {view === 'applications' && (
          <main className="catalog catalog-wide">
            <ApplicationsView
              applications={applications}
              onWithdraw={handleWithdraw}
              onOpenClub={handleOpenClubFromApps}
            />
          </main>
        )}

        {view === 'profile' && (
          <main className="catalog catalog-wide">
            <ProfilePanel
              profile={profile}
              onSave={setProfile}
              starredCount={starredIds.length}
              applicationCount={applications.length}
            />
          </main>
        )}
      </div>

      <footer className="site-footer">
        <p>© 2026 Campus Club · Discover campus clubs · React + Vite</p>
      </footer>

      <Toast message={toast} onDismiss={() => setToast('')} />
    </div>
  );
}

export default App;
