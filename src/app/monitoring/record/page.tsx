"use client";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2, UserPen } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { Recording } from "@prisma/client";

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
    fetch("/api/monitoring", {
      method: "GET",
    })
      .then((req) => req.json())
      .then((res) => {
        setData(res.data);
      });
  }, []);

  const deleteData = (id: string) => {
    fetch(`/api/monitoring`, {
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

  const columns: ColumnDef<Recording>[] = [
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
      accessorKey: "transcode",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Monitoring Code
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
      accessorKey: "transdate",
      size: 10,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Monitoring Date
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
      accessorKey: "company.name",
      size: 2,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
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
      accessorKey: "department.name",
      size: 2,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Department
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
      accessorKey: "pic",
      size: 2,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Staff Prakerin
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
      size: 10,
      header: (<div className="text-center">Actions</div>) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center gap-2">
            <a href={pathname + `/${data.id}`}>
              <Button variant={"outline"} className="text-orange-500">
                <UserPen />
              </Button>
            </a>
            <Button
              variant={"outline"}
              className="text-red-600"
              onClick={() => deleteData(data.id as unknown as string)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const recordMonitoringData = [
    {
      id: 1,
      transcode: "MRC001",
      transdate: "2024-12-5",
      company: {
        id: 1,
        name: "PT. Hyperdata Solusindo Mandiri",
      },
      department: {
        id: 1,
        name: "TIK",
      },
      pic: "Ervin Kurniawan"
    },
    {
      id: 2,
      transcode: "MRC002",
      transdate: "2023-12-5",
      company: {
        id: 2,
        name: "PT. Autochem Industry",
      },
      department: {
        id: 2,
        name: "LISTRIK",
      },
      pic: "Joko"
    },
  ];

  return (
    <>
      <div className="flex flex-col px-16 py-12 w-full h-full min-h-screen gap-4">
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 p-3 justify-between items-center">
            <p className="font-semibold">Record Monitoring</p>
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
        <DataTable columns={columns} data={recordMonitoringData} />
      </div>
    </>
  );
}
