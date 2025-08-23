import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";

import { formatCurrency } from "@/lib/contracts/utils";

interface ContractTableRowProps {
  contract: ContractListItem;
  formatDate: (dateString: string) => string;
}

const ContractTableRow = ({ contract, formatDate }: ContractTableRowProps) => {
  return (
    <>
      <TableRow>
        <TableCell className="min-w-[200px]">
          <div>
            <Link
              to={`/validations/${contract.id_contrato}`}
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              {contract.nome}
            </Link>
            <p className="text-sm text-gray-500 truncate max-w-xs lg:max-w-sm xl:max-w-md line-clamp-1">
              {contract.descricao}
            </p>
          </div>
        </TableCell>
        <TableCell className="min-w-[120px]">
          <span className="font-medium text-gray-900">
            {formatCurrency(contract.valor_total)}
          </span>
        </TableCell>

        <TableCell className="text-gray-600 min-w-[120px]">
          {formatDate(contract.data_criacao || "")}
        </TableCell>
        <TableCell className="text-gray-600 min-w-[120px]">
          {contract.data_atualizacao
            ? formatDate(contract.data_atualizacao)
            : "-"}
        </TableCell>
        <TableCell className="text-right min-w-[100px]">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/validations/${contract.id_contrato}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ContractTableRow;
