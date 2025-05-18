import axios from 'axios';
export const getTwitchChannelInfo = async (channels: { twitchUrl: string; id: string }[]) => {
  const headers = {
    'Client-ID': process.env.TWITCH_API_CLIENT_ID ?? '',
  };
  try {
    const users = await Promise.all(
      channels.map(async (_data: any) => {
        if (!_data || !_data?.id) {
          return { id: '' };
        }
        if (_data.twitchUrl === '') return { id: _data.id };
        const u = new URL(_data.twitchUrl);
        u.hash = '';
        u.search = '';
        const username = u.toString().split('/').pop();
        const userResponse: any = await axios.get(
          `https://api.twitch.tv/helix/users?login=${username}`,
          { headers },
        );
        return { user: userResponse.data.data[0], id: _data.id };
      }),
    );

    const streamDataResponse: any = await axios.get(
      `https://api.twitch.tv/helix/streams?${users
        .map(({ user }) => (!user ? '' : `user_id=${user.id}`))
        .join('&')}`,
      { headers },
    );

    const channelInfoList = await Promise.all(
      users.map(async ({ user, id }) => {
        const streamData = streamDataResponse.data.data.find((e: any) => e.user_id === user?.id);

        if (streamData) {
          const { title, viewer_count, thumbnail_url } = streamData;
          const { profile_image_url, display_name } = user;

          return {
            id,
            twitchName: display_name,
            isLive: true,
            twitchLiveTitle: title,
            viewCount: viewer_count,
            twitchLogo: profile_image_url,
            twitchThumbnail: thumbnail_url.replace('{width}', '1920').replace('{height}', '1080'),
          };
        } else {
          if (!user) {
            return { id, twitchName: null };
          }
          const { profile_image_url, display_name } = user;

          return {
            id,
            twitchName: display_name,
            isLive: false,
            twitchLogo: profile_image_url,
          };
        }
      }),
    );

    return channelInfoList;
  } catch (error) {
    console.error(error);
  }
};
