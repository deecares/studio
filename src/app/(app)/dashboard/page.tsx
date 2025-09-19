import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Car, Search, Map } from "lucide-react";

const features = [
  {
    icon: UserPlus,
    title: "User Registration & Profiles",
    description: "Drivers & riders create accounts. Optionally verify identity via Aadhaar, college ID, or email. Profiles show ratings, travel history, and car details.",
  },
  {
    icon: Car,
    title: "Ride Creation (for Drivers)",
    description: "Drivers can easily list their rides by entering their route, date, time, number of available seats, and the cost per seat.",
  },
  {
    icon: Search,
    title: "Ride Search & Booking (for Riders)",
    description: "Riders can find matching rides by entering their pickup and drop-off locations, along with their preferred travel time.",
  },
  {
    icon: Map,
    title: "Live Tracking & Communication",
    description: "Riders can track their driver’s live location for peace of mind. Communication is easy with in-app chat or privacy-protected contact numbers.",
  },
];


export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Welcome to RideWise" />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground">Your guide to smarter, shared journeys.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {features.map((feature, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <feature.icon className="h-10 w-10 text-accent" />
                        <div className="space-y-1">
                            <CardTitle>{feature.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
