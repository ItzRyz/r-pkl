import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center gap-2">
      <LoginForm />
      <div className="text-xs text-center">Copyright ©2024. Salmanaf</div>
    </div>
  );
}
