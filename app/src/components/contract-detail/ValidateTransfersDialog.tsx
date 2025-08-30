import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/contracts/utils";
import { contractsService } from "@/lib/contracts/service";
import { Loader2, Search, Calendar, Building, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ValidateTransfersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transferId: number;
  contractId: number;
  transfer?: Transfer;
}

const ValidateTransfersDialog = ({
  open,
  onOpenChange,
  transferId,
  contractId,
  transfer,
}: ValidateTransfersDialogProps) => {
  const [transfers, setTransfers] = useState<BankTransferItem[]>([]);
  const [selectedTransfers, setSelectedTransfers] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const [filters, setFilters] = useState<BankTransferFilters>({
    contrato: contractId,
    mes_ano: "",
    conta: undefined,
    search: "",
    page: 1,
    pageSize: 10,
  });

  const [accounts, setAccounts] = useState<Array<{ id: number; nome: string }>>(
    []
  );

  useEffect(() => {
    if (open) {
      // Reset states when dialog opens
      setSelectedTransfers(new Set());
      setPage(1);
      setFilters({
        contrato: contractId,
        mes_ano: "",
        conta: undefined,
        search: "",
        page: 1,
        pageSize: 10,
      });
      fetchTransfers();
      fetchAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchTransfers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await contractsService.getBankTransfers({
        ...filters,
        page,
      });
      setTransfers(response.results);
      setTotalCount(response.count);
      setTotalPages(Math.ceil(response.count / (filters.pageSize || 10)));
    } catch (error) {
      console.error("Erro ao buscar transferências:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    const uniqueAccounts = new Map<number, string>();
    try {
      const response = await contractsService.getBankTransfers({
        contrato: contractId,
        pageSize: 100,
      });
      response.results.forEach((transfer) => {
        if (transfer.conta_projeto) {
          uniqueAccounts.set(
            transfer.id_conta_projeto,
            `${transfer.conta_projeto.banco.nome} - Ag: ${transfer.conta_projeto.agencia} CC: ${transfer.conta_projeto.conta}`
          );
        }
      });
      setAccounts(Array.from(uniqueAccounts, ([id, nome]) => ({ id, nome })));
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedTransfers.size === transfers.length) {
      setSelectedTransfers(new Set());
    } else {
      setSelectedTransfers(new Set(transfers.map((t) => t.id_transferencia)));
    }
  };

  const handleSelectTransfer = (id: number) => {
    const newSelected = new Set(selectedTransfers);
    const method = newSelected.has(id) ? "delete" : "add";

    newSelected[method](id);

    setSelectedTransfers(newSelected);
  };

  const handleSubmit = async () => {
    if (selectedTransfers.size === 0) {
      toast({
        title: "Transferência não selecionada",
        description: "Selecione pelo menos uma transferência para validar",
      });
      return;
    }

    setSubmitting(true);

    try {
      await contractsService.validateTransfers(
        transferId,
        Array.from(selectedTransfers)
      );
      window.location.reload();
    } catch (error) {
      console.error("Erro ao validar transferências:", error);
      toast({
        title: "Erro",
        description: "Erro ao validar transferências",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleFilterChange = (
    key: keyof BankTransferFilters,
    value: unknown
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
    setPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Validar transferência{" "}
            {transfer
              ? `#${transfer?.id_transferencia} | ${formatCurrency(
                  transfer.valor
                )} | ${formatDate(transfer.data)}`
              : ""}
          </DialogTitle>
          <DialogDescription>
            Selecione as transferências realizadas para validar esta
            transferência RCI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mes_ano" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mês/ano
              </Label>
              <Input
                id="mes_ano"
                type="text"
                placeholder="Ex. 01/2025"
                value={filters.mes_ano}
                onChange={(e) => handleFilterChange("mes_ano", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conta" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Conta
              </Label>
              <Select
                value={filters.conta?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange(
                    "conta",
                    value === "all" ? undefined : Number(value)
                  )
                }
              >
                <SelectTrigger id="conta">
                  <SelectValue placeholder="Todas as contas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as contas</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </Label>
              <Input
                id="search"
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedTransfers.size} de {totalCount} selecionadas
              </div>
            </div>

            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : transfers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mb-2" />
                  <p>Nenhuma transferência encontrada</p>
                </div>
              ) : (
                <div className="divide-y">
                  {transfers.map((transfer) => (
                    <div
                      key={transfer.id_transferencia}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50"
                    >
                      <div className="mt-1">
                        <Checkbox
                          checked={selectedTransfers.has(
                            transfer.id_transferencia
                          )}
                          onCheckedChange={() =>
                            handleSelectTransfer(transfer.id_transferencia)
                          }
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              handleSelectTransfer(transfer.id_transferencia)
                            }
                          >
                            <p className="font-medium">
                              {formatCurrency(transfer.valor)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(transfer.data)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {transfer.conta_projeto.banco.nome}
                            </p>
                            <p className="text-xs text-gray-600">
                              Ag: {transfer.conta_projeto.agencia} | CC:{" "}
                              {transfer.conta_projeto.conta}
                            </p>
                          </div>
                        </div>

                        {transfer.observacao && (
                          <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                            {transfer.observacao}
                          </p>
                        )}

                        {transfer.extrato_bancario?.conta_rci && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            Extrato:{" "}
                            {transfer.extrato_bancario.conta_rci.unidade.sigla}{" "}
                            - {transfer.extrato_bancario.conta_rci.unidade.nome}{" "}
                            | {transfer.extrato_bancario.conta_rci.banco.nome}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedTransfers.size === 0 || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validando...
              </>
            ) : (
              <>Validar {transfer ? `#${transfer?.id_transferencia}` : ""}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValidateTransfersDialog;
