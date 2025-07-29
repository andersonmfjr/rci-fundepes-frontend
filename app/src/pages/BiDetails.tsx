import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Share2 } from "lucide-react";
import {
  BiDetailsResponse,
  BiDetailsStats as BiDetailsStatsType,
} from "@/types";
import { biService } from "@/lib/bi";
import Layout from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { BiDetailsStats, BiBarChart, BiDonutChart } from "@/components/bi";
import { usePageTitle } from "@/hooks/use-page-title";
import { Skeleton } from "@/components/ui/skeleton";

const BiDetails = () => {
  usePageTitle("Business Intelligence - Detalhamento");
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BiDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await biService.getDetails(id);
      setData(response);
    } catch (error) {
      console.error("Error loading details:", error);
      toast({
        title: "Erro ao carregar detalhes",
        description: "Não foi possível carregar os detalhes do projeto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const formatCompactCurrency = useCallback(
    (value: number) => {
      if (value >= 1000000) {
        return `R$ ${(value / 1000000).toFixed(1)} mi`;
      } else if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)} mil`;
      }
      return formatCurrency(value);
    },
    [formatCurrency]
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Projeto não encontrado
            </h1>
            <p className="text-gray-600">
              O projeto solicitado não foi encontrado ou não existe.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ressarcimento de Custos Indiretos
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  Atualizado em 12 de jun de 2025
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              COMPARTILHAR
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <BiDetailsStats
            stats={data.stats}
            formatCurrency={formatCurrency}
            formatCompactCurrency={formatCompactCurrency}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-md border bg-white p-4">
              <BiBarChart data={data.barChart} />
            </div>
            <div className="rounded-md border bg-white p-4">
              <BiDonutChart data={data.donutChart} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BiDetails;
