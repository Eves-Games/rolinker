import db from "./db";

export interface UserRoles {
    data: UserRolesData[];
};

export interface UserRolesData {
    group: UserRolesGroup;
    role: UserRole;
    isNotificationsEnabled: boolean;
};

export interface UserRolesGroup {
    id: number;
    name: string;
    memberCount: number;
    hasVerifiedBadge: boolean;
};

export interface UserRole {
    id: number;
    name: string;
    rank: number;
};

/**
 * @param {string | number} userId
 * @returns {Promise<GroupMembership>}
 * @throws {Error}
 */
export async function getUserRoles(userId: string | number): Promise<UserRoles> {
    const res = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
    const data = await res.json();

    if (!res.ok) throw new Error(data);

    return data as UserRoles;
};

export interface Groups {
    data: GroupData[];
};

export interface GroupData {
    id: number;
    name: string;
    description: string;
    owner: {
        id: number;
        type: number;
        name: string;
    };
    memberCount: number;
    created: string;
    hasVerifiedBadge: boolean;
};

/**
* @param {(string | number)[]} groupIds
* @returns {Promise<Groups>}
* @throws {Error}
*/
export async function getGroups(groupIds: (string | number)[]): Promise<Groups> {
    const queryParams = new URLSearchParams();
    groupIds.forEach((id) => queryParams.append('groupIds', id.toString()));

    const res = await fetch(`https://groups.roblox.com/v2/groups?${queryParams}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data);

    return data as Groups;
};

export interface GroupRoles {
    data: any;
    groupId: number;
    roles: GroupRole[];
};

export interface GroupRole {
    id: number;
    name: string;
    description: string;
    rank: number;
    memberCount: number;
};

/**
 * @param {string | number} groupId
 * @returns {Promise<GroupMembership>}
 * @throws {Error}
 */
export async function getGroupRoles(groupId: string | number): Promise<GroupRoles> {
    const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`);
    const data = await res.json();

    if (!res.ok) throw new Error(data);

    return data as GroupRoles;
};

interface ThumbnailBatchResponse {
    requestId: string;
    errorCode: number;
    errorMessage: string;
    targetId: number;
    state: string;
    imageUrl: string;
    version: string;
  }
  
  interface GetUserResponse {
    description: string;
    created: string;
    isBanned: boolean;
    externalAppDisplayName: string;
    hasVerifiedBadge: boolean;
    id: number;
    name: string;
    displayName: string;
  }
  
  export async function getDetailedAccounts(ownerId: string) {
    const accounts = await db.account.findMany({
      where: { userId: ownerId },
    });
  
    if (accounts.length === 0) return [];
  
    const userIds = accounts.map((account) => parseInt(account.id));
  
    const usersResponse = await fetch("https://users.roblox.com/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userIds,
        excludeBannedUsers: true,
      }),
      next: { revalidate: 3600 },
    }).then((res) => res.json());
  
    const users: GetUserResponse[] = usersResponse.data;
    const userMap = new Map(users.map((user) => [user.id.toString(), user]));
  
    const thumbnailsResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${userIds.join(",")}&size=75x75&format=Png&isCircular=false`,
      {
        next: { revalidate: 60 },
      },
    ).then((res) => res.json());
  
    const thumbnails: ThumbnailBatchResponse[] = thumbnailsResponse.data;
    const thumbnailMap = new Map(
      thumbnails.map((thumbnail) => [thumbnail.targetId.toString(), thumbnail]),
    );
  
    const accountsWithData = accounts.map((account) => {
      const user = userMap.get(account.id);
      const thumbnail = thumbnailMap.get(account.id);
  
      return {
        ...account,
        name: user ? user.name : "",
        imageUrl: thumbnail ? thumbnail.imageUrl : "",
      };
    });
  
    return accountsWithData;
  }
  