import { http } from './http';

export interface StaffMember {
  id: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isOwner: boolean;
  profilePhotoUrl?: string;
  roles: string[];
  lastActive?: Date;
}

export const getBusinessStaff = async (
  businessId: string
): Promise<StaffMember[]> => {
  const response = await http.get<StaffMember[]>(
    `/business/${businessId}/staff`
  );
  return response.data;
};

export const inviteStaff = async (
  businessId: string,
  data: { email: string; isOwner?: boolean }
): Promise<StaffMember> => {
  const response = await http.post<StaffMember>(
    `/business/${businessId}/staff`,
    data
  );
  return response.data;
};

export const removeStaff = async (
  businessId: string,
  staffId: string
): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>(
    `/business/${businessId}/staff/${staffId}`
  );
  return response.data;
};
