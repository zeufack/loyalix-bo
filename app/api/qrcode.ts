import { http } from './http';

export interface QRCodeResponse {
  qrCodeData: string;
  qrCodeImage: string;
  expiresAt: string;
}

export interface QRCodeInstance {
  id: string;
  nonce: string;
  businessId: string;
  isUsed: boolean;
  usedAt?: string;
  expiresAt: string;
  createdAt: string;
}

export const generateBusinessQRCode = async (
  businessId: string
): Promise<QRCodeResponse> => {
  const response = await http.post(`/business/generate/${businessId}`);
  return response.data;
};

export const getQRCodes = async (): Promise<QRCodeInstance[]> => {
  const response = await http.get('/qrcode');
  return response.data;
};
