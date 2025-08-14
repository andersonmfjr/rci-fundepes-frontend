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
import { FormSchema, formSchema } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { toFormData } from "@/lib/to-form-data";

const uploadFile = async (data: FormSchema) => {
  await fetcher("/app/extrato-bancario", {
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
  const { mutate } = useMutation({
    mutationFn: uploadFile,
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
    defaultValues: {
      extractFile: null,
    },
  });

  const file = watch("extractFile");

  const submitForm = (data: FormSchema) => mutate(data);

  const handleClose = () => {
    reset();
    onOpenChange();
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

          <div className="py-3">
            <label
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
            <span className="text-red-600 text-xs">
              {errors?.extractFile?.message}
            </span>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
