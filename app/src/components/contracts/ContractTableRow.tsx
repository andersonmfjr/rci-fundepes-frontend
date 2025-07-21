import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";
import type { ContractListItem } from "@/types";

import {
  calculateTotalRciPercentage,
  formatCurrency,
} from "@/lib/contracts/utils";

interface ContractTableRowProps {
  contract: ContractListItem;
  formatDate: (dateString: string) => string;
}

const ContractTableRow = ({ contract, formatDate }: ContractTableRowProps) => {
  const totalRciPercentage = calculateTotalRciPercentage(contract.unidades);

  return (
    <TableRow>
      <TableCell className="min-w-[200px]">
        <div>
          <Link
            to={`/contracts/${contract.id}`}
            className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
          >
            {contract.nome}
          </Link>
          <p className="text-sm text-gray-500 truncate max-w-xs lg:max-w-sm xl:max-w-md line-clamp-1">
            {contract.descricao}
          </p>
        </div>
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Badge variant="outline">{totalRciPercentage.toFixed(1)}%</Badge>
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
        {formatDate(contract.data_atualizacao || "")}
      </TableCell>
      <TableCell className="text-right min-w-[100px]">
        <div className="flex items-center justify-end gap-1 lg:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/contracts/${contract.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
          {/* FIXME: Edit contract button */}
          {/* <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/contracts/${contract.id}/edit`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button> */}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ContractTableRow;
