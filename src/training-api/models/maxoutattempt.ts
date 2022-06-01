import { execute } from '../connectors/mysql.js';
import { MaxOutQueries } from '../queries/max_out.js';

interface IMaxOutAttempt {
  id: number,
  user_id: number,
  movement_id: number,
  weight: number,
  reps: number,
  is_pr: number,
  did_fail: number,
  attempted_date: string
}

interface IMaxOutAttemptView {
  discord_name: string,
  id: number,
  user_id: number,
  movement_id: number,
  movement_name: string,
  weight: number,
  reps: number,
  is_pr: number,
  did_fail: number,
  attempted_date: string
}

export {
  IMaxOutAttempt,
  IMaxOutAttemptView
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getTester = async () => {
  return execute(MaxOutQueries.Tester, []);
};

export const getMaxOutAttemptsByUserMovementAndReps = async (discord_user: string, movement: string, reps: number): Promise<IMaxOutAttemptView[]> => {
  return execute<IMaxOutAttemptView[]>(MaxOutQueries.GetMaxOutAttemptsByUserMovementAndReps, [discord_user, movement, reps]);
};

export const getMaxOutAttemptsByUserAndMovement = async (discord_user: string, movement: string): Promise<IMaxOutAttemptView[]> => {
  return execute<IMaxOutAttemptView[]>(MaxOutQueries.GetMaxOutAttemptsByUserAndMovement, [discord_user, movement]);
};

export const getMaxOutAttemptsById = async (max_id: number): Promise<IMaxOutAttemptView[]> => {
  return execute<IMaxOutAttemptView[]>(MaxOutQueries.GetMaxOutAttemptsById, [max_id]);
};

export const addMaxOutAttempt = async (maxOutAttempt: IMaxOutAttempt): Promise<IMaxOutAttemptView[]> => {
  const result = await execute<IMaxOutAttemptView[]>(MaxOutQueries.AddMaxOutAttempt, [
    maxOutAttempt.user_id,
    maxOutAttempt.movement_id,
    maxOutAttempt.weight,
    maxOutAttempt.reps,
    maxOutAttempt.is_pr,
    maxOutAttempt.did_fail,
    maxOutAttempt.attempted_date
  ]);
  return result
};