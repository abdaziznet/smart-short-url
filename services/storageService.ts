import { ShortLink } from '../types';

const STORAGE_KEY = 'smartshort_links';

export const getLinks = (): ShortLink[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load links", error);
    return [];
  }
};

export const saveLink = (link: ShortLink): void => {
  const links = getLinks();
  const updatedLinks = [link, ...links];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
};

export const deleteLink = (id: string): void => {
  const links = getLinks();
  const updatedLinks = links.filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLinks));
};

export const incrementVisits = (shortCode: string): ShortLink | null => {
  const links = getLinks();
  const linkIndex = links.findIndex(l => l.shortCode === shortCode);
  
  if (linkIndex !== -1) {
    const link = links[linkIndex];
    link.visits += 1;
    link.lastVisited = Date.now();
    links[linkIndex] = link;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    return link;
  }
  return null;
};

export const getLinkByCode = (code: string): ShortLink | undefined => {
  const links = getLinks();
  return links.find(l => l.shortCode === code);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
