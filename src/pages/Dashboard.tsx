// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ReactNode } from "react";
// import { FileDown, MessagesSquare, HelpCircle, Mail } from "lucide-react";
// import { Link } from "react-router";

// type CardCompProps = {
//   href: string;
//   heading: string;
//   icon: ReactNode;
//   count: number | undefined;
// };

export default function Dashboard() {
  // const CardComp = ({ href, heading, count, icon }: CardCompProps) => {
  //   return (
  //     <Link to={href} className="group block">
  //       <Card className="rounded-2xl transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //           <CardTitle className="text-sm font-medium transition-colors group-hover:text-blue-600">
  //             {heading}
  //           </CardTitle>
  //           <div className="rounded-lg bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-100">
  //             {icon}
  //           </div>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-3xl font-bold transition-colors group-hover:text-blue-700">
  //             {count}
  //           </div>
  //           <p className="text-muted-foreground mt-1 text-xs">
  //             Total {heading}
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </Link>
  //   );
  // };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Hi, Welcome back 👋
      </h2>
      <p className="mt-1 text-sm sm:text-base">
        Here’s an overview of your dashboard activity
      </p>

      {/* <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardComp
          href="/dashboard/brochure/downloads"
          heading="Brochure Downloads"
          count={10}
          icon={<FileDown className="h-5 w-5" />}
        />
        <CardComp
          href="/dashboard/contact-form"
          heading="Contact Submission"
          count={10}
          icon={<MessagesSquare className="h-5 w-5" />}
        />
        <CardComp
          href="/dashboard/enquire-form"
          heading="Enquire Submission"
          count={10}
          icon={<HelpCircle className="h-5 w-5" />}
        />
        <CardComp
          href="/dashboard/newsletter-subscribers"
          heading="Newsletter Submission"
          count={10}
          icon={<Mail className="h-5 w-5" />}
        />
      </div> */}
    </div>
  );
}
