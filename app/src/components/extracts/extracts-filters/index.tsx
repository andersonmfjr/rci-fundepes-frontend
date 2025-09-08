import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/fetcher";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { onlyNumbers } from "@/lib/only-numbers";

type FilterSchema = {
  mes_referencia: string;
  ano_referencia: string;
  id_conta_rci: string;
  status: string;
};

export function ExtractsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: rciAccounts } = useQuery({
    queryKey: ["get-rci-accounts"],
    queryFn: async () => fetcher<Pagination<RciAccount>>("/app/contas-rci"),
  });

  const { register, setValue, handleSubmit, reset } = useForm<FilterSchema>({
    defaultValues: {
      mes_referencia: "",
      ano_referencia: "",
      status: "",
      id_conta_rci: "",
    },
  });

  const handleFilter = (data: FilterSchema) => {
    const newSearchParams = new URLSearchParams();
    const keys = Object.keys(data);

    for (const key of keys) if (data[key]) newSearchParams.set(key, data[key]);

    setSearchParams(newSearchParams);
  };

  const handleChangeOnlyNumbers = (event: ChangeEvent<HTMLInputElement>) =>
    (event.target.value = onlyNumbers(event.target.value));

  const handleRemoveFilter = () => {
    setSearchParams({});
    reset();
  };

  return (
    <fieldset className="border rounded-md pb-5 pt-1 px-4">
      <legend className="font-bold mb-2 text-lg">Filtros</legend>
      <form onSubmit={handleSubmit(handleFilter)}>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex gap-4">
            <Input
              className="lg:w-36"
              {...register("mes_referencia")}
              autoComplete="off"
              placeholder="Mês"
              maxLength={2}
              onChange={handleChangeOnlyNumbers}
            />
            <Input
              className="lg:w-36"
              {...register("ano_referencia")}
              autoComplete="off"
              placeholder="Ano"
              maxLength={4}
              onChange={handleChangeOnlyNumbers}
            />
          </div>

          <Select onValueChange={(value) => setValue("id_conta_rci", value)}>
            <SelectTrigger id="id_conta_rci">
              <SelectValue placeholder="Conta RCI" />
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

          <Select onValueChange={(value) => setValue("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Processado</SelectItem>
                <SelectItem value="false">Em processamento</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button type="submit">Filtrar</Button>
            <Button
              type="button"
              className="hidden data-[visible=true]:block"
              variant="destructive"
              data-visible={searchParams.size > 0}
              onClick={handleRemoveFilter}
            >
              Remover filtro
            </Button>
          </div>
        </div>
      </form>
    </fieldset>
  );
}
