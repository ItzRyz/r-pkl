"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ZodIssue } from "zod";

import { editGroup } from "@/helper/group";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarIcon,
  Check,
  CheckCheckIcon,
  ChevronsUpDown,
  Trash2,
  UserPen,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Group, Kunjungan, Monitoring } from "@prisma/client";
// import { createPDF } from "./pdf";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ComboBox, ComboType } from "@/components/ui/combo-box";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "../data-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import AutoTable from "jspdf-autotable";

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

const convertImageToBase64 = async (
  imgElement: HTMLImageElement
): Promise<string> => {
  return new Promise((resolve, reject) => {
    html2canvas(imgElement, { useCORS: true })
      .then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        resolve(dataUrl);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const convertSvgToBase64 = (svgContent: BlobPart) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngBase64 = canvas.toDataURL("image/png");
        resolve(pngBase64);
      } else {
        reject(new Error("Canvas context not available"));
      }
      URL.revokeObjectURL(url);
    };

    img.onerror = (e) => {
      reject(new Error("Error loading SVG"));
      URL.revokeObjectURL(url);
    };

    img.src = url;
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

    const uncheckIconSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>';
    const uncheckIconBase64 = await convertSvgToBase64(uncheckIconSvg);

    // Add the Base64 image to the PDF
    doc.addImage(base64Image, "PNG", 10, 5, 190, 25);

    // Add subtitle, Division, Date, etc.
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RECORDING KUNJUNGAN SISWA PRAKERIN", 100, 40, {
      align: "center",
    });
    doc.setFont("helvetica", "none");
    doc.text("Di", 65, 45, {
      align: "left",
    });
    doc.setFont("helvetica", "bold");
    doc.text("PT. Hyperdata Solusindo Mandiri", 70, 45, {
      align: "left",
    });

    doc.setFont("helvetica", "none");
    // Add Division and Date
    doc.setFontSize(10);
    doc.text("TIK DIVISION", 15, 60);
    doc.text("Hari/Tanggal/Bulan/Tahun : 5 Desember 2024", 15, 65);

    // Add Rekap Permasalahan table
    doc.setFontSize(10);
    doc.text("1. Rekap Permasalahan", 15, 72);
    AutoTable(doc, {
      startY: 77,
      head: [["No", "Evaluasi Hasil Kunjungan", "Penyelesaian"]],
      body: [["", "", ""]],
    });

    // Add Rekap Monitoring table
    doc.text(
      "2. Rekap monitoring siswa prakerin",
      15,
      (doc as any).lastAutoTable.finalY + 5
    );

    AutoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["NIS", "Nama", "Checklist Monitoring", "Alpha", "TTD Siswa"]],
      body: [
        [
          "22540",
          "Salman\nAl Farizi",
          { content: "\n\n", styles: { halign: "center" } },
          "1",
          "",
        ],
      ],
      didDrawCell: (data) => {
        if (data.column.index === 2 && data.row.index === 0) {
          let imgX = data.cell.x;
          let imgY = data.cell.y + 2;
          // Correctly add the PNG Base64 image
          if (data.section === 'body') {
            // Line 1
            doc.addImage(uncheckIconBase64 as string, "PNG", imgX, imgY, 4, 4);
            doc.text("Jurnal", imgX + 5, imgY + 3);
            doc.addImage(uncheckIconBase64 as string, "PNG", imgX + 20, imgY, 4, 4);
            doc.text("APD", imgX + 25, imgY + 3);
            doc.addImage(uncheckIconBase64 as string, "PNG", imgX + 40, imgY, 4, 4);
            doc.text("Rambut", imgX + 45, imgY + 3);

            // Line 2
            imgY += 5;
            doc.addImage(uncheckIconBase64 as string, "PNG", imgX, imgY, 4, 4);
            doc.text("Jurnal", imgX + 5, imgY + 3);
            doc.addImage(uncheckIconBase64 as string, "PNG", imgX + 20, imgY, 4, 4);
            doc.text("APD", imgX + 25, imgY + 3);
            doc.addImage(uncheckIconBase64 as string, "PNG", imgX + 40, imgY, 4, 4);
            doc.text("Rambut", imgX + 45, imgY + 3);
          }
        }
      },
    });

    // Add signature area
    doc.text("Diketahui Oleh,", 20, (doc as any).lastAutoTable.finalY + 20);
    doc.text(
      "_________________________",
      20,
      (doc as any).lastAutoTable.finalY + 40
    );
    doc.text("Perusahaan", 20, (doc as any).lastAutoTable.finalY + 45);
    doc.text(
      "_________________________",
      140,
      (doc as any).lastAutoTable.finalY + 40
    );
    doc.text(
      "Staff Prakerin / Pembimbing Sekolah",
      135,
      (doc as any).lastAutoTable.finalY + 20
    );

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
  const [dataMonitoring, setDataMonitoring] = useState<Monitoring[]>([]);
  const [selectCompany, setSelectCompany] = useState<ComboType[]>([]);
  const [selectDepartment, setSelectDepartment] = useState<ComboType[]>([]);
  const [valueComp, setValueComp] = useState("");
  const [valueDep, setValueDep] = useState("");
  const [openDep, setOpenDep] = useState(false);
  const [openComp, setOpenComp] = useState(false);
  const [date, setDate] = useState<Date>();
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
      setSelectCompany([
        {
          value: "1",
          label: "PT. Hyperdata Solusindo Mandiri",
        },
      ]);
      setSelectDepartment([
        {
          value: "1",
          label: "TIK",
        },
      ]);
      setDataMonitoring([
        {
          id: 1,
          createdat: new Date(),
          updatedat: new Date(),
          kunjunganid: 1,
          nis: "22540",
          nama: "Muhammad Salman Al Farizi",
          jurnal: true,
          apd: true,
          rambut: true,
          penampilan: true,
          kinerja: true,
          lksp: true,
          alpha: 0,
        } satisfies Monitoring,
      ]);
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

  const columns: ColumnDef<Monitoring>[] = [
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
      accessorKey: "nis",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            NIS
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
      accessorKey: "nama",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nama
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
      accessorKey: "jurnal",
      size: 10,
      header: (<div className="text-center">Jurnal</div>) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={data.jurnal} />
          </div>
        );
      },
    },
    {
      accessorKey: "apd",
      size: 2,
      header: (<div className="text-center">APD</div>) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={data.apd} />
          </div>
        );
      },
    },
    {
      accessorKey: "rambut",
      size: 2,
      header: (<div className="text-center">Rambut</div>) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={data.rambut} />
          </div>
        );
      },
    },
    {
      accessorKey: "lksp",
      size: 2,
      header: (<div className="text-center">LKSP</div>) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={data.lksp} />
          </div>
        );
      },
    },
    {
      accessorKey: "kinerja",
      size: 2,
      header: (<div className="text-center">Kinerja</div>) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={data.kinerja} />
          </div>
        );
      },
    },
    {
      accessorKey: "penampilan",
      size: 2,
      header: (
        <div className="text-center">Penampilan</div>
      ) as unknown as string,
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div className="flex flex-row justify-center">
            <Checkbox checked={data.penampilan} />
          </div>
        );
      },
    },
    {
      id: "alpha",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full "
          >
            Alpha
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
        const data = row.original;

        return <div className="flex flex-row justify-center">{data.alpha}</div>;
      },
    },
    {
      id: "ttd",
      header: (<div className="text-center">TTD</div>) as unknown as string,
      cell: "",
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
        <img
          id="myImage"
          src="/kop_recording.png"
          alt="Image to be added to PDF"
          style={{ display: "unset" }}
        />
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 py-3 px-6 justify-between items-center">
            <p className="font-semibold">Edit Kunjungan</p>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="text-red-600">
                <a href={pathname.replace(/\/\d+/, "")}>Back</a>
              </Button>
              <Button
                variant={"outline"}
                className="text-amber-500"
                onClick={createPDFWithImage}
              >
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
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
                      value={valueComp}
                      setValue={setValueComp}
                      open={openComp}
                      setOpen={setOpenComp}
                    />
                    <Input
                      name="companyid"
                      id="companyid"
                      type="hidden"
                      value={valueComp}
                    />
                  </div>
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Popover open={openDep} onOpenChange={setOpenDep}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDep}
                          className="w-full justify-between"
                        >
                          {valueDep
                            ? selectDepartment.find(
                              (dep) => dep.value === valueDep
                            )?.label
                            : "Select department..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search department..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No department found.</CommandEmpty>
                            <CommandGroup>
                              {selectDepartment.map((dep) => (
                                <CommandItem
                                  key={dep.value}
                                  value={dep.value}
                                  onSelect={(currentValue) => {
                                    setValueDep(
                                      currentValue === valueDep
                                        ? ""
                                        : currentValue
                                    );
                                    setOpenDep(false);
                                  }}
                                >
                                  {dep.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      valueDep === dep.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Input
                      name="departmentid"
                      id="departmentid"
                      type="hidden"
                      value={valueDep}
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
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-end gap-4">
                      <div className="space-y-1 w-1/4">
                        <Label htmlFor="nis">NIS</Label>
                        <Input
                          id="nis"
                          name="nis"
                          placeholder="Enter NIS here."
                        />
                      </div>
                      <div className="space-y-1 w-1/4">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                          id="nama"
                          name="nama"
                          placeholder="Enter name here."
                        />
                      </div>
                      <Button>Save changes</Button>
                    </div>
                    <DataTable columns={columns} data={dataMonitoring} />
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged
                      out.
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
