
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AppHeader } from '@/components/app-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlusCircle,
  Car,
  ArrowRight,
  MessageSquare,
  Star,
  IndianRupee,
} from 'lucide-react';
import { currentUser, rides, conversations } from '@/lib/data';
import { Ride } from '@/lib/types';
import { format } from 'date-fns';
import { StarRating } from '@/components/star-rating';

const getAverageRating = (user: typeof currentUser) => {
  if (!user.feedback || user.feedback.length === 0) return 0;
  const total = user.feedback.reduce((acc, f) => acc + f.rating, 0);
  return total / user.feedback.length;
};

export default function DashboardPage() {
  const upcomingRides = rides.filter(
    ride =>
      (ride.driver.id === currentUser.id ||
        ride.riders.some(r => r.id === currentUser.id)) &&
      ride.status === 'upcoming'
  );

  const activeRide = rides.find(
    ride =>
      (ride.driver.id === currentUser.id ||
        ride.riders.some(r => r.id === currentUser.id)) &&
      ride.status === 'active'
  );

  const unreadMessages = conversations.filter(c =>
    c.messages.some(m => !m.isRead && m.sender.id !== currentUser.id)
  ).length;

  const avgRating = getAverageRating(currentUser);

  const RideCard = ({ ride, isDriver }: { ride: Ride; isDriver: boolean }) => (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 bg-muted/30 p-4">
        <Image
          src={ride.driver.avatar}
          alt={ride.driver.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold">
              {ride.from} <ArrowRight className="inline h-4 w-4" /> {ride.to}
            </p>
            <Badge variant={isDriver ? 'default' : 'secondary'}>
              {isDriver ? 'Driving' : 'Riding'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(ride.departureTime, 'MMM d, yyyy, h:mm a')}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between text-sm">
          <p className="font-medium text-muted-foreground">Driver</p>
          <p>{ride.driver.name}</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="font-medium text-muted-foreground">Price</p>
          <p className='flex items-center'><IndianRupee className="h-4 w-4" />{ride.price.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-4">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/track/${ride.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title={`Welcome, ${currentUser.name}!`} />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        {/* Active Ride Card */}
        {activeRide && (
          <Card className="border-primary bg-primary/10">
            <CardHeader>
              <CardTitle>Your ride is active!</CardTitle>
              <CardDescription>
                Track your ongoing journey from {activeRide.from} to{' '}
                {activeRide.to}.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href={`/track/${activeRide.id}`}>Track Live</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button
            asChild
            className="h-24 w-full flex-col gap-2 text-lg"
            variant="outline"
          >
            <Link href="/request">
              <Car />
              Find a Ride
            </Link>
          </Button>
          <Button asChild className="h-24 w-full flex-col gap-2 text-lg">
            <Link href="/offer">
              <PlusCircle />
              Offer a Ride
            </Link>
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Based on {currentUser.feedback?.length || 0} reviews
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unread Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/messages" className="hover:underline">
                  Go to inbox
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Rides */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Upcoming Rides
          </h2>
          {upcomingRides.length > 0 ? (
            <div className="mt-4 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {upcomingRides.map(ride => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  isDriver={ride.driver.id === currentUser.id}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                You have no upcoming rides.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
