import { Request, Response } from 'express';
import { SquadService, BoardService, TestService } from '../services';

export class SquadController {
  static async create(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const { name } = req.body;
      const squad = await SquadService.createSquad(name, user.id);
      res.status(201).json(squad);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const squads = await SquadService.getSquadsByUser(user.id);
      res.json(squads);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async join(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const squad = await SquadService.joinSquad(req.params.id, user.id);
      if (!squad) return res.status(404).json({ error: 'Squad not found' });
      res.json(squad);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async leave(req: Request, res: Response) {
    try {
      const user = req.user as any;
      await SquadService.leaveSquad(req.params.id, user.id);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const squad = await SquadService.getSquadById(req.params.id);
      if (!squad) return res.status(404).json({ error: 'Squad not found' });
      res.json(squad);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getMembers(req: Request, res: Response) {
    try {
      const members = await SquadService.getSquadMembers(req.params.id);
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export class BoardController {
  static async create(req: Request, res: Response) {
    try {
      const user = req.user as any;
      const { squadId, title } = req.body;
      const board = await BoardService.createBoard(squadId, user.id, title);
      res.status(201).json(board);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async listBySquad(req: Request, res: Response) {
    try {
      const boards = await BoardService.getBoardsBySquad(req.params.id);
      res.json(boards);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const result = await BoardService.getBoardWithElements(req.params.id);
      if (!result.board) return res.status(404).json({ error: 'Board not found' });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export class TestController {
  static async clearDb(req: Request, res: Response) {
    try {
      await TestService.clearDatabase();
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async seedSquads(req: Request, res: Response) {
    try {
      await TestService.seedSquads(req.body.squads);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async seedUsers(req: Request, res: Response) {
    try {
      await TestService.seedUsers(req.body.users);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  static async seedBoards(req: Request, res: Response) {
    try {
      const results = await TestService.seedBoards(req.body.boards);
      res.json(results);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
