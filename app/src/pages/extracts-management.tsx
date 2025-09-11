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
import { ExtractPagination } from "@/components/extracts/extracts-pagination";
import { ExtractsFilter } from "@/components/extracts/extracts-filters";
import { ExtractsTableSkeleton } from "@/components/skeletons/extracts-skeleton";

const ITEMS_PER_PAGE = 10;

export function ExtractsManagement() {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: extracts, isLoading } = useQuery({
    queryKey: ["extracts", searchParams.toString()],
    queryFn: () => {
      const queryParams = new URLSearchParams(searchParams);
      const { month, year, account, status } = Object.fromEntries(
        queryParams.entries()
      );
      queryParams.set("page", queryParams.get("page") || "1");
      queryParams.set("page_size", "10");

      if (month) queryParams.set("mes_referencia", month);
      if (year) queryParams.set("ano_referencia", year);
      if (account) queryParams.set("id_conta_rci", account);
      if (status) queryParams.set("status", status);

      return fetcher<Pagination<BankExtract>>(
        `/app/extrato-bancario?${queryParams.toString()}`
      );
    },
  });

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenDetails = (id: string) => {
    const query = new URLSearchParams(searchParams);

    query.set("current", id);

    setSearchParams(query);
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", String(page));
    setSearchParams(newSearchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <main className="space-y-6">
          <div className="">
            <Button onClick={() => setOpen(true)}>
              Adicionar extrato
              <Plus />
            </Button>
          </div>

          <ExtractsFilter />

          {isLoading && <ExtractsTableSkeleton />}

          {!isLoading && (
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead className="min-w-[200px]">Descrição</TableHead> */}
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
                  {extracts?.results?.length ? (
                    extracts?.results?.map((extract) => (
                      <TableRow key={extract.id_extrato}>
                        {/* <TableCell className="min-w-[200px]">
                          {extract.descricao}
                        </TableCell> */}
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
                        <TableCell className="text-center max-w-32">
                          <a
                            href={extract.link_arquivo}
                            download
                            className="text-blue-400 hover:underline text-ellipsis max-w-32 block overflow-hidden whitespace-nowrap"
                          >
                            {extract.link_arquivo}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleOpenDetails(String(extract.id_extrato))
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          <ExtractPagination
            currentPage={Number(searchParams.get("page") || 1)}
            onPageChange={handlePageChange}
            totalPages={Math.ceil(extracts?.count / ITEMS_PER_PAGE)}
          />
        </main>
        <UploadExtractModal onOpenChange={handleClose} open={open} />
      </div>

      <ExtractDetailsModal />
    </Layout>
  );
}
