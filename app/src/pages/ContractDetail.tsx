import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ContractDetail } from "@/types";
import { contractsService } from "@/lib/contracts";

import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import ContractInfo from "@/components/contract-detail/ContractInfo";

import ContractBankTransfers from "@/components/contract-detail/ContractBankTransfers";
import ContractRciDistribution from "@/components/contract-detail/ContractRciDistribution";
import ContractAddendums from "@/components/contract-detail/ContractAddendums";
import { usePageTitle } from "@/hooks/use-page-title";
import { ContractDetailPageSkeleton } from "@/components/skeletons";

const ContractDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadContract(id);
    }
  }, [id]);

  const loadContract = async (contractId: string) => {
    try {
      const data = await contractsService.getById(contractId);
      setContract(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar contrato",
        description: "Não foi possível carregar os dados do contrato",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update page title when contract loads
  usePageTitle(contract ? `${contract.nome}` : "Detalhes do Contrato");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (isLoading) {
    return (
      <Layout>
        <ContractDetailPageSkeleton />
      </Layout>
    );
  }

  if (!contract) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Contrato não encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            O contrato solicitado não existe ou foi removido
          </p>
          <Button onClick={() => navigate("/contracts")}>
            Voltar para Contratos
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 lg:space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/contracts")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">
              {contract.nome}
            </h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Detalhes do contrato RCI
            </p>
          </div>
        </div>

        <ContractInfo contract={contract} formatDate={formatDate} />

        <ContractAddendums contract={contract} />

        <ContractRciDistribution contract={contract} />

        <ContractBankTransfers contract={contract} />
      </div>
    </Layout>
  );
};

export default ContractDetail;
