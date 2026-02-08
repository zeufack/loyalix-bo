'use client';

import { useState, useCallback } from 'react';

interface UseImageUploadReturn {
  file: File | null;
  previewUrl: string | null;
  handleChange: (file: File | null) => void;
  reset: () => void;
  setPreviewUrl: (url: string | null) => void;
}

export function useImageUpload(initialUrl?: string | null): UseImageUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrlState] = useState<string | null>(initialUrl || null);

  const handleChange = useCallback((newFile: File | null) => {
    setFile(newFile);
    if (newFile === null) {
      setPreviewUrlState(null);
    }
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setPreviewUrlState(initialUrl || null);
  }, [initialUrl]);

  const setPreviewUrl = useCallback((url: string | null) => {
    setPreviewUrlState(url);
  }, []);

  return {
    file,
    previewUrl,
    handleChange,
    reset,
    setPreviewUrl
  };
}
