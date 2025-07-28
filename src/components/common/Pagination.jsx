// ====== src/components/common/Pagination.jsx ======
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = "" 
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}