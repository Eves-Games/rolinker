'use server';

interface GroupRole {
    id: number;
    name: string;
    rank: number;
    memberCount: number;
};

interface GroupRoles {
    groupId: number;
    roles: GroupRole[];
};

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

interface UserGroup {
    id: number;
    name: string;
    memberCount: number;
    hasVerifiedBadge: boolean;
};

interface Role {
    id: number;
    name: string;
    rank: number;
};

interface UserRoles {
    data: Array<{
        group: UserGroup;
        role: Role;
    }>
};

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

/**
 * @param {(string)} userId - The user ID.
 * @param {(string)} groupId - The group ID.
 * @returns {Promise<Role | null>} The user's role in the specified group, or null if not found.
 */
export async function getUserRoleInGroup(userId: string, groupId: string) {
    const userRoles = await getUserRoles(userId);
    if (!userRoles) return null;

    const groupRole = userRoles.find(role => role.group.id === parseInt(groupId));
    if (!groupRole) return null;

    return groupRole.role;
};

interface Group extends UserGroup {
    description: string;
    owner: {
        id: number;
        type: number;
        name: string;
    };
    created: string;
};

interface GroupInfos {
    data: Array<Group>
};

/**
 * @param {(string)} groupId - A single group ID or an array of group IDs.
 * @returns {Promise<GroupRole[]>} The details of the group(s) requested.
 */
export async function getGroups(groupId: string[]) {
    const res = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${groupId.join(',')}`)

    if (!res.ok) return null;

    const GroupInfos = await res.json() as GroupInfos;

    return GroupInfos;
};