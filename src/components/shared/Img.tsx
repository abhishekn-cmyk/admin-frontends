import { cn } from "@/lib/utils";

type ImgProps = {
  dynamic?: boolean;
  src: string;
  className?: string;
};

export default function Img({ dynamic, src, className }: ImgProps) {
  return (
    <img
      src={dynamic ? `${import.meta.env.VITE_API_BASE_URL}/${src}` : src}
      className={cn("size-14 rounded-md", className)}
    />
  );
}
