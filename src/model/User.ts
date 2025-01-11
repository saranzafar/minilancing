import mongoose, { Schema, Document } from "mongoose";

// Project Schema
export interface Project extends Document {
    title: string;
    details: string;
    amount: string;
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
    bids: [{
        bid: string,
        userId: mongoose.Types.ObjectId,
        username: string,
        createdAt: Date,
    }];
}

const ProjectSchema: Schema<Project> = new mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    amount: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bids: [
        {
            bid: { type: String, required: true },
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            username: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
},
    { timestamps: true });


// Bid Schema
export interface Bid extends Document {
    bidContent: string;
    createdAt: Date;
    projectId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    username: string
}

const BidSchema: Schema<Bid> = new mongoose.Schema({
    bidContent: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Chat Schema
export interface Chat extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    message: string;
}

const ChatSchema: Schema<Chat> = new mongoose.Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true }
}, { timestamps: true });

// User Schema
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    userType: string;
    bids: mongoose.Types.ObjectId[];
    chat: mongoose.Types.ObjectId[];
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userType: {
        type: String,
        default: "client",
    },
    bids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }],
    chat: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
}, { timestamps: true });

// Models
const UserModel = mongoose.models.User || mongoose.model<User>("User", UserSchema);
const ProjectModel = mongoose.models.Project || mongoose.model<Project>("Project", ProjectSchema);
const BidModel = mongoose.models.Bid || mongoose.model<Bid>("Bid", BidSchema);
const ChatModel = mongoose.models.Chat || mongoose.model<Chat>("Chat", ChatSchema);

export { UserModel, ProjectModel, BidModel, ChatModel };
