import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  paket: 'monthly' | 'yearly';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { paket }: PaymentRequest = await req.json();

    // Validate paket
    if (!paket || !['monthly', 'yearly'].includes(paket)) {
      throw new Error("Invalid paket. Must be 'monthly' or 'yearly'");
    }

    // Set amount based on paket
    const amount = paket === 'monthly' ? 40000 : 400000;
    
    // Generate unique order ID
    const orderId = `premium-${user.id}-${Date.now()}`;

    // Get user profile for customer details
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('nama')
      .eq('id', user.id)
      .single();

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        paket,
        amount,
        midtrans_order_id: orderId,
        status: 'pending'
      });

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      throw new Error('Failed to create transaction record');
    }

    // Prepare Midtrans Snap transaction
    const snapTransaction = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: profile?.nama || 'User',
        email: user.email,
      },
      item_details: [{
        id: `premium-${paket}`,
        price: amount,
        quantity: 1,
        name: `Premium Membership ${paket === 'monthly' ? '1 Bulan' : '1 Tahun'}`
      }],
      callbacks: {
        finish: `${req.headers.get("origin")}/payment-success?order_id=${orderId}`,
        error: `${req.headers.get("origin")}/payment-failed?order_id=${orderId}`,
        pending: `${req.headers.get("origin")}/payment-pending?order_id=${orderId}`
      }
    };

    // Create Snap transaction with Midtrans
    const midtransResponse = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(Deno.env.get("MIDTRANS_SERVER_KEY") + ":")}`
      },
      body: JSON.stringify(snapTransaction)
    });

    if (!midtransResponse.ok) {
      const errorText = await midtransResponse.text();
      console.error('Midtrans API error:', errorText);
      throw new Error('Failed to create payment session');
    }

    const midtransData = await midtransResponse.json();

    return new Response(JSON.stringify({
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
      order_id: orderId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create payment session' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});