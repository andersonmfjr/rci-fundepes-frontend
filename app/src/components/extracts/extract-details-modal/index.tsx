import { ExtractDetailsSkeleton } from "@/components/skeletons/extracts-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function ExtractDetailsModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: extract, isLoading } = useQuery({
    queryKey: ["get-extract", searchParams.get("current")],
    queryFn: async ({ queryKey: [_, id] }) =>
      fetcher<BankExtract>(`/app/extrato-bancario/${id}`),
    enabled: !!searchParams.get("current"),
  });

  const handleClose = () => {
    const query = new URLSearchParams(searchParams);

    query.delete("current");
    setSearchParams(query);
  };

  return (
    <Dialog open={!!searchParams.get("current")} onOpenChange={handleClose}>
      <form>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do extrato</DialogTitle>
            <DialogDescription hidden>
              Na tabela estão as tranferências contidas no extrato.
            </DialogDescription>
          </DialogHeader>
          {isLoading && <ExtractDetailsSkeleton />}
          {!isLoading && (
            <div className="w-full">
              <div className="flex flex-col gap-2">
                <div className="">
                  <span className="text-xs font-semibold">Descrição:</span>
                  <p>{extract?.descricao}</p>
                </div>
                <div className="">
                  <span className="text-xs font-semibold">Mês/Ano:</span>
                  <p>
                    {extract?.mes_referencia}/{extract?.ano_referencia}
                  </p>
                </div>
                <div className="">
                  <span className="text-xs font-semibold">Conta:</span>
                  <p>{extract?.conta_rci_numero}</p>
                </div>
                <div className="">
                  <span className="text-xs font-semibold block mb-1">
                    Status:
                  </span>
                  {extract?.processado ? (
                    <Badge className="bg-emerald-600">Processado</Badge>
                  ) : (
                    <Badge className="bg-orange-500">Em processamento</Badge>
                  )}
                </div>
              </div>

              <hr className="my-3" />

              <h2 className="font-semibold mb-3">Transferências</h2>
              <div className="overflow-hidden rounded-md border bg-white max-w-[550px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="max-w-10">Data</TableHead>
                      <TableHead className="max-w-10">Valor</TableHead>
                      <TableHead className="max-w-10">Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="max-w-[500px]">
                    {extract?.transferencias &&
                    extract.transferencias.length > 0 ? (
                      extract.transferencias.map((transfer) => (
                        <TableRow
                          key={transfer.id_transferencia_realizada}
                          className="overflow-x-auto"
                        >
                          <TableCell>
                            {new Intl.DateTimeFormat("pt-BR", {
                              dateStyle: "short",
                            }).format(new Date(transfer.data))}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(transfer.valor))}
                          </TableCell>
                          <TableCell>{transfer.observacao}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Nenhuma transferência foi realizada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
