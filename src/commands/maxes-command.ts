import dayjs from 'dayjs'
import {
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { getMaxOutPRsByUserAndMovement } from '../training-api/controllers/maxoutattempts.js';
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
      }
    ],
  };
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionString[] = [];
  
  public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
    const query_options = intr.options.data
    console.log(query_options)
    // Get data from database
    const maxOutData = await getMaxOutPRsByUserAndMovement(`${intr.user.username}#${intr.user.discriminator}`, 'Back Squat')

    let list_o_maxes = maxOutData.map((v) => {
      const formatted_date = dayjs(v.attempted_date).format('MM/DD/YYYY')
      return `${v.movement_name} ${v.reps}RM: ${v.weight} ${formatted_date.toString()}`
    })

    let embed: MessageEmbed;
    embed = Lang.getEmbed('displayEmbeds.maxes', data.lang(), {CURRENT_USER: `${intr.user.username}#${intr.user.discriminator}`, LIST_OF_MAXES: list_o_maxes.join('\n')});

    await InteractionUtils.send(intr, embed);
  }
}
