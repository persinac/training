
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