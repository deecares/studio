'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AppHeader } from '@/components/app-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { rides } from '@/lib/data';
import { notFound } from 'next/navigation';
import { formatDistanceToNow, addSeconds } from 'date-fns';
import { Car, Clock, MapPin, Share2, Siren } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export default function TrackRideDetails({ rideId }: { rideId: string }) {
  const ride = rides.find(r => r.id === rideId);
  const { toast } = useToast();

  const [eta, setEta] = useState(
    ride?.arrivalTime ? new Date(ride.arrivalTime) : new Date()
  );

  useEffect(() => {
    if (ride && ride.status === 'active') {
      const timer = setInterval(() => {
        setEta(prevEta => addSeconds(prevEta, -5));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ride]);

  if (!ride) {
    notFound();
  }

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: 'Track My Ride',
          text: `I'm on a ride from ${ride.from} to ${ride.to}. Track my progress here:`,
          url: shareUrl,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: 'Link Copied!',
          description: 'Ride tracking link copied to clipboard.',
        });
      });
    }
  };

  const handleSos = () => {
    console.log('SOS Activated!');
    toast({
      variant: 'destructive',
      title: 'SOS Alert Sent',
      description:
        'Your location has been shared with emergency contacts and authorities.',
    });
  };

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Track Your Ride" />
      <main className="grid flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-3">
        <div className="relative h-[50vh] lg:h-full">
          <Image
            src="https://picsum.photos/seed/trackmap/1200/800"
            alt="Map showing ride route"
            fill
            className="object-cover"
            data-ai-hint="street map"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-8">
            <h2 className="text-3xl font-bold text-white">
              ETA: {formatDistanceToNow(eta, { addSuffix: true })}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 md:p-8 lg:col-span-1">
          <Card className="flex w-full flex-1 flex-col">
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>
                From {ride.from} to {ride.to}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <Image
                    src={ride.driver.avatar}
                    alt={ride.driver.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full border-2 border-primary"
                  />
                </Avatar>

                <div>
                  <p className="text-lg font-semibold">{ride.driver.name}</p>
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
                    <p className="font-medium">
                      {new Date(eta).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
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
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2" /> Share Ride
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Siren className="mr-2" /> SOS
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm SOS Alert</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately alert our safety team and local
                    authorities with your ride details and current location. Are
                    you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSos}>
                    Confirm & Send Alert
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  );
}
