const PING_COMMAND = {
    name: 'ping',
    description: 'responds with pong',
};

const LINK_COMMAND = {
    name: 'link',
    description: 'redirect user to link web-page'
};

const SWITCH_COMMAND = {
    name: 'switch',
    description: 'switch roblox account being used'
};

const GET_ROLES_COMMAND = {
    name: 'get-roles',
    description: 'assign roblox group roles to user'
};

const GET_DIVISIONS_COMMAND = {
    name: 'get-divisions',
    description: 'give division invite links to user'
};

export const commands = {
    ping: PING_COMMAND,
    link: LINK_COMMAND,
    switch: SWITCH_COMMAND,
    getroles: GET_ROLES_COMMAND,
    getdivisions: GET_DIVISIONS_COMMAND,
};