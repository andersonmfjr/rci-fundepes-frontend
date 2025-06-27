import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ProjectFormData, Unit } from '@/types';
import { projectsService } from '@/lib/projects';
import { generateId, formatCurrency, calculateUnitRciValue } from '@/lib/projects/utils';
import FileUpload from '@/components/project/FileUpload';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';

const unitSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome da unidade é obrigatório"),
  percentual_rci: z.number().min(0, "Percentual deve ser positivo").max(100, "Percentual não pode ser maior que 100"),
});

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(200, "Nome deve ter no máximo 200 caracteres"),
  descricao: z.string().min(1, "Descrição é obrigatória").max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  valor_total: z.number().min(0, "Valor deve ser positivo"),
  link_contrato: z.string().url("Link inválido").optional().or(z.literal("")),
});

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  usePageTitle(isEdit ? 'Editar Projeto' : 'Novo Projeto');
  const [isLoading, setIsLoading] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [bankStatements, setBankStatements] = useState<File[]>([]);
  const [units, setUnits] = useState<Unit[]>([
    { id: generateId(), nome: '', percentual_rci: 0 }
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      valor_total: 0,
      link_contrato: "",
    },
  });

  useEffect(() => {
    const loadProject = async (projectId: string) => {
      try {
        const project = await projectsService.getById(projectId);
        if (project) {
          form.reset({
            nome: project.nome,
            descricao: project.descricao,
            valor_total: project.valor_total,
            link_contrato: project.link_contrato || "",
          });
          setUnits(project.unidades.length > 0 ? project.unidades : [{ id: generateId(), nome: '', percentual_rci: 0 }]);
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
      // Validate units
      const validUnits = units.filter(unit => unit.nome.trim() !== '' && unit.percentual_rci > 0);
      
      if (validUnits.length === 0) {
        toast({
          title: "Erro de validação",
          description: "Adicione pelo menos uma unidade com nome e percentual válidos",
          variant: "destructive"
        });
        return;
      }

      const formData: ProjectFormData = {
        nome: values.nome,
        descricao: values.descricao,
        valor_total: values.valor_total,
        unidades: validUnits,
        link_contrato: values.link_contrato,
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

  const addUnit = () => {
    setUnits([...units, { id: generateId(), nome: '', percentual_rci: 0 }]);
  };

  const removeUnit = (unitId: string) => {
    if (units.length > 1) {
      setUnits(units.filter(unit => unit.id !== unitId));
    }
  };

  const updateUnit = (unitId: string, field: keyof Unit, value: string | number) => {
    setUnits(units.map(unit => 
      unit.id === unitId 
        ? { ...unit, [field]: value }
        : unit
    ));
  };

  const getTotalRciPercentage = () => {
    return units.reduce((total, unit) => total + (unit.percentual_rci || 0), 0);
  };

  const getTotalRciValue = () => {
    const totalValue = form.watch('valor_total') || 0;
    return totalValue * (getTotalRciPercentage() / 100);
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
                  name="nome"
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
                  name="descricao"
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
                  name="valor_total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (R$) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
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
                <CardTitle>Unidades RCI</CardTitle>
                <CardDescription>
                  Configure as unidades e seus respectivos percentuais de RCI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {units.map((unit, index) => (
                  <div key={unit.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Nome da Unidade</label>
                      <Input
                        placeholder="Ex: UFAL"
                        value={unit.nome}
                        onChange={(e) => updateUnit(unit.id, 'nome', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-sm font-medium text-gray-700">RCI (%)</label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="0.0"
                        value={unit.percentual_rci || ''}
                        onChange={(e) => updateUnit(unit.id, 'percentual_rci', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div className="w-32">
                      <span className="text-sm font-medium text-gray-700">Valor RCI</span>
                      <div className="mt-1 text-sm font-semibold text-green-600">
                        {formatCurrency(calculateUnitRciValue(form.watch('valor_total') || 0, unit.percentual_rci))}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeUnit(unit.id)}
                      disabled={units.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addUnit}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Unidade
                  </Button>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">Total RCI</div>
                    <div className="text-lg font-bold text-green-600">
                      {getTotalRciPercentage().toFixed(1)}% = {formatCurrency(getTotalRciValue())}
                    </div>
                  </div>
                </div>
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
                  name="link_contrato"
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
