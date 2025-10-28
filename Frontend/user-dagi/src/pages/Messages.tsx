import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Chat {
  id: string;
  application_id: string;
  employer_id: string;
  jobseeker_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('hirehub_token');
        if (!token) {
          setNeedsAuth(true);
          setError('Please log in to view your messages');
          setLoading(false);
          return;
        }

        console.log('💬 Fetching chats from backend...');
        
        const response = await fetch('http://localhost:4000/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setNeedsAuth(true);
            setError('Please log in to view your messages');
            throw new Error('Unauthorized');
          }
          throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
        console.log('✅ Chats loaded:', data);
        
        setChats(data || []);
        setLoading(false);
        setNeedsAuth(false);
      } catch (err: any) {
        console.error('❌ Failed to load chats:', err);
        if (err.message !== 'Unauthorized') {
          setError('Failed to load messages');
        }
        setChats([]);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId: string) => {
    navigate(`/messaging/${chatId}`);
  };

  const handleLoginRedirect = () => {
    window.location.href = 'http://localhost:3002/login?from=job-seeker';
  };

  const filteredChats = chats.filter(chat => 
    searchQuery === "" || 
    chat.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to view your messages
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleLoginRedirect} className="bg-primary">
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/browse')}>
                  Browse Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Chat with employers about your applications
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Messages List */}
        {error && !needsAuth && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {chats.length === 0 && !error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground mb-6">
                When employers accept or shortlist your applications, you'll be able to message them here.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/browse')}>
                  Browse Jobs
                </Button>
                <Button variant="outline" onClick={() => navigate('/applications')}>
                  My Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleChatClick(chat.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">Employer</h3>
                        {chat.last_message_at && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(chat.last_message_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {chat.last_message ? (
                        <p className="text-muted-foreground truncate">
                          {chat.last_message}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          No messages yet. Start the conversation!
                        </p>
                      )}
                      
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Application #{chat.application_id.substring(0, 8)}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredChats.length === 0 && searchQuery && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No messages found matching "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Messages;

