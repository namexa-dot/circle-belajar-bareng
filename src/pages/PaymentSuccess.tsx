import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Refresh user profile to get updated premium status
    const timer = setTimeout(() => {
      refreshProfile();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refreshProfile]);

  const handleContinueToEducation = () => {
    navigate('/edukasi');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="card-gradient text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-6 relative">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <Crown className="w-8 h-8 text-primary absolute -top-2 -right-2 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-500 mb-2">
              Pembayaran Berhasil! 🎉
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Selamat! Anda sekarang adalah Member Premium Circle Belajar Bareng
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {orderId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Order ID:</p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Yang Sudah Bisa Anda Akses:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Semua materi edukasi premium</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Video tutorial eksklusif</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Konsultasi dengan mentor</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Template keuangan premium</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📧 Email konfirmasi telah dikirim ke alamat email Anda dengan detail lengkap benefit premium.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleContinueToEducation}
                className="btn-premium flex-1"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Mulai Belajar Premium
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackToHome}
                className="flex-1"
              >
                Kembali ke Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;