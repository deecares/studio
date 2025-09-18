export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Ride = {
  id: string;
  driver: User;
  riders: User[];
  from: string;
  to: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  seats: {
    total: number;
    available: number;
  };
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
};

export type Message = {
  id: string;
  sender: User;
  text: string;
  timestamp: Date;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  participant: User;
  messages: Message[];
};
