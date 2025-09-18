'use client';

import { useState } from "react";
import Image from "next/image";
import { AppHeader } from "@/components/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations as initialConversations, currentUser } from "@/lib/data";
import { Conversation, Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(conversations[0] || null);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConvo) return;
    
    const message: Message = {
        id: `msg-${Date.now()}`,
        sender: currentUser,
        text: newMessage,
        timestamp: new Date(),
        isRead: true
    };

    const updatedConversations = conversations.map(convo => {
        if (convo.id === selectedConvo.id) {
            return { ...convo, messages: [...convo.messages, message] };
        }
        return convo;
    });

    setConversations(updatedConversations);
    setSelectedConvo(updatedConversations.find(c => c.id === selectedConvo.id) || null);
    setNewMessage("");
  }


  return (
    <div className="flex h-screen flex-col">
      <AppHeader title="Messages" />
      <main className="flex-1 overflow-hidden">
        <div className="h-full border-t">
          <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex-col border-r bg-card hidden md:flex">
              <div className="p-4">
                <h2 className="text-lg font-semibold">Conversations</h2>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                  {conversations.map((convo) => (
                    <button
                      key={convo.id}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-muted",
                        selectedConvo?.id === convo.id && "bg-muted"
                      )}
                      onClick={() => setSelectedConvo(convo)}
                    >
                      <Avatar>
                        <AvatarImage src={convo.participant.avatar} alt={convo.participant.name} />
                        <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate">{convo.participant.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {convo.messages[convo.messages.length - 1].text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="col-span-1 flex flex-col h-full md:col-span-2 lg:col-span-3">
              {selectedConvo ? (
                <>
                  <div className="flex items-center gap-3 border-b p-4">
                    <Avatar>
                        <AvatarImage src={selectedConvo.participant.avatar} alt={selectedConvo.participant.name} />
                        <AvatarFallback>{selectedConvo.participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{selectedConvo.participant.name}</h3>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedConvo.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-end gap-2",
                            message.sender.id === currentUser.id && "justify-end"
                          )}
                        >
                          {message.sender.id !== currentUser.id && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.sender.avatar} />
                              <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className={cn(
                              "max-w-xs rounded-lg p-3 md:max-w-md",
                              message.sender.id === currentUser.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}>
                            <p className="text-sm">{message.text}</p>
                            <p className={cn("text-xs mt-1", message.sender.id === currentUser.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="relative">
                      <Input 
                        placeholder="Type a message..." 
                        className="pr-12" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        />
                      <Button type="submit" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 bg-accent text-accent-foreground">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
