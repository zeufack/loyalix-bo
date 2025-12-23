export interface Business {
  id: string;
  name: string;
  phone?: string;
  email: string;
  description?: string | null;
  industryType: string;
  address?: string | null;
  owner?: string;
  qrSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  staff?: any[];
  programs?: any[];
}

export type BusinessTableItem = Pick<
  Business,
  'id' | 'name' | 'email' | 'phone' | 'industryType' | 'createdAt'
> & {
  staffCount: number;
  programsCount: number;
};

export interface CreateBusinessPayload {
  name: string;
  email: string;
  phone?: string;
  description?: string;
  industryType: string;
  address?: string;
  owner: string;
}
