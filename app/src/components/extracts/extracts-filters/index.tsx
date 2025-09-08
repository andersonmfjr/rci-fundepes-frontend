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
import { Button } from "@/components/ui/button";
import { FilterSchema } from "./schema";
import { onlyNumbers } from "@/lib/only-numbers";

export function ExtractsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: rciAccounts } = useQuery({
    queryKey: ["get-rci-accounts"],
    queryFn: async () => fetcher<Pagination<RciAccount>>("/app/contas-rci"),
  });

  const { register, setValue, handleSubmit, reset } = useForm<FilterSchema>({
    defaultValues: {
      status: "",
      id_conta_rci: "",
    },
  });

  const handleFilter = (data: FilterSchema) => {
    const newSearchParams = new URLSearchParams();
    const keys = Object.keys(data);

    for (const key of keys)
      if (data[key]?.numberValue)
        newSearchParams.set(key, data[key]?.numberValue);
      else if (data[key]) newSearchParams.set(key, data[key]);

    setSearchParams(newSearchParams);
  };

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
              onChange={(e) => {
                const onlyNums = onlyNumbers(e.target.value);
                setValue("mes_referencia.stringValue", onlyNums);
                setValue("mes_referencia.numberValue", Number(onlyNums));
              }}
            />
            <Input
              className="lg:w-36"
              {...register("ano_referencia")}
              autoComplete="off"
              placeholder="Ano"
              maxLength={4}
              onChange={(e) => {
                const onlyNums = onlyNumbers(e.target.value);
                setValue("ano_referencia.stringValue", onlyNums);
                setValue("ano_referencia.numberValue", Number(onlyNums));
              }}
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
