import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUserStats } from "@/hooks/useUser";

type StatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  statsKey: string; // "GapMap Forms" | "CV Forms" | "Interview Forms" | "PLAB Quizzes"
};

export default function StatsModal({
  isOpen,
  onClose,
  userId,
  statsKey,
}: StatsModalProps) {
  const { data, isLoading } = useUserStats(userId);

  // Pick stats based on the key passed
  let stats: any[] = [];
  if (statsKey === "GapMap Forms") stats = data?.gapmapDetails || [];
  if (statsKey === "CV Forms") stats = data?.cvDetails || [];
  if (statsKey === "Interview Forms") stats = data?.interviewDetails || [];
  if (statsKey === "PLAB Quizzes") stats = data?.plabquiz || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {statsKey}
          </DialogTitle>
          <DialogDescription>
            Showing details for {stats.length} items
          </DialogDescription>
        </DialogHeader>

        {isLoading && <p className="mt-4 text-sm">Loading stats…</p>}

        {!isLoading && stats.length === 0 && (
          <p className="text-muted-foreground mt-4 text-sm">No data found.</p>
        )}

        {!isLoading && stats.length > 0 && (
          <div className="mt-4 space-y-3">
            {stats.map((item, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm shadow-sm">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
