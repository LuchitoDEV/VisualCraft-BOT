import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('leads')
  .setDescription('Muestra todas las leads.');

export async function execute(interaction, pool) {
  const res = await pool.query('SELECT * FROM leads ORDER BY fecha_creacion DESC LIMIT 10');
  if (res.rows.length === 0) 
    return interaction.reply('No hay leads aún.');

  const embed = new EmbedBuilder()
    .setTitle('Últimas leads')
    .setColor(0x00AE86)
    .setTimestamp();

  res.rows.forEach(row => {
    embed.addFields({
      name: `${row.nombre} — ${row.estado}`,
      value: `Tickets: ${row.tickets.join(', ')}\nAgregado por: <@${row.vendedor}>`
    });
  });

  interaction.reply({ embeds: [embed] });
}
