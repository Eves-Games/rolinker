import db from '@/lib/db';
import { GetUserResponse, ThumbnailBatchResponse } from 'roblox-api-types';

export async function getDetailedAccounts(ownerId: string) {
    const accounts = await db.account.findMany({
        where: {
            userId: ownerId
        }
    });

    if (accounts.length === 0) return null;

    const userIds = accounts.map((account) => parseInt(account.id));

    const usersResponse = await fetch('https://users.roblox.com/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userIds,
            excludeBannedUsers: true,
        }),
        next: { revalidate: 3600 }
    }).then((res) => res.json());

    const users: GetUserResponse[] = usersResponse.data;
    const userMap = new Map(users.map((user) => [user.id.toString(), user]));

    const thumbnailsResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${userIds.join(',')}&size=75x75&format=Png&isCircular=false`, {
        next: { revalidate: 60 }
    }).then((res) => res.json());

    const thumbnails: ThumbnailBatchResponse[] = thumbnailsResponse.data;
    const thumbnailMap = new Map(thumbnails.map((thumbnail) => [thumbnail.targetId.toString(), thumbnail]));

    const accountsWithData = accounts.map((account) => {
        const user = userMap.get(account.id);
        const thumbnail = thumbnailMap.get(account.id);

        return {
            ...account,
            name: user ? user.name : '',
            imageUrl: thumbnail ? thumbnail.imageUrl : '',
        };
    });

    return accountsWithData;
}