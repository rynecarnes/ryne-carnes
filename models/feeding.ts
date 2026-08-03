export interface Feeding {
  id: string;
  started_at: string;   // ISO 8601 timestamptz
  amount_oz: number;
  notes: string | null;
  created_at: string;   // ISO 8601 timestamptz
}
