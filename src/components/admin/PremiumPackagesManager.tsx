import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Calendar, Crown, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface PremiumPackage {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  description?: string;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

const packageSchema = z.object({
  name: z.string().min(1, 'Nama paket harus diisi'),
  duration_months: z.number().min(1, 'Durasi minimal 1 bulan'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  description: z.string().optional(),
  is_popular: z.boolean(),
  is_active: z.boolean(),
});

type PackageFormData = z.infer<typeof packageSchema>;

const PremiumPackagesManager = () => {
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<PremiumPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      duration_months: 1,
      price: 0,
      description: '',
      is_popular: false,
      is_active: true,
    },
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_packages')
        .select('*')
        .order('duration_months', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat paket premium',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PackageFormData) => {
    try {
      if (editingPackage) {
        // Update existing package
        const { error } = await supabase
          .from('premium_packages')
          .update(data)
          .eq('id', editingPackage.id);

        if (error) throw error;

        toast({
          title: 'Berhasil',
          description: 'Paket premium berhasil diperbarui',
        });
      } else {
        // Create new package
        const { error } = await supabase
          .from('premium_packages')
          .insert(data as any);

        if (error) throw error;

        toast({
          title: 'Berhasil',
          description: 'Paket premium berhasil ditambahkan',
        });
      }

      form.reset();
      setEditingPackage(null);
      setIsDialogOpen(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan paket premium',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (pkg: PremiumPackage) => {
    setEditingPackage(pkg);
    form.setValue('name', pkg.name);
    form.setValue('duration_months', pkg.duration_months);
    form.setValue('price', pkg.price);
    form.setValue('description', pkg.description || '');
    form.setValue('is_popular', pkg.is_popular);
    form.setValue('is_active', pkg.is_active);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus paket premium ini?')) return;

    try {
      const { error } = await supabase
        .from('premium_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Berhasil',
        description: 'Paket premium berhasil dihapus',
      });
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus paket premium',
        variant: 'destructive',
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPackage(null);
    form.reset();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="text-center py-4">Memuat paket premium...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Daftar Paket Premium</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogClose()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Edit Paket Premium' : 'Tambah Paket Premium Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingPackage 
                  ? 'Perbarui informasi paket premium'
                  : 'Tambahkan paket premium baru untuk pengguna'
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Paket</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 1 Bulan Premium" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi (Bulan)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (IDR)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1000"
                          placeholder="40000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Deskripsi paket..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_popular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Paket Populer</FormLabel>
                        <FormDescription>
                          Tandai sebagai paket yang paling populer
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Status Aktif</FormLabel>
                        <FormDescription>
                          Paket dapat dibeli oleh pengguna
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Batal
                  </Button>
                  <Button type="submit">
                    {editingPackage ? 'Perbarui' : 'Tambah'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Paket</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada paket premium
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{pkg.name}</div>
                        {pkg.description && (
                          <div className="text-sm text-muted-foreground">{pkg.description}</div>
                        )}
                      </div>
                      {pkg.is_popular && (
                        <Badge className="premium-badge">
                          <Star className="mr-1 h-3 w-3" />
                          Populer
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {pkg.duration_months} bulan
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(pkg.price)}
                  </TableCell>
                  <TableCell>
                    {pkg.is_active ? (
                      <Badge className="bg-green-500/20 text-green-300">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(pkg.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PremiumPackagesManager;