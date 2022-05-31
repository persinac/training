/**
 * gets active teams
 */
import { execute } from '../connectors/mysql.js';
import { IMaxOutAttempt, IMaxOutAttemptView } from '../models/maxoutattempt.js';
import { MaxOutQueries } from '../queries/queries.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getTester = async () => {
  return execute(MaxOutQueries.Tester, []);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getMaxOutPRsByUserAndMovement = async (discord_user: string, movement: string) => {
  return execute<IMaxOutAttemptView[]>(MaxOutQueries.GetMaxOutPRsByUserAndMovement, [discord_user, movement]);
};

export const getMaxOutAttemptsByUserAndMovement = async (): Promise<IMaxOutAttemptView[]> => {
  return execute<IMaxOutAttemptView[]>(MaxOutQueries.GetMaxOutAttemptsByUserAndMovement, []);
};

export const addMaxOutAttempt = async (maxOutAttempt: IMaxOutAttempt): Promise<IMaxOutAttemptView[]> => {
  const result = await execute<IMaxOutAttemptView[]>(MaxOutQueries.GetMaxOutAttemptsByUserAndMovement, [
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