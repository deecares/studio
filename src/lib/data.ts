import type { User, Ride, Conversation, Message } from '@/lib/types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user-2', name: 'Bob', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user-3', name: 'Charlie', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user-4', name: 'Diana', avatar: 'https://picsum.photos/seed/user4/100/100' },
  { id: 'user-5', name: 'Eve', avatar: 'https://picsum.photos/seed/user5/100/100' },
];

export const currentUser: User = users[0];

export const rides: Ride[] = [
  {
    id: 'ride-1',
    driver: users[1],
    riders: [users[0], users[2]],
    from: 'Downtown',
    to: 'Airport',
    departureTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    arrivalTime: new Date(new Date().getTime() + 2.5 * 60 * 60 * 1000),
    price: 15.00,
    seats: { total: 3, available: 1 },
    status: 'upcoming',
  },
  {
    id: 'ride-2',
    driver: users[3],
    riders: [users[0]],
    from: 'North Suburbs',
    to: 'City Center',
    departureTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    arrivalTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    price: 12.50,
    seats: { total: 2, available: 0 },
    status: 'completed',
  },
  {
    id: 'ride-3',
    driver: users[0],
    riders: [users[4]],
    from: 'West End',
    to: 'East Side',
    departureTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    arrivalTime: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    price: 8.00,
    seats: { total: 4, available: 3 },
    status: 'completed',
  },
  {
    id: 'ride-4',
    driver: users[0],
    riders: [],
    from: 'University',
    to: 'Tech Park',
    departureTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    arrivalTime: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
    price: 7.50,
    seats: { total: 3, available: 3 },
    status: 'upcoming',
  },
  {
    id: 'ride-5',
    driver: users[2],
    riders: [users[0]],
    from: 'Financial District',
    to: 'Residential Area',
    departureTime: new Date(new Date().getTime() - 30 * 60 * 1000), // 30 minutes ago
    arrivalTime: new Date(new Date().getTime() + 30 * 60 * 1000),
    price: 20.00,
    seats: { total: 1, available: 0 },
    status: 'active',
  },
];

const generateMessages = (participant: User): Message[] => [
    { id: 'msg-1', sender: participant, text: 'Hey, are you on your way?', timestamp: new Date(new Date().getTime() - 10 * 60 * 1000), isRead: true },
    { id: 'msg-2', sender: currentUser, text: 'Yep, I should be there in about 5 minutes!', timestamp: new Date(new Date().getTime() - 9 * 60 * 1000), isRead: true },
    { id: 'msg-3', sender: participant, text: 'Great, see you soon!', timestamp: new Date(new Date().getTime() - 8 * 60 * 1000), isRead: false },
];

export const conversations: Conversation[] = [
    {
        id: 'convo-1',
        participant: users[1],
        messages: generateMessages(users[1]),
    },
    {
        id: 'convo-2',
        participant: users[3],
        messages: [
            { id: 'msg-4', sender: users[3], text: 'Thanks for the ride yesterday!', timestamp: new Date(new Date().getTime() - 20 * 60 * 60 * 1000), isRead: true },
            { id: 'msg-5', sender: currentUser, text: 'No problem at all!', timestamp: new Date(new Date().getTime() - 19 * 60 * 60 * 1000), isRead: true },
        ]
    },
    {
        id: 'convo-3',
        participant: users[4],
        messages: [
            { id: 'msg-6', sender: users[4], text: 'Can I bring a small bag?', timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), isRead: true },
        ]
    }
]
