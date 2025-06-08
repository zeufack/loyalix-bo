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

export interface TableMeta {
  updateData: (rowIndex: number, columnId: string, value: any) => void;
}
