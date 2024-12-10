"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2, UserPen } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { redirect, RedirectType, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

type Menu = {
  id: string;
  no: number;
  menunm: string;
  link: string;
  icon: string;
  seq: number;
  isactive: boolean;
};

export default function Home() {
  const pathname = usePathname();
  const [data, setData] = useState<Menu[]>([]);

  useEffect(() => {
    fetch("/api/menu", {
      method: "GET",
    })
      .then((req) => req.json())
      .then((res) => {
        setData(res.data);
      });
  }, []);

  const deleteMenu = (id: string) => {
    fetch(`/api/menu`, {
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
          throw new Error("Failed to delete menu");
        }
        return response.json();
      })
      .then(() => {
        setData((prevData) => prevData.filter((menu) => menu.id !== id));
      })
      .catch((error) => {
        alert("Failed to delete menu. Please try again.");
      });
  };

  const columns: ColumnDef<Menu>[] = [
    {
      id: "no",
      accessorKey: "no",
      size: 1,
      header: "No",
      cell: ({ row }) => {
        return <div className="text-center">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "menunm",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
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
      accessorKey: "link",
      size: 10,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Link
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
      accessorKey: "seq",
      size: 2,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Seq
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
      id: "active",
      size: 2,
      header: (<div className="text-center">Active</div>) as unknown as string,
      cell: ({ row }) => {
        const menu = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={menu.isactive} />
          </div>
        );
      },
    },
    {
      id: "actions",
      size: 10,
      header: (<div className="text-center">Actions</div>) as unknown as string,
      cell: ({ row }) => {
        const menu = row.original;

        return (
          <div className="flex flex-row justify-center gap-2">
            <a href={`/master/menu/${menu.id}`}>
              <Button variant={"outline"} className="text-orange-500">
                <UserPen />
              </Button>
            </a>
            <Button
              variant={"outline"}
              className="text-red-600"
              onClick={() => deleteMenu(menu.id)}
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
            <p className="font-semibold">Menu</p>
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
