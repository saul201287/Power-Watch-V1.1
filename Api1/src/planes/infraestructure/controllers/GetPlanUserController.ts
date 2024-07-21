import { Request, Response } from "express";
import { GetPlanUserUseCase } from "../../application/GetPlanUserUseCase";

export class GetPlanUserController {
  constructor(readonly getPlan: GetPlanUserUseCase) {}
  async run(req: Request, res: Response) {
    const data = req.body;
    try {
      const plan = await this.getPlan.run(data.email);
      if (typeof plan != "string") {
        const newToken = res.locals.newToken;
        if (newToken) {
          res.header("nuevo-token", newToken).status(200).json({
            data: plan,
          });
        } else {
          res.status(200).json({
            data: plan,
          });
        }
      } else {
        res.status(401).json({
          messages: plan,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: error,
      });
    }
  }
}
