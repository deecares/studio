"use client";
import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { currentUser, users } from "@/lib/data";
import { User, Feedback } from "@/lib/types";
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, Car, Bike, Star, MessageSquare } from 'lucide-react';
import { StarRating } from "@/components/star-rating";

const getAverageRating = (user: User) => {
    if (!user.feedback || user.feedback.length === 0) return 0;
    const total = user.feedback.reduce((acc, f) => acc + f.rating, 0);
    return total / user.feedback.length;
}

const FeedbackCard = ({feedback}: {feedback: Feedback}) => {
    return (
        <div className="flex items-start space-x-4 py-4">
            <Avatar>
                <AvatarImage src={feedback.author.avatar} alt={feedback.author.name} />
                <AvatarFallback>{feedback.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-semibold">{feedback.author.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(feedback.timestamp, { addSuffix: true })}</p>
                </div>
                <StarRating rating={feedback.rating} />
                <p className="mt-2 text-sm text-foreground/80">{feedback.comment}</p>
            </div>
        </div>
    )
}

export default function ProfilePage() {
  // For this demo, we're viewing the current user's profile.
  // In a real app, this might come from a URL param, e.g., /profile/[userId]
  const user = currentUser; 
  const avgRating = getAverageRating(user);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Your Profile" />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <Card>
            <CardHeader className="flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4"/> 
                        Joined {user.memberSince && format(user.memberSince, 'MMMM yyyy')}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <StarRating rating={avgRating} size={5} />
                    <span className="text-lg font-bold">{avgRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({user.feedback?.length || 0} reviews)</span>
                </div>
            </CardHeader>
            <CardContent className="border-t">
                 <div className="grid grid-cols-2 divide-x text-center">
                    <div className="p-4">
                        <p className="text-2xl font-bold">{user.ridesGiven || 0}</p>
                        <p className="text-sm text-muted-foreground">Rides Given</p>
                    </div>
                     <div className="p-4">
                        <p className="text-2xl font-bold">{user.ridesTaken || 0}</p>
                        <p className="text-sm text-muted-foreground">Rides Taken</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-6 w-6"/> Feedback</CardTitle>
            <CardDescription>What other users are saying about {user.name}.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {user.feedback && user.feedback.length > 0 ? (
                user.feedback.map(fb => <FeedbackCard key={fb.id} feedback={fb} />)
            ) : (
                <p className="py-8 text-center text-muted-foreground">No feedback yet.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
