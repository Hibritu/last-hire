import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Search,
  MessageSquare
} from "lucide-react";
import { JobService } from "@/services/jobService";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch real applications and jobs from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [applicationsData, jobsData] = await Promise.all([
          JobService.getAllApplications(),
          JobService.getEmployerJobs()
        ]);
        setApplications(applicationsData);
        setJobs(jobsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load chat data:', err);
        setApplications([]);
        setJobs([]);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get shortlisted and accepted candidates for chat
  const eligibleCandidates = applications.filter((app: any) =>
    app.status === 'shortlisted' || app.status === 'accepted'
  );

  const filteredCandidates = eligibleCandidates.filter((candidate: any) => {
    const candidateName = candidate.candidateName || candidate.applicant_name || '';
    return candidateName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedCandidate = eligibleCandidates.find((c: any) => 
    (c.candidateId || c.id) === selectedChat
  );
  
  console.log('💬 [CHAT] Selected chat ID:', selectedChat);
  console.log('💬 [CHAT] Selected candidate:', selectedCandidate);
  console.log('💬 [CHAT] Eligible candidates:', eligibleCandidates);
  
  const jobTitle = selectedCandidate ? 
    jobs.find((j: any) => j.id === (selectedCandidate.jobId || selectedCandidate.job_id))?.title : '';

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId: '1', // Current user (employer)
        receiverId: selectedChat,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false,
        jobId: selectedCandidate?.jobId || ''
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    }
  };

  const handleAttachFile = () => {
    toast({
      title: "File Attachment",
      description: "File attachment feature would open a file picker here.",
    });
    // In a real app, this would open a file picker
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          Chat with shortlisted and accepted candidates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredCandidates.map((candidate) => {
                const job = jobs.find((j: any) => j.id === candidate.jobId || j.id === candidate.job_id);
                return (
                  <div
                    key={candidate.id || candidate.candidateId}
                    className={cn(
                      "flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b",
                      selectedChat === (candidate.id || candidate.candidateId) && "bg-muted"
                    )}
                    onClick={() => setSelectedChat(candidate.id || candidate.candidateId)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {(candidate.candidateName || candidate.applicant_name || 'U').split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{candidate.candidateName || candidate.applicant_name || 'Unknown'}</p>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            candidate.status === 'accepted' && "bg-success text-success-foreground"
                          )}
                        >
                          {candidate.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {job?.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredCandidates.length === 0 && (
              <div className="p-6 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  No eligible candidates for chat.
                  <br />
                  Shortlist or accept candidates to start conversations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {(selectedCandidate?.candidateName || selectedCandidate?.applicant_name || 'U').split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedCandidate?.candidateName || selectedCandidate?.applicant_name || 'Unknown'}</CardTitle>
                    <CardDescription>{jobTitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col h-[400px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {messages.filter(msg => 
                      (msg.senderId === '1' && msg.receiverId === selectedChat) ||
                      (msg.senderId === selectedChat && msg.receiverId === '1')
                    ).length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center p-8">
                      <div>
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">
                          No messages yet. Start the conversation below!
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages
                      .filter(msg => 
                        (msg.senderId === '1' && msg.receiverId === selectedChat) ||
                        (msg.senderId === selectedChat && msg.receiverId === '1')
                      )
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            msg.senderId === '1' ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                              msg.senderId === '1'
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleAttachFile}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a candidate from the list to start chatting
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}