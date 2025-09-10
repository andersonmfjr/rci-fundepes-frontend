import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

type FilterSchema = {
  status: string;
  from: string;
  to: string;
  unity: string;
  search: string;
};

const ContractsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const { register, handleSubmit, setValue, reset, watch } =
    useForm<FilterSchema>({
      mode: "onSubmit",
      reValidateMode: "onSubmit",
      defaultValues: {
        status: "",
        from: from ? new Date(from).toISOString().substring(0, 10) : "",
        to: to ? new Date(to).toISOString().substring(0, 10) : "",
        unity: "",
        search: "",
      },
    });

  const status = watch("status");
  const unity = watch("unity");

  const handleFilter = (data: FilterSchema) => {
    const newSearchParams = new URLSearchParams(searchParams);
    const keys = Object.keys(data);

    for (const key of keys) {
      if (data[key]) newSearchParams.set(key, data[key]);
    }

    setSearchParams(newSearchParams);
  };

  const handleRemoveFilter = () => {
    setSearchParams({});
    reset({
      from: "",
      search: "",
      status: "",
      to: "",
      unity: "",
    });
  };

  return (
    <fieldset className="border rounded-md pb-5 pt-1 px-4">
      <legend className="font-bold mb-2 text-lg">Filtros</legend>
      <form onSubmit={handleSubmit(handleFilter)}>
        <div className="space-y-1">
          <Label htmlFor="from">Vigência (inicial e final)</Label>
          <div className="flex gap-2 lg:w-56">
            <Input type="date" id="from" {...register("from")} />
            <Input type="date" id="to" {...register("to")} />
          </div>
        </div>
        <div className="flex gap-4 flex-col lg:flex-row mt-2">
          <div className="space-y-1 w-full">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value)}
              value={status}
            >
              <SelectTrigger className="self-end" id="status">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">Validado</SelectItem>
                  <SelectItem value="false">Não validado</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="unity">Unidade</Label>
            <Select
              onValueChange={(value) => setValue("unity", value)}
              value={unity}
            >
              <SelectTrigger className="self-end" id="unity">
                <SelectValue placeholder="Filtrar por unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* {rciAccounts?.results?.map((account) => (
              <SelectItem
              value={String(account.id_conta_rci)}
              key={account.id_conta_rci}
              >
              {account?.numero} - {account?.id_banco?.nome}
              </SelectItem>
              ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-full">
            <Label>Busca textual</Label>
            <div className="relative flex-1 self-end">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar contratos..."
                className="pl-10"
                {...register("search")}
              />
            </div>
          </div>
          <Button className="self-end" type="submit">
            Filtrar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="hidden self-end data-[visible=true]:block"
            data-visible={searchParams.size > 0}
            onClick={handleRemoveFilter}
          >
            Remover filtro
          </Button>
        </div>
      </form>
    </fieldset>
  );
};

export default ContractsFilters;
