import { IGeneratorId } from "../../application/services/IGenaratorId";
import { v4 as uuidv4 } from "uuid";

export class IdServices implements IGeneratorId {
  asignarId(): string {
    const id = uuidv4();
    return id;
  }
}