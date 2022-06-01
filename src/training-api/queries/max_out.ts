export const MaxOutQueries = {
  Tester: `select count(*) from maxes`,

  GetMaxOutAttemptsByUserMovementAndReps: `
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
        and m.reps = ?
    ORDER BY m.is_pr ASC, m.did_fail ASC, m.attempted_date DESC, m.weight DESC
    LIMIT 10
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
    ORDER BY m.is_pr ASC, m.did_fail ASC, m.attempted_date DESC, m.weight DESC
  `,

  GetMaxOutAttemptsById: `
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
    where m.id = ?
  `,

  AddMaxOutAttempt: `
      INSERT INTO maxes (user_id, movement_id, weight, reps, is_pr, did_fail,
                             attempted_date, created_on, updated_on)
      VALUES (?, ?, ?, ?, ?, ?, ?, current_timestamp(), current_timestamp());
  `,
};