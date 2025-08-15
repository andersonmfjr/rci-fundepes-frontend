import { z } from "zod";

export const formSchema = z.object({
  description: z.string().trim().optional(),
  month: z.string().min(1, "Campo obrigatório"),
  year: z.string().min(1, "Campo obrigatório"),
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
