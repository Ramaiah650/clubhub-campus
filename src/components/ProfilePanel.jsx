import { useState, useEffect } from 'react';
import { User, Star, ClipboardList, Save } from 'lucide-react';

const EMPTY = { name: '', email: '', courseYear: '', bio: '' };

/**
 * Editable profile — Props, Conditional rendering, local persistence via parent
 */
function ProfilePanel({ profile, onSave, starredCount, applicationCount }) {
  const [draft, setDraft] = useState(profile || EMPTY);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setDraft(profile || EMPTY);
  }, [profile]);

  const handleChange = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: draft.name.trim(),
      email: draft.email.trim(),
      courseYear: draft.courseYear.trim(),
      bio: draft.bio.trim(),
    });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const displayName = draft.name?.trim() || 'Student explorer';

  return (
    <div className="panel-view">
      <div className="catalog-head">
        <div>
          <h1>Profile</h1>
          <p className="catalog-sub">Your Campus Club profile — saved on this device.</p>
        </div>
      </div>

      <div className="profile-layout">
        <aside className="profile-summary">
          <div className="profile-avatar" aria-hidden>
            <User size={28} />
          </div>
          <h2 className="profile-display-name">{displayName}</h2>
          {draft.courseYear ? (
            <p className="profile-course">{draft.courseYear}</p>
          ) : (
            <p className="profile-course muted">Add your course / year</p>
          )}
          <ul className="profile-stats">
            <li>
              <Star size={16} aria-hidden />
              <strong>{starredCount}</strong>
              <span>Starred clubs</span>
            </li>
            <li>
              <ClipboardList size={16} aria-hidden />
              <strong>{applicationCount}</strong>
              <span>Applications</span>
            </li>
          </ul>
        </aside>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              value={draft.name}
              onChange={handleChange('name')}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={draft.email}
              onChange={handleChange('email')}
              placeholder="you@campus.edu"
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Course / year</span>
            <input
              type="text"
              value={draft.courseYear}
              onChange={handleChange('courseYear')}
              placeholder="e.g. B.Tech CSE · Year 2"
            />
          </label>
          <label className="field">
            <span>Bio</span>
            <textarea
              rows={4}
              value={draft.bio}
              onChange={handleChange('bio')}
              placeholder="Interests, goals, or what you hope to find in clubs…"
            />
          </label>
          <div className="profile-form-actions">
            <button type="submit" className="btn-coral">
              <Save size={16} aria-hidden />
              Save profile
            </button>
            {savedFlash ? <span className="save-flash">Saved</span> : null}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePanel;
