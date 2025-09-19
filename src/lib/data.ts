import type { User, Ride, Conversation, Message, Feedback } from '@/lib/types';

const tempUsers: Omit<User, 'feedback' | 'ridesGiven' | 'ridesTaken' | 'memberSince'>[] = [
  { id: 'user-1', name: 'Alice', avatar: 'https://picsum.photos/seed/user1/100/100' },
  { id: 'user-2', name: 'Bob', avatar: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'user-3', name: 'Charlie', avatar: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'user-4', name: 'Diana', avatar: 'https://picsum.photos/seed/user4/100/100' },
  { id: 'user-5', name: 'Eve', avatar: 'https://picsum.photos/seed/user5/100/100' },
];

export const users: User[] = tempUsers.map((u, i) => ({
    ...u,
    memberSince: new Date(new Date().setFullYear(new Date().getFullYear() - (i % 3))), // Member for 0-2 years
    ridesGiven: (i + 1) * 3,
    ridesTaken: (5-i) * 4,
    feedback: [
        {
            id: `feedback-${i}-1`,
            author: tempUsers[(i + 1) % 5] as User,
            rating: 5,
            comment: 'Great ride, very friendly and punctual!',
            timestamp: new Date(new Date().getTime() - (i + 1) * 24 * 60 * 60 * 1000)
        },
        {
            id: `feedback-${i}-2`,
            author: tempUsers[(i + 2) % 5] as User,
            rating: 4,
            comment: 'Smooth journey, but the music was a bit loud.',
            timestamp: new Date(new Date().getTime() - (i + 5) * 24 * 60 * 60 * 1000)
        }
    ]
}));

export const currentUser: User = users[0];

export let rides: Ride[] = [
  {
    id: 'ride-1',
    driver: users[1],
    riders: [users[0], users[2]],
    from: 'Downtown',
    fromCoords: { lat: 17.7258, lng: 83.3134 },
    to: 'Airport',
    toCoords: { lat: 17.7214, lng: 83.2246 },
    departureTime: new Date('2025-09-20T09:00:00'),
    arrivalTime: new Date('2025-09-20T09:30:00'),
    price: 1200.00,
    seats: { total: 3, available: 1 },
    status: 'upcoming',
  },
  {
    id: 'ride-2',
    driver: users[3],
    riders: [users[0]],
    from: 'North Suburbs',
    fromCoords: { lat: 17.749, lng: 83.336 },
    to: 'City Center',
    toCoords: { lat: 17.723, lng: 83.311 },
    departureTime: new Date('2025-09-19T18:00:00'),
    arrivalTime: new Date('2025-09-19T18:45:00'),
    price: 1000.00,
    seats: { total: 2, available: 0 },
    status: 'completed',
  },
  {
    id: 'ride-3',
    driver: users[0],
    riders: [users[4]],
    from: 'West End',
    fromCoords: { lat: 17.712, lng: 83.28 },
    to: 'East Side',
    toCoords: { lat: 17.735, lng: 83.345 },
    departureTime: new Date('2025-09-18T10:00:00'),
    arrivalTime: new Date('2025-09-18T10:30:00'),
    price: 640.00,
    seats: { total: 4, available: 3 },
    status: 'completed',
  },
  {
    id: 'ride-4',
    driver: users[0],
    riders: [],
    from: 'Andhra University',
    fromCoords: { lat: 17.7303, lng: 83.3223 },
    to: 'Tech Park',
    toCoords: { lat: 17.7816, lng: 83.3644 },
    departureTime: new Date('2025-09-21T14:00:00'),
    arrivalTime: new Date('2025-09-21T14:25:00'),
    price: 600.00,
    seats: { total: 3, available: 3 },
    status: 'upcoming',
  },
  {
    id: 'ride-5',
    driver: users[2],
    riders: [users[0]],
    from: 'Seethammadhara',
    fromCoords: { lat: 17.7353, lng: 83.3184 },
    to: 'Andhra University',
    toCoords: { lat: 17.7303, lng: 83.3223 },
    departureTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    arrivalTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    price: 1600.00,
    seats: { total: 1, available: 0 },
    status: 'active',
  },
];

const generateMessages = (participant: User): Message[] => [
    { id: 'msg-1', sender: participant, text: 'Hey, are you on your way?', timestamp: new Date(new Date().getTime() - 10 * 60 * 1000), isRead: true },
    { id: 'msg-2', sender: currentUser, text: 'Yep, I should be there in about 5 minutes!', timestamp: new Date(new Date().getTime() - 9 * 60 * 1000), isRead: true },
    { id: 'msg-3', sender: participant, text: 'Great, see you soon!', timestamp: new Date(new Date().getTime() - 8 * 60 * 1000), isRead: false },
];

export let conversations: Conversation[] = [
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

export const addFeedback = (userId: string, feedback: Omit<Feedback, 'id' | 'timestamp'>) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        if (!user.feedback) {
            user.feedback = [];
        }
        user.feedback.push({
            ...feedback,
            id: `feedback-${Date.now()}`,
            timestamp: new Date(),
        });
    }
}
