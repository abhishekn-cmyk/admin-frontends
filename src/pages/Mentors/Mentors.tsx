import {
  Users,
  UserCheck,
  UserX,
  Wifi,
  Search,
  Edit,
  Trash2,
  Plus,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { AddMentors } from "./AddMentors";
import EditMentors from "./EditMentors";
import { useMentors, useDeleteMentor } from "@/hooks/useMentor";
import AddMentees from "./AddMentees";

export default function Mentors() {
  // ===== State =====
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Use custom hooks
  const { data: mentors = [], isLoading, isError } = useMentors();
  const deleteMutation = useDeleteMentor();

  const handleEdit = (mentor: any) => {
    setSelectedMentor(mentor);
    setEditForm(true);
  };
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // ===== Stats Calculation (useMemo for perf) =====
  const stats = useMemo(() => {
    const total = mentors.length;
    const active = mentors.filter((m: any) => m.status === "active").length;
    const inactive = mentors.filter((m: any) => m.status === "inactive").length;
    const onlineNow = mentors.filter((m: any) => m.mode === "online").length;

    return [
      {
        title: "Total Mentors",
        count: total,
        icon: Users,
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        textColor: "text-blue-500",
      },
      {
        title: "Active Mentors",
        count: active,
        icon: UserCheck,
        color: "bg-gradient-to-r from-green-500 to-green-600",
        textColor: "text-green-500",
      },
      {
        title: "Inactive Mentors",
        count: inactive,
        icon: UserX,
        color: "bg-gradient-to-r from-red-500 to-red-600",
        textColor: "text-red-500",
      },
      {
        title: "Online Now",
        count: onlineNow,
        icon: Wifi,
        color: "bg-gradient-to-r from-purple-500 to-purple-600",
        textColor: "text-purple-500",
      },
    ];
  }, [mentors]);

  // ===== Search + Filter Logic =====
  const filteredMentors = mentors.filter((mentor: any) => {
    const matchesSearch =
      mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : mentor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ===== Pagination Logic =====
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMentors = filteredMentors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Generate pagination buttons with ellipsis for many pages
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm ${
            currentPage === i
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Mentors</h1>
            <p className="mt-1">Mentor Management Dashboard</p>
          </div>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-card flex flex-col rounded-xl border p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      {stat.title}
                    </p>
                    {isLoading ? (
                      <div className="mt-1 h-8 w-12 animate-pulse rounded bg-gray-200"></div>
                    ) : (
                      <p className="mt-1 text-2xl font-bold">{stat.count}</p>
                    )}
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Mentor List ===== */}
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
          {/* Table Header */}
          <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <h2 className="text-lg font-semibold">Mentor List</h2>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-gray-700 sm:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters && <X className="ml-1 h-4 w-4" />}
              </button>

              {/* Search Input */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Controls - Hidden on mobile unless toggled */}
              <div
                className={`${showFilters ? "flex" : "hidden"} flex-col gap-3 sm:flex sm:flex-row`}
              >
                {/* Filter Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="away">Away</option>
                </select>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 transition"
                >
                  Reset
                </button>
              </div>

              {/* Add Mentor Button */}
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white shadow transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Mentor</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Mentor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Specialization
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Experience
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    GMC Certificate
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  // Skeleton loading rows
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                          <div className="ml-4 space-y-2">
                            <div className="h-4 w-32 rounded bg-gray-200"></div>
                            <div className="h-3 w-24 rounded bg-gray-200"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-6 w-16 rounded-full bg-gray-200"></div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-4 w-20 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="h-4 w-12 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="mx-auto h-4 w-10 rounded bg-gray-200"></div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-8 rounded bg-gray-200"></div>
                          <div className="h-8 w-8 rounded bg-gray-200"></div>
                          <div className="h-8 w-8 rounded bg-gray-200"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-red-500 sm:px-6"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-lg font-medium">
                          Failed to load mentors
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Please try again later
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : currentMentors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-gray-500 sm:px-6"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="mb-2 h-12 w-12 text-gray-300" />
                        <div className="text-lg font-medium">
                          No mentors found
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Try adjusting your search or filters
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentMentors.map((mentor: any) => (
                    <tr
                      key={mentor._id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-medium text-white">
                            {mentor.name
                              ? mentor.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {mentor.name}
                            </p>
                            <p className="max-w-[150px] truncate text-xs text-gray-500">
                              {mentor.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            mentor.status === "active"
                              ? "bg-green-100 text-green-800"
                              : mentor.status === "inactive"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {mentor.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
                        {mentor.specialty || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
                        {mentor.clinicalExperienceYears || 0} years
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            mentor.gmcCertificate
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100"
                          }`}
                        >
                          {mentor.gmcCertificate ? "Uploaded" : "Not Uploaded"}
                        </span>
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMentor(mentor);
                              setIsOpen(true);
                            }}
                            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
                            title="Add Mentees"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Mentees</span>
                          </button>

                          <button
                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                            onClick={() => handleEdit(mentor)}
                            title="Edit Mentor"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this mentor?",
                                )
                              ) {
                                deleteMutation.mutate(mentor._id);
                              }
                            }}
                            title="Delete Mentor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-4 sm:flex-row sm:px-6">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredMentors.length)}
                </span>{" "}
                of <span className="font-medium">{filteredMentors.length}</span>{" "}
                results
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {renderPaginationButtons()}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Mentor Modal */}
      {showForm && <AddMentors setOpen={setShowForm} open={showForm} />}

      {/* Edit Mentor Modal */}
      {editForm && (
        <EditMentors
          setOpen={setEditForm}
          open={editForm}
          mentor={selectedMentor}
        />
      )}

      {/* Add Mentees Modal */}
      {isOpen && (
        <AddMentees
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mentor={selectedMentor}
        />
      )}
    </>
  );
}
