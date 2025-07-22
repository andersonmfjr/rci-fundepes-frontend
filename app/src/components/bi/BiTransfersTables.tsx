import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BiBankTransfer, BiRciReceived } from "@/types";

interface BiTransfersTablesProps {
  bankTransfers: BiBankTransfer[];
  rciReceived: BiRciReceived[];
  formatCurrency: (value: number) => string;
}

const BiTransfersTables: React.FC<BiTransfersTablesProps> = ({
  bankTransfers,
  rciReceived,
  formatCurrency,
}) => {
  const calculateTotal = (transfers: BiBankTransfer[] | BiRciReceived[]) => {
    return transfers.reduce((total, transfer) => total + transfer.valor, 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bank Transfers Table */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Extrato bancário RCI Unidade Acadêmica
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Total: {formatCurrency(calculateTotal(bankTransfers))}
          </p>
        </div>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Origem</TableHead>
                <TableHead className="font-semibold">Destino</TableHead>
                <TableHead className="font-semibold">Valor (R$)</TableHead>
                <TableHead className="font-semibold">Obs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankTransfers.map((transfer, index) => (
                <TableRow key={index}>
                  <TableCell>{transfer.data}</TableCell>
                  <TableCell>{transfer.origem}</TableCell>
                  <TableCell>{transfer.destino}</TableCell>
                  <TableCell>{formatCurrency(transfer.valor)}</TableCell>
                  <TableCell>{transfer.observacao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* RCI Received Table */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">RCI Recebidos pelo sistema</h3>
          <p className="text-sm text-gray-600 mt-1">
            Total: {formatCurrency(calculateTotal(rciReceived))}
          </p>
        </div>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Origem</TableHead>
                <TableHead className="font-semibold">Destino</TableHead>
                <TableHead className="font-semibold">Valor (R$)</TableHead>
                <TableHead className="font-semibold">Obs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rciReceived.map((transfer, index) => (
                <TableRow key={index}>
                  <TableCell>{transfer.data}</TableCell>
                  <TableCell>{transfer.origem}</TableCell>
                  <TableCell>{transfer.destino}</TableCell>
                  <TableCell>{formatCurrency(transfer.valor)}</TableCell>
                  <TableCell>{transfer.observacao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BiTransfersTables;
