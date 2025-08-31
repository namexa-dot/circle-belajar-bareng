import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, BookOpen, Crown, Settings } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import CategoriesManager from '@/components/admin/CategoriesManager';
import EducationsManager from '@/components/admin/EducationsManager';
import PremiumPackagesManager from '@/components/admin/PremiumPackagesManager';
import UsersManager from '@/components/admin/UsersManager';

const Admin = () => {
  const { profile, loading } = useAuth();
  const { toast } = useToast();

  // Check if user is admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    toast({
      title: 'Akses Ditolak',
      description: 'Anda tidak memiliki izin untuk mengakses halaman admin.',
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              Panel <span className="gradient-text">Administrator</span>
            </h1>
            <Badge className="premium-badge">
              <Settings className="mr-1 h-3 w-3" />
              Admin
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Kelola konten, pengguna, dan pengaturan website dari sini.
          </p>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Kategori
            </TabsTrigger>
            <TabsTrigger value="educations" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Konten Edukasi
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Paket Premium
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pengguna
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Manajemen Kategori
                </CardTitle>
                <CardDescription>
                  Kelola kategori untuk mengorganisir konten edukasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoriesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="educations">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Manajemen Konten Edukasi
                </CardTitle>
                <CardDescription>
                  Tambah, edit, dan hapus konten edukasi keuangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EducationsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Manajemen Paket Premium
                </CardTitle>
                <CardDescription>
                  Kelola harga dan paket berlangganan premium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PremiumPackagesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manajemen Pengguna
                </CardTitle>
                <CardDescription>
                  Kelola pengguna dan status membership mereka
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;