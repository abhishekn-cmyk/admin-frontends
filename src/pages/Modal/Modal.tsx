import { useState } from "react";
import { useAdminGetAllConsents, useAdminCreateConsent, useAdminUpdateConsent } from "@/hooks/useConsent";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus,Edit, User} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ConsentTable() {
  const { data: consents } = useAdminGetAllConsents();
  const createConsent = useAdminCreateConsent();
  const updateConsent = useAdminUpdateConsent();

  const [search, setSearch] = useState("");

  // -------------------------
  // Modal states
  // -------------------------
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [currentConsent, setCurrentConsent] = useState<any>(null);

  // -------------------------
  // Form states
  // -------------------------
  const [userId, setUserId] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [choice, setChoice] = useState<"accept_all" | "essential_only" | "decline">("accept_all");
  const [policyVersion, setPolicyVersion] = useState("1.0.0");
  const [policyTitle, setPolicyTitle] = useState("Default Policy");
  const [policyDescription, setPolicyDescription] = useState("Default policy description");
  const [sections, setSections] = useState<{ heading: string; content: string }[]>([{ heading: "", content: "" }]);

  // -------------------------
  // Policy Section Handlers
  // -------------------------
//   const handleAddSection = () => setSections([...sections, { heading: "", content: "" }]);
//   const handleRemoveSection = (index: number) => setSections(sections.filter((_, i) => i !== index));
//   const handleSectionChange = (index: number, field: "heading" | "content", value: string) => {
//     const newSections = [...sections];
//     newSections[index][field] = value;
//     setSections(newSections);
//   };

  // -------------------------
  // Create Consent Handler
  // -------------------------
  const handleCreateConsent = () => {
    if (!policyTitle || !policyVersion || !policyDescription || sections.some(s => !s.heading || !s.content)) {
      toast.error("Please fill all policy fields and section details");
      return;
    }

    createConsent.mutate(
      {
        userId: userId || undefined,
        ipAddress: ipAddress || undefined,
        choice,
        policy: { version: policyVersion, title: policyTitle, description: policyDescription, sections },
      },
      {
        onSuccess: () => {
          toast.success("Consent created successfully!");
          setCreateOpen(false);
          resetForm();
        },
      }
    );
  };

  // -------------------------
  // Update Consent Handler
  // -------------------------
 const handleUpdateConsent = () => {
  if (!currentConsent) return;

  updateConsent.mutate(
    {
      // either userId or ipAddress
      userId: currentConsent.userId,
      ipAddress: currentConsent.ipAddress,
      choice,
      policy: {
        version: policyVersion,
        title: policyTitle,
        description: policyDescription,
        sections,
      },
    },
    {
      onSuccess: () => {
        toast.success("Consent updated successfully!");
        setUpdateOpen(false);
        setCurrentConsent(null);
      },
    }
  );
};

  const openUpdateModal = (consent: any) => {
    setCurrentConsent(consent);
    setUserId(consent.userId || "");
    setIpAddress(consent.ipAddress || "");
    setChoice(consent.choice);
    setPolicyVersion(consent.policy?.version || "1.0.0");
    setPolicyTitle(consent.policy?.title || "Default Policy");
    setPolicyDescription(consent.policy?.description || "Default policy description");
    setSections(consent.policy?.sections || [{ heading: "", content: "" }]);
    setUpdateOpen(true);
  };

  const resetForm = () => {
    setUserId("");
    setIpAddress("");
    setChoice("accept_all");
    setPolicyVersion("1.0.0");
    setPolicyTitle("Default Policy");
    setPolicyDescription("Default policy description");
    setSections([{ heading: "", content: "" }]);
  };

  // -------------------------
  // Search Filter
  // -------------------------
  const filteredConsents = consents?.filter(c =>
    c.userId?.toLowerCase().includes(search.toLowerCase()) ||
    c.ipAddress?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="shadow-lg rounded-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6 rounded-t-xl border-b flex justify-between items-center">
        <CardTitle className="text-2xl font-bold text-gray-800">User Consents</CardTitle>

        {/* Create Consent */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Create Consent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Consent</DialogTitle>
            </DialogHeader>
            <ConsentForm
              userId={userId}
              setUserId={setUserId}
              ipAddress={ipAddress}
              setIpAddress={setIpAddress}
              choice={choice}
              setChoice={setChoice}
              policyVersion={policyVersion}
              setPolicyVersion={setPolicyVersion}
              policyTitle={policyTitle}
              setPolicyTitle={setPolicyTitle}
              policyDescription={policyDescription}
              setPolicyDescription={setPolicyDescription}
              sections={sections}
              setSections={setSections}
              onSubmit={handleCreateConsent}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex mb-4 gap-4">
          <Input
            placeholder="Search by User ID or IP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-full"
          />
        </div>

        {/* Consent Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Consent Choice</th>
                <th className="px-4 py-3 text-left">IP Address</th>
                <th className="px-4 py-3 text-left">Last Updated</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConsents?.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2">
                    {c.userId ? <><User className="h-4 w-4 text-blue-500" />{c.userId}</> : <span className="text-gray-400 italic">Guest</span>}
                  </td>
                  <td className="px-4 py-3">{c.choice.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{c.ipAddress || '-'}</td>
                  <td className="px-4 py-3">{new Date(c.updatedAt || "").toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" onClick={() => openUpdateModal(c)} className="rounded-lg bg-yellow-500 hover:bg-yellow-600 flex items-center">
                      <Edit className="h-4 w-4 mr-1" /> Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update Consent Modal */}
        <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Consent</DialogTitle>
            </DialogHeader>
            {currentConsent && (
              <ConsentForm
                userId={userId}
                setUserId={setUserId}
                ipAddress={ipAddress}
                setIpAddress={setIpAddress}
                choice={choice}
                setChoice={setChoice}
                policyVersion={policyVersion}
                setPolicyVersion={setPolicyVersion}
                policyTitle={policyTitle}
                setPolicyTitle={setPolicyTitle}
                policyDescription={policyDescription}
                setPolicyDescription={setPolicyDescription}
                sections={sections}
                setSections={setSections}
                onSubmit={handleUpdateConsent}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// -------------------------
// ConsentForm Component
// -------------------------
interface ConsentFormProps {
  userId: string;
  setUserId: (v: string) => void;
  ipAddress: string;
  setIpAddress: (v: string) => void;
  choice: "accept_all" | "essential_only" | "decline";
  setChoice: (v: any) => void;
  policyVersion: string;
  setPolicyVersion: (v: string) => void;
  policyTitle: string;
  setPolicyTitle: (v: string) => void;
  policyDescription: string;
  setPolicyDescription: (v: string) => void;
  sections: { heading: string; content: string }[];
  setSections: (v: any) => void;
  onSubmit: () => void;
}

function ConsentForm({
  userId, setUserId,
  ipAddress, setIpAddress,
  choice, setChoice,
  policyVersion, setPolicyVersion,
  policyTitle, setPolicyTitle,
  policyDescription, setPolicyDescription,
  sections, setSections,
  onSubmit
}: ConsentFormProps) {

  const handleAddSection = () => setSections([...sections, { heading: "", content: "" }]);
  const handleRemoveSection = (index: number) => setSections(sections.filter((_, i) => i !== index));
  const handleSectionChange = (index: number, field: "heading" | "content", value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="User ID (optional)" value={userId} onChange={e => setUserId(e.target.value)} />
        <Input placeholder="IP Address (optional)" value={ipAddress} onChange={e => setIpAddress(e.target.value)} />
      </div>

      <Select value={choice} onValueChange={v => setChoice(v as any)}>
        <SelectTrigger className="rounded-lg">
          <SelectValue placeholder="Choice" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="accept_all">Accept All</SelectItem>
          <SelectItem value="essential_only">Essential Only</SelectItem>
          <SelectItem value="decline">Decline</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Policy Version" value={policyVersion} onChange={e => setPolicyVersion(e.target.value)} />
      <Input placeholder="Policy Title" value={policyTitle} onChange={e => setPolicyTitle(e.target.value)} />
      <Input placeholder="Policy Description" value={policyDescription} onChange={e => setPolicyDescription(e.target.value)} />

      <div className="space-y-2">
        {sections.map((sec, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input placeholder="Section Heading" value={sec.heading} onChange={e => handleSectionChange(i, "heading", e.target.value)} />
            <Input placeholder="Section Content" value={sec.content} onChange={e => handleSectionChange(i, "content", e.target.value)} />
            {sections.length > 1 && <Button size="sm" variant="destructive" onClick={() => handleRemoveSection(i)}>Remove</Button>}
          </div>
        ))}
        <Button size="sm" onClick={handleAddSection}>Add Section</Button>
      </div>

      <Button className="mt-4" onClick={onSubmit}>Save Consent</Button>
    </div>
  );
}
