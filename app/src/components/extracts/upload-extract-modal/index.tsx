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
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormSchema, formSchema } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { toFormData } from "@/lib/to-form-data";

const uploadFile = async (data: FormSchema) => {
  await fetcher("/app/upload-extrato", {
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
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const file = watch("extractFile");

  const submitForm = (data: FormSchema) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Adicionar um novo extrato</DialogTitle>
            <DialogDescription>
              Faça o upload do arquivo .OFX nesta área abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="">
            <label
              className="border-dashed border-2 rounded-md h-56 flex items-center justify-center cursor-pointer"
              htmlFor="extractFile"
            >
              <Upload className="text-gray-500" />
            </label>
            <input
              type="file"
              id="extractFile"
              className="hidden"
              {...register("extractFile")}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
