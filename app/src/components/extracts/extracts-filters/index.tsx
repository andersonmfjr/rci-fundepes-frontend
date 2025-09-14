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
import { Label } from "@/components/ui/label";
import { Calendar, Check, CreditCard } from "lucide-react";

const filterKeys: (keyof FilterSchema)[] = [
  "account",
  "month",
  "status",
  "year",
];

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

  const isFiltered = filterKeys.some((key) => searchParams.has(key));

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
          <div className="flex gap-4 w-full">
            <div className="space-y-1 w-full">
              <Label htmlFor="month" className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Mês
              </Label>
              <Input
                id="month"
                {...register("month")}
                autoComplete="off"
                placeholder="Ex. 01 ou 1"
                maxLength={2}
                defaultValue={searchParams.get("month")}
                onChange={(e) => {
                  const onlyNums = onlyNumbers(e.target.value);
                  setValue("month", onlyNums);
                }}
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="year" className=" flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Ano
              </Label>
              <Input
                id="year"
                {...register("year")}
                autoComplete="off"
                placeholder="Ex. 2025"
                maxLength={4}
                defaultValue={searchParams.get("year")}
                onChange={(e) => {
                  const onlyNums = onlyNumbers(e.target.value);
                  setValue("year", onlyNums);
                }}
              />
            </div>
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="account" className=" flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Conta RCI
            </Label>
            <Select
              onValueChange={(value) => setValue("account", value)}
              value={account}
            >
              <SelectTrigger id="account">
                <SelectValue placeholder="Todas as contas RCI" />
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
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="status" className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              Status
            </Label>
            <Select
              onValueChange={(value) => setValue("status", value)}
              value={status}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">Processado</SelectItem>
                  <SelectItem value="false">Em processamento</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 flex-col lg:flex-row lg:items-end">
            <Button type="submit">Filtrar</Button>
            <Button
              type="button"
              className="hidden data-[visible=true]:block"
              variant="destructive"
              data-visible={!!isFiltered}
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
