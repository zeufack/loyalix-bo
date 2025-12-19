'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  RefreshCw,
  Download,
  Clock,
  Building2,
  QrCode,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getBusinesses } from '@/app/api/business';
import { generateBusinessQRCode, QRCodeResponse } from '@/app/api/qrcode';
import { formatDistanceToNow } from 'date-fns';

export function QRCodeGenerator() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);

  // Fetch businesses
  const { data: businessesData, isLoading: loadingBusinesses } = useQuery({
    queryKey: ['businesses-for-qr'],
    queryFn: () => getBusinesses({ limit: 100 })
  });

  // Generate QR code mutation
  const generateMutation = useMutation({
    mutationFn: (businessId: string) => generateBusinessQRCode(businessId),
    onSuccess: (data) => {
      setQrData(data);
      toast.success('QR code generated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate QR code');
    }
  });

  // Update time left countdown
  useEffect(() => {
    if (!qrData?.expiresAt) return;

    const updateTimeLeft = () => {
      const expiresAt = new Date(qrData.expiresAt);
      const now = new Date();

      if (now >= expiresAt) {
        setTimeLeft('Expired');
        return;
      }

      const diff = expiresAt.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [qrData]);

  const handleGenerate = () => {
    if (!selectedBusinessId) {
      toast.error('Please select a business');
      return;
    }
    generateMutation.mutate(selectedBusinessId);
  };

  const handleDownload = () => {
    if (!qrData?.qrCodeImage) return;

    const link = document.createElement('a');
    link.download = `qr-code-${selectedBusinessId}-${Date.now()}.png`;
    link.href = qrData.qrCodeImage;
    link.click();
    toast.success('QR code downloaded');
  };

  const isExpired = qrData && new Date(qrData.expiresAt) <= new Date();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Business Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Business
          </CardTitle>
          <CardDescription>
            Choose a business to generate a QR code for customer check-ins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business">Business</Label>
            {loadingBusinesses ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={selectedBusinessId}
                onValueChange={setSelectedBusinessId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businessesData?.data?.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedBusinessId || generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <QrCode className="mr-2 h-4 w-4" />
            )}
            Generate QR Code
          </Button>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">How it works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. Select a business from the dropdown</li>
              <li>2. Click generate to create a unique QR code</li>
              <li>3. Display the QR code for customers to scan</li>
              <li>4. QR codes expire after 15 minutes for security</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Generated QR Code
          </CardTitle>
          <CardDescription>
            Display this QR code for customers to scan when they visit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qrData ? (
            <div className="space-y-4">
              <div
                ref={qrRef}
                className="flex justify-center rounded-lg border bg-white p-6"
              >
                {qrData.qrCodeImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={qrData.qrCodeImage}
                    alt="Business QR Code"
                    className="w-64 h-64"
                  />
                ) : (
                  <QRCodeCanvas
                    value={qrData.qrCodeData}
                    size={256}
                    level="H"
                    includeMargin
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Expires in:
                  </span>
                  <Badge variant={isExpired ? 'destructive' : 'secondary'}>
                    {timeLeft}
                  </Badge>
                </div>
              </div>

              {isExpired && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  This QR code has expired. Generate a new one.
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!qrData.qrCodeImage}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <QrCode className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Select a business and generate a QR code to display here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
