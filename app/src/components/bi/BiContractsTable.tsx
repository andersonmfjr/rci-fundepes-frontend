import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { BiContract, BiSortField, BiSortDirection } from "@/types";

interface BiContractsTableProps {
  contracts: BiContract[];
  sortField: BiSortField;
  sortDirection: BiSortDirection;
  onSort: (field: BiSortField) => void;
  formatCurrency: (value: number) => string;
}

const BiContractsTable: React.FC<BiContractsTableProps> = ({
  contracts,
  sortField,
  sortDirection,
  onSort,
  formatCurrency,
}) => {
  const navigate = useNavigate();

  const getSortIcon = (field: BiSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 text-blue-600" />
    );
  };

  const handleContractClick = (contract: BiContract) => {
    navigate(`/bi/${contract.id}`);
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">
              <button
                onClick={() => onSort("contrato")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Contrato
                {getSortIcon("contrato")}
              </button>
            </TableHead>
            <TableHead className="min-w-[120px]">
              <button
                onClick={() => onSort("financiador")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Financiador
                {getSortIcon("financiador")}
              </button>
            </TableHead>
            <TableHead className="min-w-[100px]">
              <button
                onClick={() => onSort("inicio")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Início
                {getSortIcon("inicio")}
              </button>
            </TableHead>
            <TableHead className="min-w-[100px]">
              <button
                onClick={() => onSort("fim")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Fim
                {getSortIcon("fim")}
              </button>
            </TableHead>
            <TableHead className="min-w-[140px]">
              <button
                onClick={() => onSort("valor_contrato")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Valor Contrato
                {getSortIcon("valor_contrato")}
              </button>
            </TableHead>
            <TableHead className="min-w-[160px]">
              <button
                onClick={() => onSort("valor_rci_reitoria")}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                Valor RCI Reitoria
                {getSortIcon("valor_rci_reitoria")}
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">
                <button
                  onClick={() => handleContractClick(contract)}
                  className="text-left hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                >
                  {contract.contrato}
                </button>
              </TableCell>
              <TableCell>{contract.financiador}</TableCell>
              <TableCell>{contract.inicio}</TableCell>
              <TableCell>{contract.fim}</TableCell>
              <TableCell>{formatCurrency(contract.valor_contrato)}</TableCell>
              <TableCell>
                {formatCurrency(contract.valor_rci_reitoria)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BiContractsTable;
