import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import PublicationDialog from "./PublicationDialog";
import FocusAreaDialog from "./FocusAreaDialog";
import PartnershipDialog from "./PartnershipDialog";
import ParticipationDialog from "./ParticipationDialog";
import ProposalDialog from "./ProposalDialog";

import { SectionType, ICounts } from "@/types/research";
import { useResearchCounts } from "@/hooks/useResearch";

export default function Research() {
  const [openDialog, setOpenDialog] = useState<SectionType | null>(null);

  const { data: counts, isLoading, refetch } = useResearchCounts();

  const sections: {
    title: string;
    key: keyof ICounts;
    dialog: SectionType;
  }[] = [
    { title: "Publications", key: "publications", dialog: "publication" },
    { title: "Focus Areas", key: "focusAreas", dialog: "focus" },
    { title: "Partnerships", key: "partnerships", dialog: "partnership" },
    { title: "Participations", key: "participations", dialog: "participation" },
    { title: "Proposals", key: "proposals", dialog: "proposal" },
  ];

  const chartData = useMemo(() => {
    if (!counts) return [];
    return sections.map((s) => ({
      name: s.title,
      value: counts[s.key],
    }));
  }, [counts]);

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Admin Research Dashboard
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Manage all research data in one place
          </p>
        </header>

        {/* Count Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-12">
          {sections.map((section, idx) => (
            <Card
              key={idx}
              className="shadow-md rounded-2xl border border-gray-200 bg-white text-center py-6"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-indigo-600">
                  {isLoading ? "..." : counts?.[section.key]}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={() => setOpenDialog(section.dialog)}
                >
                  <PlusCircle className="w-4 h-4 mr-1" /> Add
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card className="shadow-md rounded-2xl border border-gray-200 bg-white p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Research Data Distribution (%)
          </h2>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >

                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name: string, entry: any) =>
                    `${value} (${(entry.percent * 100).toFixed(1)}%)`
                  }
                  contentStyle={{ borderRadius: "10px", padding: "6px 10px" }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dialog Components */}
        <PublicationDialog
          open={openDialog === "publication"}
          onClose={() => {
            setOpenDialog(null);
            refetch();
          }}
        />
        <FocusAreaDialog
          open={openDialog === "focus"}
          onClose={() => {
            setOpenDialog(null);
            refetch();
          }}
        />
        <PartnershipDialog
          open={openDialog === "partnership"}
          onClose={() => {
            setOpenDialog(null);
            refetch();
          }}
        />
        <ParticipationDialog
          open={openDialog === "participation"}
          onClose={() => {
            setOpenDialog(null);
            refetch();
          }}
        />
        <ProposalDialog
          open={openDialog === "proposal"}
          onClose={() => {
            setOpenDialog(null);
            refetch();
          }}
        />
      </motion.div>
    </div>
  );
}
