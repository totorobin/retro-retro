export interface User {
  id: string; // Google Unique ID
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

export interface Squad {
  id: string;
  name: string;
  adminId: string;
  memberIds: string[];
}

export enum BoardMode {
  Creation = 'CREATION',
  Presentation = 'PRESENTATION'
}

export interface Board {
  id: string;
  squadId: string;
  title: string;
  ownerId: string;
  mode: BoardMode;
  createdAt: Date;
  lastModifiedAt: Date;
}

export type ElementType = 'SHAPE' | 'IMAGE' | 'TEXT' | 'POSTIT' | 'LASER_TRAIL' | 'STAMP';

export interface BaseElement {
  id: string;
  boardId: string;
  type: ElementType;
  x: number;
  y: number;
  zindex: number;
  creatorId: string;
}

export interface ShapeElement extends BaseElement {
  type: 'SHAPE';
  shapeType: 'RECTANGLE' | 'CIRCLE' | 'POLYGON';
  width?: number;
  height?: number;
  points?: number[];
  fill: string;
  stroke: string;
  opacity: number;
  defaultPostitColor?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface PostItElement extends BaseElement {
  type: 'POSTIT';
  content: string;
  width: number;
  height: number;
  color: string;
  isVisible: boolean;
  lockedBy?: string;
  reactions: Reaction[];
}

export interface ImageElement extends BaseElement {
  type: 'IMAGE';
  url: string;
  width: number;
  height: number;
}

export interface TextElement extends BaseElement {
  type: 'TEXT';
  content: string;
  fontSize: number;
  color: string;
  width?: number;
}

export interface StampElement extends BaseElement {
  type: 'STAMP';
  stampType: 'profile' | 'emoji';
  userId?: string;
  userPicture?: string;
  emoji?: string;
  size: number;
}

export interface LaserTrailElement {
  id: string;
  userId: string;
  points: number[];
  color: string;
}

export type AnyElement = ShapeElement | PostItElement | ImageElement | TextElement | StampElement;
