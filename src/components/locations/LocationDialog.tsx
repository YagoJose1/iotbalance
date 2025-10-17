import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Location, Organization } from "@/types";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (location: Partial<Location>) => void;
  location: Location | null;
  organizations: Organization[];
}

export const LocationDialog = ({ open, onOpenChange, onSave, location, organizations }: LocationDialogProps) => {
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [address, setAddress] = useState("");
  const [timezone, setTimezone] = useState("America/Sao_Paulo");

  useEffect(() => {
    if (location) {
      setName(location.name);
      setOrganizationId(location.organizationId);
      setAddress(location.address);
      setTimezone(location.timezone);
    } else {
      setName("");
      setOrganizationId("");
      setAddress("");
      setTimezone("America/Sao_Paulo");
    }
  }, [location, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      organizationId,
      address,
      timezone,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl mx-4">
        <DialogHeader>
          <DialogTitle>{location ? "Editar Local" : "Novo Local"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Local</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Loja Centro"
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Endereço completo"
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">America/São Paulo</SelectItem>
                <SelectItem value="America/Manaus">America/Manaus</SelectItem>
                <SelectItem value="America/Recife">America/Recife</SelectItem>
              </SelectContent>
            </Select>
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
