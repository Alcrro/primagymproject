export interface ITrainer {
  id: number;
  name: string;
  age: number | null;
  category: string;
  classes: string[];
  specializations: string[];
  certifications: string[];
  description: string | null;
  bio: string | null;
  instagram: string | null;
  email: string | null;
  thumbnail: string | null;
  locationId: number | null;
  isActive: boolean;
  sortOrder: number;
  reviews?: { rating: number }[];
}

export interface ITrainerWithLocation extends ITrainer {
  location: {
    id: number;
    slug: string;
    name: string;
  } | null;
}

export interface ITrainerReview {
  id: number;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
}
