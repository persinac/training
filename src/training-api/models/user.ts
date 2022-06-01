import {execute} from '../connectors/mysql.js';
import {UserQueries} from '../queries/users.js';

interface IUser {
  id: number,
  name: string,
  discord_name: string,
  is_active: number
}

export {
  IUser
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getTester = async () => {
  return execute(UserQueries.Tester, []);
};

export const getUserByID = async (id: number): Promise<IUser> => {
  return execute<IUser>(UserQueries.GetUserByID, [id]);
};

export const getUserByDiscordName = async (discord_name: string): Promise<IUser> => {
  return execute<IUser>(UserQueries.GetUserByName, [discord_name]);
};