// category.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  lft: number;
  rght: number;
  tree_id: number;
  level: number;
  parent_id?: number | null;
  children?: Category[]; // 👈 added so frontend can access subcategories
}
