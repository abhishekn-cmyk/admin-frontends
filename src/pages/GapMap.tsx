"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTable from "@/pages/SectionTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Target,
  Calendar,
  BookOpen,
  Users,
  Globe,
  Briefcase,
  Clock,
} from "lucide-react";

export default function GapMap() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    nationalities: new Set(),
    visaStatuses: new Set(),
    targetRoles: new Set(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tools/full/sdj`,
        );
        const gapMaps = res.data.gapMaps || [];
        setData(gapMaps);

        // Calculate statistics
        const nationalities = new Set();
        const visaStatuses = new Set();
        const targetRoles = new Set();

        gapMaps.forEach((item: any) => {
          if (item.personal?.nationality)
            nationalities.add(item.personal.nationality);
          if (item.status?.visaStatus) visaStatuses.add(item.status.visaStatus);
          if (item.goals?.targetRole) targetRoles.add(item.goals.targetRole);
        });

        setStats({
          total: gapMaps.length,
          nationalities,
          visaStatuses,
          targetRoles,
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
          <p className="text-gray-600">Loading Gap Maps...</p>
        </div>
      </div>
    );
  }

  const first = data[0] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Gap Map Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive overview of candidate gap analysis
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Gap Maps
              </CardTitle>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <p className="mt-1 text-xs text-gray-500">candidates analyzed</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Nationalities
              </CardTitle>
              <div className="rounded-full bg-green-100 p-3">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {stats.nationalities.size}
              </p>
              <p className="mt-1 text-xs text-gray-500">different countries</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Visa Statuses
              </CardTitle>
              <div className="rounded-full bg-purple-100 p-3">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {stats.visaStatuses.size}
              </p>
              <p className="mt-1 text-xs text-gray-500">different statuses</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Target Roles
              </CardTitle>
              <div className="rounded-full bg-orange-100 p-3">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">
                {stats.targetRoles.size}
              </p>
              <p className="mt-1 text-xs text-gray-500">different roles</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                First Candidate
              </CardTitle>
              <BookOpen className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="truncate text-xl font-bold">
                {first?.personal?.fullName || "N/A"}
              </p>
              <div className="mt-2 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <p className="text-sm opacity-90">
                  {first?.personal?.nationality || "Nationality not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Visa Status</CardTitle>
              <Target className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {first?.status?.visaStatus || "N/A"}
              </p>
              <p className="mt-2 text-sm opacity-90">Current status</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Target Role</CardTitle>
              <Calendar className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="truncate text-xl font-bold">
                {first?.goals?.targetRole || "N/A"}
              </p>
              <div className="mt-2 flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <p className="text-sm opacity-90">
                  {first?.goals?.preferredLocation || "Location not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-xl border-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Experience Level
              </CardTitle>
              <Users className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {first?.professional?.experience
                  ? `${first.professional.experience} years`
                  : "N/A"}
              </p>
              <p className="mt-2 text-sm opacity-90">
                {first?.professional?.currentRole || "Role not specified"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table Section */}
        <div className="rounded-xl border border-gray-100 bg-white p-1 shadow-lg md:p-4">
          <SectionTable title="Gap Maps Analysis" data={data} />
        </div>
      </div>
    </div>
  );
}
