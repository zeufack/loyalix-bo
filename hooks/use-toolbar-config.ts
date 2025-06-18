import { AlertCircle, CheckCircle2, UserCheck, UserX } from 'lucide-react';
import { DataTableToolbarConfig } from '../types/table';

export const getCustomerToolbarConfig = (): DataTableToolbarConfig => ({
  search: {
    columnId: 'name',
    placeholder: 'Filter customers...'
  },
  facetedFilters: [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  ]
});

export const getBusinessToolbarConfig = (): DataTableToolbarConfig => ({
  search: {
    columnId: 'name',
    placeholder: 'Filter businesses...'
  },
  facetedFilters: [
    {
      columnId: 'businessType',
      title: 'Business Type',
      options: [
        { label: 'Retail', value: 'retail' },
        { label: 'Service', value: 'service' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Wholesale', value: 'wholesale' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      columnId: 'address',
      title: 'Has Address',
      options: [
        { label: 'With Address', value: 'with_address' },
        { label: 'Without Address', value: 'without_address' }
      ]
    }
  ],
  showViewOptions: true,
  showResetButton: true
});

export const getUserToolbarConfig = (): DataTableToolbarConfig => ({
  search: {
    columnId: 'email',
    placeholder: 'Search users by email...',
    className: 'w-[250px]' // Wider input for emails
  },
  facetedFilters: [
    {
      columnId: 'isActive',
      title: 'Account Status',
      options: [
        {
          label: 'Active',
          value: 'true',
          icon: UserCheck
        },
        {
          label: 'Inactive',
          value: 'false',
          icon: UserX
        }
      ]
    },
    {
      columnId: 'createdAt',
      title: 'Registration Period',
      options: [
        { label: 'Last 7 Days', value: '7d' },
        { label: 'Last 30 Days', value: '30d' },
        { label: 'Last Year', value: '1y' },
        { label: 'Older', value: 'older' }
      ]
    }
  ],
  showViewOptions: true,
  showResetButton: true
});

// Hook for creating custom toolbar configurations
export const useToolbarConfig = (
  entityType: 'customer' | 'user' | 'custom' | 'business',
  customConfig?: DataTableToolbarConfig
): DataTableToolbarConfig => {
  if (entityType === 'custom' && customConfig) {
    return customConfig;
  }

  switch (entityType) {
    case 'customer':
      return getCustomerToolbarConfig();
    case 'business':
      return getBusinessToolbarConfig();
    case 'user':
      return getUserToolbarConfig();
    default:
      return customConfig || { showViewOptions: true };
  }
};
