import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CarTaxiFront } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/ridewise-hero/1920/1080"
          alt="A scenic road"
          fill
          className="object-cover"
          data-ai-hint="car road trip"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto flex h-screen flex-col items-start justify-center px-4 md:px-8">
        <div className="max-w-2xl text-left">
          <div className="mb-6 flex items-center gap-3 text-primary">
            <CarTaxiFront className="h-12 w-12" />
            <h1 className="font-headline text-5xl font-bold tracking-tighter md:text-6xl">
              RideWise
            </h1>
          </div>
          <p className="mb-4 text-2xl font-medium text-foreground/80 md:text-3xl">
            Smarter sharing, greener journeys.
          </p>
          <p className="mb-8 max-w-lg text-muted-foreground">
            Join a community dedicated to reducing traffic and emissions. Whether you're offering a ride or need one, RideWise connects you with people heading your way.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
