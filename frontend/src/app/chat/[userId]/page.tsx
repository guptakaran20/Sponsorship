import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { ArrowLeft, Send, User, Sparkles, MessageSquare } from 'lucide-react';

export default function ChatPage() {
    const { userId: otherUserId } = useParams();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                const u = await fetchApi('/auth/me');
                setCurrentUser(u);

                await loadMessages();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        initChat();

        // Setup polling for new messages since MVP does not include Socket.io initially
        const interval = setInterval(() => {
            loadMessages();
        }, 5000);

        return () => clearInterval(interval);
    }, [otherUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            const msgs = await fetchApi(`/messages/${otherUserId}`);
            setMessages(msgs || []);
        } catch (e) {
            console.error(e);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            const msg = newMessage;
            setNewMessage('');

            // Optimistic update
            setMessages(prev => [...prev, {
                id: 'temp-' + Date.now(),
                senderId: currentUser.id,
                receiverId: otherUserId,
                message: msg,
                createdAt: new Date().toISOString()
            }]);

            await fetchApi('/messages', {
                method: 'POST',
                body: JSON.stringify({
                    receiverId: otherUserId,
                    message: msg
                })
            });

            loadMessages();
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-8 items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-8">
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col bg-slate-900 border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center px-6 shrink-0 relative z-10">
                    <button
                        onClick={() => router.back()}
                        className="p-2 mr-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold">Deal Negotiation</h2>
                            <p className="text-emerald-400 text-xs font-medium">Partner online</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                            <MessageSquare className="w-12 h-12 opacity-20" />
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isMine = msg.senderId === currentUser?.id;

                            return (
                                <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                    max-w-[75%] md:max-w-[60%] px-5 py-3 rounded-2xl
                    ${isMine
                                            ? 'bg-indigo-500 text-white rounded-br-sm'
                                            : 'bg-white/10 text-slate-200 border border-white/5 rounded-bl-sm'}
                  `}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        <div className={`text-[10px] mt-2 opacity-50 font-medium ${isMine ? 'text-indigo-100' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-slate-900/80 backdrop-blur-md shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                        <div className="flex-1 bg-black/20 border border-white/10 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                className="w-full bg-transparent text-white p-4 max-h-32 focus:outline-none resize-none"
                                placeholder="Type your message..."
                                rows={1}
                                style={{ minHeight: '56px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="h-14 w-14 shrink-0 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/25"
                        >
                            <Send className="w-5 h-5 ml-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
