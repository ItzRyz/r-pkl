"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ZodIssue } from "zod";

import { editGroup } from "@/helper/group";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, CalendarIcon, Trash2, UserPen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Group, Recording } from "@prisma/client";
// import { createPDF } from "./pdf";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ComboBox, ComboType } from "@/components/ui/combo-box";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ErrorMessages = ({
  errors,
}: {
  errors: ZodIssue[] | string | undefined;
}) => {
  let text: string | undefined;
  if (typeof errors === "string") {
    text = errors;
  } else {
    if (errors?.length === 0) return null;
    text = errors && errors.map((item) => item.message)[0];
  }
  return text ? (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{text}</AlertDescription>
    </Alert>
  ) : null;
};

const SuccessMessage = ({ message }: { message: string | undefined }) => {
  return message ? (
    <Alert variant="success">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  ) : null;
};

const convertImageToBase64 = async (imgElement: HTMLImageElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    html2canvas(imgElement, { useCORS: true }).then(canvas => {
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    }).catch(error => {
      reject(error);
    });
  });
};

const createPDFWithImage = async () => {
  const doc = new jsPDF();
  try {
    // Get the image element from the DOM
    const imgElement = document.getElementById("myImage") as HTMLImageElement;

    if (!imgElement) {
      throw new Error("Image element not found");
    }

    // Convert the image to Base64 using html2canvas
    const base64Image = await convertImageToBase64(imgElement);

    // Add the Base64 image to the PDF
    doc.addImage(base64Image, "PNG", 10, 10, 190, 40);

    // Add subtitle, Division, Date, etc.
    doc.setFontSize(12);
    doc.text("Di ____________________", 105, 25, { align: "center" });

    // Add Division and Date
    doc.setFontSize(10);
    doc.text("..... DIVISION", 15, 40);
    doc.text("Hari/Tanggal/Bulan/Tahun : ____________________", 15, 47);

    // Add Rekap Permasalahan table
    doc.setFontSize(10);
    doc.text("1. Rekap Permasalahan", 15, 60);
    doc.rect(15, 65, 180, 20); // Table outline
    doc.text("No", 17, 70);
    doc.text("Evaluasi Hasil Kunjungan", 40, 70);
    doc.text("Penyelesaian", 140, 70);
    doc.line(35, 65, 35, 85); // Column line
    doc.line(135, 65, 135, 85); // Column line

    // Add Rekap Monitoring table
    doc.text("2. Rekap monitoring siswa prakerin", 15, 100);
    doc.rect(15, 105, 180, 60); // Table outline
    doc.text("NIS", 17, 110);
    doc.text("NAMA", 35, 110);
    doc.text("CHECKLIST MONITORING", 70, 110);
    doc.text("ALPHA", 140, 110);
    doc.text("TTD SISWA", 160, 110);
    doc.line(30, 105, 30, 165); // Column line
    doc.line(65, 105, 65, 165); // Column line
    doc.line(135, 105, 135, 165); // Column line
    doc.line(155, 105, 155, 165); // Column line

    // Add signature area
    doc.text("Diketahui Oleh :", 15, 180);
    doc.text("_________________________", 20, 190);
    doc.text("Perusahaan", 25, 195);
    doc.text("_________________________", 140, 190);
    doc.text("Staff Prakerin / Pembimbing Sekolah", 145, 195);

    // Save the PDF
    doc.setDocumentProperties({
      title: "RECORDING KUNJUNGAN SISWA PRAKERIN",
      author: "Salmanaf",
    });
    doc.output("dataurlnewwindow");
  } catch (e: unknown) {
    console.error("Error generating PDF:", e);
  }
};

export default function Edit({ params }: { params: { id: number } }) {
  const [state, formAction] = useFormState(editGroup, { error: [] });
  const [oldData, setOldData] = useState<Group | null>();
  const [dataDetail, setDataDetail] = useState<Recording[]>([]);
  const [selectCompany, setSelectCompany] = useState<ComboType[]>([]);
  const [selectDepartment, setSelectDepartment] = useState<ComboType[]>([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>()
  const router = useRouter();
  const pathname = usePathname();

  if (state.status == 200) {
    router.push("/master/group");
  }

  useEffect(() => {
    const getData = async () => {
      const req = await fetch("/api/monitoring/" + params.id);
      const res = req.status == 200 && (await req.json());
      setOldData(res.data as Group);
    };
    getData();
  }, []);

  const deleteData = (id: number) => {
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
        setDataDetail((prevData) => prevData.filter((rec) => rec.id !== id));
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
              onClick={() => deleteData(data.id)}
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
        <img id="myImage" src="/kop_recording.png" alt="Image to be added to PDF" style={{ display: 'none' }} />
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 py-3 px-6 justify-between items-center">
            <p className="font-semibold">Edit Kunjungan</p>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="text-red-600">
                <a href={pathname.replace(/\/\d+/, "")}>Back</a>
              </Button>
              <Button variant={"outline"} className="text-amber-500" onClick={createPDFWithImage}>
                Print
              </Button>
              <Button
                type="submit"
                form="formedit"
                variant={"outline"}
                className="text-lime-500"
              >
                Save
              </Button>
            </div>
          </CardHeader>
        </Card>
        <Card className="rounded-md">
          <CardHeader>
            <form id="formedit" action={formAction}>
              <div className="grid w-full items-center gap-4">
                {state.status == 200 ? (
                  <SuccessMessage message={state.message} />
                ) : (
                  <ErrorMessages
                    errors={
                      state.status != 200 && state.message
                        ? state.message
                        : state.error
                    }
                  />
                )}
                <div className="flex flex-row justify-between w-full gap-4">
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="transcode">Transcode</Label>
                    <Input
                      id="transcode"
                      name="transcode"
                      type="text"
                      placeholder="Document code here."
                    />
                  </div>
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="transdate">Transdate</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex flex-row justify-between w-full gap-4">
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <ComboBox
                      data={selectCompany}
                      placeholder="Select company"
                      searchText="Search company"
                      value={value}
                      setValue={setValue}
                      open={open}
                      setOpen={setOpen}
                    />
                    <Input
                      name="companyid"
                      id="companyid"
                      type="hidden"
                      value={value}
                    />
                  </div>
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                    <ComboBox
                      data={selectDepartment}
                      placeholder="Select department"
                      searchText="Search department"
                      value={value}
                      setValue={setValue}
                      open={open}
                      setOpen={setOpen}
                    />
                    <Input
                      name="departmentid"
                      id="departmentid"
                      type="hidden"
                      value={value}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full space-y-1.5">
                  <Label htmlFor="pic">Staff Prakerin</Label>
                  <div className="relative">
                    <Input
                      id="pic"
                      name="pic"
                      type="text"
                      placeholder="Staff prakerin name here."
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardHeader>
        </Card>
        <Tabs defaultValue="monitoring" className="w-full">
          <Card>
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monitoring">Rekap Monitoring</TabsTrigger>
                <TabsTrigger value="problem">Rekap masalah</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="monitoring">
                <Card>
                  <CardHeader>
                    <CardTitle>Rekap Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-2">
                    <div className="flex flex-row items-end gap-4">
                      <div className="space-y-1 w-1/4">
                        <Label htmlFor="nis">NIS</Label>
                        <Input id="nis" name="nis" placeholder="Enter NIS here." />
                      </div>
                      <div className="space-y-1 w-1/4">
                        <Label htmlFor="nama">Nama</Label>
                        <Input id="nama" name="nama" placeholder="Enter name here." />
                      </div>
                      <Button>Save changes</Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
}