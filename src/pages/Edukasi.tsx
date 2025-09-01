import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, Crown, PlayCircle, FileText, Image, Clock, Filter } from 'lucide-react';
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

interface Category {
  id: string;
  nama_kategori: string;
}

const Edukasi = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [educations, setEducations] = useState<Education[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchEducations();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('nama_kategori');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEducations = async () => {
    try {
      const { data, error } = await supabase
        .from('educations')
        .select(`
          *,
          categories (
            nama_kategori
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEducations(data || []);
    } catch (error) {
      console.error('Error fetching educations:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat konten edukasi',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEducations = educations.filter(education => {
    const matchesSearch = education.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         education.topik.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || 
                           education.categories.nama_kategori === selectedCategory;
    
    // If content is premium and user is not premium, don't show it
    const canView = !education.is_premium || 
                   (profile?.role === 'premium' && 
                    (!profile.premium_until || new Date(profile.premium_until) > new Date()));
    
    return matchesSearch && matchesCategory && canView;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'artikel': return <FileText className="h-4 w-4" />;
      case 'gambar': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Pusat <span className="gradient-text">Edukasi</span> Keuangan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Temukan berbagai materi pembelajaran keuangan yang akan membantu Anda mencapai tujuan finansial
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan judul atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="flex w-full overflow-x-auto scrollbar-hide gap-1 p-1 mb-6 md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              <TabsTrigger value="semua" className="shrink-0 px-4 py-2">Semua</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.nama_kategori} className="shrink-0 px-4 py-2 whitespace-nowrap">
                  {category.nama_kategori}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="card-gradient animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEducations.map((education) => (
              <Card key={education.id} className="card-gradient group hover:scale-105 transition-all duration-300">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getTypeColor(education.tipe)} flex items-center gap-1`}>
                      {getTypeIcon(education.tipe)}
                      {education.tipe.charAt(0).toUpperCase() + education.tipe.slice(1)}
                    </Badge>
                    {education.is_premium && (
                      <Crown className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {education.judul}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    <Badge variant="outline" className="text-xs">
                      {education.categories.nama_kategori}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {education.konten}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(education.created_at).toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {education.topik.split(' ').slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button asChild className="w-full btn-premium">
                    <Link to={`/edukasi/${education.id}`}>
                      Baca Selengkapnya
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredEducations.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tidak ada konten ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau kategori yang dipilih
            </p>
          </div>
        )}

        {/* Premium CTA for non-premium users */}
        {profile?.role !== 'premium' && (
          <div className="mt-16">
            <Card className="card-gradient border-primary/20 text-center">
              <CardHeader>
                <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Ingin Akses Lebih Banyak?</CardTitle>
                <CardDescription className="text-lg">
                  Upgrade ke Premium untuk mengakses semua materi eksklusif dan fitur lengkap
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="lg" className="btn-premium">
                  <Link to="/premium">
                    Jadi Member Premium <Crown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edukasi;
