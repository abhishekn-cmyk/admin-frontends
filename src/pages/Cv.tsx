"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SectionTable from "@/pages/SectionTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, User, Award, Book, GraduationCap, Briefcase, MapPin, Clock } from "lucide-react";

export default function Cv() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    medicalSchools: new Set(),
    specialties: new Set(),
    experienceLevels: new Set(),
    locations: new Set()
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tools/full/sdj`);
        const cvs = res.data.cvs || [];
        setData(cvs);
        
        // Calculate statistics
        const medicalSchools = new Set();
        const specialties = new Set();
        const experienceLevels = new Set();
        const locations = new Set();
        
        cvs.forEach((item: any) => {
          if (item.education?.medicalSchool) medicalSchools.add(item.education.medicalSchool);
          if (item.specialty) specialties.add(item.specialty);
          if (item.experience?.years) experienceLevels.add(Math.floor(item.experience.years / 5) * 5 + '+ years');
          if (item.personalInfo?.location) locations.add(item.personalInfo.location);
        });
        
        setStats({
          total: cvs.length,
          medicalSchools,
          specialties,
          experienceLevels,
          locations
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading CV Data...</p>
        </div>
      </div>
    );
  }

  const first = data[0] || {};
  const experienceYears = first?.experience?.years ? `${first.experience.years} years` : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">CV Database</h1>
          <p className="text-gray-600">Comprehensive overview of candidate CVs and qualifications</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total CVs</CardTitle>
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">candidates in database</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Medical Schools</CardTitle>
              <div className="p-3 rounded-full bg-green-100">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.medicalSchools.size}</p>
              <p className="text-xs text-gray-500 mt-1">different institutions</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Specialties</CardTitle>
              <div className="p-3 rounded-full bg-purple-100">
                <Book className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.specialties.size}</p>
              <p className="text-xs text-gray-500 mt-1">areas of expertise</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Experience Levels</CardTitle>
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{stats.experienceLevels.size}</p>
              <p className="text-xs text-gray-500 mt-1">different tiers</p>
            </CardContent>
          </Card>
        </div>

        {/* Detail Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg rounded-xl border-0 overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Candidate Profile</CardTitle>
              <User className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold truncate">{first?.personalInfo?.fullName || "N/A"}</p>
              <div className="flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                <p className="text-sm opacity-90">{first?.personalInfo?.location || "Location not specified"}</p>
              </div>
              <p className="text-sm opacity-90 mt-1 truncate">{first?.personalInfo?.email || "Email not available"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg rounded-xl border-0 overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Medical Education</CardTitle>
              <GraduationCap className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{first?.education?.medicalSchool || "N/A"}</p>
              <p className="text-sm opacity-90 mt-2">
                {first?.education?.graduationYear 
                  ? `Graduated ${first.education.graduationYear}`
                  : "Graduation year not specified"
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-lg rounded-xl border-0 overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Professional Experience</CardTitle>
              <Briefcase className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{first?.experience?.currentRole || "N/A"}</p>
              <div className="mt-2">
                <p className="text-sm opacity-90">{first?.experience?.currentEmployer || "Employer not specified"}</p>
                <p className="text-sm opacity-90">{experienceYears} of experience</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg rounded-xl border-0 overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Specialty & Qualifications</CardTitle>
              <Award className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold capitalize">{first?.specialty || "N/A"}</p>
              <p className="text-sm opacity-90 mt-2">
                {first?.certifications?.length > 0 
                  ? `${first.certifications.length} certifications` 
                  : "No certifications listed"
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-1 md:p-4 border border-gray-100">
          <SectionTable title="CV Database" data={data} />
        </div>
      </div>
    </div>
  );
}


