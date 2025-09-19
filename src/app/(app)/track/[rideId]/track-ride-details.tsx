'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
} from '@react-google-maps/api';
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
import { formatDistanceToNow } from 'date-fns';
import { Car, Clock, MapPin, Share2, Siren, Loader2, AlertTriangle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Coordinates } from '@/lib/types';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function TrackRideDetails({ rideId }: { rideId: string }) {
  const ride = rides.find(r => r.id === rideId);
  const { toast } = useToast();

  const [eta, setEta] = useState<string>('Calculating...');
  const [driverPosition, setDriverPosition] = useState<Coordinates | null>(
    ride ? ride.fromCoords : null
  );
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places', 'geometry'],
  });

  const mapCenter = useMemo(
    () => (ride ? ride.fromCoords : { lat: 0, lng: 0 }),
    [ride]
  );

  // Fetch directions
  useEffect(() => {
    if (isLoaded && ride && !directions) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: ride.fromCoords,
          destination: ride.toCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
            toast({
              variant: 'destructive',
              title: 'Could not calculate route',
              description: 'There was an issue displaying the ride route.'
            })
          }
        }
      );
    }
  }, [isLoaded, ride, directions, toast]);

  // Simulate driver movement and update ETA
  useEffect(() => {
    if (!directions || ride?.status !== 'active') return;

    const route = directions.routes[0].overview_path;
    let step = 0;

    const timer = setInterval(() => {
      if (step < route.length) {
        setDriverPosition({ lat: route[step].lat(), lng: route[step].lng() });
        
        const remainingDistance = google.maps.geometry.spherical.computeLength(route.slice(step));
        const avgSpeedKps = 50 / 3600; // Average speed of 50 km/h in km/s
        const remainingSeconds = remainingDistance / 1000 / avgSpeedKps;
        const arrivalTime = new Date(Date.now() + remainingSeconds * 1000);
        
        setEta(formatDistanceToNow(arrivalTime, { addSuffix: true }));

        step = Math.min(step + 1, route.length -1);
      } else {
         setEta('Arrived');
         clearInterval(timer);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(timer);
  }, [directions, ride?.status]);

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

  const renderMap = () => {
    if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center bg-muted p-4 text-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
              <h3 className="mt-4 text-lg font-semibold">Map Error</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Google Maps could not be loaded. Please ensure you have a valid <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> set in your environment.
              </p>
            </div>
        );
    }
    if (!isLoaded)
      return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      );

    return (
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={13}>
        {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} />}
        {driverPosition && <MarkerF position={driverPosition} title={'Driver'} icon={{
            path: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z', // A simple arrow icon
            scale: 1.5,
            rotation: directions && step < route.length ? google.maps.geometry.spherical.computeHeading(route[step], route[step+1]) : 0,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: 'white',
            anchor: new google.maps.Point(12,12)
        }}/>}
        <MarkerF position={ride.fromCoords} label="A" title="Start"/>
        <MarkerF position={ride.toCoords} label="B" title="End"/>
      </GoogleMap>
    );
  };

  const route = directions?.routes[0].overview_path;
  const step = route ? route.findIndex(p => p.lat() === driverPosition?.lat && p.lng() === driverPosition?.lng) : 0;

  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Track Your Ride" />
      <main className="grid flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-3">
        <div className="relative h-[50vh] bg-muted lg:col-span-2 lg:h-full">
          {renderMap()}
          <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 lg:p-8">
            <h2 className="text-3xl font-bold text-white">ETA: {eta}</h2>
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
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{ride.status}</p>
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
