import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableToolbarConfig } from '../../types/table';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  config: DataTableToolbarConfig;
}

const statusOptions = [
  {
    label: 'Active',
    value: 'active'
  },
  {
    label: 'Inactive',
    value: 'inactive'
  }
];

export function DataTableToolbar<TData>({
  table,
  config
}: Readonly<DataTableToolbarProps<TData>>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const {
    search,
    facetedFilters = [],
    showViewOptions = true,
    showResetButton = true,
    customActions
  } = config;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Search Input */}
        {search && table.getColumn(search.columnId) && (
          <Input
            placeholder={search.placeholder}
            value={
              (table.getColumn(search.columnId)?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn(search.columnId)
                ?.setFilterValue(event.target.value)
            }
            className={search.className ?? 'h-8 w-[150px] lg:w-[250px]'}
          />
        )}

        {/* Faceted Filters */}
        {facetedFilters.map((filter) => {
          const column = table.getColumn(filter.columnId);
          return column ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          ) : null;
        })}

        {/* Custom Actions */}
        {customActions}

        {/* Reset Button */}
        {showResetButton && isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* View Options */}
      {showViewOptions && <DataTableViewOptions table={table} />}
    </div>
  );
}
