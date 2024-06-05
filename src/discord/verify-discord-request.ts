import { APIChatInputApplicationCommandInteraction, APIMessageComponentSelectMenuInteraction, APIModalSubmitInteraction, APIPingInteraction } from "discord-api-types/v10"
import nacl from "tweetnacl"

type VerifyWithNaclArgs = {
  appPublicKey: string
  rawBody: string
  signature: string
  timestamp: string
}

const verifyWithNacl = ({ appPublicKey, signature, rawBody, timestamp }: VerifyWithNaclArgs) => {
  return nacl.sign.detached.verify(
    Buffer.from(timestamp + rawBody),
    Buffer.from(signature, "hex"),
    Buffer.from(appPublicKey, "hex")
  )
}

type VerifyDiscordRequestResult =
  | { isValid: false }
  | { isValid: true; interaction: APIPingInteraction | APIMessageComponentSelectMenuInteraction | APIChatInputApplicationCommandInteraction | APIModalSubmitInteraction }

export async function verifyInteractionRequest(
  request: Request,
  appPublicKey: string
): Promise<VerifyDiscordRequestResult> {
  const signature = request.headers.get("x-signature-ed25519")
  const timestamp = request.headers.get("x-signature-timestamp")
  if (typeof signature !== "string" || typeof timestamp !== "string") {
    return { isValid: false }
  }

  const rawBody = await request.text()
  const isValidRequest = signature && timestamp && verifyWithNacl({ appPublicKey, rawBody, signature, timestamp })
  if (!isValidRequest) {
    return { isValid: false }
  }

  return {
    interaction: JSON.parse(rawBody) as APIPingInteraction | APIMessageComponentSelectMenuInteraction | APIChatInputApplicationCommandInteraction,
    isValid: true,
  }
}