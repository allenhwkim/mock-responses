export class CookieService {

  static getCookie(req, key): string {
    const cookies = {};
    (req.headers.cookie || '').split('; ').forEach(el => {
      const [k,v] = el.split('=');
      cookies[k] = v;
    });
    return cookies[key] ? decodeURIComponent(cookies[key]) : undefined;
  }

  static setCookie(req, res, key, value) {
    const url = new URL(req.get('origin')); // req.hostname can be 127.0.0.1
    const matches = url.hostname.match(/[-\w]+\.(?:[-\w]+\.xn--[-\w]+|[-\w]{3,}|[-\w]+\.[-\w]{2})$/i);
    const topLevelDomain = (matches && matches[0]) || url.hostname;
    const cookieDomain = topLevelDomain.match(/\./) ? '.' + topLevelDomain : topLevelDomain;

    res.cookie(key, value, {
      path: '/',
      domain: cookieDomain,
      maxAge: 6048000 
    });
  }

}
