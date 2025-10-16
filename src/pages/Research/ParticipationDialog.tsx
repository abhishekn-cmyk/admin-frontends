import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ParticipationDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participation</DialogTitle>
        </DialogHeader>

        {/* Form or content goes here */}
        <div className="p-4">
          <p className="text-gray-600">Form for adding a participation entry.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
