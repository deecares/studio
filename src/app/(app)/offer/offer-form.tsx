'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  optimizeRouteForPooling,
  type OptimizeRouteForPoolingOutput,
} from '@/ai/flows/route-optimization-pooling';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  startLocation: z.string().min(3, 'Start location is required'),
  endLocation: z.string().min(3, 'End location is required'),
  stops: z.string().optional(),
  seats: z.coerce.number().min(1, 'At least 1 seat must be available').max(8),
});

type OfferFormValues = z.infer<typeof formSchema>;

export default function OfferForm() {
  const [optimizationResult, setOptimizationResult] =
    useState<OptimizeRouteForPoolingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
      stops: '',
      seats: 1,
    },
  });

  const handleOptimize = async () => {
    const values = form.getValues();
    if (!values.startLocation || !values.endLocation) {
      form.trigger(['startLocation', 'endLocation']);
      return;
    }

    setIsLoading(true);
    setOptimizationResult(null);

    const input = {
      currentRouteDescription: `A ride from ${values.startLocation} to ${
        values.endLocation
      } with potential stops at ${values.stops || 'none'}.`,
      startLocation: values.startLocation,
      endLocation: values.endLocation,
      stops: values.stops ? values.stops.split(',').map(s => s.trim()) : [],
    };

    try {
      const result = await optimizeRouteForPooling(input);
      if (result && result.suggestedRouteModifications) {
        setOptimizationResult(result);
      } else {
        toast({
          title: 'Route is Already Optimal',
          description: 'No significant pooling improvements could be found for this route.',
        });
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: 'Could not get AI suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  function onSubmit(values: OfferFormValues) {
    console.log(values);
    toast({
      title: "Ride Offered!",
      description: `Your ride from ${values.startLocation} to ${values.endLocation} has been listed.`,
    })
    form.reset();
    setOptimizationResult(null);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Route Details</CardTitle>
          <CardDescription>
            Enter the details of your trip to offer it to other riders.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Downtown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Airport" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="stops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major Stops (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Central Station, North Mall"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleOptimize}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Optimize for Pooling
              </Button>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Offer Ride
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
         <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">AI is analyzing your route...</p>
                </div>
            </CardContent>
        </Card>
      )}

      {optimizationResult && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              AI Route Suggestion
            </CardTitle>
            <CardDescription>
              We found a potential improvement for your route to increase
              pooling chances.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Suggestion
              </Label>
              <p className="font-medium">
                {optimizationResult.suggestedRouteModifications}
              </p>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Justification
              </Label>
              <p>{optimizationResult.justification}</p>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Expected Impact
              </Label>
              <p>{optimizationResult.expectedImpact}</p>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" onClick={() => setOptimizationResult(null)}>
              Dismiss
            </Button>
            <Button
              onClick={() => {
                form.setValue(
                  'stops',
                  optimizationResult.suggestedRouteModifications
                );
                setOptimizationResult(null);
                toast({
                  title: 'Route Updated!',
                  description: 'Your stops have been updated with the AI suggestion.',
                });
              }}
            >
              Accept Suggestion
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
