import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Crown, 
  User, 
  Mail, 
  Calendar,
  Settings,
  Star,
  TrendingUp,
  Target,
  Award,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [nama, setNama] = useState(profile?.nama || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

  // Update nama when profile changes
  useEffect(() => {
    setNama(profile?.nama || '');
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nama })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast({
        title: 'Berhasil!',
        description: 'Profil berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui profil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshingStatus(true);
    try {
      await refreshProfile();
      toast({
        title: 'Status Diperbarui!',
        description: 'Status membership telah direfresh',
      });
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui status',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshingStatus(false);
    }
  };

  const isPremium = profile?.role === 'premium' && 
                   (!profile.premium_until || new Date(profile.premium_until) > new Date());

  const premiumEndDate = profile?.premium_until ? 
    new Date(profile.premium_until).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null;

  const daysUntilExpiry = profile?.premium_until ? 
    Math.ceil((new Date(profile.premium_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 mx-auto">
              <User className="h-12 w-12 text-black" />
            </div>
            {isPremium && (
              <Crown className="absolute -top-2 -right-2 h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {profile?.nama || 'User'}
            {isPremium && (
              <Badge className="ml-3 premium-badge">
                <Crown className="mr-1 h-4 w-4" />
                Premium Member
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Informasi Profil
                  </CardTitle>
                  <CardDescription>
                    Kelola informasi akun Anda
                  </CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "outline" : "secondary"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Batal' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    {isEditing ? (
                      <Input
                        id="nama"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">
                        {profile?.nama || 'Belum diatur'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {user?.email}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Status Membership</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {isPremium ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span className="text-primary font-semibold">Premium Member</span>
                              <Crown className="ml-2 h-4 w-4 text-primary" />
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>Member Gratis</span>
                            </>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleRefreshStatus}
                          disabled={isRefreshingStatus}
                          className="text-xs"
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshingStatus ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                      {isPremium && (
                        <div className="text-sm text-muted-foreground">
                          <div>Berlaku hingga: {premiumEndDate}</div>
                          {daysUntilExpiry && daysUntilExpiry > 0 && (
                            <div className="text-green-600 font-medium">
                              Tersisa {daysUntilExpiry} hari
                            </div>
                          )}
                          {daysUntilExpiry && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                            <div className="text-orange-500 font-medium mt-1">
                              ⚠️ Membership akan berakhir dalam {daysUntilExpiry} hari
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Tanggal Bergabung</Label>
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {profile?.created_at ? 
                        new Date(profile.created_at).toLocaleDateString('id-ID') : 
                        'Tidak diketahui'
                      }
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="btn-premium"
                    >
                      {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Premium Status Card */}
            <Card className={`${isPremium ? 'border-primary/50 card-gradient shadow-lg' : 'card-gradient'}`}>
              <CardHeader className="text-center">
                <div className="relative">
                  <Crown className={`h-12 w-12 mx-auto mb-2 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <CardTitle className="text-lg">
                  {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
                </CardTitle>
                <CardDescription>
                  {isPremium 
                    ? (
                        <div className="space-y-1">
                          <div>Aktif hingga {premiumEndDate}</div>
                          {daysUntilExpiry && daysUntilExpiry > 0 && (
                            <div className={`font-medium ${daysUntilExpiry <= 7 ? 'text-orange-500' : 'text-green-600'}`}>
                              {daysUntilExpiry <= 7 ? '⚠️ ' : '✅ '}
                              {daysUntilExpiry} hari tersisa
                            </div>
                          )}
                        </div>
                      )
                    : 'Dapatkan akses ke semua fitur premium'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleRefreshStatus}
                      disabled={isRefreshingStatus}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshingStatus ? 'animate-spin' : ''}`} />
                      Refresh Status
                    </Button>
                    <Link to="/premium">
                      <Button variant="secondary" className="w-full">
                        Perpanjang Premium
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/premium">
                    <Button className="w-full btn-premium">
                      Upgrade Sekarang
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Statistik Belajar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Artikel Dibaca</span>
                  <Badge variant="secondary">15</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Video Ditonton</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hari Streak</span>
                  <Badge variant="secondary">7</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Pencapaian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">First Step</div>
                    <div className="text-xs text-muted-foreground">Membaca artikel pertama</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Target className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Dedicated Learner</div>
                    <div className="text-xs text-muted-foreground">Belajar 7 hari berturut-turut</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
