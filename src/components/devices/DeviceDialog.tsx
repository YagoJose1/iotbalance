import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Device, Organization, Location, Zone } from "@/types";

interface DeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (device: Partial<Device>) => void;
  device: Device | null;
  organizations: Organization[];
  locations: Location[];
  zones: Zone[];
}

export const DeviceDialog = ({ open, onOpenChange, onSave, device, organizations, locations, zones }: DeviceDialogProps) => {
  const [serial, setSerial] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [model, setModel] = useState("HX711");
  const [calibrationFactor, setCalibrationFactor] = useState("1.0");
  const [offset, setOffset] = useState("0");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [lowLevelPercent, setLowLevelPercent] = useState("30");
  const [criticalLevelPercent, setCriticalLevelPercent] = useState("15");

  const filteredLocations = locations.filter(l => l.organizationId === organizationId);
  const filteredZones = zones.filter(z => z.locationId === locationId);

  useEffect(() => {
    if (device) {
      setSerial(device.serial);
      setOrganizationId(device.organizationId);
      setLocationId(device.locationId);
      setZoneId(device.zoneId || "");
      setModel(device.model);
      setCalibrationFactor(device.calibrationFactor.toString());
      setOffset(device.offset.toString());
      setMinWeight(device.minWeight?.toString() || "");
      setMaxWeight(device.maxWeight?.toString() || "");
      setLowLevelPercent(device.lowLevelPercent?.toString() || "30");
      setCriticalLevelPercent(device.criticalLevelPercent?.toString() || "15");
    } else {
      setSerial("");
      setOrganizationId("");
      setLocationId("");
      setZoneId("");
      setModel("HX711");
      setCalibrationFactor("1.0");
      setOffset("0");
      setMinWeight("");
      setMaxWeight("");
      setLowLevelPercent("30");
      setCriticalLevelPercent("15");
    }
  }, [device, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      serial,
      organizationId,
      locationId,
      zoneId: zoneId || null,
      model,
      calibrationFactor: parseFloat(calibrationFactor),
      offset: parseFloat(offset),
      minWeight: minWeight ? parseFloat(minWeight) : undefined,
      maxWeight: maxWeight ? parseFloat(maxWeight) : undefined,
      lowLevelPercent: parseFloat(lowLevelPercent),
      criticalLevelPercent: parseFloat(criticalLevelPercent),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{device ? "Editar Dispositivo" : "Novo Dispositivo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serial">Serial</Label>
              <Input
                id="serial"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="KD-123456"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="HX711"
                required
              />
            </div>
          </div>

          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Local</Label>
              <Select value={locationId} onValueChange={setLocationId} required disabled={!organizationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  {filteredLocations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone">Zona (opcional)</Label>
              <Select value={zoneId} onValueChange={setZoneId} disabled={!locationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a zona" />
                </SelectTrigger>
                <SelectContent>
                  {filteredZones.map(zone => (
                    <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calibrationFactor">Fator de Calibração</Label>
              <Input
                id="calibrationFactor"
                type="number"
                step="0.01"
                value={calibrationFactor}
                onChange={(e) => setCalibrationFactor(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offset">Offset</Label>
              <Input
                id="offset"
                type="number"
                step="0.01"
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minWeight">Peso Mínimo (g)</Label>
              <Input
                id="minWeight"
                type="number"
                step="1"
                value={minWeight}
                onChange={(e) => setMinWeight(e.target.value)}
                placeholder="Ex: 0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxWeight">Peso Máximo (g)</Label>
              <Input
                id="maxWeight"
                type="number"
                step="1"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                placeholder="Ex: 5000"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lowLevelPercent">Nível Baixo (%)</Label>
              <Input
                id="lowLevelPercent"
                type="number"
                step="1"
                min="0"
                max="100"
                value={lowLevelPercent}
                onChange={(e) => setLowLevelPercent(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticalLevelPercent">Nível Crítico (%)</Label>
              <Input
                id="criticalLevelPercent"
                type="number"
                step="1"
                min="0"
                max="100"
                value={criticalLevelPercent}
                onChange={(e) => setCriticalLevelPercent(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
