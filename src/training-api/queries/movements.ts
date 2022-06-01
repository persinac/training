export const MovementQueries = {
  Tester: `select count(*) AS counter
           from movement`,
  GetMovementByName: `
      select mvmnt.* 
      from movement mvmnt
      where mvmnt.name = ?
  `,

  GetMovementByID: `
      select mvmnt.*
      from movement mvmnt
      where mvmnt.movement_id = ?
  `
}