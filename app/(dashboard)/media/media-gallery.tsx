'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadMedia, deleteMedia } from '@/app/api/media';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

export default function MediaGallery() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, 'uploads');
      }
      toast.success(`${files.length} file(s) uploaded successfully`);
      await queryClient.invalidateQueries({ queryKey: ['media'] });
    } catch (error) {
      toast.error('Failed to upload file(s)');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Media Gallery</CardTitle>
            <CardDescription>
              Upload and manage images (JPEG, PNG, WebP - max 5MB)
            </CardDescription>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-16 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Upload images to get started
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports JPEG, PNG, WebP up to 5MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
