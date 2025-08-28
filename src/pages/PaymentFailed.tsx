import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  const handleTryAgain = () => {
    navigate('/premium');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    window.open('mailto:support@circlebelajarbareng.com?subject=Bantuan Pembayaran&body=Order ID: ' + orderId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="card-gradient text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-6">
              <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-red-500 mb-2">
              Pembayaran Gagal
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Maaf, pembayaran Anda tidak dapat diproses
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
              <h3 className="text-xl font-semibold">Kemungkinan Penyebab:</h3>
              <div className="text-left space-y-3">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Saldo tidak mencukupi</span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Koneksi internet terputus</span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Kartu kredit/debit ditolak</span>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Pembayaran dibatalkan</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                💡 Jangan khawatir! Tidak ada biaya yang dikenakan untuk transaksi yang gagal. 
                Anda dapat mencoba kembali kapan saja.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleTryAgain}
                className="btn-premium flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>
              <Button 
                variant="outline" 
                onClick={handleContactSupport}
                className="flex-1"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Hubungi Support
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleBackToHome}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentFailed;