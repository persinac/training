import {execute} from '../connectors/mysql.js';
import {MovementQueries} from '../queries/movements.js';

interface IMovement {
  movement_id: number,
  name: string,
  description: string,
  purpose: string
}

export {
  IMovement
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getTester = async () => {
  return execute(MovementQueries.Tester, []);
};

export const getMovementByID = async (id: number): Promise<IMovement> => {
  return execute<IMovement>(MovementQueries.GetMovementByID, [id]);
};

export const getMovementByName = async (movement_name: string): Promise<IMovement> => {
  return execute<IMovement>(MovementQueries.GetMovementByName, [movement_name]);
};