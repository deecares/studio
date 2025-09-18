import Link from "next/link";
import Image from "next/image";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { currentUser, rides } from "@/lib/data";
import { Car, PlusCircle, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const activeRide = rides.find(r => r.status === 'active' && (r.driver.id === currentUser.id || r.riders.some(rider => rider.id === currentUser.id)));

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Dashboard" />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name}!</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Car className="h-6 w-6" />
                Request a Ride
              </CardTitle>
              <CardDescription>Find a ride to your destination quickly and easily.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/request">Request Now</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-6 w-6" />
                Offer a Ride
              </CardTitle>
              <CardDescription>Share your route and earn money by giving rides.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/offer">Offer a Ride</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {activeRide && (
          <Card>
            <CardHeader>
              <CardTitle>Your Active Ride</CardTitle>
              <CardDescription>You are currently on a ride from {activeRide.from} to {activeRide.to}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Image src={activeRide.driver.avatar} alt={activeRide.driver.name} width={64} height={64} className="rounded-full" />
                <div>
                  <p className="font-semibold">{activeRide.driver.name} (Driver)</p>
                  <p className="text-sm text-muted-foreground">Arriving in {formatDistanceToNow(activeRide.arrivalTime, { addSuffix: true })}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={`/track/${activeRide.id}`}>
                  Track Ride <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Upcoming Rides</CardTitle>
            <CardDescription>Here are your scheduled rides.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rides.filter(r => r.status === 'upcoming' && (r.driver.id === currentUser.id || r.riders.some(rider => rider.id === currentUser.id))).map(ride => (
                <div key={ride.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <Image src={ride.driver.avatar} alt={ride.driver.name} width={40} height={40} className="rounded-full" />
                    <div>
                      <p className="font-semibold">{ride.from} to {ride.to}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(ride.departureTime, 'MMM d, yyyy, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${ride.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{ride.driver.id === currentUser.id ? 'Driving' : 'Riding'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
