export interface Business {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}
