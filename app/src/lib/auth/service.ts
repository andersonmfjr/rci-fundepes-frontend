import { fetcher } from "@/lib/fetcher";

export interface UpdatePasswordRequest {
  senha_antiga: string;
  nova_senha: string;
  repita_senha: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export const updatePassword = async (
  data: UpdatePasswordRequest
): Promise<UpdatePasswordResponse> => {
  return fetcher<UpdatePasswordResponse>("/app/perfil/atualiza-senha/", {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
