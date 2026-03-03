const ALPHA = 0.3;
const STORAGE_KEY = 'portfolio_markov_matrix';
const ACCURACY_KEY = 'portfolio_markov_accuracy';

export type PageState = 'home' | 'about' | 'projects' | 'detail' | 'leadership' | 'contact' | 'unknown';

export const getPageState = (pathname: string): PageState => {
  if (pathname === '/') return 'home';
  if (pathname === '/about') return 'about';
  if (pathname === '/projects') return 'projects';
  if (pathname.startsWith('/projects/')) return 'detail';
  if (pathname === '/leadership') return 'leadership';
  if (pathname === '/contact') return 'contact';
  return 'unknown';
};

export const getPageName = (state: PageState): string => {
  const map: Record<PageState, string> = {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    detail: 'Project Detail',
    leadership: 'Leadership',
    contact: 'Contact',
    unknown: 'Unknown'
  };
  return map[state];
};

const defaultMatrix: Record<PageState, Record<PageState, number>> = {
  home: { home: 0, about: 0.3, projects: 0.4, detail: 0, leadership: 0.1, contact: 0.2, unknown: 0 },
  about: { home: 0.1, about: 0, projects: 0.4, detail: 0, leadership: 0.2, contact: 0.3, unknown: 0 },
  projects: { home: 0.1, about: 0.1, projects: 0, detail: 0.6, leadership: 0.1, contact: 0.1, unknown: 0 },
  detail: { home: 0.1, about: 0.1, projects: 0.5, detail: 0.1, leadership: 0.1, contact: 0.1, unknown: 0 },
  leadership: { home: 0.1, about: 0.2, projects: 0.3, detail: 0, leadership: 0, contact: 0.4, unknown: 0 },
  contact: { home: 0.4, about: 0.1, projects: 0.3, detail: 0, leadership: 0.2, contact: 0, unknown: 0 },
  unknown: { home: 1, about: 0, projects: 0, detail: 0, leadership: 0, contact: 0, unknown: 0 },
};

export class MarkovEngine {
  matrix: Record<PageState, Record<PageState, number>>;
  totalPredictions: number = 0;
  correctPredictions: number = 0;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.matrix = JSON.parse(saved);
      } catch {
        this.matrix = JSON.parse(JSON.stringify(defaultMatrix));
      }
    } else {
      this.matrix = JSON.parse(JSON.stringify(defaultMatrix));
    }

    const acc = localStorage.getItem(ACCURACY_KEY);
    if (acc) {
      try {
        const parsed = JSON.parse(acc);
        this.totalPredictions = parsed.total || 0;
        this.correctPredictions = parsed.correct || 0;
      } catch {
        // ignore
      }
    }
  }

  update(from: PageState, to: PageState) {
    if (from === 'unknown' || to === 'unknown') return;

    const row = this.matrix[from];
    for (const key in row) {
      if (key === to) {
        row[key as PageState] = (1 - ALPHA) * row[key as PageState] + ALPHA;
      } else {
        row[key as PageState] = (1 - ALPHA) * row[key as PageState];
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.matrix));
  }

  getPredictions(from: PageState): { state: PageState; prob: number }[] {
    if (from === 'unknown') return [];
    const row = this.matrix[from];
    return Object.entries(row)
      .map(([state, prob]) => ({ state: state as PageState, prob }))
      .filter(p => p.prob > 0.01)
      .sort((a, b) => b.prob - a.prob);
  }

  recordHit(isHit: boolean) {
    this.totalPredictions++;
    if (isHit) this.correctPredictions++;
    localStorage.setItem(ACCURACY_KEY, JSON.stringify({
      total: this.totalPredictions,
      correct: this.correctPredictions
    }));
  }

  getAccuracy() {
    if (this.totalPredictions === 0) return 0;
    return Math.round((this.correctPredictions / this.totalPredictions) * 100);
  }
}
