import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ContractsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ContractsFilters = ({
  searchTerm,
  onSearchChange,
}: ContractsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar contratos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default ContractsFilters;
