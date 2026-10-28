import { ArrowLeft, ArrowRight, Bell, Building2, Camera, Eye, EyeOff, IdCard, Lock, Mail, Phone, User, UserRound } from 'lucide-react';
import { useState } from 'react';
import { CampusHero } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { departments } from '../data/catalog';
import { demoEmail, demoPassword } from '../data/seed';
import { Link, useQuery, useRouter } from '../lib/router';

function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      <nav className="auth-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="auth-split">
        <CampusHero />
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}

function RoleToggle({ role, setRole }) {
  return (
    <div className="role-toggle" role="group" aria-label="Sign in as">
      <button type="button" className={role === 'user' ? 'is-on' : ''} onClick={() => setRole('user')}>
        <UserRound size={16} /> Users
      </button>
      <button type="button" className={role === 'librarian' ? 'is-on' : ''} onClick={() => setRole('librarian')}>
        <Building2 size={16} /> Librarian
      </button>
    </div>
  );
}

export function Login() {
  const { signIn } = useLibrary();
  const { navigate } = useRouter();
  const query = useQuery();
  const [role, setRole] = useState('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const result = signIn({ identifier, password, role, remember });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const next = query.get('next');
    if (result.role === 'librarian') {
      navigate('/librarian');
      return;
    }
    if (next && next.startsWith('/') && !next.startsWith('//')) navigate(next);
    else navigate('/dashboard');
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={submit}>
        <h1>Welcome Back</h1>
        <p className="auth-sub">Sign in to continue</p>
        <RoleToggle role={role} setRole={setRole} />
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label className="field">
          <span className="sr-only">Email or register number</span>
          <Mail size={16} />
          <input
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Email / Register Number"
            autoComplete="username"
            data-testid="login-id"
          />
        </label>
        <label className="field">
          <span className="sr-only">Password</span>
          <Lock size={16} />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            data-testid="login-password"
          />
          <button type="button" className="ghost-icon" onClick={() => setShow((value) => !value)} aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </label>
        <div className="form-row">
          <label className="check">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            Remember me
          </label>
          <Link to="/forgot" className="text-link">
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn btn-primary btn-block" data-testid="sign-in">
          Sign In <ArrowRight size={16} />
        </button>
        <button
          type="button"
          className="demo-chip"
          data-testid="demo-fill"
          onClick={() => {
            setIdentifier(demoEmail);
            setPassword(demoPassword);
            setRole('user');
            setError('');
          }}
        >
          Use Harshini’s demo account
        </button>
        <p className="demo-note">
          {demoEmail} · {demoPassword}. Any non-empty email and password will also sign in.
        </p>
        <p className="switch-auth">
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export function Signup() {
  const { createAccount } = useLibrary();
  const { navigate } = useRouter();
  const [form, setForm] = useState({
    name: '',
    universityId: '',
    department: '',
    phone: '',
    photo: '',
  });
  const [error, setError] = useState('');

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose a PNG or JPG for the profile photo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      if (result.length > 500000) {
        setError('That photo is too large. Choose one under about 400KB.');
        return;
      }
      setField('photo', result);
      setError('');
    };
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    const result = createAccount(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/verify');
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={submit}>
        <Link to="/login" className="back-inline">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1>Create Your Quillora Account</h1>
        <p className="auth-sub">Fill in your details to register as a new user.</p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <label className="field">
          <span className="sr-only">Name</span>
          <User size={16} />
          <input value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Name" autoComplete="name" />
        </label>
        <label className="field">
          <span className="sr-only">University ID</span>
          <IdCard size={16} />
          <input value={form.universityId} onChange={(event) => setField('universityId', event.target.value)} placeholder="University ID" />
        </label>
        <label className="field">
          <span className="sr-only">Department</span>
          <Building2 size={16} />
          <select value={form.department} onChange={(event) => setField('department', event.target.value)}>
            <option value="">Department</option>
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="sr-only">Phone number</span>
          <Phone size={16} />
          <input value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="Phone Number" autoComplete="tel" />
        </label>
        <label className="photo-field">
          <span className="photo-placeholder">
            {form.photo ? <img src={form.photo} alt="" /> : <Camera size={18} />}
          </span>
          <span>
            <strong>Profile Photo</strong>
            <em>PNG or JPG, small enough for this browser.</em>
          </span>
          <input type="file" accept="image/png,image/jpeg" onChange={onPhoto} />
        </label>
        <button type="submit" className="btn btn-primary btn-block">
          Create Account
        </button>
      </form>
    </AuthLayout>
  );
}

export function Verify() {
  const { continuePending } = useLibrary();
  const { navigate } = useRouter();
  const [email] = useState(() => {
    try {
      return sessionStorage.getItem('quillora.pendingEmail') || '';
    } catch {
      return '';
    }
  });

  return (
    <AuthLayout>
      <div className="verify">
        <Link to="/login" className="back-inline">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="verify-seal" aria-hidden="true">
          <span className="laurel" />
          <IdCard size={36} />
        </div>
        <h1>Verification Pending</h1>
        <p>
          Your account has been successfully submitted and is currently under review by the librarian. You’ll be notified once your account is approved.
        </p>
        {email && <p className="demo-note">Sign-in id: {email}</p>}
        <div className="verify-note">
          <Bell size={18} />
          <p>You will receive a notification once your account is approved. You can enter the reading rooms now; borrowing waits for the desk.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => {
            const result = continuePending();
            if (result.ok) navigate('/dashboard');
            else navigate('/login');
          }}
        >
          Enter the library
        </button>
      </div>
    </AuthLayout>
  );
}

