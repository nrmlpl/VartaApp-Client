export const sampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Thoe",
        _id: "2",
        groupChat: true,
        members: ["1", "2"],
    },
];

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Thoe",
        _id: "2",
    },
];

export const sampleNotifications = [
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Doe",
        },
        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Thoe",
        },
        _id: "2",
    },
];

export const sampleMessage = [
    {
        attachments: [],
        content: "... ka msg",
        _id: "ajvbasbvjsbvajsbav",
        sender: {
            _id: "user._id",
            name: "chaman",
        },
        chat: "chatId",
        createdAt: "2024-03-12T10:41:30.630Z",
    },
    {
        attachments: [
            {
                public_id: "asdsade",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            }
        ],
        content: "",
        _id: "ajvbasbvjsbvajsbavhjgg",
        sender: {
            _id: "shdvuhsjdvhdv",
            name: "chaman2",
        },
        chat: "chatId",
        createdAt: "2024-03-12T10:41:30.630Z",
    },
];

export const dashboardData = {
    users: [
        {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "John Doe",
            _id: "1",
            username: "John",
            friends: 20,
            groups: 5,
        },
        {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "John Thoe",
            _id: "2",
            username: "Thoe",
            friends: 10,
            groups: 3,
        },
    ],

    chats: [
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Doe",
            _id: "1",
            username: "John",
            groupChat: false,
            members: [{ _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" }, { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" }],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "John",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            }
        },
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Thoe",
            _id: "2",
            username: "Thoe",
            groupChat: true,
            members: [{ _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" }, { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" }],
            totalMembers: 2,
            totalMessages: 10,
            creator: {
                name: "Thoe",
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
            }
        }
    ],

    messages: [
        {
            attachments: [],
            content: "Shyam ka msg",
            _id: "ajvbasbvjsbvajsbav",
            sender: {
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "chaman",
            },
            chat: "chatId",
            groupChat: false,
            createdAt: "2024-03-12T10:41:30.630Z",
        },
        {
            attachments: [
                {
                    public_id: "asdsade",
                    url: "https://www.w3schools.com/howto/img_avatar.png",
                },
            ],
            content: "",
            _id: "ajvbasbvjsbvajsbavhjgg",
            sender: {
                avatar: "https://www.w3schools.com/howto/img_avatar.png",
                name: "chaman2",
            },
            chat: "chatId",
            groupChat: true,
            createdAt: "2024-03-12T10:41:30.630Z",
        },
    ],
};