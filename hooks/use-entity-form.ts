'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api-error';

interface UseEntityFormOptions<T extends { id: string }, CreateData> {
  createEntity: (data: CreateData) => Promise<T>;
  updateEntity?: (id: string, data: Partial<CreateData>) => Promise<T>;
  uploadImage?: (id: string, file: File) => Promise<any>;
  queryKey: string;
  successMessage: string;
  updateSuccessMessage?: string;
  imageUploadErrorMessage?: string;
}

interface UseEntityFormReturn<T, CreateData> {
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  handleCreate: (
    formData: CreateData,
    imageFile: File | null,
    validate?: () => string | null
  ) => Promise<T | null>;
  handleUpdate: (
    id: string,
    formData: Partial<CreateData>,
    imageFile: File | null,
    validate?: () => string | null
  ) => Promise<T | null>;
}

export function useEntityForm<T extends { id: string }, CreateData>(
  options: UseEntityFormOptions<T, CreateData>
): UseEntityFormReturn<T, CreateData> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleCreate = useCallback(async (
    formData: CreateData,
    imageFile: File | null,
    validate?: () => string | null
  ): Promise<T | null> => {
    if (validate) {
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return null;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const created = await options.createEntity(formData);

      if (imageFile && options.uploadImage) {
        try {
          await options.uploadImage(created.id, imageFile);
        } catch (iconErr) {
          toast.warning(
            options.imageUploadErrorMessage || 
            'Created successfully, but image upload failed. You can add an image by editing.'
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: [options.queryKey] });
      toast.success(options.successMessage);
      return created;
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options, queryClient]);

  const handleUpdate = useCallback(async (
    id: string,
    formData: Partial<CreateData>,
    imageFile: File | null,
    validate?: () => string | null
  ): Promise<T | null> => {
    if (!options.updateEntity) {
      throw new Error('updateEntity function is required for handleUpdate');
    }

    if (validate) {
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return null;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Update text fields
      await options.updateEntity(id, formData);

      // Upload new image if a file was selected
      if (imageFile && options.uploadImage) {
        try {
          await options.uploadImage(id, imageFile);
        } catch (iconErr) {
          toast.warning(
            options.imageUploadErrorMessage || 
            'Updated successfully, but image upload failed.'
          );
        }
      }

      queryClient.invalidateQueries({ queryKey: [options.queryKey] });
      toast.success(options.updateSuccessMessage || options.successMessage);
      return { id } as T;
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options, queryClient]);

  return {
    loading,
    error,
    setError,
    handleCreate,
    handleUpdate
  };
}
