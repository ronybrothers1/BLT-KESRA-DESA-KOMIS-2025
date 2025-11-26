export interface Recipient {
  id: number;
  no_kk: string; // The full KK number (used for validation)
  nama: string;
  alamat: string; // The specific Dusun name
}

export enum DusunFilter {
  ALL = 'SEMUA',
  KOMIS = 'DSN. KOMIS',
  TOTONGAN = 'DSN. TOTONGAN',
  DUKO = 'DSN. DUKO',
  MALAKAH = 'DSN. MALAKAH',
}

export interface ValidationResult {
  status: 'idle' | 'valid' | 'invalid';
  message: string;
}