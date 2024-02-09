export default function discordNameSlice(
  discord_name: string,
  max: number = 7
) {
  return discord_name.length > max
    ? discord_name.slice(0, max - 1)
    : discord_name;
}
