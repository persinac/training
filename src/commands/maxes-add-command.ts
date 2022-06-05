import dayjs from 'dayjs'
import {
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import {addMaxOutAttempt, getMaxOutAttemptsById} from '../training-api/models/maxoutattempt.js';
import {IMaxOutAttempt} from '../training-api/models/maxoutattempt.js';
import {getMovementByName} from '../training-api/models/movement.js';
import {getUserByDiscordName} from '../training-api/models/user.js';
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
        required: true,
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
        name: 'weight',
        description: 'Weight',
        required: true,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'kg_or_lbs',
        description: 'KG or LB selector',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: 'KGs', value: 'kgs' },
          { name: 'LBs', value: 'lbs' }
        ],
      },
      {
        name: 'successful_attempt',
        description: 'Failed?',
        required: true,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Yes',
            value: '0',
          },
          {
            name: 'No',
            value: '1',
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
        name: 'attempted_date_month',
        description: 'Attempted On - Month',
        required: false,
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: 'Jan', value: '01' },
          { name: 'Feb', value: '02' },
          { name: 'Mar', value: '03' },
          { name: 'Apr', value: '04' },
          { name: 'May', value: '05' },
          { name: 'Jun', value: '06' },
          { name: 'Jul', value: '07' },
          { name: 'Aug', value: '08' },
          { name: 'Sep', value: '09' },
          { name: 'Oct', value: '10' },
          { name: 'Nov', value: '11' },
          { name: 'Dec', value: '12' },
        ],
      },
      {
        name: 'attempted_date_day',
        description: 'Attempted On - Day',
        required: false,
        type: ApplicationCommandOptionType.String
      },
      {
        name: 'attempted_date_year',
        description: 'Attempted On - Year',
        required: false,
        type: ApplicationCommandOptionType.String,
      },
    ],
  };
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionString[] = [];

  public formatDate(date: Date): string {
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ].join('-')
    ;
  }

  public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
    const query_options = intr.options.data
    const input = {} as IMaxOutAttempt
    input.attempted_date = 'YYYY-MM-DD'
    const currentDate = new Date()
    let movement_name = ''
    try {
      query_options.forEach((v) => {
        const {name, value} = v
        switch (name) {
          case 'movement': {
            movement_name = value.toString()
            break;
          }
          case 'reps': {
            input.reps = Number(value)
            break;
          }
          case 'kg_or_lbs': {
            input.kilos = value.toString() === 'kgs' ? 1 : 0
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
          case 'attempted_date_month': {
            if (value !== undefined) {
              input.attempted_date = input.attempted_date.replace('MM', value.toString())
            }

            break;
          }
          case 'attempted_date_day': {
            if (isNaN(parseInt(value.toString()))) {
              throw new Error('Day must be a valid number: (DD)');
            }

            if (value !== undefined) {
              input.attempted_date = input.attempted_date.replace('DD', value.toString())
            }

            break;
          }
          case 'attempted_date_year': {
            if (isNaN(parseInt(value.toString()))) {
              throw new Error('Year must be a valid, 4 digit year');
            }

            if (parseInt(value.toString()) < 2010) {
              throw new Error(`Ok boomer, we aren't keeping track of your glory days maxes. Try a more recent year.`);
            }

            if (value !== undefined) {
              input.attempted_date = input.attempted_date.replace('YYYY', value.toString())
            }

            break;
          }
        }
      })
    } catch (e) {
      const embed = new MessageEmbed()
        .setTitle('ERROR')
        .setDescription(e.toString())
        .setTimestamp()

      await InteractionUtils.send(intr, embed);
      return
    }

    const movement_data = await getMovementByName(movement_name)
    const user_data =  await getUserByDiscordName(`${intr.user.username}#${intr.user.discriminator}`)
    // TODO: Try catch block in case user is invalid or movement is invalid
    input.user_id = user_data[0].id
    input.movement_id = movement_data[0].movement_id
    input.attempted_date = input.attempted_date === 'YYYY-MM-DD' ? this.formatDate(currentDate) : input.attempted_date
    try {
      const attempted_date = new Date(input.attempted_date)
      if (attempted_date > currentDate) {
        throw new Error(`You rub a crystal ball and see yourself hitting this in the future? GTFO.`);
      }
      const insert_result = await addMaxOutAttempt(input)
      const max_out_data = await getMaxOutAttemptsById(insert_result['insertId'])
      console.log(max_out_data)
      let list_o_maxes = max_out_data.map((v) => {
        const formatted_date = dayjs(v.attempted_date).format('MM/DD/YYYY')
        return `${v.movement_name} ${v.reps}RM: ${v.weight} ${formatted_date.toString()}`
      })
      let embed: MessageEmbed;
      embed = Lang.getEmbed('displayEmbeds.maxes-add', data.lang(), {CURRENT_USER: `${intr.user.username}#${intr.user.discriminator}`, NEW_MAX:  list_o_maxes.join('\n')});
      await InteractionUtils.send(intr, embed);
    } catch (e) {
      const embed = new MessageEmbed()
        .setTitle('ERROR')
        .setDescription(e.toString())
        .setTimestamp()

      await InteractionUtils.send(intr, embed);
    }
  }
}
