import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { UploadExtractModal } from "@/components/extracts/upload-extract-modal";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { useSearchParams } from "react-router-dom";
import { ExtractDetailsModal } from "@/components/extracts/extract-details-modal";
import { Badge } from "@/components/ui/badge";

const data = [
  {
    id: 1,
    descricao: "Relatório Financeiro Janeiro",
    id_conta_rci: 101,
    mes_referencia: "01",
    ano_referencia: "2025",
    processado: true,
    link_arquivo: "https://exemplo.com/relatorio-janeiro.pdf",
  },
  {
    id: 2,
    descricao: "Resumo de Vendas Fevereiro",
    id_conta_rci: 102,
    mes_referencia: "02",
    ano_referencia: "2025",
    processado: false,
    link_arquivo: "https://exemplo.com/resumo-fevereiro.pdf",
  },
  {
    id: 3,
    descricao: "Demonstrativo de Custos Março",
    id_conta_rci: 103,
    mes_referencia: "03",
    ano_referencia: "2025",
    processado: true,
    link_arquivo: "https://exemplo.com/custos-marco.pdf",
  },
  {
    id: 4,
    descricao: "Relatório Anual 2024",
    id_conta_rci: 104,
    mes_referencia: "12",
    ano_referencia: "2025",
    processado: true,
    link_arquivo: "https://exemplo.com/relatorio-anual-2024.pdf",
  },
  {
    id: 5,
    descricao: "Projeções Financeiras Abril",
    id_conta_rci: 105,
    mes_referencia: "04",
    ano_referencia: "2025",
    processado: false,
    link_arquivo: "https://exemplo.com/projecoes-abril.pdf",
  },
];

export function ExtractsManagement() {
  const [open, setOpen] = useState(false);
  const [_, setSearchParams] = useSearchParams();
  const { data: extracts } = useQuery({
    queryKey: ["extracts"],
    queryFn: () => fetcher<Pagination<BankExtract>>("/app/extrato-bancario"),
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Extratos</h1>
            <p className="text-gray-600">
              Gerencie os extratos das contas de RCI
            </p>
          </div>
        </header>
        <main>
          <div className="flex justify-end mb-6">
            <Button onClick={() => setOpen(true)}>
              Adicionar extrato
              <Plus />
            </Button>
          </div>

          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Descrição</TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    Número da Conta
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    Mês/Ano Referência
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    Status
                  </TableHead>
                  <TableHead className="min-w-[120px] text-center">
                    Link do arquivo
                  </TableHead>
                  <TableHead className="min-w-[100px] whitespace-nowrap">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((extract) => (
                  <TableRow key={extract.id}>
                    <TableCell className="min-w-[200px]">
                      {extract.descricao}
                    </TableCell>
                    <TableCell className="text-center">
                      {extract.id_conta_rci}
                    </TableCell>
                    <TableCell className="text-center">{`${extract.mes_referencia}/${extract.ano_referencia}`}</TableCell>
                    <TableCell className="text-center">
                      {extract.processado ? (
                        <Badge className="bg-emerald-600">Processado</Badge>
                      ) : (
                        <Badge className="bg-orange-500">
                          Em processamento
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <a
                        href={extract.link_arquivo}
                        download
                        className="text-blue-400 hover:underline"
                      >
                        {extract.link_arquivo}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSearchParams({ current: String(extract.id) })
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
        <UploadExtractModal onOpenChange={handleClose} open={open} />
      </div>

      <ExtractDetailsModal />
    </Layout>
  );
}
