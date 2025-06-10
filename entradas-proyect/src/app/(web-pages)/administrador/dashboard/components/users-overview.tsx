"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  {
    name: "Administradores",
    value: 5,
  },
  {
    name: "Organizadores",
    value: 25,
  },
  {
    name: "Usuarios",
    value: 543,
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export function UsersOverview() {
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
        <Tooltip formatter={(value: number) => [`${value} usuarios`, "Cantidad"]} />
      </PieChart>
    </ResponsiveContainer>
  );
}
