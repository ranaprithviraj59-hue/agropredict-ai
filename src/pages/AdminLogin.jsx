import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/shared/PageTransition';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!loginAdmin(key.trim())) {
      toast.error('Invalid admin key');
      return;
    }
    toast.success('Admin access enabled');
    navigate('/AdminPanel');
  };

  return (
    <PageTransition>
      <div className="max-w-md mx-auto py-12">
        <Card className="p-6 border-primary/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Admin Login</h1>
              <p className="text-sm text-muted-foreground">Admin panel is only for project administrator.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Admin Key</Label>
              <Input
                type="password"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="Enter admin key"
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full bg-primary h-11">
              <Lock className="w-4 h-4 mr-2" />
              Unlock Admin Panel
            </Button>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
}
