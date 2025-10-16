import { useState, useMemo } from "react";
import { useExams } from "@/hooks/use-exam";
import AddExam from "./AddExams";
import EditExam from "./EditExams";
import { 
  Calendar, 
  Users, 
  FileText, 
  Layers, 
  Edit, 
  Trash, 
  Loader2, 
  Plus,
  Clock,
  BarChart3
} from "lucide-react";


export default function Exams() {
 const { exams, isLoading, addExam, updateExamMutation, deleteExamMutation } = useExams();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const now = new Date();
    const totalThisMonth = exams.filter((e) => {
      const d = new Date(e.createdAt || "");
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const enrolledUsers = exams.reduce(
      (sum, e) => sum + (e.enrolledUsers || 0),
      0
    );

    const nextWeek = exams.filter((e) => {
      if (!e.startDate) return false;
      const d = new Date(e.startDate);
      return d >= now && d <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).length;

    const typeCount = new Set(exams.map((e) => e.category)).size;
    return { totalThisMonth, enrolledUsers, nextWeek, typeCount };
  }, [exams]);

  // ✅ Spinner Overlay
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="ml-3 text-lg font-medium text-gray-700 mt-3">
            Loading Exams...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>
          <p className="text-gray-500">Create and manage all exam content</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          onClick={() => setOpenAdd(true)}
        >
          <Plus size={18} />
          <span>Add New Exam</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Exams This Month</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalThisMonth}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <BarChart3 size={14} className="mr-1" />
            <span>Current month exams</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Users Enrolled</p>
              <p className="text-2xl font-bold text-gray-800">{stats.enrolledUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <BarChart3 size={14} className="mr-1" />
            <span>Total enrollments</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming (7 days)</p>
              <p className="text-2xl font-bold text-gray-800">{stats.nextWeek}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Starting soon</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Exam Categories</p>
              <p className="text-2xl font-bold text-gray-800">{stats.typeCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Layers className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <BarChart3 size={14} className="mr-1" />
            <span>Unique categories</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Exams</h2>
          <p className="text-sm text-gray-500">Manage your exam content and settings</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-600 text-sm">Title</th>
                <th className="p-4 font-medium text-gray-600 text-sm">Category</th>
                <th className="p-4 font-medium text-gray-600 text-sm">Schedule</th>
                <th className="p-4 font-medium text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No exams found</p>
                    <button 
                      className="text-blue-600 hover:text-blue-800 mt-2 font-medium"
                      onClick={() => setOpenAdd(true)}
                    >
                      Create your first exam
                    </button>
                  </td>
                </tr>
              ) : (
                exams.map((exam: any) => (
                  <tr key={exam._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800">{exam.title}</p>
                        {exam.subtitle && (
                          <p className="text-sm text-gray-500 mt-1">{exam.subtitle}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {exam.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {exam.startDate && exam.endDate ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-700">
                            {new Date(exam.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-gray-500">
                            to {new Date(exam.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                          onClick={() => {
                            setSelectedExam(exam);
                            setOpenEdit(true);
                          }}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                          onClick={() => deleteExamMutation.mutate(exam._id)}
                        >
                          <Trash size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
            <AddExam
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSave={(data) => addExam.mutate(data)}
      />
      <EditExam
        open={openEdit}
        onOpenChange={setOpenEdit}
        exam={selectedExam}
       onUpdate={(data) => {
  if (!data._id) return; // skip update if ID is missing
  updateExamMutation.mutate({ id: data._id, payload: data });
}}
      />

    </div>
  );
}
