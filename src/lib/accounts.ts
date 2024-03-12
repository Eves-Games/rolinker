import db from '@/lib/db';
import { GetUserResponse, ThumbnailBatchResponse } from 'roblox-api-types';

export async function getDetailedAccounts(ownerId: string) {
    const accounts = await db.account.findMany({
        where: {
            ownerId: ownerId
        }
    });

    if (accounts.length == 0) return null;

    const usersResponse = await fetch('https://users.roblox.com/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userIds: accounts.map((account) => parseInt(account.id)),
            excludeBannedUsers: true,
        }),
    }).then((res) => res.json());

    const users: GetUserResponse[] = usersResponse.data;

    const thumbnailsResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${accounts.map(account => account.id).join(',')}&size=75x75&format=Png&isCircular=false`).then(
        (res) => res.json()
    );

    const thumbnails: ThumbnailBatchResponse[] = thumbnailsResponse.data;

    const accountsWithData = accounts.map((account) => {
        const user = users.find((user) => user.id.toString() === account.id);
        const thumbnail = thumbnails.find((thumbnail) => thumbnail.targetId.toString() === account.id);

        return {
            ...account,
            name: user ? user.name : '',
            imageUrl: thumbnail ? thumbnail.imageUrl : '',
        };
    });

    return accountsWithData;
}