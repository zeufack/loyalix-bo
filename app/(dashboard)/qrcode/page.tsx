import { QRCodeGenerator } from './qr-code-generator';

export default function QRCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
        <p className="text-muted-foreground">
          Generate QR codes for customer check-ins at your businesses.
        </p>
      </div>
      <QRCodeGenerator />
    </div>
  );
}
