import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout";
import RedirectIfAuthenticated from "./layout/RedirectIfAuthenticated";
import ProtectedRoute from "./layout/ProtectedRoute";

const Mentors = lazy(() => import("./pages/Mentors/Mentors"));
const MentorApplication = lazy(
  () => import("./pages/Mentors/MentorApplication"),
);
const Exams = lazy(() => import("./pages/Exams/Exams"));
const Programs = lazy(() => import("./pages/Programs/Program"));
const SponsorMatch = lazy(() => import("./pages/SponsorMatch"));
const Research = lazy(() => import("./pages/Research/Research"));
const CareerTools = lazy(() => import("./pages/CareerTools/CareerTools"));
const Bundles = lazy(() => import("./pages/Bundles"));
const About = lazy(() => import("./pages/About"));
const Trust = lazy(() => import("./pages/Trust"));
const ConsentTable = lazy(() => import("./pages/Modal/Modal"));
const AdminPLAB = lazy(() => import("./pages/Plab"));
const Cv = lazy(() => import("./pages/Cv"));
const GapMap = lazy(() => import("./pages/GapMap"));
const Interview = lazy(() => import("./pages/Interview"));
const Sponsor = lazy(() => import("./pages/Sponsor"));
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Profile = lazy(() => import("./pages/Profile"));
const Users = lazy(() => import("./pages/Users"));
const SuperAdmin = lazy(() => import("./pages/SuperAdmin"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        {/* Public routes */}
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/pricing" element={<Pricing />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/mentors" element={<Mentors />} />
            <Route
              path="/dashboard/mentors/mentor-application"
              element={<MentorApplication />}
            />
            <Route path="/dashboard/exams" element={<Exams />} />
            <Route path="/dashboard/sponsormatch" element={<SponsorMatch />} />
            <Route path="/dashboard/programs" element={<Programs />} />
            <Route path="/dashboard/research" element={<Research />} />
            <Route
              path="/dashboard/nhs-carrertools"
              element={<CareerTools />}
            />
            <Route path="/dashboard/about" element={<About />} />
            <Route path="/dashboard/super-admin" element={<SuperAdmin />} />
            <Route path="/dashboard/gapmap" element={<GapMap />} />
            <Route path="/dashboard/cv" element={<Cv />} />
            <Route path="/dashboard/interview" element={<Interview />} />
            <Route path="/dashboard/sponsor" element={<Sponsor />} />
            <Route path="/dashboard/bundle" element={<Bundles />} />
            <Route path="/dashboard/trust" element={<Trust />} />
            <Route path="/dashboard/modal" element={<ConsentTable />} />
            <Route path="/dashboard/plab-quiz" element={<AdminPLAB />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
