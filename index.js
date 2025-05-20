const keep_alive = require(`./keep_alive.js`);
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

const PREFIX = '!'; // Puedes cambiar el prefijo

client.on('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // !help
  if (command === 'help') {
    message.channel.send('Comandos disponibles:\n!ban <@usuario>\n!mute <@usuario>\n!warn <@usuario> <razón>\n!help');
  }

  // !ban
  else if (command === 'ban') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply('No tienes permisos para banear.');
    const user = message.mentions.members.first();
    if (!user) return message.reply('Menciona a un usuario para banear.');
    try {
      await user.ban({ reason: 'Baneado por un moderador.' });
      message.channel.send(`${user.user.tag} ha sido baneado.`);
    } catch (err) {
      message.reply('No pude banear a ese usuario.');
    }
  }

  // !mute
  else if (command === 'mute') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) return message.reply('No tienes permisos para mutear.');
    const user = message.mentions.members.first();
    if (!user) return message.reply('Menciona a un usuario para mutear.');
    let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    if (!muteRole) {
      try {
        muteRole = await message.guild.roles.create({ name: 'Muted', permissions: [] });
        message.guild.channels.cache.forEach(async (channel) => {
          await channel.permissionOverwrites.create(muteRole, { SendMessages: false, Speak: false });
        });
      } catch (e) {
        return message.reply('No pude crear el rol Muted.');
      }
    }
    await user.roles.add(muteRole);
    message.channel.send(`${user.user.tag} ha sido muteado.`);
  }

  // !warn
  else if (command === 'warn') {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply('No tienes permisos para advertir.');
    const user = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'Sin razón especificada';
    if (!user) return message.reply('Menciona a un usuario para advertir.');
    message.channel.send(`${user.user.tag} ha sido advertido. Razón: ${reason}`);
    // Aquí podrías guardar la advertencia en una base de datos si quieres
  }
});

client.login('TU_TOKEN_AQUI');
