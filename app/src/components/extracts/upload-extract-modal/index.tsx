import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormSchema, formSchema, MutationSchema } from "./schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { toFormData } from "@/lib/to-form-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Feedback } from "@/components/feedback";
import { ChangeEvent, DragEvent } from "react";
import { useToast } from "@/hooks/use-toast";

const uploadFile = async (data: MutationSchema) => {
  await fetcher("/app/extrato-bancario/", {
    method: "POST",
    body: toFormData(data),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type UploadExtractModalProps = {
  open: boolean;
  onOpenChange(): void;
};

export function UploadExtractModal({
  open,
  onOpenChange,
}: UploadExtractModalProps) {
  const { toast } = useToast();
  const { data: rciAccounts } = useQuery({
    queryKey: ["get-rci-accounts"],
    queryFn: async () => fetcher<Pagination<RciAccount>>("/app/contas-rci"),
    enabled: open,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast({
        title: "Extrato cadastrado com sucesso",
        description:
          "O extrato cadastrado será processado dentro de alguns instantes.",
      });
      handleClose();
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Algo deu errado ao tentar cadastrar este extrato",
        description: "Verifique o console de seu navegador",
        variant: "destructive",
      });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      monthAndYear: "",
      description: "",
      extractFile: null,
    },
  });

  const file = watch("extractFile");

  const submitForm = (data: FormSchema) => {
    const monthAndYearSplitted = data.monthAndYear?.split("/");
    mutate({
      mes_referencia: monthAndYearSplitted[0],
      ano_referencia: monthAndYearSplitted[1],
      descricao: data.description,
      id_conta_rci: data.account,
      link_arquivo: data.extractFile,
      processado: false,
    });
  };

  const handleClose = () => {
    reset();
    onOpenChange();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setValue("extractFile", droppedFile);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleChangeMonthAndYear = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/[^0-9/]/g, "");

    if (value.length > 7) value = value.slice(0, 7);

    if (value.length == 2 && !value.includes("/")) {
      value = value + "/";
    }

    event.target.value = value;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogHeader>
            <DialogTitle>Adicionar um novo extrato</DialogTitle>
            <DialogDescription>
              Faça o upload do arquivo .OFX nesta área abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2">
            <div className="mb-3 space-y-1">
              <div className="flex gap-2">
                <div className="w-full">
                  <Label htmlFor="monthAndYear">
                    Mês/ano <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    {...register("monthAndYear")}
                    autoComplete="off"
                    placeholder="Ex. 01/2025"
                    id="monthAndYear"
                    onChange={handleChangeMonthAndYear}
                  />
                  <Feedback message={errors?.monthAndYear?.message} />
                </div>
                <div className="w-full">
                  <Label htmlFor="account">
                    Conta <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("account", Number(value))
                    }
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Selecione a conta bancária" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {rciAccounts?.results?.map((account) => (
                          <SelectItem
                            value={String(account.id_conta_rci)}
                            key={account.id_conta_rci}
                          >
                            {account?.numero} - {account?.id_banco?.nome}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Feedback message={errors?.account?.message} />
                </div>
              </div>
            </div>

            <div id="upload">
              <Label>Arquivo</Label>
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-dashed border-2 rounded-md h-56 items-center justify-center cursor-pointer data-[visible=true]:flex hidden group hover:bg-blue-500/20 transition-colors duration-300 data-[error=true]:border-red-600"
                htmlFor="extractFile"
                data-visible={!file}
                data-error={!!errors?.extractFile?.message}
              >
                <Upload className="text-gray-500 group-hover:hidden" />
                <span className="hidden text-gray-400 group-hover:block">
                  Clique e selecione o arquivo, ou arraste ele para essa área.
                </span>
              </label>
              <input
                type="file"
                id="extractFile"
                className="hidden"
                {...register("extractFile", {
                  onChange: (e) => setValue("extractFile", e.target.files[0]),
                })}
              />

              <div
                className="border-2 border-blue-500 bg-blue-500/30 p-2 rounded-md justify-between data-[visible=true]:flex hidden data-[error=true]:border-red-600"
                data-error={!!errors?.extractFile?.message}
                data-visible={!!file}
              >
                <span className="text-blue-600">
                  {file?.name} - {(file?.size / 1024).toFixed(1)}KB
                </span>
                <button
                  type="button"
                  onClick={() => setValue("extractFile", null)}
                >
                  <X className="text-blue-600" />
                </button>
              </div>
              <Feedback message={errors?.extractFile?.message} />
            </div>
            <div className="w-full mt-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                {...register("description")}
                placeholder="Ex. Extrato de verificação"
              />
              <Feedback message={errors?.description?.message} />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              Enviar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
