"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types';

const formSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500),
});

type FeedbackFormValues = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  userToRate: User;
  currentUser: User;
  onFeedbackSubmit: (userId: string, values: FeedbackFormValues) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackForm({
  userToRate,
  currentUser,
  onFeedbackSubmit,
  open,
  onOpenChange,
}: FeedbackFormProps) {
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  function onSubmit(values: FeedbackFormValues) {
    onFeedbackSubmit(userToRate.id, values);
    toast({
      title: 'Feedback Submitted!',
      description: `Your feedback for ${userToRate.name} has been recorded.`,
    });
    onOpenChange(false);
    form.reset();
  }

  const currentRating = form.watch('rating');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Feedback for {userToRate.name}</DialogTitle>
          <DialogDescription>
            Rate your experience. Your feedback helps build a trustworthy community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            (hoveredRating >= star || currentRating >= star)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-muted-foreground'
                          )}
                          onMouseEnter={() => setHoveredRating(star)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Share details of your experience with ${userToRate.name}...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
