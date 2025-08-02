import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, AlertTriangle } from "lucide-react";
import type { ContractListItem } from "@/types";
import ContractAlertsDialog from "./ContractAlertsDialog";

import { formatCurrency } from "@/lib/contracts/utils";

interface ContractTableRowProps {
  contract: ContractListItem;
  formatDate: (dateString: string) => string;
}

const ContractTableRow = ({ contract, formatDate }: ContractTableRowProps) => {
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const hasAlerts = contract.alertas && contract.alertas.length > 0;

  return (
    <>
      <TableRow className={hasAlerts ? "bg-yellow-50/50" : ""}>
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
            {hasAlerts && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlertsDialogOpen(true)}
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
              >
                <AlertTriangle className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/contracts/${contract.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {hasAlerts && (
        <ContractAlertsDialog
          open={alertsDialogOpen}
          onOpenChange={setAlertsDialogOpen}
          alerts={contract.alertas}
          contractName={contract.nome}
        />
      )}
    </>
  );
};

export default ContractTableRow;
