import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

function currentLoc() {
  return window.location.pathname + window.location.search;
}

export function Router({ children }) {
  const [loc, setLoc] = useState(currentLoc);

  useEffect(() => {
    const onPop = () => setLoc(currentLoc());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to) => {
    const next = to.startsWith('/') ? to : `/${to}`;
    window.history.pushState({}, '', next);
    setLoc(next);
  }, []);

  const replace = useCallback((to) => {
    window.history.replaceState({}, '', to);
    setLoc(to);
  }, []);

  const path = loc.split('?')[0] || '/';
  const search = loc.includes('?') ? `?${loc.split('?')[1]}` : '';

  const value = useMemo(
    () => ({ path, search, navigate, replace }),
    [path, search, navigate, replace],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside Router');
  return ctx;
}

export function useQuery() {
  const { search } = useRouter();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function Link({ to, className, children, ...rest }) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Navigate({ to }) {
  const { navigate, path, search } = useRouter();
  useEffect(() => {
    if (path + search !== to) navigate(to);
  }, [navigate, path, search, to]);
  return null;
}
