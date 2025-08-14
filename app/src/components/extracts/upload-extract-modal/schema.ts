import { z } from "zod";

export const formSchema = z.object({
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
