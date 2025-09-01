import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Crown, PlayCircle, FileText, Image, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Education {
  id: string;
  judul: string;
  topik: string;
  konten: string;
  media_url?: string;
  tipe: 'artikel' | 'video' | 'gambar';
  is_premium: boolean;
  created_at: string;
  categories: {
    nama_kategori: string;
  };
}

const EdukasiDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [education, setEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEducation();
    }
  }, [id]);

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from('educations')
        .select(`
          *,
          categories (
            nama_kategori
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // Check if user can access premium content
        const canAccessPremium = !data.is_premium || 
          (profile?.role === 'premium' && 
           (!profile.premium_until || new Date(profile.premium_until) > new Date()));

        if (!canAccessPremium) {
          setAccessDenied(true);
        } else {
          setEducation(data);
        }
      }
    } catch (error) {
      console.error('Error fetching education:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat konten edukasi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-5 w-5" />;
      case 'artikel': return <FileText className="h-5 w-5" />;
      case 'gambar': return <Image className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500/20 text-red-300';
      case 'artikel': return 'bg-blue-500/20 text-blue-300';
      case 'gambar': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const renderMedia = () => {
    if (!education?.media_url) return null;

    switch (education.tipe) {
      case 'video':
        return (
          <div className="aspect-video w-full mb-6">
            <iframe
              src={education.media_url}
              className="w-full h-full rounded-lg"
              allowFullScreen
              title={education.judul}
            />
          </div>
        );
      case 'gambar':
        return (
          <div className="w-full mb-6">
            <img
              src={education.media_url}
              alt={education.judul}
              className="w-full rounded-lg object-cover max-h-96"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="card-gradient animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/edukasi">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Edukasi
            </Link>
          </Button>
          
          <Card className="card-gradient border-primary/20 text-center">
            <CardHeader>
              <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Konten Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Konten ini hanya tersedia untuk member premium. Upgrade sekarang untuk mengakses semua materi eksklusif.
              </p>
              <Button asChild size="lg" className="btn-premium">
                <Link to="/premium">
                  Jadi Member Premium <Crown className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!education) {
    return <Navigate to="/edukasi" replace />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Button asChild variant="outline" className="mb-6">
          <Link to="/edukasi">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Edukasi
          </Link>
        </Button>

        {/* Main Content */}
        <Card className="card-gradient">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge className={`${getTypeColor(education.tipe)} flex items-center gap-1`}>
                {getTypeIcon(education.tipe)}
                {education.tipe.charAt(0).toUpperCase() + education.tipe.slice(1)}
              </Badge>
              {education.is_premium && (
                <Crown className="h-5 w-5 text-primary" />
              )}
            </div>
            
            <CardTitle className="text-3xl font-bold leading-tight">
              {education.judul}
            </CardTitle>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(education.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <Badge variant="outline">
                {education.categories.nama_kategori}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Topik Tags */}
            <div className="flex flex-wrap gap-2">
              {education.topik.split(' ').map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Media Content */}
            {renderMedia()}

            {/* Text Content */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="text-base leading-relaxed whitespace-pre-wrap">
                {education.konten}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Content CTA */}
        <div className="mt-12">
          <Card className="card-gradient text-center">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-4">
                Jelajahi Konten Edukasi Lainnya
              </h3>
              <p className="text-muted-foreground mb-6">
                Temukan lebih banyak materi pembelajaran keuangan yang menarik
              </p>
              <Button asChild className="btn-premium">
                <Link to="/edukasi">
                  Lihat Semua Konten
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EdukasiDetail;