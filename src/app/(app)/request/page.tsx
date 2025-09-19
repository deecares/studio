
"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, IndianRupee } from "lucide-react";
import { rides, users } from "@/lib/data";
import { Ride } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/star-rating";

const getAverageRating = (user: typeof users[0]) => {
    if (!user.feedback || user.feedback.length === 0) return 0;
    const total = user.feedback.reduce((acc, f) => acc + f.rating, 0);
    return total / user.feedback.length;
}


export default function RequestRidePage() {
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [matchedRides, setMatchedRides] = useState<Ride[]>([]);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMatchedRides([]);

    // Simulate API call
    setTimeout(() => {
      // Simple mock logic: find rides with available seats
      const availableRides = rides.filter(ride => ride.seats.available > 0 && ride.status === 'upcoming');
      setMatchedRides(availableRides);
      setLoading(false);
      setSearched(true);
    }, 2000);
  };
  
  const handleBookRide = (rideId: string) => {
    toast({
      title: "Ride Booked!",
      description: "Your seat has been confirmed. The driver will be notified.",
    });
    setMatchedRides(currentRides => currentRides.filter(ride => ride.id !== rideId));
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Request a Ride" />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <Card>
            <form onSubmit={handleSearch}>
              <CardHeader>
                <CardTitle>Where are you going?</CardTitle>
                <CardDescription>Enter your pickup and drop-off locations to find a ride.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <Input id="pickup" placeholder="e.g., 123 Main St" required defaultValue="City University" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dropoff">Drop-off Location</Label>
                  <Input id="dropoff" placeholder="e.g., Tech Park" required defaultValue="Central Library"/>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {loading ? "Searching..." : "Find a Ride"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {loading && (
            <div className="flex justify-center items-center pt-8">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Finding available rides...</p>
            </div>
          )}

          {searched && !loading && matchedRides.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Available Rides</h3>
                {matchedRides.map((ride) => {
                    const avgRating = getAverageRating(ride.driver);
                    return (
                        <Card key={ride.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image src={ride.driver.avatar} alt={ride.driver.name} width={48} height={48} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold text-lg">{ride.driver.name}</p>
                                            <div className="flex items-center gap-1">
                                                <StarRating rating={avgRating} size={4} />
                                                <span className="text-xs text-muted-foreground">({ride.driver.feedback?.length || 0} reviews)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold flex items-center"><IndianRupee className="h-5 w-5" />{ride.price.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">{ride.seats.available} seats left</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-medium">{ride.from}</div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                                    <div className="font-medium">{ride.to}</div>
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-2">{format(ride.departureTime, "MMM d, h:mm a")}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleBookRide(ride.id)}>Book Seat</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
          )}
          
          {searched && !loading && matchedRides.length === 0 && (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No rides found. Try adjusting your locations or check back later.</p>
                </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
}
