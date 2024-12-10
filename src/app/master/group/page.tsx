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

  const deleteGroup = (id: string) => {
    fetch(`/api/group`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete group");
        }
        return response.json();
      })
      .then(() => {
        setData((prevData) => prevData.filter((group) => group.id !== id));
      })
      .catch((error) => {
        alert("Failed to delete group. Please try again.");
      });
  };

  const columns: ColumnDef<Group>[] = [
    {
      id: "no",
      accessorKey: "no",
      size: 10,
      header: "No",
      cell: ({ row }) => {
        return <div className="text-start">{row.index + 1}</div>;
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
      cell: ({ row }) => {
        return <div className="text-start ms-4">{row.original.groupnm}</div>;
      },
    },
    {
      id: "actions",
      size: 15,
      header: (
        <div className="text-end me-8">Actions</div>
      ) as unknown as string,
      cell: ({ row }) => {
        const group = row.original;

        return (
          <div className="flex flex-row justify-end gap-2">
            <a href={`/master/group/${group.id}`}>
              <Button variant={"outline"} className="text-orange-500">
                <UserPen />
              </Button>
            </a>
            <Button
              variant={"outline"}
              className="text-red-600"
              onClick={() => deleteGroup(group.id)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col px-16 py-12 w-full h-full min-h-screen gap-4">
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 p-3 justify-between items-center">
            <p className="font-semibold">Groups</p>
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
