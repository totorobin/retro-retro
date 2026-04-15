import mongoose, { Schema, Document } from 'mongoose';
import { User, Squad, Board, BoardMode, BaseElement, ShapeElement, PostItElement, ImageElement, TextElement } from '@retro/models';

// USER SCHEMA
const userSchema = new Schema<User & Document>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  picture: { type: String },
});

export const UserModel = mongoose.model<User & Document>('User', userSchema);

// SQUAD SCHEMA
const squadSchema = new Schema<Squad & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  adminId: { type: String, required: true, ref: 'User' },
  memberIds: [{ type: String, ref: 'User' }],
});

export const SquadModel = mongoose.model<Squad & Document>('Squad', squadSchema);

// BOARD SCHEMA
const boardSchema = new Schema<Board & Document>({
  id: { type: String, required: true, unique: true },
  squadId: { type: String, required: true, ref: 'Squad' },
  title: { type: String, required: true },
  ownerId: { type: String, required: true, ref: 'User' },
  mode: { type: String, enum: Object.values(BoardMode), default: BoardMode.Creation },
  createdAt: { type: Date, default: Date.now },
  lastModifiedAt: { type: Date, default: Date.now },
});

export const BoardModel = mongoose.model<Board & Document>('Board', boardSchema);

// ELEMENT SCHEMA
const elementSchema = new Schema<BaseElement & any & Document>({
  id: { type: String, required: true, unique: true },
  boardId: { type: String, required: true, ref: 'Board' },
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  zindex: { type: Number, required: true },
  creatorId: { type: String, required: true, ref: 'User' },
  
  // Shape specific
  shapeType: { type: String },
  width: { type: Number },
  height: { type: Number },
  points: [{ type: Number }],
  fill: { type: String },
  stroke: { type: String },
  opacity: { type: Number },
  defaultPostitColor: { type: String },
  
  // PostIt/Text specific
  content: { type: String },
  color: { type: String },
  isVisible: { type: Boolean },
  lockedBy: { type: String, ref: 'User' },
  reactions: [{
    emoji: { type: String },
    count: { type: Number },
    userIds: [{ type: String, ref: 'User' }]
  }],
  
  // Image specific
  url: { type: String },
  
  // Text specific
  fontSize: { type: Number },
}, { timestamps: true });

export const ElementModel = mongoose.model<BaseElement & any & Document>('Element', elementSchema);
