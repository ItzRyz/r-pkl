"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ZodIssue, ZodIssueCode } from "zod";

import { addUser } from "@/helper/user";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/ui/combo-box";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [state, formAction] = useFormState(addUser, { error: [] });
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (state.status == 200) {
    router.push("/master/user");
  }

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  return (
    <>
      <div className="flex flex-col px-16 py-12 w-full h-full min-h-screen gap-4">
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 py-3 px-6 justify-between items-center">
            <p className="font-semibold">Add Users</p>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="text-red-600">
                <a href={"/master/user"}>Back</a>
              </Button>
              <Button
                type="submit"
                form="loginform"
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
            <form id="loginform" action={formAction}>
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Your username here."
                    />
                  </div>
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="group">Group</Label>
                    <ComboBox
                      data={frameworks}
                      placeholder="Select group"
                      searchText="Search group"
                      value={value}
                      setValue={setValue}
                      open={open}
                      setOpen={setOpen}
                    />
                    <Input
                      name="groupid"
                      id="groupid"
                      type="hidden"
                      value={value}
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between w-full gap-4">
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name here."
                    />
                  </div>
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email here."
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type="text"
                      placeholder="Your password here."
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
