"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  {
    name: "Conciertos",
    value: 45,
  },
  {
    name: "Teatro",
    value: 25,
  },
  {
    name: "Deportes",
    value: 15,
  },
  {
    name: "Conferencias",
    value: 10,
  },
  {
    name: "Otros",
    value: 5,
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function EventosPorCategoria() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value} eventos`, "Cantidad"]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
