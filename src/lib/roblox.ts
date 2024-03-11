'use server';

interface GroupRole {
    id: number;
    name: string;
    rank: number;
    memberCount: number;
}

interface GroupRoles {
    groupId: number;
    roles: GroupRole[];
}

/**
 * @param {(string)} groupId - A single group ID or an array of group IDs.
 * @returns {Promise<GroupRole[]>} The details of the group(s) requested.
 */
export async function getRoles(groupId: string) {
    const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`);

    if (!res.ok) return null;

    const GroupRoles = await res.json() as GroupRoles;

    return GroupRoles.roles;
};

interface Group {
    id: number;
    name: string;
    memberCount: number;
    hasVerifiedBadge: boolean;
}

interface Role {
    id: number;
    name: string;
    rank: number;
}

interface UserRoles {
    data: Array<{
        group: Group;
        role: Role;
    }>
}

/**
 * @param {(string)} userId - A single group ID or an array of group IDs.
 * @returns {Promise<Array<Group, Role>>} The details of the group(s) requested.
 */
export async function getUserRoles(userId: string) {
    const res = await fetch(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);

    if (!res.ok) return null;

    const UserRoles = await res.json() as UserRoles;

    return UserRoles.data;
};