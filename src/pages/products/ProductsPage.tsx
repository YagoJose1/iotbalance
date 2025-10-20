import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Package, Building2 } from "lucide-react";
import { loadMockData, saveMockData } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { ProductDialog } from "@/components/products/ProductDialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";

const ProductsPage = () => {
  const { toast } = useToast();
  const [data, setData] = useState(loadMockData());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSave = (product: Partial<Product>) => {
    const newData = { ...data };
    
    if (editingProduct) {
      const index = newData.products.findIndex(p => p.id === editingProduct.id);
      newData.products[index] = { ...editingProduct, ...product };
      toast({ title: "Produto atualizado com sucesso!" });
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        organizationId: product.organizationId!,
        name: product.name!,
        sku: product.sku!,
        densityKgPerL: product.densityKgPerL,
        unitLabel: product.unitLabel || "unidade",
        active: true,
        createdAt: new Date().toISOString(),
      };
      newData.products.push(newProduct);
      toast({ title: "Produto criado com sucesso!" });
    }
    
    saveMockData(newData);
    setData(newData);
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleToggleActive = (product: Product) => {
    const newData = { ...data };
    const index = newData.products.findIndex(p => p.id === product.id);
    newData.products[index] = { ...product, active: !product.active };
    saveMockData(newData);
    setData(newData);
    toast({ 
      title: product.active ? "Produto desativado" : "Produto ativado",
      description: `${product.name} foi ${product.active ? "desativado" : "ativado"} com sucesso.`
    });
  };

  // 🗑️ NOVA FUNÇÃO: Remover produto
  const handleDelete = (product: Product) => {
    if (!confirm(`Tem certeza que deseja remover o produto "${product.name}"?`)) return;

    const newData = { ...data };
    newData.products = newData.products.filter(p => p.id !== product.id);

    saveMockData(newData);
    setData(newData);

    toast({
      title: "Produto removido",
      description: `${product.name} foi removido com sucesso.`,
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Produtos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gerencie o catálogo de produtos</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setDialogOpen(true); }} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.products.map((product) => {
          const organization = data.organizations.find(o => o.id === product.organizationId);
          const assignmentCount = data.deviceAssignments?.filter(a => a.productId === product.id && !a.endedAt).length || 0;

          return (
            <Card 
              key={product.id} 
              className="p-4 sm:p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <Badge variant={product.active ? "default" : "secondary"}>
                  {product.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold mb-1 truncate">{product.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">SKU: {product.sku}</p>
              
              {organization && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-3">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{organization.name}</span>
                </div>
              )}

              {product.densityKgPerL && (
                <p className="text-xs text-muted-foreground mb-3">
                  Densidade: {product.densityKgPerL} kg/L
                </p>
              )}
              
              <div className="pt-3 border-t space-y-2">
                <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {assignmentCount} dispositivo{assignmentCount !== 1 ? "s" : ""} em uso
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(product)}
                    className="flex-1 text-xs"
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant={product.active ? "secondary" : "default"}
                    onClick={() => handleToggleActive(product)}
                    className="flex-1 text-xs"
                  >
                    {product.active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product)}
                    className="flex-1 text-xs"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {data.products.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
          <p className="text-muted-foreground mb-4">Comece criando seu primeiro produto</p>
          <Button onClick={() => { setEditingProduct(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Produto
          </Button>
        </Card>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        product={editingProduct}
        organizations={data.organizations}
      />
    </div>
  );
};

export default ProductsPage;
