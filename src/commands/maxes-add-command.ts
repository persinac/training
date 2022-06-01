import dayjs from 'dayjs'
import {
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { addMaxOutAttempt } from '../training-api/controllers/maxoutattempts.js';
import {IMaxOutAttempt} from '../training-api/models/maxoutattempt.js';
import { InteractionUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './index.js';

export class MaxesAddCommand implements Command {
  public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
    name: Lang.getCom('commands.maxes-add'),
    description: Lang.getRef('commandDescs.maxes-add', Lang.Default),
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
        required: true,
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
      },
      {
        name: 'weight',
        description: 'Weight (KG)',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'did_fail',
        description: 'Failed?',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Yes',
            value: '1',
          },
          {
            name: 'No',
            value: '0',
          }
        ],
      },
      {
        name: 'is_pr',
        description: 'Is PR?',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Yes',
            value: '1',
          },
          {
            name: 'No',
            value: '0',
          }
        ],
      },
      {
        name: 'attempted_date',
        description: 'Attempted On',
        required: true,
        type: ApplicationCommandOptionType.String
      },
    ],
  };
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionString[] = [];

  public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
    const query_options = intr.options.data
    const input = {} as IMaxOutAttempt
    console.log(query_options)
    query_options.forEach((v) => {
      const {name, value} = v
      switch (name) {
        case 'movement': {
          input.movement_id = 1
          break;
        }
        case 'reps': {
          input.reps = Number(value)
          break;
        }
        case 'weight': {
          input.weight = Number(value)
          break;
        }
        case 'did_fail': {
          input.did_fail = Number(value)
          break;
        }
        case 'is_pr': {
          input.is_pr = Number(value)
          break;
        }
        case 'attempted_date': {
          input.attempted_date = value.toString()
          break;
        }
      }
      console.log(v);
    })
    
    const maxOutData = await addMaxOutAttempt(input)

    let list_o_maxes = maxOutData.map((v) => {
      const formatted_date = dayjs(v.attempted_date).format('MM/DD/YYYY')
      return `${v.movement_name} ${v.reps}RM: ${v.weight} ${formatted_date.toString()}`
    })

    let embed: MessageEmbed;
    embed = Lang.getEmbed('displayEmbeds.maxes', data.lang(), {CURRENT_USER: `${intr.user.username}#${intr.user.discriminator}`, LIST_OF_MAXES: list_o_maxes.join('\n')});

    await InteractionUtils.send(intr, embed);
  }
}
