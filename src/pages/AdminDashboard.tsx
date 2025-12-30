import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Eye, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string | null;
  phone: string | null;
  current_location: string | null;
  origin: string | null;
  professions: string[] | null;
  introduction: string | null;
  industry_experience: string | null;
  instagram: string | null;
  linkedin: string | null;
  referrals: string[] | null;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('membership_applications')
        .update({ 
          status, 
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setApplications(apps => 
        apps.map(app => app.id === id ? { ...app, status } : app)
      );
      
      toast({
        title: status === 'approved' ? "Application Approved" : "Application Rejected",
        description: `The application has been ${status}.`,
      });
      
      setSelectedApp(null);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  const filteredApps = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <Logo />
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Membership Applications
            </h1>
            <p className="text-muted-foreground">
              Review and manage membership applications
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card/50 border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Total</span>
              </div>
              <p className="font-display text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Pending</span>
              </div>
              <p className="font-display text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Approved</span>
              </div>
              <p className="font-display text-2xl font-bold">{stats.approved}</p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-500 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Rejected</span>
              </div>
              <p className="font-display text-2xl font-bold">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading applications...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No applications found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-card/50 border border-border/50 rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-semibold">
                        {app.first_name} {app.last_name}
                      </h3>
                      <Badge
                        variant={
                          app.status === 'approved' ? 'default' :
                          app.status === 'rejected' ? 'destructive' : 'secondary'
                        }
                        className={cn(
                          app.status === 'approved' && 'bg-green-500/20 text-green-500 border-green-500/30',
                          app.status === 'pending' && 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        )}
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{app.email}</p>
                    {app.professions && app.professions.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {app.professions.join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                          onClick={() => updateStatus(app.id, 'approved')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                          onClick={() => updateStatus(app.id, 'rejected')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Application Detail Modal */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {selectedApp?.first_name} {selectedApp?.last_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedApp.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Birthday</p>
                  <p className="font-medium">
                    {selectedApp.birthday ? new Date(selectedApp.birthday).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedApp.current_location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium">{selectedApp.origin || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Instagram</p>
                  <p className="font-medium">@{selectedApp.instagram || 'N/A'}</p>
                </div>
              </div>

              {selectedApp.professions && selectedApp.professions.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Professions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.professions.map((p, i) => (
                      <Badge key={i} variant="secondary">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.introduction && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Introduction</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedApp.introduction}</p>
                </div>
              )}

              {selectedApp.industry_experience && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Industry Experience</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{selectedApp.industry_experience}</p>
                </div>
              )}

              {selectedApp.referrals && selectedApp.referrals.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Referrals</p>
                  <p className="font-medium">{selectedApp.referrals.join(', ')}</p>
                </div>
              )}

              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => updateStatus(selectedApp.id, 'approved')}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => updateStatus(selectedApp.id, 'rejected')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
