'use client';

import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';

interface FormImageFieldProps {
  label: string;
  value?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  uploadLabel?: string;
}

export function FormImageField({
  label,
  value,
  onChange,
  disabled,
  uploadLabel = 'Click to upload an image'
}: FormImageFieldProps) {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right pt-2">{label}</Label>
      <div className="col-span-3">
        <ImageUpload
          value={value}
          onChange={onChange}
          disabled={disabled}
          label={uploadLabel}
        />
      </div>
    </div>
  );
}
