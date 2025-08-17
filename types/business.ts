export interface Business {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  address?: string | null;
  qrSecret: string;
  createdAt: Date;
  updatedAt: Date;
  staff?: any[];
  programs?: any[];
}

export type BusinessTableItem = Pick<
  Business,
  'id' | 'name' | 'email' | 'phone' | 'businessType' | 'createdAt'
> & {
  staffCount: number;
  programsCount: number;
};

export type BusinessCreatePayload = Omit<
  Business,
  'id' | 'createdAt' | 'updatedAt' | 'staff' | 'programs'
>;
