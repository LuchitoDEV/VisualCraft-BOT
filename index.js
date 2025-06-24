import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.commands = new Collection();

const commandsPath = path.join('./commands');
for (const file of fs.readdirSync(commandsPath)) {
  const { data, execute } = await import(`./commands/${file}`);
  client.commands.set(data.name, { data, execute });
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
await pool.query(\`
  CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    tickets TEXT[] NOT NULL,
    estado TEXT NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
    vendedor TEXT NOT NULL
  );
\`);

client.once('ready', () => console.log(\`Conectado como \${client.user.tag}\`));

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;
  try {
    await cmd.execute(interaction, pool);
  } catch (e) {
    console.error(e);
    await interaction.reply({ content: 'Ocurrió un error.', ephemeral: true });
  }
});

await client.login(process.env.DISCORD_TOKEN);