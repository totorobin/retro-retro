import { SquadModel, BoardModel, ElementModel, UserModel } from '../models';
import { BoardMode } from '@retro/models';
import { v4 as uuidv4 } from 'uuid';

export class SquadService {
  static async createSquad(name: string, adminId: string) {
    return await SquadModel.create({ id: uuidv4(), name, adminId, memberIds: [adminId] });
  }

  static async getSquadsByUser(userId: string) {
    return await SquadModel.find({ memberIds: userId });
  }

  static async joinSquad(squadId: string, userId: string) {
    return await SquadModel.findOneAndUpdate(
      { id: squadId },
      { $addToSet: { memberIds: userId } },
      { new: true }
    );
  }

  static async leaveSquad(squadId: string, userId: string) {
    return await SquadModel.findOneAndUpdate(
      { id: squadId },
      { $pull: { memberIds: userId } },
      { new: true }
    );
  }

  static async getSquadById(id: string) {
    return await SquadModel.findOne({ id });
  }

  static async getSquadMembers(squadId: string) {
    const squad = await SquadModel.findOne({ id: squadId });
    if (!squad) return [];
    return await UserModel.find({ id: { $in: squad.memberIds } });
  }
}

export class BoardService {
  static async createBoard(squadId: string, ownerId: string, title: string) {
    return await BoardModel.create({
      id: uuidv4(),
      squadId,
      ownerId,
      title,
      mode: BoardMode.Creation,
      createdAt: new Date(),
      lastModifiedAt: new Date()
    });
  }

  static async getBoardsBySquad(squadId: string) {
    return await BoardModel.find({ squadId }).sort({ createdAt: -1 });
  }

  static async getBoardWithElements(boardId: string) {
    const board = await BoardModel.findOne({ id: boardId });
    const elements = await ElementModel.find({ boardId });
    return { board, elements };
  }

  static async updateBoardMode(boardId: string, mode: string) {
    return await BoardModel.findOneAndUpdate({ id: boardId }, { mode }, { new: true });
  }
}

export class TestService {
  static async clearDatabase() {
    const mongoose = require('mongoose');
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  }

  static async seedSquads(squads: any[]) {
    for (const squad of squads) {
      await SquadModel.findOneAndUpdate({ id: squad.id }, { ...squad }, { upsert: true });
    }
  }

  static async seedUsers(users: any[]) {
    for (const user of users) {
      await UserModel.findOneAndUpdate({ id: user.id }, { ...user }, { upsert: true });
    }
  }

  static async seedBoards(boards: any[]) {
    const results = [];
    for (const board of boards) {
      const result = await BoardModel.findOneAndUpdate({ id: board.id }, { ...board }, { upsert: true, new: true });
      results.push(result);
    }
    return results;
  }
}
