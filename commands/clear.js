import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Borra mensajes en el canal.')
  .addIntegerOption(opt => opt.setName('cantidad').setDescription('Cuántos mensajes borrar').setRequired(true));

export async function execute(interaction) {
  const cantidad = interaction.options.getInteger('cantidad');
  if (!interaction.member.permissions.has('ManageMessages')) {
    return interaction.reply({ content: 'No tenés permisos para borrar mensajes.', ephemeral: true });
  }
  const borrados = await interaction.channel.bulkDelete(cantidad, true);
  interaction.reply({ content: `🧹 He borrado ${borrados.size} mensajes.`, ephemeral: true });
}
