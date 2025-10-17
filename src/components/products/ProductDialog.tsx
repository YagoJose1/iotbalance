import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Organization } from "@/types";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Partial<Product>) => void;
  product: Product | null;
  organizations: Organization[];
}

export const ProductDialog = ({ open, onOpenChange, onSave, product, organizations }: ProductDialogProps) => {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [densityKgPerL, setDensityKgPerL] = useState("");
  const [unitLabel, setUnitLabel] = useState("unidade");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setOrganizationId(product.organizationId);
      setDensityKgPerL(product.densityKgPerL?.toString() || "");
      setUnitLabel(product.unitLabel);
    } else {
      setName("");
      setSku("");
      setOrganizationId("");
      setDensityKgPerL("");
      setUnitLabel("unidade");
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      sku,
      organizationId,
      densityKgPerL: densityKgPerL ? parseFloat(densityKgPerL) : undefined,
      unitLabel,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-2xl mx-4">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Refrigerante Cola 2L"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ex: REF-COL-2L"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="density">Densidade (kg/L - opcional)</Label>
              <Input
                id="density"
                type="number"
                step="0.001"
                value={densityKgPerL}
                onChange={(e) => setDensityKgPerL(e.target.value)}
                placeholder="Ex: 1.042"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitLabel">Unidade de Medida</Label>
              <Select value={unitLabel} onValueChange={setUnitLabel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="litro">Litro</SelectItem>
                  <SelectItem value="kg">Quilograma</SelectItem>
                  <SelectItem value="garrafa">Garrafa</SelectItem>
                  <SelectItem value="barril">Barril</SelectItem>
                </SelectContent>
              </Select>
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
