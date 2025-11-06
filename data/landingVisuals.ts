import heroSvgUrl from './hero.svg';

export interface HeroVisual {
  id: string;
  lead: string;
  support?: string;
  illustration: {
    key: string;
    alt: string;
    caption: string;
    src?: string;
  };
}

export const HERO_VISUALS: HeroVisual[] = [
  {
    id: 'hero-double-panel',
    lead: 'Structural damage heals fast. Cellular damage does not.',
    support:
      'On the left, tissue & bone are torn. Red dots = new cellular damage. Indigo dots = prenatal cellular damage. On the right, tissue & bone are healed—but the dots remain, so pain persists.',
    illustration: {
      key: 'hero-landing',
      alt:
        'Side-by-side illustration showing a torn muscle and fractured bone with red and indigo dots, next to a healed structure with the same dots still present to depict persistent cellular damage.',
      caption: 'Cellular damage is a separate problem from the tissue or bone injury you can see on scans.',
      src: heroSvgUrl,
    },
  },
];
