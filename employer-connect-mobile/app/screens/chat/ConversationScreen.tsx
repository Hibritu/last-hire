import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isEmployer: boolean;
}

export default function ConversationScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get conversation details from route params
  const { conversationId, applicantName, jobTitle } = route.params as {
    conversationId: string;
    applicantName: string;
    jobTitle: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      // Simulate API call - Load messages for this conversation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: 'applicant1',
          senderName: applicantName,
          text: 'Hi, I recently applied for the position and wanted to follow up.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isEmployer: false,
        },
        {
          id: 'msg2',
          senderId: 'employer1',
          senderName: 'You',
          text: 'Thank you for your application! We are reviewing it and will get back to you soon.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          isEmployer: true,
        },
        {
          id: 'msg3',
          senderId: 'applicant1',
          senderName: applicantName,
          text: 'Great! I look forward to hearing from you. Is there any additional information you need from me?',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          isEmployer: false,
        },
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      // Simulate API call to send message
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newMsg: Message = {
        id: 'msg_' + Date.now(),
        senderId: 'employer1',
        senderName: 'You',
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isEmployer: true,
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      console.log('✅ [CHAT] Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading conversation..." />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View className="bg-primary p-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Avatar alt={applicantName} size="sm" className="mr-3" />
        <View className="flex-1">
          <Text className="text-white font-bold text-base">{applicantName}</Text>
          <Text className="text-white text-xs opacity-90">{jobTitle}</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View
            key={message.id}
            className={`mb-4 ${message.isEmployer ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.isEmployer
                  ? 'bg-primary rounded-br-none'
                  : 'bg-gray-200 rounded-bl-none'
              }`}
            >
              <Text
                className={`text-base ${
                  message.isEmployer ? 'text-white' : 'text-foreground'
                }`}
              >
                {message.text}
              </Text>
            </View>
            <Text className="text-xs text-muted-foreground mt-1 px-2">
              {new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="p-4 bg-card border-t border-border">
        <View className="flex-row items-center">
          <View className="flex-1 mr-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              numberOfLines={1}
              onSubmitEditing={handleSendMessage}
            />
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              newMessage.trim() && !isSending ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            {isSending ? (
              <LoadingSpinner size="small" color="white" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={newMessage.trim() ? 'white' : 'gray'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

