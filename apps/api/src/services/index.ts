import { SquadModel, BoardModel, ElementModel, UserModel } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class SquadService {
  static async createSquad(name: string, adminId: string) {
    return await SquadModel.create({
      id: uuidv4(),
      name,
      adminId,
      memberIds: [adminId]
    });
  }

  static async getSquadsByUser(userId: string) {
    return await SquadModel.find({ memberIds: userId });
  }

  static async joinSquad(squadId: string, userId: string) {
    const squad = await SquadModel.findOneAndUpdate(
      { id: squadId },
      { $addToSet: { memberIds: userId } },
      { new: true }
    );
    return squad;
  }

  static async getSquadById(id: string) {
    return await SquadModel.findOne({ id });
  }
}

export class BoardService {
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
      await SquadModel.findOneAndUpdate(
        { id: squad.id },
        { ...squad },
        { upsert: true }
      );
    }
  }

  static async seedUsers(users: any[]) {
    for (const user of users) {
      await UserModel.findOneAndUpdate(
        { id: user.id },
        { ...user },
        { upsert: true }
      );
    }
  }
}
