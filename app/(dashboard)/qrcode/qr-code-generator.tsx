'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function QRCodeGenerator() {
  const [text, setText] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text">Text</Label>
            <Input
              id="text"
              className="col-span-3"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          {text && (
            <div className="flex justify-center mt-4">
              <QRCodeCanvas value={text} size={256} level={"H"} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}