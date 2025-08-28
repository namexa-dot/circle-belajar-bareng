import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  user_id: string;
  paket: string;
  amount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Sending premium welcome email');
    
    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { user_id, paket, amount }: EmailRequest = await req.json();

    // Get user profile and email
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserById(user_id);
    if (authError || !authUser) {
      throw new Error('User not found');
    }

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('nama')
      .eq('id', user_id)
      .single();

    const userName = profile?.nama || 'Member Premium';
    const userEmail = authUser.user.email;
    
    if (!userEmail) {
      throw new Error('User email not found');
    }

    // Create email content
    const paketName = paket === 'monthly' ? '1 Bulan' : '1 Tahun';
    const formattedAmount = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Selamat Datang di Premium Circle Belajar Bareng!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #6b7280; }
          .crown { font-size: 2em; color: #fbbf24; }
          .benefits { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .benefit-item { margin: 10px 0; padding-left: 20px; position: relative; }
          .benefit-item:before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .cta { background: #1e3a8a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="crown">👑</div>
          <h1>Selamat Datang di Premium Circle Belajar Bareng!</h1>
          <p>Halo ${userName}, selamat bergabung menjadi Member Premium!</p>
        </div>
        
        <div class="content">
          <h2>Terima kasih atas kepercayaan Anda!</h2>
          <p>Pembayaran Anda untuk paket <strong>Premium ${paketName}</strong> sebesar <strong>${formattedAmount}</strong> telah berhasil diproses.</p>
          
          <div class="benefits">
            <h3>🎯 Benefit Premium yang Sudah Bisa Anda Nikmati:</h3>
            <div class="benefit-item">Akses ke semua materi edukasi eksklusif</div>
            <div class="benefit-item">Video tutorial premium & studi kasus nyata</div>
            <div class="benefit-item">Konsultasi dengan mentor berpengalaman</div>
            <div class="benefit-item">Template & tools perencanaan keuangan</div>
            <div class="benefit-item">Webinar eksklusif khusus member premium</div>
            <div class="benefit-item">Akses prioritas ke fitur-fitur terbaru</div>
          </div>

          <p>Sekarang Anda sudah dapat mengakses semua konten premium yang tersedia di platform kami. Mari mulai perjalanan pembelajaran keuangan Anda!</p>
          
          <a href="https://avkukzfvqtjovfrrhzer.lovable.app/edukasi" class="cta">Mulai Belajar Sekarang</a>
          
          <h3>💡 Tips untuk Memaksimalkan Learning Experience:</h3>
          <ul>
            <li>Eksplorasi semua kategori materi yang tersedia</li>
            <li>Ikuti webinar eksklusif yang akan diselenggarakan</li>
            <li>Manfaatkan template keuangan untuk planning pribadi</li>
            <li>Jangan ragu untuk berkonsultasi dengan mentor</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Jika ada pertanyaan, jangan ragu untuk menghubungi tim support kami.</p>
          <p><strong>Circle Belajar Bareng</strong><br>
          Platform Edukasi Keuangan Terpercaya</p>
          <p style="font-size: 12px; margin-top: 20px;">
            Email ini dikirim otomatis. Mohon tidak membalas email ini.
          </p>
        </div>
      </body>
      </html>
    `;

    // Send email
    const emailResponse = await resend.emails.send({
      from: 'Circle Belajar Bareng <onboarding@resend.dev>',
      to: [userEmail],
      subject: '🎉 Selamat! Anda Sekarang Member Premium Circle Belajar Bareng',
      html: emailHtml,
    });

    console.log('Premium welcome email sent successfully:', emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: 'Premium welcome email sent successfully',
      email_id: emailResponse.data?.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Failed to send premium welcome email:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send email' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});