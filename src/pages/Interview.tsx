"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTable from "@/pages/SectionTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  Users,
  Target,
  BarChart3,
  CalendarRange,
} from "lucide-react";

export default function Interview() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    interviewTypes: new Set(),
    specialties: new Set(),
    roles: new Set(),
    completed: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tools/full/sdj`,
        );
        const interviewSessions = res.data.interviewSessions || [];
        setData(interviewSessions);

        // Calculate statistics
        const interviewTypes = new Set();
        const specialties = new Set();
        const roles = new Set();
        let completed = 0;

        interviewSessions.forEach((item: any) => {
          if (item.config?.interviewType)
            interviewTypes.add(item.config.interviewType);
          if (item.config?.specialty) specialties.add(item.config.specialty);
          if (item.config?.role) roles.add(item.config.role);
          if (item.status === "completed") completed++;
        });

        setStats({
          total: interviewSessions.length,
          interviewTypes,
          specialties,
          roles,
          completed,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading Interview Data...</p>
        </div>
      </div>
    );
  }

  const first = data[0] || {};
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Interview Sessions Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive overview of all interview sessions
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Interviews
              </CardTitle>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <p className="mt-1 text-xs text-gray-500">sessions conducted</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completion Rate
              </CardTitle>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {completionRate}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {stats.completed} of {stats.total} completed
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Interview Types
              </CardTitle>
              <div className="rounded-full bg-purple-100 p-3">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {stats.interviewTypes.size}
              </p>
              <p className="mt-1 text-xs text-gray-500">different formats</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Specialties
              </CardTitle>
              <div className="rounded-full bg-orange-100 p-3">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {stats.specialties.size}
              </p>
              <p className="mt-1 text-xs text-gray-500">areas of expertise</p>
            </CardContent>
          </Card>
        </div>

        {/* Detail Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                First Interview Type
              </CardTitle>
              <Clock className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {first?.config?.interviewType || "N/A"}
              </p>
              <div className="mt-2 flex items-center">
                <CalendarRange className="mr-1 h-4 w-4" />
                <p className="text-sm opacity-90">
                  {first?.createdAt
                    ? new Date(first.createdAt).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Specialty</CardTitle>
              <FileText className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {first?.config?.specialty || "N/A"}
              </p>
              <p className="mt-2 text-sm opacity-90">Area of focus</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <CheckCircle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {first?.config?.role || "N/A"}
              </p>
              <p className="mt-2 text-sm opacity-90">
                Position interviewed for
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Interview Status
              </CardTitle>
              <Calendar className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold capitalize">
                {first?.status || "N/A"}
              </p>
              <p className="mt-2 text-sm opacity-90">Current session status</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table Section */}
        <div className="rounded-xl border border-gray-100 bg-white p-1 shadow-lg md:p-4">
          <SectionTable title="Interview Sessions" data={data} />
        </div>
      </div>
    </div>
  );
}
