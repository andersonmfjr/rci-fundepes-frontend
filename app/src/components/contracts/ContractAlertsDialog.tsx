import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface ContractAlertsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alerts: Alert[];
  contractName: string;
}

const ContractAlertsDialog = ({
  open,
  onOpenChange,
  alerts,
  contractName,
}: ContractAlertsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Alertas do contrato
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Contrato: <span className="font-medium">{contractName}</span>
          </p>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="p-3 border border-yellow-200 rounded-lg bg-yellow-50"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {alert.titulo}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {alert.descricao}
                    </p>
                    <p className="text-sm text-gray-700">{alert.mensagem}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractAlertsDialog;
