"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2, UserPen } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { redirect, RedirectType, usePathname } from "next/navigation";
import { User, Group } from "@prisma/client";

type UserTable = User & {
  no: number;
  group: Group;
};

export default function Home() {
  const pathname = usePathname();
  const [data, setData] = useState<UserTable[]>([]);

  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
    })
      .then((req) => req.json())
      .then((res) => {
        setData(res.data);
      });
  }, []);

  const deleteUser = (id: number) => {
    fetch(`/api/user`, {
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
          throw new Error("Failed to delete user");
        }
        return response.json();
      })
      .then(() => {
        // Update the state to remove the deleted user
        setData((prevData) => prevData.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      });
  };

  const columns: ColumnDef<UserTable>[] = [
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
      accessorKey: "username",
      size: 10,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
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
        return <div className="ms-4">{row.original.username}</div>;
      },
    },
    {
      accessorKey: "group.groupnm",
      size: 10,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Group
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
        return (
          <div className="ms-4">
            {row.original.groupid ? row.original.group.groupnm : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      size: 35,
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
      cell: ({ row }) => {
        return <div className="ms-4">{row.original.name}</div>;
      },
    },
    {
      accessorKey: "email",
      size: 55,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
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
        return <div className="ms-4">{row.original.email}</div>;
      },
    },
    {
      id: "actions",
      size: 15,
      header: (<div className="text-center">Actions</div>) as unknown as string,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex flex-row justify-center gap-2">
            <a href={"/master/user/" + user.id}>
              <Button variant={"outline"} className="text-orange-500">
                <UserPen />
              </Button>
            </a>
            <Button
              variant={"outline"}
              className="text-red-600"
              onClick={() => deleteUser(user.id)}
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
