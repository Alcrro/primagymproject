export interface IGalleryPhoto {
  id: number;
  filename: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isActive: boolean;
}
