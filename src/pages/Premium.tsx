import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Crown, 
  Check, 
  Star, 
  Users, 
  VideoIcon,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

interface PremiumPackage {
  id: string;
  name: string;
  price: number;
  description: string | null;
  duration_months: number;
  is_popular: boolean;
  is_active: boolean;
}

const Premium = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_packages')
        .select('*')
        .eq('is_active', true)
        .order('duration_months', { ascending: true });

      if (error) throw error;

      setPackages(data || []);
      
      // Set default selected plan to the first package if none selected
      if (data && data.length > 0 && !selectedPlan) {
        setSelectedPlan(data[0].id);
      }
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

  useEffect(() => {
    fetchPackages();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const benefits = [
    {
      icon: BookOpen,
      title: 'Akses Materi Eksklusif',
      description: 'Dapatkan akses ke semua konten premium termasuk panduan mendalam dan strategi advanced'
    },
    {
      icon: VideoIcon,
      title: 'Video Premium & Studi Kasus',
      description: 'Tonton video tutorial eksklusif dan analisis studi kasus nyata dari para ahli'
    },
    {
      icon: MessageCircle,
      title: 'Konsultasi dengan Mentor',
      description: 'Dapatkan kesempatan konsultasi singkat dengan mentor berpengalaman'
    },
    {
      icon: TrendingUp,
      title: 'Template & Tools Premium',
      description: 'Akses template perencanaan keuangan dan tools kalkulasi yang powerful'
    },
    {
      icon: Users,
      title: 'Webinar Eksklusif',
      description: 'Ikuti webinar khusus member premium dengan pembicara ahli keuangan'
    },
    {
      icon: Zap,
      title: 'Akses Prioritas',
      description: 'Dapatkan akses lebih awal ke fitur-fitur terbaru dan konten yang akan datang'
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Silakan login terlebih dahulu untuk melanjutkan pembayaran',
        variant: 'destructive',
      });
      return;
    }

    try {
      toast({
        title: 'Memproses...',
        description: 'Sedang menyiapkan pembayaran Anda',
      });

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { paket: planId }
      });

      if (error) {
        throw error;
      }

      if (data?.token) {
        // Use Snap.js popup
        (window as any).snap.pay(data.token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result);
            toast({
              title: 'Pembayaran Berhasil!',
              description: 'Selamat! Akun Anda telah diupgrade ke Premium.',
            });
            // Refresh page to update premium status
            window.location.reload();
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result);
            toast({
              title: 'Pembayaran Pending',
              description: 'Pembayaran Anda sedang diproses. Mohon tunggu konfirmasi.',
            });
          },
          onError: function(result: any) {
            console.log('Payment error:', result);
            toast({
              title: 'Pembayaran Gagal',
              description: 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.',
              variant: 'destructive',
            });
          },
          onClose: function() {
            console.log('Payment popup closed');
            toast({
              title: 'Pembayaran Dibatalkan',
              description: 'Anda membatalkan proses pembayaran.',
            });
          }
        });
      } else {
        throw new Error('Payment token not received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Gagal Memproses Pembayaran',
        description: error.message || 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.',
        variant: 'destructive',
      });
    }
  };

  const isPremium = profile?.role === 'premium' && 
                   (!profile.premium_until || new Date(profile.premium_until) > new Date());

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-16 w-16 text-primary animate-float" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Upgrade ke <span className="gradient-text">Premium</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buka potensi penuh pembelajaran keuangan Anda dengan akses eksklusif ke semua materi premium
          </p>
          
          {isPremium && (
            <div className="mt-6">
              <Badge className="premium-badge text-lg px-6 py-2">
                <Crown className="mr-2 h-5 w-5" />
                Anda sudah menjadi Member Premium!
              </Badge>
            </div>
          )}
        </div>

        {!isPremium && (
          <>
            {/* Pricing Plans */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Pilih Paket Berlangganan</h2>
              
              {loading ? (
                <div className="text-center">
                  <div className="text-muted-foreground">Memuat paket premium...</div>
                </div>
              ) : packages.length === 0 ? (
                <div className="text-center">
                  <div className="text-muted-foreground">Tidak ada paket premium tersedia</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {packages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`card-gradient relative cursor-pointer transition-all duration-300 ${
                        selectedPlan === pkg.id 
                          ? 'ring-2 ring-primary scale-105' 
                          : 'hover:scale-102'
                      } ${pkg.is_popular ? 'border-primary/50' : ''}`}
                      onClick={() => setSelectedPlan(pkg.id)}
                    >
                      {pkg.is_popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="premium-badge">
                            <Star className="mr-1 h-3 w-3" />
                            Paling Populer
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                        <div className="py-4">
                          <div className="text-4xl font-bold text-primary">{formatPrice(pkg.price)}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {pkg.duration_months} bulan
                          </div>
                        </div>
                        <CardDescription>{pkg.description || `Akses premium selama ${pkg.duration_months} bulan`}</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <Button 
                          className="w-full btn-premium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpgrade(pkg.id);
                          }}
                        >
                          Pilih Paket Ini
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Keuntungan Member Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-gradient text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Perbandingan Fitur</h2>
          <Card className="card-gradient max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4">Fitur</th>
                      <th className="text-center py-4 px-4">Gratis</th>
                      <th className="text-center py-4 px-4">
                        <div className="flex items-center justify-center">
                          <Crown className="mr-2 h-5 w-5 text-primary" />
                          Premium
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Akses konten dasar', free: true, premium: true },
                      { feature: 'Video tutorial premium', free: false, premium: true },
                      { feature: 'Studi kasus nyata', free: false, premium: true },
                      { feature: 'Konsultasi mentor', free: false, premium: true },
                      { feature: 'Template keuangan', free: false, premium: true },
                      { feature: 'Webinar eksklusif', free: false, premium: true },
                      { feature: 'Akses prioritas fitur baru', free: false, premium: true },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="py-4 px-4">{row.feature}</td>
                        <td className="text-center py-4 px-4">
                          {row.free ? (
                            <Check className="h-5 w-5 text-secondary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-4">
                          {row.premium ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Kata Member Premium</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah K.',
                role: 'Entrepreneur',
                content: 'Materi premium sangat membantu saya memahami investasi. ROI yang didapat jauh lebih besar dari biaya membership!'
              },
              {
                name: 'Ahmad R.',
                role: 'Professional',
                content: 'Video tutorial dan studi kasus nyata membuat pembelajaran jadi lebih praktis dan mudah dipahami.'
              },
              {
                name: 'Lisa M.',
                role: 'Fresh Graduate',
                content: 'Template budgeting dan konsultasi mentor sangat membantu saya mengatur keuangan pertama kali.'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="card-gradient">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Apakah bisa dibatalkan kapan saja?',
                a: 'Ya, Anda dapat membatalkan membership premium kapan saja. Akses premium akan tetap aktif hingga periode berlangganan berakhir.'
              },
              {
                q: 'Bagaimana cara mengakses konten premium?',
                a: 'Setelah upgrade berhasil, Anda akan langsung mendapat akses ke semua konten premium yang ditandai dengan ikon crown.'
              },
              {
                q: 'Apakah ada garansi uang kembali?',
                a: 'Kami menyediakan garansi 7 hari uang kembali jika Anda tidak puas dengan layanan premium kami.'
              }
            ].map((faq, index) => (
              <Card key={index} className="card-gradient">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;