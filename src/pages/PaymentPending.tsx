import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, ArrowLeft, Info } from 'lucide-react';

const PaymentPending = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  const handleCheckStatus = () => {
    // Refresh the page to check updated status
    window.location.reload();
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/premium');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="card-gradient text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-6">
              <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-12 h-12 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-yellow-500 mb-2">
              Pembayaran Pending
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Pembayaran Anda sedang diproses
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
              <h3 className="text-xl font-semibold">Status Pembayaran:</h3>
              <div className="text-left space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Pembayaran sedang diverifikasi oleh bank</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Proses biasanya memakan waktu 1-10 menit</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Anda akan menerima notifikasi setelah selesai</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Jangan tutup halaman ini
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Kami akan mengupdate status pembayaran secara otomatis. 
                    Jika pembayaran berhasil, akun premium Anda akan langsung aktif.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={handleCheckStatus}
                className="btn-premium flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Periksa Status
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTryAgain}
                className="flex-1"
              >
                Pembayaran Baru
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

export default PaymentPending;