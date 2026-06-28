export interface IDiscountCode {
  id: number;
  code: string;
  discountPct: string | null;
  discountRon: string | null;
  validFrom: Date | null;
  validUntil: Date | null;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
  createdAt: Date;
}
