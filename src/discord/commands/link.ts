import db from "@/db";
import {
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
  InteractionResponseType,
  MessageFlags,
  Routes,
} from "discord-api-types/v10";
import {
  generateMessage,
  MessageColors,
  MessageTitles,
  noLinkedAccounts,
} from "@/discord/messages";
import { findAssociatedAccount } from "@/discord/util";
import { rest } from "@/discord/rest";

export async function linkCommand(
  interaction: APIChatInputApplicationCommandInteraction,
) {
  const { member, guild_id } = interaction;
  if (!guild_id || !member)
    return generateMessage({
      responseType: InteractionResponseType.ChannelMessageWithSource,
      title: MessageTitles.Error,
      error: { interaction, message: "Interaction objects not found" },
    });

  const account = await findAssociatedAccount(member.user.id, guild_id);
  if (!account)
    return noLinkedAccounts(InteractionResponseType.ChannelMessageWithSource);

  const guild = await db.guild.findUnique({ where: { id: guild_id } });
  if (!guild || !guild.verifiedRoleId)
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        embeds: [
          {
            title: "Click to link a Roblox Account",
            url: "https://rolinker.net/manage/accounts",
          },
        ],
        flags: MessageFlags.Ephemeral,
      },
    } satisfies APIInteractionResponse;

  try {
    if (guild && guild.verifiedRoleId)
      await rest.put(
        Routes.guildMemberRole(guild.id, member.user.id, guild.verifiedRoleId),
      );
  } catch (err: any) {
    return generateMessage({
      responseType: InteractionResponseType.ChannelMessageWithSource,
      title: MessageTitles.UnableRole,
      color: MessageColors.Red,
    });
  }

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [
        {
          title: "Click to link a Roblox Account",
          url: "https://rolinker.net/manage/accounts",
        },
      ],
      flags: MessageFlags.Ephemeral,
    },
  } satisfies APIInteractionResponse;
}
