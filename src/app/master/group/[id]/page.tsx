"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ZodIssue } from "zod";

import { editGroup } from "@/helper/group";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Group } from "@prisma/client";

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

export default function Edit({ params }: { params: { id: number } }) {
  const [state, formAction] = useFormState(editGroup, { error: [] });
  const [oldData, setOldData] = useState<Group | null>();
  const router = useRouter();

  if (state.status == 200) {
    router.push("/master/group");
  }

  useEffect(() => {
    const getData = async () => {
      const req = await fetch("/api/group/" + params.id);
      const res = req.status == 200 && (await req.json());
      setOldData(res.data as Group);
    };
    getData();
  }, []);

  return (
    <>
      <div className="flex flex-col px-16 py-12 w-full h-full min-h-screen gap-4">
        <Card className="rounded-md">
          <CardHeader className="flex-row space-y-0 py-3 px-6 justify-between items-center">
            <p className="font-semibold">Edit Groups</p>
            <div className="flex flex-row gap-2">
              <Button variant={"outline"} className="text-red-600">
                <a href={"/master/group"}>Back</a>
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
                  <Input name="id" id="id" type="hidden" value={params.id} />
                  <div className="flex flex-col w-full space-y-1.5">
                    <Label htmlFor="groupnm">Group Name</Label>
                    <Input
                      id="groupnm"
                      name="groupnm"
                      type="text"
                      defaultValue={oldData?.groupnm as string}
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
