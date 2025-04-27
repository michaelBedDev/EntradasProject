import AppAreaChart from "@/components/app/AppAreaChart";
import AppBarChart from "@/components/app/AppBarChart";
import AppPieChart from "@/components/app/AppPieChart";
import CardList from "@/components/app/CardList";
import TodoList from "@/components/app/TodoList";

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 m-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:cols-span-1 2xl:col-span-2">
        <AppBarChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Transactions"></CardList>
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:cols-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Popular Content"></CardList>
      </div>
    </div>
  );
}
