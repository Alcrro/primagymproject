import { ICart } from '@/types/subscription';
export type { ICart };

export const subscriptions: ICart[] = [
  // ─── Zumba — intrări ───────────────────────────────────────────────────────
  { id: 0,  category: 'zumba', planType: 'entries', pass: 1,  price: 30,  description: '' },
  { id: 1,  category: 'zumba', planType: 'entries', pass: 4,  price: 100, description: '' },
  { id: 2,  category: 'zumba', planType: 'entries', pass: 8,  price: 150, description: '' },
  { id: 3,  category: 'zumba', planType: 'entries', pass: 10, price: 175, description: '' },

  // ─── Zumba — luni ──────────────────────────────────────────────────────────
  { id: 30, category: 'zumba', planType: 'monthly', durationMonths: 1,  price: 150,  description: '' },
  { id: 31, category: 'zumba', planType: 'monthly', durationMonths: 3,  price: 400,  description: '' },
  { id: 32, category: 'zumba', planType: 'monthly', durationMonths: 6,  price: 750,  description: '' },
  { id: 33, category: 'zumba', planType: 'monthly', durationMonths: 12, price: 1400, description: '' },

  // ─── Aerobic — intrări ─────────────────────────────────────────────────────
  { id: 10, category: 'aerobic', planType: 'entries', pass: 1,  price: 30,  description: '' },
  { id: 11, category: 'aerobic', planType: 'entries', pass: 4,  price: 100, description: '' },
  { id: 12, category: 'aerobic', planType: 'entries', pass: 8,  price: 150, description: '' },
  { id: 13, category: 'aerobic', planType: 'entries', pass: 10, price: 175, description: '' },

  // ─── Aerobic — luni ────────────────────────────────────────────────────────
  { id: 34, category: 'aerobic', planType: 'monthly', durationMonths: 1,  price: 150,  description: '' },
  { id: 35, category: 'aerobic', planType: 'monthly', durationMonths: 3,  price: 400,  description: '' },
  { id: 36, category: 'aerobic', planType: 'monthly', durationMonths: 6,  price: 750,  description: '' },
  { id: 37, category: 'aerobic', planType: 'monthly', durationMonths: 12, price: 1400, description: '' },

  // ─── Cycling — intrări ─────────────────────────────────────────────────────
  { id: 14, category: 'cycling', planType: 'entries', pass: 1,  price: 30,  description: '' },
  { id: 15, category: 'cycling', planType: 'entries', pass: 4,  price: 100, description: '' },
  { id: 16, category: 'cycling', planType: 'entries', pass: 8,  price: 150, description: '' },
  { id: 17, category: 'cycling', planType: 'entries', pass: 10, price: 175, description: '' },

  // ─── Cycling — luni ────────────────────────────────────────────────────────
  { id: 38, category: 'cycling', planType: 'monthly', durationMonths: 1,  price: 150,  description: '' },
  { id: 39, category: 'cycling', planType: 'monthly', durationMonths: 3,  price: 400,  description: '' },
  { id: 40, category: 'cycling', planType: 'monthly', durationMonths: 6,  price: 750,  description: '' },
  { id: 41, category: 'cycling', planType: 'monthly', durationMonths: 12, price: 1400, description: '' },

  // ─── Fitness — cu antrenor (intrări) ───────────────────────────────────────
  { id: 4,  category: 'fitness', planType: 'entries', pass: 1,  price: 30,  student: false, withTrainer: true, description: '' },
  { id: 5,  category: 'fitness', planType: 'entries', pass: 1,  price: 20,  student: true,  withTrainer: true, description: '' },
  { id: 6,  category: 'fitness', planType: 'entries', pass: 1,  price: 50,  student: true, holydays: true, withTrainer: true, description: '' },
  { id: 7,  category: 'fitness', planType: 'entries', pass: 4,  price: 100, withTrainer: true, description: '' },
  { id: 8,  category: 'fitness', planType: 'entries', pass: 8,  price: 150, withTrainer: true, description: '' },
  { id: 9,  category: 'fitness', planType: 'entries', pass: 10, price: 175, withTrainer: true, description: '' },

  // ─── Fitness — fără antrenor (luni) ────────────────────────────────────────
  { id: 42, category: 'fitness', planType: 'monthly', durationMonths: 1,  price: 120,  withTrainer: false, description: '' },
  { id: 43, category: 'fitness', planType: 'monthly', durationMonths: 3,  price: 320,  withTrainer: false, description: '' },
  { id: 44, category: 'fitness', planType: 'monthly', durationMonths: 6,  price: 600,  withTrainer: false, description: '' },
  { id: 45, category: 'fitness', planType: 'monthly', durationMonths: 12, price: 1100, withTrainer: false, description: '' },
];
