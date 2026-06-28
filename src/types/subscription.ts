export interface ICart {
  id: number;
  category: string;
  pass?: number;
  price: number;
  description: string;
  quantity?: number;
  student?: boolean;
  holydays?: boolean;
  planType: 'entries' | 'monthly';
  durationMonths?: number;
  withTrainer?: boolean;
}

export interface ISubscriptionCategory {
  name: string;
  className: string;
  image: string;
  link: string;
}

// ─── Admin interfaces ─────────────────────────────────────────────────────────

export interface IPlan {
  id: number;
  name: string;
  planType: "ENTRIES" | "MONTHLY";
  entries: number | null;
  durationMonths: number | null;
  withTrainer: boolean | null;
  priceRon: string;
  discountPct: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ICategory {
  id: number;
  slug: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
  plans: IPlan[];
}
