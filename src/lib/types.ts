export type User = {
  id: string;
  name: string;
  avatar: string;
  feedback?: Feedback[];
  memberSince?: Date;
  ridesGiven?: number;
  ridesTaken?: number;
};

export type Feedback = {
  id: string;
  author: User;
  rating: number;
  comment: string;
  timestamp: Date;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Ride = {
  id: string;
  driver: User;
  riders: User[];
  from: string;
  fromCoords: Coordinates;
  to: string;
  toCoords: Coordinates;
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
