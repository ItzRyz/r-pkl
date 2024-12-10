"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ZodIssue, ZodIssueCode } from "zod";

import { addGroup } from "@/helper/group";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

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
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
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
            <p className="font-semibold">Add Group</p>
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
                <div className="flex flex-col w-full space-y-1.5">
                  <Label htmlFor="groupnm">Group Name</Label>
                  <div className="relative">
                    <Input
                      id="groupnm"
                      name="groupnm"
                      type="text"
                      placeholder="Your group name here."
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