export function Forgot() {
  const { requestReset } = useLibrary();
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const result = requestReset(identifier);
    if (!result.ok) {
      setError(result.error);
      setMessage('');
      return;
    }
    setError('');
    setMessage(result.message);
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={submit}>
        <Link to="/login" className="back-inline">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1>Forgot Password</h1>
        <p className="auth-sub">We will leave a reset note with the university inbox on file.</p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {message && <p className="form-ok">{message}</p>}
        <label className="field">
          <span className="sr-only">Email or register number</span>
          <Mail size={16} />
          <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Email / Register Number" />
        </label>
        <button type="submit" className="btn btn-primary btn-block">
          Send reset note
        </button>
      </form>
    </AuthLayout>
  );
}

export function About() {
  return (
    <AuthLayout>
      <article className="prose-card">
        <h1>About Quillora</h1>
        <p className="auth-sub">Where Knowledge Finds Its Wings.</p>
        <p>
          Quillora is the reading room of the university: a gothic stack of books, papers, and quiet desks. The motto is the whole promise — Discover, Learn, Imagine, Grow.
        </p>
        <p>The circulation desk is open Monday to Saturday, 8:00 to 20:00, and Sunday 10:00 to 16:00. Research terminals stay available with a student sign-in.</p>
        <p className="quote-line">“Books are keys, Libraries are wings, And knowledge sets us free.”</p>
      </article>
    </AuthLayout>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  function submit(event) {
    event.preventDefault();
    setSent(true);
  }
  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={submit}>
        <h1>Contact the Desk</h1>
        <p className="auth-sub">desk@quillora.edu · Central Library, Block C</p>
        {sent ? (
          <p className="form-ok">Message kept at the desk. In this demo it stays on this page — nothing was sent over the network.</p>
        ) : (
          <>
            <label className="field">
              <span className="sr-only">Name</span>
              <User size={16} />
              <input required placeholder="Name" name="name" />
            </label>
            <label className="field">
              <span className="sr-only">Email</span>
              <Mail size={16} />
              <input required type="email" placeholder="Email" name="email" />
            </label>
            <label className="stack-field">
              <span className="sr-only">Message</span>
              <textarea required rows={4} placeholder="How can the desk help?" name="message" />
            </label>
            <button type="submit" className="btn btn-primary btn-block">
              Send
            </button>
          </>
        )}
      </form>
    </AuthLayout>
  );
}
