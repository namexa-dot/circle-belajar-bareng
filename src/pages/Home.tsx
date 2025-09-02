import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  PiggyBank, 
  Shield, 
  BookOpen, 
  Crown, 
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Video,
  Instagram,
  Music,
  Youtube,
  Twitter,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const Home = () => {
  const { user, profile } = useAuth();

  const features = [
    {
      icon: TrendingUp,
      title: 'Investasi Smart',
      description: 'Pelajari strategi investasi yang tepat untuk masa depan yang cerah',
      color: 'text-primary'
    },
    {
      icon: PiggyBank,
      title: 'Budgeting Expert',
      description: 'Kuasai seni mengelola keuangan dengan metode yang terbukti',
      color: 'text-secondary'
    },
    {
      icon: Shield,
      title: 'Asuransi & Proteksi',
      description: 'Lindungi diri dan keluarga dengan perencanaan yang matang',
      color: 'text-primary'
    },
    {
      icon: BookOpen,
      title: 'Edukasi Komprehensif',
      description: 'Materi lengkap dari basic hingga advanced level',
      color: 'text-secondary'
    }
  ];

  const premiumBenefits = [
    'Akses materi eksklusif dan mendalam',
    'Video tutorial premium & studi kasus nyata',
    'Konsultasi singkat dengan mentor berpengalaman',
    'Template dan tools perencanaan keuangan',
    'Webinar eksklusif dengan ahli keuangan',
    'Akses prioritas ke fitur terbaru'
  ];

  const communityPlatforms = [
    {
      name: 'TikTok',
      description: 'Konten Edukasi',
      icon: Music,
      url: 'https://www.tiktok.com/@circlebelajarbareng?_t=ZS-8u0kGvy8Vc2&_r=1',
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10 hover:bg-pink-400/20',
      borderColor: 'border-pink-400/20'
    },
    {
      name: 'Instagram',
      description: 'Info & Carousel',
      icon: Instagram,
      url: 'https://www.instagram.com/circlebelajarbareng?igsh=OXc5YXV5MXhueXly',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10 hover:bg-purple-400/20',
      borderColor: 'border-purple-400/20'
    },
    {
      name: 'Discord',
      description: 'Free and Premium Class & Networking',
      icon: MessageCircle,
      url: 'https://discord.gg/jNTYNwCE',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10 hover:bg-indigo-400/20',
      borderColor: 'border-indigo-400/20'
    },
    {
      name: 'YouTube',
      description: 'Video Edukasi',
      icon: Youtube,
      url: 'https://youtube.com/@circlebelajarbareng?si=xZtDzvFSMuTRFFum',
      color: 'text-red-400',
      bgColor: 'bg-red-400/10 hover:bg-red-400/20',
      borderColor: 'border-red-400/20'
    },
    {
      name: 'Twitter',
      description: 'Personal Branding Founder',
      icon: Twitter,
      url: 'https://x.com/ArdhyPrabowo10?t=kmB6hEsCn_E3UbatufEdAw&s=09',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10 hover:bg-blue-400/20',
      borderColor: 'border-blue-400/20'
    },
    {
      name: 'Lynk.id',
      description: 'Produk & Edukasi Digital',
      icon: ExternalLink,
      url: 'https://lynk.id/ardhyprabowo',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10 hover:bg-green-400/20',
      borderColor: 'border-green-400/20'
    }
  ];

  const whatsappRules = [
    'Saling respect antar member.',
    'Dilarang spam chat, stiker berlebihan, dan konten 18+.',
    'Belajar bareng – saling support satu sama lain.',
    'Tetap on-topic, sesuai bahasan komunitas.',
    'Sharing plan/portofolio diperbolehkan.',
    'Jangan FOMO, sombong, atau pelit ilmu.',
    'Selalu DYOR (Do Your Own Research).',
    'Dilarang share link berbahaya/phishing, jualan di luar finansial market, atau hal berbau 18+. (Link komunitas/edukasi diperbolehkan ✅)',
    'Jika melanggar berlebihan → akan di-kick.',
    'Ada masalah? Hubungi Admin langsung.'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Kuasai{' '}
              <span className="gradient-text">Keuangan</span>
              <br />
              Raih Mimpi
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platform edukasi keuangan terlengkap untuk membantu Anda mencapai kebebasan finansial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button asChild size="lg" className="btn-premium">
                  <Link to="/edukasi">
                    Mulai Belajar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="btn-premium">
                    <Link to="/auth">
                      Mulai Gratis <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="btn-secondary">
                    <Link to="/edukasi">Lihat Materi</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mengapa Circle Belajar Bareng?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk membimbing perjalanan finansial Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient text-center group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Materi Edukasi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Member Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Expert Mentor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="card-gradient border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
              <CardHeader className="text-center relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-primary mr-2" />
                  <CardTitle className="text-3xl font-bold">Upgrade ke Premium</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Akses eksklusif ke semua materi premium dan fitur lengkap
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center pt-6">
                  <Button asChild size="lg" className="btn-premium">
                    <Link to="/premium">
                      Jadi Member Premium <Crown className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bergabung dengan Komunitas</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Belajar bersama ribuan orang yang memiliki tujuan yang sama - mencapai kebebasan finansial melalui berbagai platform komunikasi
            </p>
          </div>

          {/* WhatsApp Group Special Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="card-gradient border-green-400/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
              <CardHeader className="text-center relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-green-400 mr-3" />
                  <CardTitle className="text-2xl font-bold">WhatsApp - Grup Diskusi Harian</CardTitle>
                </div>
                <CardDescription className="text-lg mb-6">
                  Bergabung dengan grup diskusi aktif untuk sharing pengalaman dan belajar bersama
                </CardDescription>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 mb-6"
                >
                  <a 
                    href="https://chat.whatsapp.com/Laekos6T8bB7hpkuZoYK8j" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Gabung Grup WhatsApp
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-card/50 rounded-lg p-6 border border-green-400/20">
                  <div className="flex items-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-green-400 mr-2" />
                    <h3 className="text-lg font-semibold">Peraturan Grup</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {whatsappRules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5 flex-shrink-0 border-green-400/30 text-green-400">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Social Media Platforms */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Ikuti Kami di Platform Lain</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dapatkan konten edukasi, update terbaru, dan bergabung dengan komunitas yang lebih luas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityPlatforms.map((platform, index) => (
              <Card 
                key={index} 
                className={`group hover:scale-105 transition-all duration-300 border ${platform.borderColor} ${platform.bgColor} relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
                <CardHeader className="text-center relative z-10">
                  <platform.icon className={`h-10 w-10 mx-auto mb-3 ${platform.color} group-hover:scale-110 transition-transform`} />
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <CardDescription className="text-sm">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className={`${platform.borderColor} ${platform.color} hover:bg-primary/10 transition-colors`}
                  >
                    <a 
                      href={platform.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Kunjungi
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Final CTA */}
          {!user && (
            <div className="text-center mt-12">
              <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 mb-4">
                <AlertTriangle className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Bergabung sekarang untuk akses penuh</span>
              </div>
              <div>
                <Button asChild size="lg" className="btn-premium">
                  <Link to="/auth">
                    Daftar Gratis Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;