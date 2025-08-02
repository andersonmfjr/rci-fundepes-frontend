import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import type { ContractListItem } from "@/types";
import ContractTableRow from "./ContractTableRow";

type SortField = "nome" | "valor_total" | "data_criacao" | "data_atualizacao";
type SortDirection = "asc" | "desc";

interface ContractsTableProps {
  contracts: ContractListItem[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  formatDate: (dateString: string) => string;
}

const ContractsTable = ({
  contracts,
  sortField,
  sortDirection,
  onSort,
  formatDate,
}: ContractsTableProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }

    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
    );
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              <button
                onClick={() => onSort("nome")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Nome
                {getSortIcon("nome")}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort("valor_total")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Valor Total
                {getSortIcon("valor_total")}
              </button>
            </TableHead>

            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort("data_criacao")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Criado em
                {getSortIcon("data_criacao")}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort("data_atualizacao")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Atualizado em
                {getSortIcon("data_atualizacao")}
              </button>
            </TableHead>
            <TableHead className="text-right min-w-[100px] whitespace-nowrap">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <ContractTableRow
              key={contract.id}
              contract={contract}
              formatDate={formatDate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractsTable;
