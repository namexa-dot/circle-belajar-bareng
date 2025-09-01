import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardIcon } from 'lucide-react';

const Rules = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <Card 
        classname='card-gradient relative cursor-pointer transition-all duration-300
        ring-2 ring-primary scale-105'>
        RULES KOMUNITAS CIRCLE BELAJAR BARENG
      </Card>
    </div>
  );
};

export default Rules;
