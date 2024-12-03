import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <div className="flex flex-row justify-center items-center w-full h-full min-h-screen">
        <div className="text-3xl">
          Welcome, <span className="font-bold">{session?.user.name}</span>
        </div>
      </div>
    </>
  );
}
