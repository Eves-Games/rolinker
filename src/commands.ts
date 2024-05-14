import { RESTPatchAPIApplicationCommandJSONBody } from "discord-api-types/v10";

const LINK_COMMAND = {
    name: 'link',
    description: 'redirect user to link web-page'
} satisfies RESTPatchAPIApplicationCommandJSONBody;

const SWITCH_COMMAND = {
    name: 'switch',
    description: 'switch roblox account being used'
} satisfies RESTPatchAPIApplicationCommandJSONBody;

const SEND_LINK_COMMAND = {
    name: 'send-link',
    description: 'send link account embed to channel'
} satisfies RESTPatchAPIApplicationCommandJSONBody;

const GET = {
    name: 'get',
    description: 'commands for getting user data',
    options: [
        {
            name: 'divisions',
            description: 'give division invite links to user',
            type: 1
        },
        {
            name: 'roles',
            description: 'assign roblox group roles to user',
            type: 1
        },
    ]
} satisfies RESTPatchAPIApplicationCommandJSONBody;

const BOT = {
    name: 'bot',
    description: 'commands for the connected rank bot',
    options: [
        {
            name: 'shout',
            description: 'send a shout to the linked group',
            type: 1
        },
        {
            name: 'promote',
            description: 'promote a user in the linked group',
            type: 1
        },
        {
            name: 'demote',
            description: 'demote a user in the linked group',
            type: 1
        }
    ]
} satisfies RESTPatchAPIApplicationCommandJSONBody;

export const commands = {
    link: LINK_COMMAND,
    switch: SWITCH_COMMAND,
    sendlink: SEND_LINK_COMMAND,
    get: GET,
    bot: BOT
};