/** Row shape returned by GET /api/services */
export interface ServiceOption {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  country_id: string | null;
  sort_order: number;
}
