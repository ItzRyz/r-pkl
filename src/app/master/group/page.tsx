"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2, UserPen } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { redirect, RedirectType, usePathname } from "next/navigation";

type Group = {
  id: string;
  no: number;
  groupnm: string;
};

const columns: ColumnDef<Group>[] = [
  {
    id: "no",
    accessorKey: "no",
    size: 10,
    header: "No",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "groupnm",
    size: 10,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Groupname
          {!column.getIsSorted() ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    id: "actions",
    size: 15,
    header: (<div className="text-center">Actions</div>) as unknown as string,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <div className="flex flex-row justify-center gap-2">
          <Button variant={"outline"} className="text-orange-500">
            <UserPen />
          </Button>
          <Button variant={"outline"} className="text-red-600">
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];

export default function Home() {
  const pathname = usePathname();
  const [data, setData] = useState<Group[]>([]);
  useEffect(() => {
    fetch("/api/group", {
      method: "GET",
    })
      .then((req) => req.json())
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (
    <>
      <div className="flex flex-col px-16 py-12 w-full h-full min-h-screen gap-4">
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 p-3 justify-between items-center">
            <p className="font-semibold">Users</p>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="text-orange-500">
                Export
              </Button>
              <Button variant={"outline"} className="text-lime-500">
                <a href={pathname + "/add"}>Add</a>
              </Button>
            </div>
          </CardHeader>
        </Card>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
