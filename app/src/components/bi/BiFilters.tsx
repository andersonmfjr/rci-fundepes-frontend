import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CalendarIcon,
  Search,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { biService } from "@/lib/bi";

interface BiFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: {
    unidade_academica?: number;
    tipo_contrato?: number;
    projeto_contrato?: number;
    periodo_inicio?: string;
    periodo_fim?: string;
  }) => void;
}

const BiFilters: React.FC<BiFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onFiltersChange,
}) => {
  const [academicUnits, setAcademicUnits] = useState<AcademicUnit[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [projectContracts, setProjectContracts] = useState<
    { id: number; nome: string }[]
  >([]);
  const [selectedAcademicUnit, setSelectedAcademicUnit] =
    useState<string>("all");
  const [selectedContractType, setSelectedContractType] =
    useState<string>("all");
  const [selectedProjectContract, setSelectedProjectContract] =
    useState<string>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem("bi-filters-expanded");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [units, types, projects] = await Promise.all([
          biService.getAcademicUnits(),
          biService.getContractTypes(),
          biService.getProjectContracts(),
        ]);
        setAcademicUnits(units);
        setContractTypes(types);
        setProjectContracts(projects);
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    };

    loadFilterOptions();
  }, []);

  const currentFilters = useMemo(
    () => ({
      unidade_academica:
        selectedAcademicUnit !== "all"
          ? parseInt(selectedAcademicUnit)
          : undefined,
      tipo_contrato:
        selectedContractType !== "all"
          ? parseInt(selectedContractType)
          : undefined,
      projeto_contrato:
        selectedProjectContract !== "all"
          ? parseInt(selectedProjectContract)
          : undefined,
      periodo_inicio: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      periodo_fim: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    }),
    [
      selectedAcademicUnit,
      selectedContractType,
      selectedProjectContract,
      startDate,
      endDate,
    ]
  );

  useEffect(() => {
    onFiltersChange(currentFilters);
  }, [currentFilters, onFiltersChange]);

  useEffect(() => {
    localStorage.setItem("bi-filters-expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
          <div className="flex items-center gap-2">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="text-sm">Ocultar</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-sm">Mostrar</span>
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* First Row: Search, Academic Unit, Contract Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Academic Unit */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Unidade Acadêmica</label>
                <Select
                  value={selectedAcademicUnit}
                  onValueChange={setSelectedAcademicUnit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as unidades</SelectItem>
                    {academicUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contract Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Contrato</label>
                <Select
                  value={selectedContractType}
                  onValueChange={setSelectedContractType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {contractTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row: Project/Contract and Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project/Contract */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Projeto/Contrato</label>
                <Select
                  value={selectedProjectContract}
                  onValueChange={setSelectedProjectContract}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os projetos</SelectItem>
                    {projectContracts.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                      >
                        {project.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Period */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate
                          ? format(startDate, "dd/MM/yyyy", { locale: ptBR })
                          : "Início"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate
                          ? format(endDate, "dd/MM/yyyy", { locale: ptBR })
                          : "Fim"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default BiFilters;
