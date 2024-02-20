const PING_COMMAND = {
    name: 'ping',
    description: 'responds with pong',
};

const LINK_COMMAND = {
    name: 'link',
    description: 'redirect user to link web-page'
};

const GET_ROLES_COMMAND = {
    name: 'get-roles',
    description: 'assign roblox group roles to user'
};

const GET_SUB_GUILDS_COMMAND = {
    name: 'get-sub-guilds',
    description: 'give sub-guild invite links to user'
};

export const commands = {
    ping: PING_COMMAND,
    link: LINK_COMMAND,
    getroles: GET_ROLES_COMMAND,
    getsubguilds: GET_SUB_GUILDS_COMMAND,
};