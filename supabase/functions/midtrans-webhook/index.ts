import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received Midtrans webhook');
    
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const payload = await req.json();
    console.log('Webhook payload:', payload);

    const {
      order_id,
      transaction_status,
      transaction_id,
      payment_type,
      fraud_status
    } = payload;

    // Validate required fields
    if (!order_id || !transaction_status) {
      throw new Error('Missing required fields in webhook payload');
    }

    // Get transaction from database
    const { data: transaction, error: fetchError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('midtrans_order_id', order_id)
      .single();

    if (fetchError || !transaction) {
      console.error('Transaction not found:', order_id);
      throw new Error('Transaction not found');
    }

    let status = 'pending';
    let shouldUpgradeUser = false;

    // Determine transaction status based on Midtrans response
    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        status = 'paid';
        shouldUpgradeUser = true;
      }
    } else if (transaction_status === 'settlement') {
      status = 'paid';
      shouldUpgradeUser = true;
    } else if (transaction_status === 'pending') {
      status = 'pending';
    } else if (['deny', 'expire', 'cancel'].includes(transaction_status)) {
      status = 'failed';
    }

    // Update transaction record
    const { error: updateError } = await supabaseClient
      .from('transactions')
      .update({
        status,
        midtrans_transaction_id: transaction_id,
        payment_type,
        updated_at: new Date().toISOString()
      })
      .eq('midtrans_order_id', order_id);

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      throw new Error('Failed to update transaction');
    }

    // If payment is successful, upgrade user to premium
    if (shouldUpgradeUser) {
      console.log('Upgrading user to premium:', transaction.user_id);
      
      // Calculate premium expiry date
      const now = new Date();
      const premiumUntil = new Date(now);
      
      if (transaction.paket === 'monthly') {
        premiumUntil.setMonth(premiumUntil.getMonth() + 1);
      } else if (transaction.paket === 'yearly') {
        premiumUntil.setFullYear(premiumUntil.getFullYear() + 1);
      }

      // Update user profile to premium
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          role: 'premium',
          premium_until: premiumUntil.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.user_id);

      if (profileError) {
        console.error('Failed to upgrade user profile:', profileError);
        throw new Error('Failed to upgrade user to premium');
      }

      console.log('User upgraded to premium successfully');

      // Send welcome email
      try {
        const emailResponse = await supabaseClient.functions.invoke('send-premium-email', {
          body: { 
            user_id: transaction.user_id,
            paket: transaction.paket,
            amount: transaction.amount
          }
        });
        console.log('Welcome email sent:', emailResponse);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't throw error for email failure, as payment processing is successful
      }
    }

    return new Response(JSON.stringify({ 
      status: 'success',
      message: 'Webhook processed successfully' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to process webhook' 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});