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
import { ExtractsFilterSkeleton } from "@/components/skeletons/extracts-skeleton";

export function ExtractsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: rciAccounts, isLoading } = useQuery({
    queryKey: ["get-rci-accounts"],
    queryFn: async () => fetcher<Pagination<RciAccount>>("/app/contas-rci"),
  });

  const { register, watch, setValue, handleSubmit, reset } =
    useForm<FilterSchema>({
      defaultValues: {
        status: searchParams.get("status") || "",
        account: searchParams.get("account") || "",
      },
    });

  const account = watch("account");
  const status = watch("status");

  const handleFilter = (data: FilterSchema) => {
    const newSearchParams = new URLSearchParams();
    const keys = Object.keys(data);

    for (const key of keys) {
      if (data[key]) {
        if (key == "month" || key == "year") {
          newSearchParams.set(key, String(Number(data[key])));
          continue;
        }
        newSearchParams.set(key, data[key]);
      }
    }

    setSearchParams(newSearchParams);
  };

  const handleRemoveFilter = () => {
    setSearchParams({}, { replace: true });
    reset({
      account: "",
      month: "",
      status: "",
      year: "",
    });
  };

  if (isLoading) return <ExtractsFilterSkeleton />;

  return (
    <fieldset className="border rounded-md pb-5 pt-1 px-4">
      <legend className="font-bold mb-2 text-lg">Filtros</legend>
      <form onSubmit={handleSubmit(handleFilter)}>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex gap-4">
            <Input
              {...register("month")}
              className="lg:w-36"
              autoComplete="off"
              placeholder="Mês"
              maxLength={2}
              defaultValue={searchParams.get("month")}
              onChange={(e) => {
                const onlyNums = onlyNumbers(e.target.value);
                setValue("month", onlyNums);
              }}
            />
            <Input
              {...register("year")}
              className="lg:w-36"
              autoComplete="off"
              placeholder="Ano"
              maxLength={4}
              defaultValue={searchParams.get("year")}
              onChange={(e) => {
                const onlyNums = onlyNumbers(e.target.value);
                setValue("year", onlyNums);
              }}
            />
          </div>

          <Select
            onValueChange={(value) => setValue("account", value)}
            value={account}
          >
            <SelectTrigger id="account">
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

          <Select
            onValueChange={(value) => setValue("status", value)}
            value={status}
          >
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
