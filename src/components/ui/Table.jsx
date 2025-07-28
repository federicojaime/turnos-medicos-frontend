// ====== src/components/ui/Table.jsx ACTUALIZADO ======
import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Pagination from '../common/Pagination';
import Badge from './Badge';
import Card from './Card';
import { SkeletonTable } from './Skeleton'; // Importar desde Skeleton.jsx

export default function Table({
  columns,
  data,
  pagination = null,
  onPageChange,
  sortable = true,
  loading = false,
  className = '',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    if (column.type === 'badge') {
      return <Badge variant={column.variant?.(item[column.key])}>{item[column.key]}</Badge>;
    }

    if (column.type === 'date') {
      return new Date(item[column.key]).toLocaleDateString();
    }

    return item[column.key];
  };

  if (loading) {
    return <SkeletonTable rows={5} />;
  }

  return (
    <Card className={`overflow-hidden ${className}`} padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  }`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && sortConfig.key === column.key && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      )}

      {pagination && (
        <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </Card>
  );
}