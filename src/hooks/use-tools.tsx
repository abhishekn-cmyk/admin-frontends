import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tool, Category } from "@/types/tool";
import { fetchTools, createTool, updateTool, deleteTool, addCategory } from "@/api/tool";
import { toast } from "sonner";

export function useTools() {
  const queryClient = useQueryClient();

  // Fetch all tools
  const { data: tools = [], isLoading } = useQuery<Tool[], Error>({
    queryKey: ["tools"],
    queryFn: fetchTools,
  });

  // Add Tool
  const addToolMutation = useMutation({
    mutationFn: createTool,
    onSuccess: () => {
      toast.success("✅ Tool added successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: () => toast.error("❌ Failed to add tool"),
  });

  // Update Tool
  const updateToolMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateTool(id, formData),
    onSuccess: () => {
      toast.success("✅ Tool updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: () => toast.error("❌ Failed to update tool"),
  });

  // Delete Tool
  const deleteToolMutation = useMutation({
    mutationFn: (id: string) => deleteTool(id),
    onSuccess: () => {
      toast.success("✅ Tool deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: () => toast.error("❌ Failed to delete tool"),
  });

  // Add Category to a Tool
  // top of component
const addCategoryMutation = useMutation({
  mutationFn: ({ toolId, category }: { toolId: string; category: Category }) =>
    addCategory(toolId, category),
  onSuccess: () => {
    toast.success("✅ Category added");
    queryClient.invalidateQueries({ queryKey: ["tools"] });
  },
  onError: () => toast.error("❌ Failed to add category"),
});


  return {
    tools,
    isLoading,
    addToolMutation,
    updateToolMutation,
    deleteToolMutation,
    addCategoryMutation,
  };
}
