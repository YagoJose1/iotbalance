import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Activity, Battery, Signal, Thermometer, Edit } from "lucide-react";
import { loadMockData, generateWeightHistory, saveMockData } from "@/lib/mockData";
import { WeightChart } from "@/components/device/WeightChart";
import { ConsumptionHistory } from "@/components/device/ConsumptionHistory";
import { DevicePolicyConfig } from "@/components/device/DevicePolicyConfig";
import { DeviceDialog } from "@/components/devices/DeviceDialog";
import type { Device } from "@/types";
import { useToast } from "@/hooks/use-toast";

const DeviceDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [data, setData] = useState(loadMockData());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const device = data.devices.find(d => d.id === id);
  const assignment = data.deviceAssignments?.find(
    a => a.deviceId === id && !a.endedAt
  );
  const product = assignment ? data.products.find(p => p.id === assignment.productId) : null;
  const container = assignment ? data.containers.find(c => c.id === assignment.containerId) : null;
  const location = device ? data.locations.find(l => l.id === device.locationId) : null;
  const zone = device?.zoneId ? data.zones.find(z => z.id === device.zoneId) : null;
  const policies = data.policies.filter(p => 
    p.scopeType === 'device' && p.scopeId === id
  );

  if (!device) {
    return (
      <div className="space-y-6">
        <Link to="/devices">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Dispositivo não encontrado</p>
        </Card>
      </div>
    );
  }

  const weightHistory = generateWeightHistory(device);

  const getStatusColor = (percent: number) => {
    if (percent < 15) return "text-danger";
    if (percent < 30) return "text-warning";
    return "text-success";
  };

  const handleEditClick = () => {
    setEditingDevice(device);
    setDialogOpen(true);
  };

  const handleSave = (updated: Partial<Device>) => {
    const newData = { ...data };
    const index = newData.devices.findIndex(d => d.id === device.id);
    if (index >= 0) {
      newData.devices[index] = { ...newData.devices[index], ...updated };
      saveMockData(newData);
      setData(newData);
      toast({ title: "Dispositivo atualizado com sucesso!" });
    } else {
      toast({ title: "Erro ao atualizar dispositivo", variant: "destructive" });
    }
    setDialogOpen(false);
    setEditingDevice(null);
  };

  return (
    <div className="space-y-6">
      <Link to="/devices">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{device.serial}</h1>
          <p className="text-muted-foreground">{product?.name || "Sem produto vinculado"}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
            {device.status}
          </Badge>

          {/* Botão Editar */}
          <Button variant="ghost" onClick={handleEditClick} className="h-8">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`h-5 w-5 ${getStatusColor(device.currentPercent)}`} />
            <span className="text-sm text-muted-foreground">Nível Atual</span>
          </div>
          <p className={`text-2xl font-bold ${getStatusColor(device.currentPercent)}`}>
            {device.currentPercent.toFixed(1)}%
          </p>
          <Progress value={device.currentPercent} className="h-2 mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Battery className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Bateria</span>
          </div>
          <p className="text-2xl font-bold">{(device.batteryLevel * 100).toFixed(0)}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Signal className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Sinal</span>
          </div>
          <p className="text-2xl font-bold">{device.rssi} dBm</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Firmware</span>
          </div>
          <p className="text-2xl font-bold">{device.firmwareVersion}</p>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informações do Dispositivo</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modelo:</span>
              <span className="font-medium">{device.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Local:</span>
              <span className="font-medium">{location?.name}</span>
            </div>
            {zone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zona:</span>
                <span className="font-medium">{zone.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Último visto:</span>
              <span className="font-medium">
                {new Date(device.lastSeenAt).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Calibração</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fator:</span>
              <span className="font-medium">{device.calibrationFactor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offset:</span>
              <span className="font-medium">{device.offset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unidade:</span>
              <span className="font-medium">{device.unit}</span>
            </div>
            {container && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tara:</span>
                <span className="font-medium">{container.tareWeightG}g</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
          <TabsTrigger value="consumption">Histórico de Consumo</TabsTrigger>
          <TabsTrigger value="policies">Políticas e Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card className="p-6">
            <WeightChart data={weightHistory} />
          </Card>
        </TabsContent>

        <TabsContent value="consumption">
          <ConsumptionHistory device={device} />
        </TabsContent>

        <TabsContent value="policies">
          <DevicePolicyConfig device={device} policies={policies} />
        </TabsContent>
      </Tabs>

      {/* DeviceDialog para edição */}
      <DeviceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        device={editingDevice}
        organizations={data.organizations}
        locations={data.locations}
        zones={data.zones}
      />
    </div>
  );
};

export default DeviceDetailPage;
