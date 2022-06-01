export const MaxOutQueries = {
  Tester: `select count(*) from maxes`,
  GetMaxOutPRsByUserAndMovement: `
    select u.discord_name,
           m.id,
           m.user_id,
           m.movement_id,
           mvmnt.name AS movement_name,
           m.weight,
           m.reps,
           m.is_pr,
           m.did_fail,
           m.attempted_date
    from maxes m
             LEFT JOIN users u on u.id = m.user_id
             LEFT JOIN movement mvmnt ON mvmnt.movement_id = m.movement_id
    where u.discord_name = ?
        and mvmnt.name = ?
        and is_pr = 1
        and did_fail = 0
  `,

  GetMaxOutAttemptsByUserAndMovement: `
    select u.discord_name,
           m.id,
           m.user_id,
           m.movement_id,
           mvmnt.name AS movement_name,
           m.weight,
           m.reps,
           m.is_pr,
           m.did_fail,
           m.attempted_date
    from maxes m
             LEFT JOIN users u on u.id = m.user_id
             LEFT JOIN movement mvmnt ON mvmnt.movement_id = m.movement_id
    where u.discord_name = ?
      and mvmnt.name = ?
  `,

  AddMaxOutAttempt: `
      INSERT INTO maxes (user_id, movement_id, weight, reps, is_pr, did_fail,
                             attempted_date, created_on, updated_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp());
  `,

  UpdateTeamById: `
  UPDATE teams_system.teams
  SET name = ?,
      league = ?
  WHERE
    id = ?
  `,

  DeleteTeamById: `
  UPDATE teams_system.teams
  SET isActive = false
  WHERE
    id = ?
  `
};