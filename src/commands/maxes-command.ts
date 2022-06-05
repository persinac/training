import dayjs from 'dayjs'
import {
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import {
  getMaxOutAttemptsByUserAndMovement,
  getMaxOutAttemptsByUserMovementAndReps, IMaxOutAttemptView
} from '../training-api/models/maxoutattempt.js';
import { InteractionUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './index.js';
import {length} from "class-validator";

export class MaxesCommand implements Command {
  public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: Lang.getCom('commands.maxes'),
    description: Lang.getRef('commandDescs.maxes', Lang.Default),
    dm_permission: true,
    default_member_permissions: undefined,
    options: [
      {
        name: 'movement',
        description: 'Movement',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: 'Back Squat', value: 'Back Squat' },
          { name: 'Bench Press', value: 'Bench Press' },
          { name: 'Clean and Jerk', value: 'Clean and Jerk' },
          { name: 'Clean', value: 'Clean' },
          { name: 'Clean Grip Deadlift', value: 'Clean Grip Deadlift' },
          { name: 'Deadlift', value: 'Deadlift' },
          { name: 'Front Squat', value: 'Front Squat' },
          { name: 'Jerk', value: 'Jerk' },
          { name: 'Muscle Snatch', value: 'Muscle Snatch' },
          { name: 'Power Clean', value: 'Power Clean' },
          { name: 'Power Jerk', value: 'Power Jerk' },
          { name: 'Power Snatch', value: 'Power Snatch' },
          { name: 'Push Jerk', value: 'Push Jerk' },
          { name: 'Push Press', value: 'Push Press' },
          { name: 'Snatch', value: 'Snatch' },
          { name: 'Snatch Grip Deadlift', value: 'Snatch Grip Deadlift' },
          { name: 'Strict Press', value: 'Strict Press' },
        ],
      },
      {
        name: 'reps',
        description: 'Reps',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: '8RM', value: '8' },
          { name: '5RM', value: '5' },
          { name: '3RM', value: '3' },
          { name: '2RM', value: '2' },
          { name: '1RM', value: '1' },
        ],
      },
      {
        name: 'show_in_kgs_or_lbs',
        description: 'Show weights in KGs or LBs',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: 'kgs', value: 'kgs' },
          { name: 'lbs', value: 'lbs' }
        ],
      }
    ],
  };
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionString[] = [];
  
  public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
    const query_options = intr.options.data
    let movement_name = ''
    let reps = 0
    let kgsOrLbs = 'kgs'
    // TODO: We can slice and dice this many ways... probably going to need a query builder based on options
    query_options.forEach((v) => {
      const {name, value} = v
      switch (name) {
        case 'movement': {
          movement_name = value.toString()
          break;
        }
        case 'reps': {
          reps = Number(value)
          break;
        }
        case 'show_in_kgs_or_lbs': {
          kgsOrLbs = value.toString()
          break;
        }
      }
    })
    let max_out_data = []
    /**
     * TODO:
     *  - If no reps provided, then list ALL current maxes - group by RM, show top
     *  - Else, do what we're currently doing
     */
    const embed = new MessageEmbed()
    if (reps > 0) {
      max_out_data = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, reps)

      if (max_out_data.length === 0) {
        embed.setTitle(`${intr.user.username}#${intr.user.discriminator}`)
          .addField('Current Max', `No data available for ${movement_name}` )
          .addField('Attempts', 'N/A' )
          .setTimestamp()
      } else {
        const current_max_str = this.stringify_movement_for_embed(max_out_data[0], true, kgsOrLbs)
        const sorted_maxes_by_attempt_date = max_out_data.sort((a, b) => b.attempted_date - a.attempted_date)

        let list_o_maxes = sorted_maxes_by_attempt_date.map((v) => {
          return this.stringify_movement_for_embed(v, false, kgsOrLbs)
        });

        embed.setTitle(`${intr.user.username}#${intr.user.discriminator}`)
          .addField('Current Max', current_max_str)
          .addField('Attempts', list_o_maxes.join('\n'))
          .setTimestamp()
      }
    } else {
      const eight_rm = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, 8)
      const five_rm = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, 5)
      const three_rm = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, 3)
      const two_rm = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, 2)
      const one_rm = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, 1)

      const list_o_maxes = []
      if (eight_rm.length > 0) {
        list_o_maxes.push(this.stringify_movement_for_embed(eight_rm[0], true, kgsOrLbs))
      }

      if (five_rm.length > 0) {
        list_o_maxes.push(this.stringify_movement_for_embed(five_rm[0], true, kgsOrLbs))
      }

      if (three_rm.length > 0) {
        list_o_maxes.push(this.stringify_movement_for_embed(three_rm[0], true, kgsOrLbs))
      }

      if (two_rm.length > 0) {
        list_o_maxes.push(this.stringify_movement_for_embed(two_rm[0], true, kgsOrLbs))
      }

      if (one_rm.length > 0) {
        list_o_maxes.push(this.stringify_movement_for_embed(one_rm[0], true, kgsOrLbs))
      }

      embed.setTitle(`${intr.user.username}#${intr.user.discriminator}`)
        .setTitle('List of current Maxes')
        .setDescription(list_o_maxes.join('\n'))
        .setTimestamp()
    }
    await InteractionUtils.send(intr, embed);
  }

  public stringify_movement_for_embed(v: IMaxOutAttemptView, for_curr_max: boolean, kgs_or_lbs: string): string {
    const formatted_date = dayjs(v.attempted_date).format('MM/DD/YYYY')
    let icon_attempt = ''
    if (!for_curr_max) { icon_attempt = v.did_fail === 1 ? ':red_circle:' : ':white_circle:' }
    let display_weight = v.weight
    const display_label = kgs_or_lbs === 'kgs' ? 'kg' : 'lb'

    // display in KGs but the current max is in LBs -> convert
    if (kgs_or_lbs === 'kgs' && v.kilos === 0) {
      display_weight = v.weight / 2.2
    }

    // display in LBs but the current max is in KGs -> convert
    if (kgs_or_lbs === 'lbs' && v.kilos === 1) {
      display_weight = v.weight * 2.2
    }

    return `${v.movement_name} ${v.reps}RM: ${display_weight.toFixed(2)}${display_label}\t ${formatted_date.toString()}\t ${icon_attempt}`
  }
}
