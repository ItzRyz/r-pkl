"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authenticate } from "@/helper/auth";
import { useFormState } from "react-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function LoginForm() {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [state, formAction] = useFormState(authenticate, null);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>R-PKL</CardTitle>
        <CardDescription>Insert username & password to login.</CardDescription>
        <hr />
      </CardHeader>
      <CardContent>
        <form id="loginform" action={formAction}>
          <div className="grid w-full items-center gap-4">
            {state?.message ? (
              <Alert
                variant="destructive"
                className="flex justify-start items-center"
              >
                <AlertDescription>{state?.message}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Your username here."
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Your password here."
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="loginform">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
