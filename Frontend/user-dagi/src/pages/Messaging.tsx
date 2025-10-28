import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip } from 'lucide-react';

const Messaging = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'HR', text: 'Hi, we are impressed with your profile and would like to schedule an interview.' },
    { id: 2, sender: 'You', text: 'Hi, thank you for reaching out. I am available to interview next week.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !file) return;
    const messageText = file ? `${newMessage} (file: ${file.name})` : newMessage;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: messageText }]);
    setNewMessage('');
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Conversation with HR from TechCorp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'You' ? 'justify-end' : ''}`}>
                  {message.sender !== 'You' && (
                    <Avatar>
                      <AvatarFallback>HR</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`p-4 rounded-lg ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p>{message.text}</p>
                  </div>
                  {message.sender === 'You' && (
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
            {file && (
              <div className="text-sm text-muted-foreground mt-2">
                Selected file: {file.name}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messaging;