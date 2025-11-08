import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanTab } from './PlanTab';
import { recommendedPlan, cheapestPlan, fastestPlan } from '@/data/mockData';
import { Trophy, DollarSign, Zap } from 'lucide-react';

interface ResultsDashboardProps {
  onBookNow: (planId: string) => void;
}

export const ResultsDashboard = ({ onBookNow }: ResultsDashboardProps) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Travel Plans Ready! 🎉</h2>
        <p className="text-muted-foreground">Compare and choose the perfect plan for your journey</p>
      </div>

      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="cheapest" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Cheapest
          </TabsTrigger>
          <TabsTrigger value="fastest" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Fastest
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended">
          <PlanTab plan={recommendedPlan} onBookNow={onBookNow} />
        </TabsContent>

        <TabsContent value="cheapest">
          <PlanTab plan={cheapestPlan} onBookNow={onBookNow} />
        </TabsContent>

        <TabsContent value="fastest">
          <PlanTab plan={fastestPlan} onBookNow={onBookNow} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
