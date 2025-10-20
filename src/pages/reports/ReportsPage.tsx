import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart3, TrendingDown, Download, Package, Activity } from "lucide-react";
import { loadMockData } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReportsPage = () => {
  const { toast } = useToast();
  const [data] = useState(loadMockData());
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");

  const handleExport = (reportType: string) => {
    toast({
      title: "Exportando relatório",
      description: `Relatório de ${reportType} será baixado em breve.`,
    });
  };

  const filteredDevices = data.devices;
  const totalDevices = filteredDevices.length;
  const activeDevices = filteredDevices.filter(d => d.status === "active").length;
  const criticalDevices = filteredDevices.filter(d => (d.currentPercent || 100) < 15).length;
  const warningDevices = filteredDevices.filter(d => {
    const p = d.currentPercent || 100;
    return p >= 15 && p < 30;
  }).length;

  const avgLevel = filteredDevices.length > 0
    ? filteredDevices.reduce((sum, d) => sum + (d.currentPercent || 0), 0) / filteredDevices.length
    : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Relatórios</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Análise e insights do sistema</p>
        </div>
        <Button onClick={() => handleExport("completo")} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Período</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="consumption">Consumo</TabsTrigger>
          <TabsTrigger value="efficiency">Eficiência</TabsTrigger>
        </TabsList>

        {/* Aba Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dispositivos Ativos</p>
                  <p className="text-2xl font-bold">{activeDevices}/{totalDevices}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-danger/10 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-danger" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Níveis Críticos</p>
                  <p className="text-2xl font-bold text-danger">{criticalDevices}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Níveis Baixos</p>
                  <p className="text-2xl font-bold text-warning">{warningDevices}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nível Médio</p>
                  <p className="text-2xl font-bold">{avgLevel.toFixed(1)}%</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Aba Consumo */}
        <TabsContent value="consumption" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Análise de Consumo - Últimos {selectedPeriod} dias
            </h3>
            <p className="text-muted-foreground mb-6">
              Dados de consumo detalhados por dispositivo e produto
            </p>

            <div className="space-y-4">
              {filteredDevices.slice(0, 5).map((device) => {
                const assignment = data.deviceAssignments?.find(a => a.deviceId === device.id && !a.endedAt);
                const product = assignment ? data.products.find(p => p.id === assignment.productId) : null;
                
                return (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{device.serial}</p>
                        <p className="text-sm text-muted-foreground">{product?.name || "Sem produto"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{device.currentPercent?.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Nível atual</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Aba Eficiência */}
        <TabsContent value="efficiency" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Eficiência Operacional
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Taxa de Resposta a Alertas</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">87%</span>
                  <span className="text-sm text-success">+5% vs mês anterior</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tempo Médio de Reposição</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">2.5h</span>
                  <span className="text-sm text-success">-15% vs mês anterior</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Rupturas Evitadas</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">24</span>
                  <span className="text-sm text-muted-foreground">no último mês</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Uptime dos Dispositivos</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">99.2%</span>
                  <span className="text-sm text-success">Excelente</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;