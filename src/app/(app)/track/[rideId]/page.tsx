import Image from "next/image";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { rides } from "@/lib/data";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Car, Clock, MapPin } from "lucide-react";

export default function TrackRidePage({ params }: { params: { rideId: string } }) {
  const ride = rides.find(r => r.id === params.rideId);

  if (!ride) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Track Your Ride" />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden">
        <div className="lg:col-span-2 relative h-[50vh] lg:h-full">
            <Image
                src="https://picsum.photos/seed/trackmap/1200/800"
                alt="Map showing ride route"
                fill
                className="object-cover"
                data-ai-hint="street map"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                <h2 className="text-3xl font-bold text-white">ETA: {formatDistanceToNow(ride.arrivalTime)}</h2>
            </div>
        </div>
        <div className="lg:col-span-1 p-4 md:p-8 flex flex-col">
          <Card className="w-full flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>From {ride.from} to {ride.to}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-center space-x-4">
                <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} className="w-16 h-16 rounded-full border-2 border-primary" />
                <div>
                  <p className="font-semibold text-lg">{ride.driver.name}</p>
                  <p className="text-sm text-muted-foreground">Your Driver</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">From</p>
                        <p className="font-medium">{ride.from}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <div>
                        <p className="text-muted-foreground">To</p>
                        <p className="font-medium">{ride.to}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Estimated Arrival</p>
                        <p className="font-medium">{new Date(ride.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">Vehicle</p>
                        <p className="font-medium">Blue Sedan - ABC 123</p>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
