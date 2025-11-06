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
    id: 'tissue-bone-damage',
    lead: 'Tissue & Bone Damage',
    support:
      'The structural injury you can see on scans: torn muscle fibers and a fractured joint. This typically heals within six months.',
    illustration: {
      key: 'hero-landing',
      alt:
        'Detailed anatomical illustration of a lower leg with a visible bone fracture and torn muscle fibers highlighted as “Tissue & Bone Damage.”',
      caption: 'Structural damage is visible and addressed by conventional care.',
      src: '/images/tissue-bone-damage.png',
    },
  },
  {
    id: 'new-cellular-damage',
    lead: 'New Cellular Damage',
    support: 'Recent injury wakes up new cellular damage signals. Doctors don’t treat this—it doesn’t heal on its own.',
    illustration: {
      key: 'new-cellular',
      alt: 'Torn muscle and bone with bright red dots tightly clustered around the injury, representing new cellular damage.',
      caption: 'New cellular damage sits on top of the structural injury and keeps pain firing.',
      src: '/images/new-cellular-damage.png',
    },
  },
  {
    id: 'prenatal-cellular-damage',
    lead: 'Prenatal Cellular Damage',
    support: 'Dormant cellular memories from before birth can reactivate around the injury site.',
    illustration: {
      key: 'prenatal-cellular',
      alt: 'Injury surrounded by a halo of indigo dots to illustrate prenatal cellular damage reactivating.',
      caption: 'Prenatal cellular damage patterns reactivate and surround the injury.',
      src: '/images/prenatal-cellular-damage.png',
    },
  },
  {
    id: 'healed-but-persistent',
    lead: 'After Tissue & Bone Heal, Cellular Damage Persists',
    support: 'Even when scans look “normal,” both new and prenatal cellular damage can keep chronic pain alive.',
    illustration: {
      key: 'persistent-cellular',
      alt: 'Healed bone and muscle with both red and indigo dots still active around the joint.',
      caption: 'Structure is healed, but cellular damage signals remain.',
      src: '/images/healed-structure-persistent-damage.png',
    },
  },
];
