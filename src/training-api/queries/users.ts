export const UserQueries = {
  Tester: `select count(*) AS counter
           from users`,
  GetUserByName: `
      select u.* 
      from users u
      where u.discord_name = ?
  `,

  GetUserByID: `
      select u.*
      from users u
      where u.id = ?
  `
}