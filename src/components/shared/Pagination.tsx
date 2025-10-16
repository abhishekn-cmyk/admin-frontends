import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectChange?: (limit: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onSelectChange,
  onPageChange,
}: PaginationProps) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Select
          onValueChange={(val) => onSelectChange?.(Number(val))}
          defaultValue="10"
        >
          <SelectTrigger className="w-fit border">
            <SelectValue placeholder={String(currentPage)} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((i) => (
              <SelectItem value={String(i)} key={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p>Rows per page</p>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>{" "}
    </div>
  );
}
