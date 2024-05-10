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