const GEO_PREFIX = '/api/admin/geo';

export function geoBenchmarkApiPath(pathname: string, search = ''): string {
  if (!pathname.startsWith(GEO_PREFIX)) {
    throw new Error('Rejected geo admin path.');
  }
  const rest = pathname.slice(GEO_PREFIX.length).replace(/^\/+/, '');
  const parts = rest ? rest.split('/') : [];
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new Error('Rejected geo admin path.');
  }
  if (rest && !/^[A-Za-z0-9/_-]+$/.test(rest)) {
    throw new Error('Rejected geo admin path.');
  }
  if (search && !search.startsWith('?')) {
    throw new Error('Rejected geo admin path.');
  }
  if (/[\r\n]/.test(search) || search.includes('://')) {
    throw new Error('Rejected geo admin path.');
  }
  return `/admin/geo-benchmark${rest ? `/${rest}` : ''}${search}`;
}
