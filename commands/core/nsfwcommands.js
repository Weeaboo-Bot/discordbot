const Command = require('../../models/Command');
const Discord = require('discord.js');


module.exports = class NSFWCommandsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nsfwcommands',
            aliases: ['commandsnsfw', 'cnsfw', 'pervert'],
            group: 'core',
            memberName: 'nsfwcommands',
            description: 'Lists all the NSFW commands!',
            examples: ['~nsfwcommands']
        });
    }

    run(message) {
        const embed = new Discord.MessageEmbed()
            .setAuthor("NSFW Commands", 'https://a.safe.moe/Tr9Jr.png')
            .setDescription(`Use \`~help [command]\` for more details.`)
            .setColor('727293')
            .setThumbnail(this.client.user.displayAvatarURL({ format: 'png' }))
            .setFooter("Any message from me can be removed by reacting with a 🎴 emoji!")
            .addField("__2D NSFW:__", "`ecchi` `hentai` `hentaigif`\n\`hentaiirl` `neko` `pantsu`\n\`oppai` `yaoi` `yuri` `zr   `", true)
            .addField("__2D Fetish:__", "`ahegao` `bara` `bondage`\n\`futa` `monstergirl` `paizuri`\n\`sukebei` `tentacle` `trap`", true)
            .addField("__3D NSFW:__", "`4knsfw` `artsyporn` `ass` `boobs`\n\`nsfw` `nsfwgif` `pornhub` `pussy`", true)
            .addField("__3D Fetish:__", "`asian` `amateur` `bdsm`\n\`cosplay` `grool` `lingerie`", true)
            .addField("__NSFW Image Boards:__", "`danbooru` `gelbooru` `hypno` `konachan` `paheal` `rule34` `tbib` `yandere` `xbooru` `e621`");
        message.channel.send({ embed }).then(m => { m.react('🎴') });

        return null;
    }
};