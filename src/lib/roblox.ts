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
 * @returns {Promise<GroupRoles>} The details of the group(s) requested.
 */
export async function getRoles(groupId: string) {
    const res = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`);

    if (!res.ok) return null;

    const GroupRoles = await res.json() as GroupRoles;

    return GroupRoles.roles;
};