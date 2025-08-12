/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";

const formSchema = z.object({
  email: z.string().min(1, "Informe o usuário."),
  password: z.string().min(1, "Informe a senha."),
});

type FormSchema = z.infer<typeof formSchema>;

function Login() {
  usePageTitle("Login");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/validations");
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema RCI BI",
      });
    },
    onError: (error: any) => {
      let description = error.message;

      if (error.message.includes("Unauthorized"))
        description = "Usuário e/ou senha incorretos.";

      toast({
        title: "Erro no login",
        description,
        variant: "destructive",
      });
    },
  });

  const { register, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleLogin = ({ email, password }: FormSchema) =>
    mutate({ email, password });

  if (isAuthenticated) {
    return <Navigate to="/validations" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">RCI BI</CardTitle>
            <CardDescription>
              Sistema de Gestão de Ressarcimento de Custos Indiretos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Usuário</Label>
              <Input
                {...register("email")}
                id="email"
                // type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Sua senha"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
