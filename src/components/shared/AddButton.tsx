import { useNavigate, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function AddButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddClick = () => navigate(`${location.pathname}/add`);

  return (
    <Button onClick={handleAddClick}>
      <Plus /> Add New
    </Button>
  );
}
