import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TMentorApplication } from "@/types/api";
import InputLabel from "../shared/InputLabel";
import { useState } from "react";
import { useRejectMentor ,useApproveMentor} from "@/hooks/useMentorApplication";
import { Button } from "../ui/button";
import {
  updateMentorApplicationTermsWithFile,
  uploadTermsFile,
} from "@/api/mentorApplication";
import { toast } from "sonner";

type MentorApplicationFormProps = {
  isOpen: boolean;
  onClose: () => void;
  mentorApplication?: TMentorApplication | null;
};

export default function MentorApplicationForm({
  isOpen,
  onClose,
  mentorApplication,
}: MentorApplicationFormProps) {
  const { mutate: rejectMentor } = useRejectMentor();
  const { mutate: approveMentor } = useApproveMentor();

  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    mentorApplication?.status || "pending",
  );
  const [remarks, setRemarks] = useState<string>(
    mentorApplication?.remarks || "",
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdateTerms = async () => {
    if (!file || !mentorApplication?._id) return;

    try {
      const uploadRes = await uploadTermsFile(file);
      const filePath = uploadRes.filePath; // whatever your /upload API returns

      await updateMentorApplicationTermsWithFile(
        mentorApplication._id,
        filePath,
      );
      toast.success("Terms updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update terms");
    }
  };

  const handleUpdateStatus = () => {
    if (!mentorApplication?._id) return;

    if (status === "approved") {
      approveMentor(mentorApplication._id);
    } else if (status === "rejected") {
      rejectMentor({ id: mentorApplication._id, remarks: remarks });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mentorApplication
              ? "Mentor Application Details"
              : "Create Mentor Application"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Review the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Readonly Fields */}
          <InputLabel
            label="Full Name"
            readOnly
            value={mentorApplication?.fullName}
          />
          <InputLabel label="Email" readOnly value={mentorApplication?.email} />
          <InputLabel label="Phone" readOnly value={mentorApplication?.phone} />
          <InputLabel
            label="GMC Number"
            readOnly
            value={mentorApplication?.gmcNumber}
          />
          <InputLabel
            label="Specialty"
            readOnly
            value={mentorApplication?.specialty}
          />
          <InputLabel
            label="Current NHS Trust"
            readOnly
            value={mentorApplication?.currentNhsTrust}
          />
          <InputLabel
            label="Current Role"
            readOnly
            value={mentorApplication?.currentRole}
          />
          <InputLabel
            label="Clinical Experience (Years)"
            readOnly
            value={mentorApplication?.clinicalExperienceYears?.toString()}
          />
          <InputLabel
            label="NHS Experience (Years)"
            readOnly
            value={mentorApplication?.nhsExperienceYears?.toString()}
          />
          <InputLabel
            label="Mentor Tier"
            readOnly
            value={mentorApplication?.mentorTier}
          />
          <InputLabel label="Bio" readOnly value={mentorApplication?.bio} />
          <InputLabel
            label="Mentorship Areas"
            readOnly
            value={mentorApplication?.mentorshipAreas?.join(", ")}
          />
          <InputLabel
            label="Hourly Rate"
            readOnly
            value={mentorApplication?.hourlyRate?.toString()}
          />
          <InputLabel
            label="Meet Link"
            readOnly
            value={mentorApplication?.meetLink}
          />

          {/* Files / Certificates */}
          <InputLabel
            label="Resume"
            readOnly
            value={mentorApplication?.resume}
          />
          <InputLabel
            label="GMC Certificate"
            readOnly
            value={mentorApplication?.gmcCertificate}
          />
          <InputLabel
            label="Medical Certificate"
            readOnly
            value={mentorApplication?.medicalcertificate}
          />
          <InputLabel
            label="Photo ID"
            readOnly
            value={mentorApplication?.photoID}
          />
          <InputLabel
            label="Additional Certificate"
            readOnly
            value={mentorApplication?.additionalCertificate}
          />
          <InputLabel
            label="Recording Consent"
            readOnly
            value={mentorApplication?.recordingConsent ? "Yes" : "No"}
          />

          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            <Button type="button" onClick={handleUpdateTerms}>
              Update Terms
            </Button>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="rounded-md border p-2"
            >
              <option value="pending" className="bg-background text-primary">
                Pending
              </option>
              <option value="approved" className="bg-background text-primary">
                Approved
              </option>
              <option value="rejected" className="bg-background text-primary">
                Rejected
              </option>
            </select>

            {status === "rejected" && (
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks for rejection"
                className="mt-2 rounded-md border p-2"
              />
            )}

            <Button type="button" onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
