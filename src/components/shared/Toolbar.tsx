import { ArrowDown, ArrowUp, Eye, Trash2, X } from "lucide-react";

type ToolbarProps = {
  number: number;
  label: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onClose: () => void;
  onView: () => void;
  onDelete: () => void;
};

export default function Toolbar({
  number,
  label,
  onClose,
  onMoveUp,
  onMoveDown,
  onView,
  onDelete,
}: ToolbarProps) {
  return (
    <div className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 transition-all hover:scale-105">
      <div className="bg-background/95 flex w-fit items-center gap-x-3 rounded-xl border p-2 shadow-xl backdrop-blur-lg">
        <button
          className="bg-background hover:bg-background/90 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-xs transition-all"
          onClick={onClose}
        >
          <X strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-x-1 text-sm">
          <span className="bg-primary text-primary-foreground inline-flex w-fit min-w-8 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px]">
            {number}
          </span>{" "}
          <span className="hidden sm:inline">{label}</span> selected
        </div>

        {number === 1 && (
          <>
            <button
              className="bg-background hover:bg-background/90 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-xs transition-all"
              onClick={onView}
            >
              <Eye strokeWidth={1.5} />
            </button>

            {onMoveUp && (
              <>
                <button
                  className="bg-background hover:bg-background/90 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-xs transition-all"
                  onClick={onMoveUp}
                >
                  <ArrowUp strokeWidth={1.5} />
                </button>

                <button
                  className="bg-background hover:bg-background/90 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-sm font-medium shadow-xs transition-all"
                  onClick={onMoveDown}
                >
                  <ArrowDown strokeWidth={1.5} />
                </button>
              </>
            )}
          </>
        )}

        <button
          className="bg-destructive hover:bg-destructive/90 inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-xs font-medium text-white shadow-xs transition-all"
          onClick={onDelete}
        >
          <Trash2 strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
