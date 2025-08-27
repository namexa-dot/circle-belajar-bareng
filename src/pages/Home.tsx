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
  CheckCircle
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
        <div className="container mx-auto text-center">
          <Users className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Bergabung dengan Komunitas</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Belajar bersama ribuan orang yang memiliki tujuan yang sama - mencapai kebebasan finansial
          </p>
          {!user && (
            <Button asChild size="lg" className="btn-premium">
              <Link to="/auth">Bergabung Sekarang</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;