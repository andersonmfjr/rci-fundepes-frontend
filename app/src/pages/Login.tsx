/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
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
import { fetcher } from "@/lib/fetcher";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";

const formSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail.'),
  password: z.string().min(1, 'Informe a senha.'),
});

type FormSchema = z.infer<typeof formSchema>;

function Login() {
  usePageTitle("Login");
  const navigate = useNavigate();
  const { login } = useAuth();

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/contracts');
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema RCI BI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const { register, handleSubmit } = useForm<FormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  const handleLogin = ({ email, password }: FormSchema) =>
    mutate({ email, password });

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
              Sistema de Gestão de Reembolso de Custos Indiretos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                {...register('password')}
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
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Credenciais de teste:
            </p>
            <p className="text-xs text-blue-600">Email: admin@rci.com</p>
            <p className="text-xs text-blue-600">Senha: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
