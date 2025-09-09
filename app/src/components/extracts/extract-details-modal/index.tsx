import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useNavigate, useSearchParams } from "react-router-dom";

export function ExtractDetailsModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: extract } = useQuery({
    queryKey: ["get-extract", searchParams.get("current")],
    queryFn: async ({ queryKey: [_, id] }) =>
      fetcher<BankExtract>(`/app/extrato-bancario/${id}`),
    enabled: !!searchParams.get("current"),
  });

  const handleClose = () => navigate("/extracts", { replace: true });

  return (
    <Dialog open={!!searchParams.get("current")} onOpenChange={handleClose}>
      <form>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detalhes do extrato</DialogTitle>
            <DialogDescription hidden>
              Na tabela estão as tranferências contidas no extrato.
            </DialogDescription>
          </DialogHeader>
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
                <p>
                  {extract?.mes_referencia}/{extract?.ano_referencia}
                </p>
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

            <div className="overflow-hidden">
              <h2 className="font-semibold mb-3">Transferências</h2>
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="max-w-10">Data</TableHead>
                    <TableHead className="max-w-10">Valor</TableHead>
                    <TableHead className="max-w-10">Observação</TableHead>
                    <TableHead className="max-w-10">Conta projeto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhuma transferência foi realizada
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
