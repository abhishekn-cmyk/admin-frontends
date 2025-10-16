import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

type PageHeadingProps = {
  title: string;
  description: string;
  onClick?: () => void;
};

export default function PageHeading({
  title,
  description,
  onClick,
}: PageHeadingProps) {
  return (
    <>
      <div className="flex justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {onClick && (
          <Button onClick={onClick}>
            <Plus /> Add New
          </Button>
        )}
      </div>

      <Separator className="my-5" />
    </>
  );
}
