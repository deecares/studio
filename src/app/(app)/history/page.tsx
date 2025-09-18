import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, rides } from "@/lib/data";
import { format } from "date-fns";

export default function HistoryPage() {
  const ridesAsRider = rides.filter(ride => 
    ride.riders.some(rider => rider.id === currentUser.id) && ride.status === 'completed'
  );

  const ridesAsDriver = rides.filter(ride => 
    ride.driver.id === currentUser.id && ride.status === 'completed'
  );

  const RideCard = ({ ride, role }: { ride: typeof rides[0], role: 'Rider' | 'Driver' }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{ride.from} to {ride.to}</CardTitle>
                <CardDescription>{format(ride.departureTime, 'MMMM d, yyyy')}</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold">₹{ride.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Driver: {ride.driver.name}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Ride History" />
      <main className="flex-1 p-4 md:p-8">
        <Tabs defaultValue="rider" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rider">Rides Taken</TabsTrigger>
            <TabsTrigger value="driver">Rides Driven</TabsTrigger>
          </TabsList>
          <TabsContent value="rider">
            <div className="space-y-4 pt-4">
              {ridesAsRider.length > 0 ? ridesAsRider.map(ride => (
                <RideCard key={ride.id} ride={ride} role="Rider" />
              )) : (
                <p className="text-center text-muted-foreground pt-8">You haven't taken any rides yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="driver">
            <div className="space-y-4 pt-4">
              {ridesAsDriver.length > 0 ? ridesAsDriver.map(ride => (
                <RideCard key={ride.id} ride={ride} role="Driver" />
              )) : (
                <p className="text-center text-muted-foreground pt-8">You haven't driven any rides yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
