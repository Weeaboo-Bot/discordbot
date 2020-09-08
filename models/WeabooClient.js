const { CommandoClient } = require("discord.js-commando");
const { Collection, MessageEmbed } = require("discord.js");
const util = require("util"),
  path = require("path"),
  fs = require("fs"),
  moment = require("moment");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 12);

module.exports = class Client extends CommandoClient {
  constructor(options) {
    super(options);

    this.meme = "hello";
    this.config = require("../config"); // Load the config file
    this.customEmojis = require("../emojis.json"); // load the bot's emojis
    this.wait = util.promisify(setTimeout); // client.wait(1000) - Wait 1 second
    this.functions = require("../helpers/functions"); // Load the functions file
    this.guildsData = require("../models/Guild"); // Guild mongoose model
    this.usersData = require("../models/User"); // User mongoose model
    this.membersData = require("../models/Member"); // Member mongoose model
    this.logs = require("../models/Log"); // Log mongoose model
    this.games = new Collection();
    this.databaseCache = {};
    this.databaseCache.users = new Collection();
    this.databaseCache.guilds = new Collection();
    this.databaseCache.members = new Collection();

    this.databaseCache.usersReminds = new Collection(); // members with active reminds
    this.databaseCache.mutedUsers = new Collection(); // members who are currently muted

    this.musicData = {
      queue: [],
      isPlaying: false,
      nowPlaying: null,
      songDispatcher: null,
      volume: 1,
    };
  }

  onError(err, message, args, fromPattern, result) {
    // eslint-disable-line no-unused-vars
    console.error(err);
    const embed = new MessageEmbed()
      .setColor("RED")
      .setTimestamp()
      .setTitle(
        "Please report this on our Discord server https://lenoxbot.com/discord"
      )
      .setDescription(`StackTrace: \n\`\`\`${err.stack}\`\`\``)
      .addField("Command:", `${message.content.split(" ").join(" ")}`);

    return message.reply({ embed });
  }

  get defaultLanguage() {
    return this.config.languages.find((language) => language.default).name;
  }

  translate(key, args, locale) {
    if (!locale) locale = this.defaultLanguage;
    const language = this.translations.get(locale);
    if (!language) throw "Invalid language set in data.";
    return language(key, args);
  }

  printDate(date, format, locale) {
    if (!locale) locale = this.defaultLanguage;
    const languageData = this.config.languages.find(
      (language) =>
        language.name === locale || language.aliases.includes(locale)
    );
    if (!format) format = languageData.defaultMomentFormat;
    return moment(new Date(date)).locale(languageData.moment).format(format);
  }

  convertTime(time, type, noPrefix, locale) {
    if (!type) time = "to";
    if (!locale) locale = this.defaultLanguage;
    const languageData = this.config.languages.find(
      (language) =>
        language.name === locale || language.aliases.includes(locale)
    );
    const m = moment(time).locale(languageData.moment);
    return type === "to" ? m.toNow(noPrefix) : m.fromNow(noPrefix);
  }

  get defaultLanguage() {
    return this.config.languages.find((language) => language.default).name;
  }

  translate(key, args, locale) {
    if (!locale) locale = this.defaultLanguage;
    const language = this.translations.get(locale);
    if (!language) throw "Invalid language set in data.";
    return language(key, args);
  }

  printDate(date, format, locale) {
    if (!locale) locale = this.defaultLanguage;
    const languageData = this.config.languages.find(
      (language) =>
        language.name === locale || language.aliases.includes(locale)
    );
    if (!format) format = languageData.defaultMomentFormat;
    return moment(new Date(date)).locale(languageData.moment).format(format);
  }

  convertTime(time, type, noPrefix, locale) {
    if (!type) time = "to";
    if (!locale) locale = this.defaultLanguage;
    const languageData = this.config.languages.find(
      (language) =>
        language.name === locale || language.aliases.includes(locale)
    );
    const m = moment(time).locale(languageData.moment);
    return type === "to" ? m.toNow(noPrefix) : m.fromNow(noPrefix);
  }

  // This function is used to find a user data or create it
  async findOrCreateUser({ id: userID }, isLean) {
    if (this.databaseCache.users.get(userID)) {
      return isLean
        ? this.databaseCache.users.get(userID).toJSON()
        : this.databaseCache.users.get(userID);
    } else {
      let userData = isLean
        ? await this.usersData.findOne({ id: userID }).lean()
        : await this.usersData.findOne({ id: userID });
      if (userData) {
        if (!isLean) this.databaseCache.users.set(userID, userData);
        return userData;
      } else {
        userData = new this.usersData({ id: userID });
        await userData.save();
        this.databaseCache.users.set(userID, userData);
        return isLean ? userData.toJSON() : userData;
      }
    }
  }

  // This function is used to find a member data or create it
  async findOrCreateMember({ id: memberID, guildID }, isLean) {
    if (this.databaseCache.members.get(`${memberID}${guildID}`)) {
      return isLean
        ? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON()
        : this.databaseCache.members.get(`${memberID}${guildID}`);
    } else {
      let memberData = isLean
        ? await this.membersData.findOne({ guildID, id: memberID }).lean()
        : await this.membersData.findOne({ guildID, id: memberID });
      if (memberData) {
        if (!isLean)
          this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
        return memberData;
      } else {
        memberData = new this.membersData({ id: memberID, guildID: guildID });
        await memberData.save();
        const guild = await this.findOrCreateGuild({ id: guildID });
        if (guild) {
          guild.members.push(memberData._id);
          await guild.save();
        }
        this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
        return isLean ? memberData.toJSON() : memberData;
      }
    }
  }

  // This function is used to find a guild data or create it
  async findOrCreateGuild({ id: guildID }, isLean) {
    if (this.databaseCache.guilds.get(guildID)) {
      return isLean
        ? this.databaseCache.guilds.get(guildID).toJSON()
        : this.databaseCache.guilds.get(guildID);
    } else {
      let guildData = isLean
        ? await this.guildsData
            .findOne({ id: guildID })
            .populate("members")
            .lean()
        : await this.guildsData.findOne({ id: guildID }).populate("members");
      if (guildData) {
        if (!isLean) this.databaseCache.guilds.set(guildID, guildData);
        return guildData;
      } else {
        guildData = new this.guildsData({ id: guildID });
        await guildData.save();
        this.databaseCache.guilds.set(guildID, guildData);
        return isLean ? guildData.toJSON() : guildData;
      }
    }
  }

  // This function is used to resolve a user from a string
  async resolveUser(search) {
    let user = null;
    if (!search || typeof search !== "string") return;
    // Try ID search
    if (search.match(/^<@!?(\d+)>$/)) {
      const id = search.match(/^<@!?(\d+)>$/)[1];
      user = this.users.fetch(id).catch(() => {});
      if (user) return user;
    }
    // Try username search
    if (search.match(/^!?(\w+)#(\d+)$/)) {
      const username = search.match(/^!?(\w+)#(\d+)$/)[0];
      const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
      user = this.users.find(
        (u) => u.username === username && u.discriminator === discriminator
      );
      if (user) return user;
    }
    user = await this.users.fetch(search).catch(() => {});
    return user;
  }

  async resolveMember(search, guild) {
    let member = null;
    if (!search || typeof search !== "string") return;
    // Try ID search
    if (search.match(/^<@!?(\d+)>$/)) {
      const id = search.match(/^<@!?(\d+)>$/)[1];
      member = await guild.members.fetch(id).catch(() => {});
      if (member) return member;
    }
    // Try username search
    if (search.match(/^!?(\w+)#(\d+)$/)) {
      guild = await guild.fetch();
      member = guild.members.cache.find((m) => m.user.tag === search);
      if (member) return member;
    }
    member = await guild.members.fetch(search).catch(() => {});
    return member;
  }

  async resolveRole(search, guild) {
    let role = null;
    if (!search || typeof search !== "string") return;
    // Try ID search
    if (search.match(/^<@&!?(\d+)>$/)) {
      const id = search.match(/^<@&!?(\d+)>$/)[1];
      role = guild.roles.cache.get(id);
      if (role) return role;
    }
    // Try name search
    role = guild.roles.cache.find((r) => search === r.name);
    if (role) return role;
    role = guild.roles.cache.get(search);
    return role;
  }
};
