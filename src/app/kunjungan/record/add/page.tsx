"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ZodIssue } from "zod";

import { addGroup } from "@/helper/group";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle, CalendarIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ComboBox, ComboType } from "@/components/ui/combo-box";

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

export default function Add() {
    const [state, formAction] = useFormState(addGroup, { error: [] });
    const [selectCompany, setSelectCompany] = useState<ComboType[]>([]);
    const [selectDepartment, setSelectDepartment] = useState<ComboType[]>([]);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>()
    const router = useRouter();
    const pathname = usePathname();

    if (state.status == 200) {
        router.push(pathname.replace(/\/add$/, ""));
    }

    return (
        <>
            <div className="flex flex-col px-16 py-12 w-full h-full min-h-screen gap-4">
                <Card className="rounded-md">
                    <CardHeader className="flex-row space-y-0 py-3 px-6 justify-between items-center">
                        <p className="font-semibold">Add Monitoring</p>
                        <div className="flex flex-row gap-2">
                            <Button variant={"outline"} className="text-red-600">
                                <a href={pathname.replace(/\/add$/, "")}>Back</a>
                            </Button>
                            <Button
                                type="submit"
                                form="formadd"
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
                        <form id="formadd" action={formAction}>
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
            </div>
        </>
    );
}
