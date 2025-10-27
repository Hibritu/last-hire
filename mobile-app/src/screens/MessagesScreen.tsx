import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StatusBar, Platform } from 'react-native';
import { conversations as initialConversations } from '../lib/data';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Toast from 'react-native-toast-message';

const MessagesScreen = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: selectedConversation.messages.length + 1,
      sender: "You",
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversation.id
        ? { ...conv, messages: [...conv.messages, message], lastMessage: message.content }
        : conv
    );

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id)!);
    setNewMessage("");
    
    Toast.show({
      type: 'success',
      text1: 'Message Sent',
      text2: 'Your message has been delivered.',
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" style={{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}}>
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="dark-content" 
        translucent={Platform.OS === 'android'} 
      />
      <View className="flex-1 flex-row">
        <View className="w-1/3 border-r border-border">
          <ScrollView>
            {conversations.map(conv => (
              <Pressable key={conv.id} onPress={() => setSelectedConversation(conv)} className={`p-4 ${selectedConversation.id === conv.id ? 'bg-muted' : ''}`}>
                <Text className="font-semibold">{conv.participant}</Text>
                <Text className="text-sm text-muted-foreground truncate">{conv.lastMessage}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="flex-1">
          {selectedConversation ? (
            <View className="flex-1">
              <View className="p-4 border-b border-border">
                <Text className="text-lg font-semibold">{selectedConversation.participant}</Text>
              </View>
              <ScrollView className="p-4">
                {selectedConversation.messages.map(msg => (
                  <View key={msg.id} className={`flex-row mb-2 ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    <View className={`p-3 rounded-lg ${msg.sender === 'You' ? 'bg-primary' : 'bg-muted'}`}>
                      <Text className={`${msg.sender === 'You' ? 'text-primary-foreground' : 'text-foreground'}`}>{msg.content}</Text>
                      <Text className={`text-xs mt-1 ${msg.sender === 'You' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.timestamp}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View className="p-4 border-t border-border flex-row items-center">
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type a message..."
                  className="flex-1 border border-border rounded-md p-2 mr-2 text-foreground"
                />
                <Button onPress={handleSendMessage}>
                  <Text>Send</Text>
                </Button>
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted-foreground">Select a conversation to start chatting</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessagesScreen;