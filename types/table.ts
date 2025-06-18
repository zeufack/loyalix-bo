export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface FilterState {
  id: string;
  value: any;
}

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SearchConfig {
  columnId: string;
  placeholder: string;
  className?: string;
}

export interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options: FilterOption[];
}

export interface DataTableToolbarConfig {
  search?: SearchConfig;
  facetedFilters?: FacetedFilterConfig[];
  showViewOptions?: boolean;
  showResetButton?: boolean;
  customActions?: React.ReactNode;
}

export interface TableMeta {
  updateData: (rowIndex: number, columnId: string, value: any) => void;
}
