import { z } from "zod";

export const formSchema = z.object({
  description: z.string().trim().optional(),
  monthAndYear: z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .refine((value) => {
      const splittedValue = value.split("/");
      return !!Number(splittedValue[0]) && !!Number(splittedValue[1]);
    }, "Este campo só aceita o formato XX/XXXX")
    .refine((value) => {
      const splittedValue = value.split("/");
      return Number(splittedValue[0]) >= 1 && Number(splittedValue[0]) <= 12;
    }, "Informe um mês válido"),
  account: z.number({ required_error: "Campo obrigatório" }),
  extractFile: z
    .instanceof(File)
    .nullish()
    .refine((file) => !!file, "O arquivo é obrigatório")
    .refine(
      (file) => file?.size <= 5 * 1024 * 1024,
      "O arquivo deve ter no máximo 5mb"
    )
    .refine((file) => {
      const allowedExtensions = [".ofx"];
      const fileExtension = "." + file?.name?.split(".")?.pop()?.toLowerCase();
      return allowedExtensions.includes(fileExtension);
    }, "O arquivo deve ser do tipo .ofx"),
});

export type FormSchema = z.infer<typeof formSchema>;

export type MutationSchema = Omit<FormSchema, "monthAndYear"> & {
  month: string;
  year: string;
};
