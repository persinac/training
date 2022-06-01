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
          {
            name: 'Back Squat',
            value: 'Back Squat',
          },
          {
            name: 'Front Squat',
            value: 'Front Squat',
          },
        ],
      },
      {
        name: 'reps',
        description: 'Reps',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: '8RM',
            value: '8',
          },
          {
            name: '5RM',
            value: '5',
          },
          {
            name: '3RM',
            value: '3',
          },
          {
            name: '2RM',
            value: '2',
          },
          {
            name: '1RM',
            value: '1',
          },
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
    console.log(query_options)
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
      }
      console.log(v);
    })
    let max_out_data = []
    /**
     * TODO:
     *  - If no reps provided, then list ALL current maxes
     *  - Else, do what we're currently doing
     */
    if (reps > 0) {
      max_out_data = await getMaxOutAttemptsByUserMovementAndReps(`${intr.user.username}#${intr.user.discriminator}`, movement_name, reps)
    } else {
      max_out_data = await getMaxOutAttemptsByUserAndMovement(`${intr.user.username}#${intr.user.discriminator}`, movement_name)
    }
    // const current_max = max_out_data[0]
    const current_max_str = this.stringify_movement_for_embed(max_out_data[0], true)
    const sorted_maxes_by_attempt_date = max_out_data.sort((a, b) => b.attempted_date - a.attempted_date)

    let list_o_maxes = sorted_maxes_by_attempt_date.map((v) => {
      return this.stringify_movement_for_embed(v, false)
    });

    const embed = new MessageEmbed()
      .setTitle(`${intr.user.username}#${intr.user.discriminator}`)
      .addField('Current Max', current_max_str )
      .addField('Attempts', list_o_maxes.join('\n') )
      .setTimestamp()

    // embed = Lang.getEmbed('displayEmbeds.maxes', data.lang(), {CURRENT_USER: `${intr.user.username}#${intr.user.discriminator}`, LIST_OF_MAXES: list_o_maxes.join('\n')});

    await InteractionUtils.send(intr, embed);
  }

  public stringify_movement_for_embed(v: IMaxOutAttemptView, for_curr_max: boolean): string {
    const formatted_date = dayjs(v.attempted_date).format('MM/DD/YYYY')
    let icon_attempt = ''
    if (!for_curr_max) { icon_attempt = v.did_fail === 1 ? ':red_circle:' : ':white_circle:' }
    return `${v.movement_name} ${v.reps}RM: ${v.weight}kg\t ${formatted_date.toString()}\t ${icon_attempt}`
  }
}
