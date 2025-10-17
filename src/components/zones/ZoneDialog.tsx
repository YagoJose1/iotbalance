import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Zone, Location, Organization } from "@/types";

interface ZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (zone: Partial<Zone>) => void;
  zone: Zone | null;
  locations: Location[];
  organizations: Organization[];
}

export const ZoneDialog = ({ open, onOpenChange, onSave, zone, locations, organizations }: ZoneDialogProps) => {
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [description, setDescription] = useState("");

  const filteredLocations = locations.filter(l => l.organizationId === organizationId);

  useEffect(() => {
    if (zone) {
      setName(zone.name);
      setLocationId(zone.locationId);
      setDescription(zone.description || "");
      const location = locations.find(l => l.id === zone.locationId);
      if (location) {
        setOrganizationId(location.organizationId);
      }
    } else {
      setName("");
      setOrganizationId("");
      setLocationId("");
      setDescription("");
    }
  }, [zone, open, locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      locationId,
      description,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl mx-4">
        <DialogHeader>
          <DialogTitle>{zone ? "Editar Zona" : "Nova Zona"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Zona</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Área de Produção"
              required
            />
          </div>


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
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a zona"
              rows={3}
            />
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
