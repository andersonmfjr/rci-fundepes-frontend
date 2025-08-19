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

export function ExtractsFilter() {
  const { data: rciAccounts } = useQuery({
    queryKey: ["get-rci-accounts"],
    queryFn: async () => fetcher<Pagination<RciAccount>>("/app/contas-rci"),
  });

  return (
    <fieldset className="border rounded-md pb-5 pt-1 px-4">
      <legend className="font-bold mb-2 text-lg">Filtros</legend>
      <div className="flex gap-4  lg:gap-10 flex-col lg:flex-row">
        <Input placeholder="Filtrar por mês/ano" />

        <Select>
          <SelectTrigger id="account">
            <SelectValue placeholder="Filtrar por conta" />
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

        <Select>
          <SelectTrigger id="account">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">Processado</SelectItem>
              <SelectItem value="false">Em processamento</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </fieldset>
  );
}
