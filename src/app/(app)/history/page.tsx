"use client";

import { useState } from 'react';
import Image from 'next/image';
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { currentUser, rides, users, addFeedback } from "@/lib/data";
import { Ride, User } from '@/lib/types';
import { format } from "date-fns";
import { IndianRupee } from "lucide-react";
import { FeedbackForm } from '@/components/feedback-form';

export default function HistoryPage() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [userToRate, setUserToRate] = useState<User | null>(null);

  const ridesAsRider = rides.filter(ride => 
    ride.riders.some(rider => rider.id === currentUser.id) && ride.status === 'completed'
  );

  const ridesAsDriver = rides.filter(ride => 
    ride.driver.id === currentUser.id && ride.status === 'completed'
  );
  
  const handleOpenFeedbackModal = (user: User) => {
    setUserToRate(user);
    setFeedbackModalOpen(true);
  };
  
  const handleFeedbackSubmit = (userId: string, values: { rating: number, comment: string }) => {
    addFeedback(userId, { ...values, author: currentUser });
  };

  const RideCard = ({ ride, role }: { ride: Ride, role: 'Rider' | 'Driver' }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{ride.from} to {ride.to}</CardTitle>
                <CardDescription>{format(ride.departureTime, 'MMMM d, yyyy')}</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold flex items-center justify-end"><IndianRupee className="h-5 w-5" />{ride.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Image src={ride.driver.avatar} alt={ride.driver.name} width={40} height={40} className="rounded-full" />
                <div>
                    <p className="font-semibold">{ride.driver.name}</p>
                    <p className="text-sm text-muted-foreground">Driver</p>
                </div>
            </div>
             {role === 'Rider' && (
                <Button variant="outline" onClick={() => handleOpenFeedbackModal(ride.driver)}>
                    Rate Driver
                </Button>
            )}
        </div>
        {ride.riders.length > 0 && <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium">Fellow Riders</h4>
             {ride.riders.filter(r => r.id !== currentUser.id).map(rider => (
                 <div key={rider.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Image src={rider.avatar} alt={rider.name} width={40} height={40} className="rounded-full" />
                        <div>
                            <p className="font-semibold">{rider.name}</p>
                            <p className="text-sm text-muted-foreground">Rider</p>
                        </div>
                    </div>
                    {role === 'Driver' && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenFeedbackModal(rider)}>
                            Rate Rider
                        </Button>
                    )}
                 </div>
             ))}
             {ride.riders.filter(r => r.id !== currentUser.id).length === 0 && role === 'Driver' && <p className="text-xs text-muted-foreground">You were the only one on this ride.</p>}
        </div>}
      </CardContent>
    </Card>
  );

  return (
    <>
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
        {userToRate && (
            <FeedbackForm 
                open={feedbackModalOpen}
                onOpenChange={setFeedbackModalOpen}
                userToRate={userToRate}
                currentUser={currentUser}
                onFeedbackSubmit={handleFeedbackSubmit}
            />
        )}
    </>
  );
}
