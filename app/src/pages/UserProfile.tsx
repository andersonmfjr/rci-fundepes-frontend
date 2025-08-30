import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Lock, Shield, Mail } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { updatePassword, type UpdatePasswordRequest } from "@/lib/auth/service";
import { usePageTitle } from "@/hooks/use-page-title";
import Layout from "@/components/layout/Layout";

const passwordSchema = z
  .object({
    senha_antiga: z.string().min(1, "Senha atual é obrigatória"),
    nova_senha: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    repita_senha: z.string().min(1, "Confirmação da senha é obrigatória"),
  })
  .refine((data) => data.nova_senha === data.repita_senha, {
    message: "As senhas não coincidem",
    path: ["repita_senha"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const UserProfile = () => {
  usePageTitle("Meu perfil");
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      senha_antiga: "",
      nova_senha: "",
      repita_senha: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordRequest) => updatePassword(data),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      form.reset();
      setIsChangingPassword(false);
    },
    onError: (error) => {
      console.error("Error updating password:", error);
      toast.error(
        "Erro ao alterar senha. Verifique se a senha atual está correta."
      );
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    updatePasswordMutation.mutate({
      senha_antiga: data.senha_antiga!,
      nova_senha: data.nova_senha!,
      repita_senha: data.repita_senha!,
    });
  };

  const getUserTypeLabel = (tipo: string) => {
    return tipo === "P" ? "Padrão" : "Administrador";
  };

  const getUserTypeBadge = (tipo: string) => {
    const variant = tipo === "P" ? "secondary" : "default";
    return <Badge variant={variant}>{getUserTypeLabel(tipo)}</Badge>;
  };

  const formatName = (user: User) => {
    if (user.name) {
      return user.name;
    }

    const name = user.first_name + " " + (user.last_name || "");
    return name.trim();
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu perfil</h1>
            <p className="text-gray-600">
              Visualize suas informações pessoais e altere sua senha
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Informações pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Nome
                </Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <span className="text-gray-900">{formatName(user)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Usuário
                </Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <span className="text-gray-900">{user.username}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail
                </Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Tipo de usuário
                </Label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">
                      {user.tipo_usuario_descricao}
                    </span>
                    {getUserTypeBadge(user.tipo_usuario)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Alterar senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isChangingPassword ? (
                <div className="text-center py-6">
                  <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Mantenha sua conta segura alterando sua senha regularmente.
                  </p>
                  <Button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full"
                  >
                    Alterar senha
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="senha_antiga"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha atual</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Digite sua senha atual"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nova_senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova senha</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Digite sua nova senha"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="repita_senha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar nova senha</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirme sua nova senha"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false);
                            form.reset();
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={updatePasswordMutation.isPending}
                          className="flex-1"
                        >
                          {updatePasswordMutation.isPending
                            ? "Alterando..."
                            : "Alterar senha"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
