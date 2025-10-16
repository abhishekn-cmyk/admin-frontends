import { useEffect, useState } from "react";
import PageHeading from "@/layout/PageHeading";
import TableLoading from "@/components/shared/TableLoading";
import DeleteDialog from "@/components/shared/DeleteDialog";
import UserForm from "@/components/form/UserForm";
import { Button } from "@/components/ui/button";
import { TUser } from "@/types/api";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { useDeleteUser, useUsers } from "@/hooks/useUser";
import { getUserStats } from "@/api/user";

interface IPLABAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface IPLABSession {
  examId: string;
  currentQuestion: number;
  answers: IPLABAnswer[];
  flaggedQuestions: number[];
  completed: boolean;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface IUserStats {
  gapmaps: any[];
  cvDetails: any[];
  interviewDetails: any[];
  plabQuizzes: IPLABSession[];
}

interface IUserStatsResponse {
  gapmaps: number;
  cvs: number;
  interviews: number;
  gapmapDetails: any[];
  cvDetails: any[];
  interviewDetails: any[];
  plabquiz: IPLABSession[];
}

export default function Users() {
  const { data, isLoading } = useUsers();
  const [editingUser, setEditingUser] = useState<TUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { mutate: handleDeleteMutation } = useDeleteUser();
  const [deleteUser, setDeleteUser] = useState<TUser | null>(null);

  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<Record<string, IUserStats>>({});

  const allUsers: TUser[] = data?.data || [];
  useEffect(() => {
    if (allUsers.length === 0) return;

    const fetchStats = async () => {
      const newStats: Record<string, IUserStats> = {};

      await Promise.all(
        allUsers.map(async (user) => {
          if (!user._id) return;
          try {
            const resStats: AxiosResponse<IUserStatsResponse> =
              await getUserStats(user._id);

            const data = resStats.data;
            newStats[user._id] = {
              gapmaps: data.gapmapDetails || [],
              cvDetails: data.cvDetails || [],
              interviewDetails: data.interviewDetails || [],
              plabQuizzes: data.plabquiz || [],
            };
          } catch {
            newStats[user._id] = {
              gapmaps: [],
              cvDetails: [],
              interviewDetails: [],
              plabQuizzes: [],
            };
          }
        }),
      );

      setUserStats(newStats);
    };

    fetchStats();
  }, [allUsers]);

  const handleEditUser = (user: TUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user: TUser) => {
    setDeleteUser(user);
  };

  const confirmDelete = async () => {
    if (!deleteUser?._id) return;
    handleDeleteMutation(deleteUser._id);
  };

  const openStatsModal = (title: string, userId: string) => {
    const stats = userStats[userId];
    if (!stats) {
      toast("No records found for this user");
      return;
    }

    let data: any[] = [];
    if (title === "GapMap Forms") data = stats.gapmaps;
    else if (title === "CVs Uploaded") data = stats.cvDetails;
    else if (title === "Interviews Attended") data = stats.interviewDetails;
    else if (title === "PLAB Quiz") data = stats.plabQuizzes;

    if (!data || data.length === 0) {
      toast("No records found");
      return;
    }

    const formattedData = data.map((item) => {
      if (title === "GapMap Forms") {
        return {
          ...item.personal,
          ...item.status,
          ...item.goals,
          "Completed Exams": item.examsData?.completedExams?.join(", ") ?? "-",
          "Exam Dates": item.examsData?.examDates
            ? Object.entries(item.examsData.examDates)
                .map(
                  ([exam, date]) =>
                    `${exam}: ${new Date(date as string | number | Date).toLocaleDateString()}`,
                )
                .join("\n")
            : "-",
          "Current Study": item.examsData?.currentStudy ?? "-",
          user_id: item.user_id,
          token: item.token,
          CreatedAt: new Date(item.createdAt).toLocaleString(),
          UpdatedAt: new Date(item.updatedAt).toLocaleString(),
        };
      } else if (title === "CVs Uploaded") {
        return {
          ...item.personalInfo,
          ...item.experience,
          ...item.education,
          Audits: item.achievements?.audits?.join(", ") ?? "-",
          Research: item.achievements?.research?.join(", ") ?? "-",
          Teaching: item.achievements?.teaching?.join(", ") ?? "-",
          CPD: item.achievements?.cpd?.join(", ") ?? "-",
          Languages: item.additional?.languages?.join(", ") ?? "-",
          Interests: item.additional?.interests ?? "-",
          Availability: item.additional?.availability ?? "-",
          user_id: item.user_id,
          token: item.token,
          category: item.category,
          CreatedAt: new Date(item.createdAt).toLocaleString(),
          UpdatedAt: new Date(item.updatedAt).toLocaleString(),
        };
      } else if (title === "Interviews Attended") {
        return {
          userId: item.userId,
          ...item.config,
          Questions:
            item.questions
              ?.map((q: any) => `${q.category}: ${q.text} (${q.timeLimit}s)`)
              .join("\n") ?? "-",
          Answers: item.answers?.join("\n") ?? "-",
          StartedAt: item.startedAt
            ? new Date(item.startedAt).toLocaleString()
            : "-",
          CompletedAt: item.completedAt
            ? new Date(item.completedAt).toLocaleString()
            : "-",
        };
      } else if (title === "PLAB Quiz") {
        return {
          ExamId: item.examId,
          Completed: item.completed ? "Yes" : "No",
          Score: item.score,
          "Current Question": item.currentQuestion,
          Answers:
            item.answers
              ?.map(
                (a: IPLABAnswer) =>
                  `Q:${a.questionId ?? "-"} | Your:${a.selectedAnswer ?? "-"} | Correct:${a.correctAnswer ?? "-"} | ${
                    a.isCorrect ? "✔️" : "❌"
                  }`,
              )
              ?.join("\n") ?? "-",
          Flags: item.flaggedQuestions?.join(", ") ?? "-",
          CreatedAt: new Date(item.createdAt).toLocaleString(),
          UpdatedAt: new Date(item.updatedAt).toLocaleString(),
        };
      }
      return {};
    });

    setModalTitle(title);
    setModalData(formattedData);
    setStatsModalOpen(true);
  };

  const renderCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
      return Object.entries(value)
        .map(([k, v]) => {
          if (
            typeof v === "string" ||
            typeof v === "number" ||
            v instanceof Date
          ) {
            const date = new Date(v as string | number | Date);
            return !isNaN(date.getTime())
              ? `${k}: ${date.toLocaleDateString()}`
              : `${k}: ${v}`;
          }
          return `${k}: ${v}`;
        })
        .join("\n");
    }
    return String(value);
  };

  return (
    <>
      <PageHeading
        title="Users"
        description="Manage users"
        onClick={() => {
          setEditingUser(null);
          setIsFormOpen(true);
        }}
      />

      {isLoading ? (
        <TableLoading />
      ) : (
        <div className="bg-card rounded-b-lg border border-t-0 p-4">
          <table className="min-w-full divide-y">
            <thead className="bg-card">
              <tr>
                {[
                  "First Name",
                  "Last Name",
                  "Email",
                  "GapMaps",
                  "CVs",
                  "Interviews",
                  "PLAB Quiz",
                  "Actions",
                ].map((i) => (
                  <th
                    className="px-4 py-2 text-left text-sm font-semibold"
                    key={i}
                  >
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allUsers?.map((user) => {
                if (!user._id) return null;
                const stats = userStats[user._id] || {
                  gapmaps: [],
                  cvDetails: [],
                  interviewDetails: [],
                  plabQuizzes: [],
                };
                return (
                  <tr key={user._id}>
                    <td className="px-4 py-2 text-sm">
                      {user.firstName ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {user.lastName ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-sm">{user.email ?? "-"}</td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openStatsModal("GapMap Forms", user._id!)
                        }
                      >
                        GapMaps
                        <span className="ml-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                          {stats.gapmaps.length}
                        </span>
                      </Button>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openStatsModal("CVs Uploaded", user._id!)
                        }
                      >
                        CVs
                        <span className="ml-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                          {stats.cvDetails.length}
                        </span>
                      </Button>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openStatsModal("Interviews Attended", user._id!)
                        }
                      >
                        Interviews
                        <span className="ml-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-800">
                          {stats.interviewDetails.length}
                        </span>
                      </Button>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStatsModal("PLAB Quiz", user._id!)}
                      >
                        PLAB Quiz
                        <span className="ml-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                          {stats.plabQuizzes.length}
                        </span>
                      </Button>
                    </td>
                    <td className="flex gap-2 px-4 py-2 text-sm">
                      <Button size="sm" onClick={() => handleEditUser(user)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Modal */}
      {statsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setStatsModalOpen(false)}
              className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="mb-4 text-2xl font-semibold">{modalTitle}</h2>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    {modalData.length > 0 &&
                      Object.keys(modalData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left font-semibold whitespace-nowrap text-gray-700"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {modalData.map((row: any, idx: number) => (
                    <tr key={idx}>
                      {Object.keys(row).map((key) => (
                        <td
                          key={key}
                          className="px-4 py-2 whitespace-pre-line text-gray-800"
                        >
                          {renderCellValue(row[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setStatsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={editingUser ?? undefined}
      />

      <DeleteDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
