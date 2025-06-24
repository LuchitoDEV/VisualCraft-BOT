import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('addlead')
  .setDescription('Agrega una nueva lead.')
  .addStringOption(o => o.setName('nombre').setDescription('Nombre del lugar').setRequired(true))
  .addStringOption(o => o.setName('tickets').setDescription('Tickets (separados por coma)').setRequired(true))
  .addStringOption(o => o.setName('estado').setDescription('Estado (pendiente/contactado/cerrado)').setRequired(true));

export async function execute(interaction, pool) {
  const nombre = interaction.options.getString('nombre');
  const tickets = interaction.options.getString('tickets').split(',').map(s => s.trim());
  const estado = interaction.options.getString('estado');
  const vendedor = interaction.user.id;

  await pool.query(
    'INSERT INTO leads (nombre, tickets, estado, vendedor) VALUES ($1, $2, $3, $4)',
     [nombre, tickets, estado, vendedor]
  );
  interaction.reply(`✅ Lead "${nombre}" agregada!`);
}
