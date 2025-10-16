import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SaveCancel() {
  return (
    <DialogFooter className="pt-4">
      <DialogClose asChild>
        <Button variant="outline" type="button">
          Cancel
        </Button>
      </DialogClose>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  );
}
