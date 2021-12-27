const validQueryDomains = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'gaming.youtube.com',
  ]);
  const idRegex = /^[a-zA-Z0-9-_]{11}$/;
  const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
const validateID = id => idRegex.test(id);
  export function getURLVideoID(link) {
    const parsed = new URL(link);
    let id = parsed.searchParams.get('v');
    if (validPathDomains.test(link) && !id) {
      const paths = parsed.pathname.split('/');
      id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
    } else if (parsed.hostname && !validQueryDomains.has(parsed.hostname)) {
      return undefined
    }
    if (!id) {
      return undefined
    }
    id = id.substring(0, 11);
    if (validateID(id)) {
      return id
    }
    return id;
  };