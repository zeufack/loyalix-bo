export interface Promotion {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  discount: number;
  businessId: string;
}
