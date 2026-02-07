'use client';

import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploadProps {
  /** URL of the existing image to preview */
  value?: string | null;
  /** Called when a file is selected or cleared */
  onChange: (file: File | null) => void;
  /** Disable the upload control */
  disabled?: boolean;
  /** Custom class name for the container */
  className?: string;
  /** Label text shown in the drop zone */
  label?: string;
}

function ImageUpload({
  value,
  onChange,
  disabled = false,
  className,
  label = 'Click to upload an image'
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPreview = preview || value || null;

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are accepted';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);
    },
    [onChange, validateFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Reset the input so the same file can be re-selected
      e.target.value = '';
    },
    [handleFileSelect]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setError(null);
      onChange(null);
    },
    [preview, onChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onClick={handleClick}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer',
          'hover:border-primary/50 hover:bg-muted/50',
          disabled && 'cursor-not-allowed opacity-50',
          error ? 'border-destructive' : 'border-muted-foreground/25',
          currentPreview ? 'h-32 w-32' : 'h-32 w-full'
        )}
      >
        {currentPreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPreview}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-muted-foreground">
            <div className="rounded-full bg-muted p-2">
              <Upload className="h-5 w-5" />
            </div>
            <span className="text-xs text-center">{label}</span>
            <span className="text-[10px]">JPEG, PNG, WebP (max 5MB)</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
