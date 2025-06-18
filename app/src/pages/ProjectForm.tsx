
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProjectFormData } from '@/types';
import { projectsService } from '@/lib/projects';
import FileUpload from '@/components/project/FileUpload';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória").max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  rciPercentage: z.number().min(0, "Percentual deve ser positivo").max(100, "Percentual não pode ser maior que 100"),
  contractLink: z.string().optional(),
});

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  usePageTitle(isEdit ? 'Editar Projeto' : 'Novo Projeto');
  const [isLoading, setIsLoading] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [bankStatements, setBankStatements] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      rciPercentage: 0,
      contractLink: "",
    },
  });

  useEffect(() => {
    const loadProject = async (projectId: string) => {
      try {
        const project = await projectsService.getById(projectId);
        if (project) {
          form.reset({
            name: project.name,
            description: project.description,
            rciPercentage: project.rciPercentage,
            contractLink: project.contractLink || "",
          });
          // Note: Files can't be restored for security reasons
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os dados do projeto",
          variant: "destructive"
        });
      }
    };

    if (isEdit && id) {
      loadProject(id);
    }
  }, [id, isEdit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const formData: ProjectFormData = {
        name: values.name,
        description: values.description,
        rciPercentage: values.rciPercentage,
        contractFile,
        contractLink: values.contractLink,
        bankStatements,
      };

      if (isEdit && id) {
        await projectsService.update(id, formData);
        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso",
        });
      } else {
        await projectsService.create(formData);
        toast({
          title: "Projeto criado",
          description: "O projeto foi criado com sucesso",
        });
      }

      navigate('/projects');
    } catch (error) {
      toast({
        title: "Erro ao salvar projeto",
        description: "Não foi possível salvar o projeto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 lg:space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {isEdit ? 'Editar Projeto' : 'Novo Projeto'}
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            {isEdit ? 'Edite as informações do projeto RCI' : 'Cadastre um novo projeto RCI'}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Dados gerais do projeto RCI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Projeto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do projeto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o projeto"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rciPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual RCI (%) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0.0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contrato</CardTitle>
                <CardDescription>
                  Upload do arquivo de contrato ou link para o documento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload
                  label="Upload do Contrato"
                  acceptedTypes={['.pdf', '.doc', '.docx']}
                  maxSize={50 * 1024 * 1024} // 50MB in bytes
                  onFileSelect={setContractFile}
                  selectedFile={contractFile}
                />

                <div className="text-center text-gray-500">ou</div>

                <FormField
                  control={form.control}
                  name="contractLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do Contrato</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://exemplo.com/contrato.pdf"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extratos Bancários</CardTitle>
                <CardDescription>
                  Upload dos arquivos de extratos bancários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  label="Upload dos Extratos"
                  acceptedTypes={['.ofx', '.csv', '.xlsx']}
                  maxSize={50 * 1024 * 1024} // 50MB in bytes
                  multiple
                  onFilesSelect={setBankStatements}
                  selectedFiles={bankStatements}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/projects')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Projeto'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default ProjectForm;
