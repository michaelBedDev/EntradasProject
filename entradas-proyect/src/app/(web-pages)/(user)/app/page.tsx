"use client";

import { AppAreaChart } from "@/components/app";
import { AppBarChart } from "@/components/app";
import { AppPieChart } from "@/components/app";
import { CardList } from "@/components/app";
import { TodoList } from "@/components/app";
import { TestingComponent } from "@/components/app";

export default function Home() {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 w-full">
        <div className="bg-card p-4 rounded-lg border border-border">
          <TestingComponent />
        </div>
        <div className="bg-card text-card-foreground border border-border p-4 rounded-lg lg:col-span-2 xl:cols-span-1 2xl:col-span-2">
          <AppBarChart />
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <CardList title="Latest Transactions"></CardList>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <AppPieChart />
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <TodoList />
        </div>
        <div className="bg-card p-4 rounded-lg  border border-border lg:col-span-2 xl:cols-span-1 2xl:col-span-2">
          <AppAreaChart />
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <CardList title="Popular Content"></CardList>
        </div>
      </div>
    </div>
  );
}
