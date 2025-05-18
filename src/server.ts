import * as dotenv from 'dotenv';
import path from 'path';
if (process.env.NODE_ENV === 'PRODUCTION') {
  dotenv.config({ path: path.resolve('.env.production') });
} else if (process.env.NODE_ENV === 'STAGING') {
  dotenv.config({ path: path.resolve('.env.staging') });
} else {
  dotenv.config();
}
if (process.env.NODE_ENV === 'CI') {
  process.exit(0);
}

import { startServer } from './app';
import { CronJob } from 'cron';
import { User } from './database';
import { Op } from 'sequelize';
import { getTwitchChannelInfo } from './utils/twitch-channel-update';
import { Client, GatewayIntentBits } from 'discord.js';

(async () => {
  try {
    await startServer();

    setTimeout(test, 1);
  } catch (error: any) {
    console.error(error);
  }
})();

async function test() {
  try {
    console.time('seed');

    /** new CronJob(
      '* * 01 * *',
      async function () {
        try {
          if (!fs.existsSync('./logs')) {
            fs.mkdirSync('./logs');
          }

          const musics = await Music.findAll({
            include: [
              {
                model: Musician,
                as: 'musician',
                attributes: ['stageName'],
              },
            ],
            attributes: ['name', 'id', 'musicianId', 'listenAmount'],
          });

          await Music.update(
            {
              listenAmount: 0,
            },
            {
              where: {},
            },
          );

          if (!fs.existsSync(`./logs/${dayjs().format('DD-MM-YYYY')}.json`)) {
            fs.writeFileSync(`./logs/${dayjs().format('DD-MM-YYYY')}.json`, JSON.stringify(musics));
          }
        } catch (e) {
          console.log(e);
        }
      },
      null,
      true,
    ); **/

    try {
      const channels = await User.findAll({
        where: {
          twitchUrl: {
            [Op.ne]: null,
          },
        },
      });
      const data = await getTwitchChannelInfo(channels);
      data?.map(async (e) => {
        if (!e) return;
        const user = await User.findOne({
          where: {
            id: e.id,
          },
        });

        if (user) {
          await user.update({
            ...e,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }

    new CronJob(
      '*/5 * * * *',
      async function () {
        try {
          const channels = await User.findAll({
            where: {
              twitchUrl: {
                [Op.ne]: null,
              },
            },
          });
          const data = await getTwitchChannelInfo(channels);
          data?.map(async (e) => {
            if (!e) return;
            const user = await User.findOne({
              where: {
                id: e.id,
              },
            });

            if (user) {
              await user.update({
                ...e,
              });
            }
          });

          await User.update(
            {
              twitchUrl: null,
            },
            {
              where: {
                twitchUrl: '',
              },
            },
          );
        } catch (e) {
          console.log(e);
        }
      },
      null,
      true,
    );

    const client = new Client({
      intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
      ],
    });
    client.login(process.env.DISCORD_BOT_TOKEN);
    console.log(`Discord Bot connected`);

    new CronJob(
      '*/5 * * * *',
      async function () {
        try {
          const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID ?? '');
          const guildMembers = await guild.members.fetch({ withPresences: true });
          guildMembers.forEach(async (member) => {
            // console.log(member.nickname + ' : ' + member?.presence?.activities);
            if (
              (member?.presence?.activities?.filter(
                (activity) => activity.applicationId === process.env.VISION_APPLICATION_ID ?? '',
              )?.length ?? 0) > 0
            ) {
              await User.update(
                {
                  isPlayingVision: true,
                },
                {
                  where: {
                    discordId: member.user.id,
                  },
                },
              );
            }
          });
        } catch (e) {
          console.log(e);
        }
      },
      null,
      true,
    );

    console.timeEnd('seed');
  } catch (error: any) {
    console.error(error);
  }
}
