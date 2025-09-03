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

interface ContractsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ContractsFilters = ({
  searchTerm,
  onSearchChange,
}: ContractsFiltersProps) => {
  return (
    <fieldset className="border rounded-md pb-5 pt-1 px-4">
      <legend className="font-bold mb-2 text-lg">Filtros</legend>
      <div className="flex gap-4 lg:gap-10 flex-col lg:flex-row">
        <div className="space-y-1">
          <Label htmlFor="from">Vigência (inicial e final)</Label>
          <div className="flex gap-2">
            <Input type="date" id="from" />
            <Input type="date" id="to" />
          </div>
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="unity">Unidade</Label>
          <Select>
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
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default ContractsFilters;
