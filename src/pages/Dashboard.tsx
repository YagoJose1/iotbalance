import { useState } from 'react';
import { Activity, AlertCircle, Battery, TrendingDown } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DeviceCard } from '@/components/dashboard/DeviceCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { loadMockData, getDashboardStats } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { toast } = useToast();
  const [data] = useState(() => loadMockData());
  const stats = getDashboardStats(data);

  const handleAcknowledgeAlert = (alertId: string) => {
    toast({
      title: "Alerta reconhecido",
      description: "O alerta foi marcado como reconhecido.",
    });
  };

  const handleDeviceClick = (deviceId: string) => {
    toast({
      title: "Abrindo detalhes",
      description: "Visualização detalhada do dispositivo em breve.",
    });
  };

  // Sort devices: critical first, then by percent
  const sortedDevices = [...data.devices].sort((a, b) => {
    const aPercent = a.currentPercent || 100;
    const bPercent = b.currentPercent || 100;
    return aPercent - bPercent;
  });

  const criticalDevices = sortedDevices.filter(d => (d.currentPercent || 100) < 15);
  const warningDevices = sortedDevices.filter(d => {
    const p = d.currentPercent || 100;
    return p >= 15 && p < 30;
  });

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Visão geral do sistema IoT Balance</p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Stats Overview */}
        <div>
          <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold tracking-tight">Visão Geral</h2>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Dispositivos Ativos"
              value={stats.activeDevices}
              icon={Activity}
              trend={`${stats.totalDevices} total`}
              variant="success"
            />
            <StatsCard
              title="Alertas Críticos"
              value={stats.criticalAlerts}
              icon={AlertCircle}
              trend="Requer atenção imediata"
              variant="danger"
            />
            <StatsCard
              title="Níveis Baixos"
              value={stats.devicesRunningLow}
              icon={TrendingDown}
              trend="Próximos de esgotar"
              variant="warning"
            />
            <StatsCard
              title="Bateria Média"
              value={`${(stats.avgBatteryLevel * 100).toFixed(0)}%`}
              icon={Battery}
              trend={`${stats.offlineDevices} offline`}
              variant="default"
            />
          </div>
        </div>

        {/* Active Alerts */}
        {data.alerts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Alertas Ativos</h2>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {data.alerts.length} alerta{data.alerts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {data.alerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledgeAlert}
                />
              ))}
            </div>
          </div>
        )}


        {/* All Devices */}
        <div>
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Todos os Dispositivos</h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {sortedDevices.length} dispositivo{sortedDevices.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onClick={() => handleDeviceClick(device.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
