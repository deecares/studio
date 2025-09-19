import * as React from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { rides, currentUser } from "@/lib/data";
import { CreditCard, PlusCircle, IndianRupee } from "lucide-react";
import { format } from "date-fns";

const paymentMethods = [
  { id: 'pm-1', type: 'Visa', details: '**** **** **** 4242', isDefault: true },
  { id: 'pm-2', type: 'UPI', details: 'alice@okhdfcbank', isDefault: false },
];

const transactions = rides
  .filter(ride => ride.status === 'completed' && (ride.driver.id === currentUser.id || ride.riders.some(r => r.id === currentUser.id)))
  .map(ride => ({
    id: ride.id,
    description: `Ride from ${ride.from} to ${ride.to}`,
    date: ride.departureTime,
    amount: ride.driver.id === currentUser.id ? ride.price : -ride.price,
  }))
  .sort((a, b) => b.date.getTime() - a.date.getTime());

export default function PaymentsPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Payments" />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment options.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{method.type}</p>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                  </div>
                  {method.isDefault ? (
                    <span className="text-xs font-semibold text-primary">DEFAULT</span>
                  ) : (
                    <Button variant="ghost" size="sm">Set as default</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardContent>
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A record of your payments and earnings.</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
                <div className="space-y-2">
                {transactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                    <div className="flex items-center justify-between py-2">
                        <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{format(transaction.date, 'MMM d, yyyy')}</p>
                        </div>
                        <p className={`font-semibold flex items-center ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {transaction.amount > 0 ? '+' : '-'} <IndianRupee className="h-4 w-4" /> {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                    </div>
                    {index < transactions.length - 1 && <Separator />}
                    </React.Fragment>
                ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground pt-4">No transactions yet.</p>
            )}
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
