export interface User {
    id: string;
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
export declare enum BoardMode {
    Creation = "CREATION",
    Presentation = "PRESENTATION"
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
export interface PostItElement extends BaseElement {
    type: 'POSTIT';
    content: string;
    width: number;
    height: number;
    color: string;
    isVisible: boolean;
    lockedBy?: string;
    reactions: Array<{
        emoji: string;
        count: number;
        userIds: string[];
    }>;
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
}
