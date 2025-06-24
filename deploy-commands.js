import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';

const commands = [];
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const { data } = await import(`./commands/${file}`);
  commands.push(data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
await rest.put(
  Routes.applicationCommands(process.env.CLIENT_ID),
  { body: commands }
);
console.log('Comandos registrados!');