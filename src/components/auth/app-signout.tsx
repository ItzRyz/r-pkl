import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function SignOutPage() {
  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>R-PKL</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
          <hr />
        </CardHeader>
        <form
          action={async (formData) => {
            "use server";
            await signOut({ redirect: true, redirectTo: "/login" });
          }}
        >
          <CardFooter className="flex w-full">
            <Button type="submit" className="w-full">
              Sign out
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
