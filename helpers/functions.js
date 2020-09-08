const crypto = require('crypto');
const {SUCCESS_EMOJI_ID} = process.env;
const yes = [
  'yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya', 'hai', 'si', 'sí', 'oui',
  'はい', 'correct'
];
const no =
    [ 'no', 'n', 'nah', 'nope', 'nop', 'iie', 'いいえ', 'non', 'fuck off' ];
const inviteRegex =
    /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex =
    /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;

const languages = require("../config")
                      .languages.map((l) => l.moment)
                      .filter((l) => l !== "en");
languages.forEach((l) => { require(`moment/locale/${l}.js`); });

module.exports = class Util {
  static delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  static shuffle(array) {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  static list(arr, conj = 'and') {
    const len = arr.length;
    if (len === 0)
      return '';
    if (len === 1)
      return arr[0];
    return `${arr.slice(0, -1).join(', ')}${
        len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
  }

  static shorten(text, maxLen = 2000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
  }

  static randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(`${len} more...`);
    }
    return arr;
  }

  static removeDuplicates(arr) {
    if (arr.length === 0 || arr.length === 1)
      return arr;
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (newArr.includes(arr[i]))
        continue;
      newArr.push(arr[i]);
    }
    return newArr;
  }

  static sortByName(arr, prop) {
    return arr.sort((a, b) => {
      if (prop)
        return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
  }

  static firstUpperCase(text, split = ' ') {
    return text.split(split)
        .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(' ');
  }

  static formatNumber(number, minimumFractionDigits = 0) {
    return Number.parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits : 2,
    });
  }

  static formatNumberK(number) {
    return number > 999 ? `${(number / 1000).toLocaleString(undefined, {
      maximumFractionDigits : 1
    })}K`
                        : number;
  }

  static base64(text, mode = 'encode') {
    if (mode === 'encode')
      return Buffer.from(text).toString('base64');
    if (mode === 'decode')
      return Buffer.from(text, 'base64').toString('utf8') || null;
    throw new TypeError(`${mode} is not a supported base64 mode.`);
  }

  static hash(text, algorithm) {
    return crypto.createHash(algorithm).update(text).digest('hex');
  }

  static streamToArray(stream) {
    if (!stream.readable)
      return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
      function onData(data) { array.push(data); }
      function onEnd(error) {
        if (error)
          reject(error);
        else
          resolve(array);
        cleanup();
      }
      function onClose() {
        resolve(array);
        cleanup();
      }
      function cleanup() {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
      }
      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);
    });
  }

  static percentColor(pct, percentColors) {
    let i = 1;
    for (i; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break;
      }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
      r : Math.floor((lower.color.r * pctLower) + (upper.color.r * pctUpper))
              .toString(16)
              .padStart(2, '0'),
      g : Math.floor((lower.color.g * pctLower) + (upper.color.g * pctUpper))
              .toString(16)
              .padStart(2, '0'),
      b : Math.floor((lower.color.b * pctLower) + (upper.color.b * pctUpper))
              .toString(16)
              .padStart(2, '0'),
    };
    return `#${color.r}${color.g}${color.b}`;
  }

  static today(timeZone) {
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    if (timeZone)
      now.setUTCHours(now.getUTCHours() + timeZone);
    return now;
  }

  static tomorrow(timeZone) {
    const today = Util.today(timeZone);
    today.setDate(today.getDate() + 1);
    return today;
  }

  static embedURL(title, url, display) {
    return `[${title}](${url.replace(/\)/g, '%27')}${
        display ? ` "${display}"` : ''})`;
  }

  static stripInvites(
      str, {guild = true, bot = true, text = '[redacted invite]'} = {}) {
    if (guild)
      str = str.replace(inviteRegex, text);
    if (bot)
      str = str.replace(botInvRegex, text);
    return str;
  }

  static async verify(channel, user,
                      {time = 30000, extraYes = [], extraNo = []} = {}) {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true) &&
             (yes.includes(value) || no.includes(value) ||
              extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages(filter, {
      max : 1,
      time,
    });
    if (!verify.size)
      return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice))
      return true;
    if (no.includes(choice) || extraNo.includes(choice))
      return false;
    return false;
  }

  static async awaitPlayers(msg, max, min = 1) {
    if (max === 1)
      return [ msg.author.id ];
    const addS = min - 1 === 1 ? '' : 's';
    await msg.say(
        `You will need at least ${min - 1} more player${addS} (at max ${
            max - 1}). To join, type \`join game\`.`,
    );
    const joined = [];
    joined.push(msg.author.id);
    const filter = res => {
      if (res.author.bot)
        return false;
      if (joined.includes(res.author.id))
        return false;
      if (res.content.toLowerCase() !== 'join game')
        return false;
      joined.push(res.author.id);
      res.react(SUCCESS_EMOJI_ID || '✅').catch(() => null);
      return true;
    };
    const verify =
        await msg.channel.awaitMessages(filter, {max : max - 1, time : 60000});
    verify.set(msg.id, msg);
    if (verify.size < min)
      return false;
    return verify.map(player => player.author.id);
  }

  static cleanAnilistHTML(html, removeLineBreaks = true) {
    let clean = html;
    if (removeLineBreaks)
      clean = clean.replace(/\r|\n|\f/g, '');
    clean = clean.replace(/<br>/g, '\n')
                .replace(/&#039;/g, '\'')
                .replace(/&quot;/g, '"')
                .replace(/<\/?i>/g, '*')
                .replace(/<\/?b>/g, '**')
                .replace(/~!|!~/g, '||')
                .replace(/&mdash;/g, '—');
    if (clean.length > 2000)
      clean = `${clean.substr(0, 1995)}...`;
    const spoilers = (clean.match(/\|\|/g) || []).length;
    if (spoilers !== 0 && (spoilers && (spoilers % 2)))
      clean += '||';
    return clean;
  }

  /**
   * Gets message prefix
   * @param {object} message The Discord message
   * @returns The prefix
   */
  getPrefix(message, data) {
    if (message.channel.type !== "dm") {
      const prefixes = [
        `<@!${message.client.user.id}> `, `<@${message.client.user.id}> `,
        message.client.user.username.toLowerCase(), data.guild.prefix
      ];
      let prefix = null;
      prefixes.forEach((p) => {
        if (message.content.startsWith(p) ||
            message.content.toLowerCase().startsWith(p)) {
          prefix = p;
        }
      });
      return prefix;
    } else {
      return true;
    }
  }

  // This function return a valid link to the support server
  async supportLink(client) {
    const guild = client.guilds.cache.get(client.config.support.id);
    const member = guild.me;
    const channel = guild.channels.cache.find(
        (ch) => ch.permissionsFor(member.id).has("CREATE_INSTANT_INVITE"));
    if (channel) {
      const invite = await channel.createInvite({maxAge : 0}).catch(() => {});
      return invite ? invite.url : null;
    } else {
      return "https://atlanta-bot.fr";
    }
  }

  // This function sort an array
  sortByKey(array, key) {
    return array.sort(function(a, b) {
      const x = a[key];
      const y = b[key];
      return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  // This function return a shuffled array
  shuffle(pArray) {
    const array = [];
    pArray.forEach(element => array.push(element));
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // This function return a random number between min and max
  randomNum(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

  convertTime(guild, time) {
    const absoluteSeconds = Math.floor((time / 1000) % 60);
    const absoluteMinutes = Math.floor((time / (1000 * 60)) % 60);
    const absoluteHours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const absoluteDays = Math.floor(time / (1000 * 60 * 60 * 24));

    const d = absoluteDays
                  ? absoluteDays === 1
                        ? guild.translate("time:ONE_DAY")
                        : guild.translate("time:DAYS", {amount : absoluteDays})
                  : null;
    const h = absoluteHours ? absoluteHours === 1
                                  ? guild.translate("time:ONE_HOUR")
                                  : guild.translate("time:HOURS",
                                                    {amount : absoluteHours})
                            : null;
    const m =
        absoluteMinutes
            ? absoluteMinutes === 1
                  ? guild.translate("time:ONE_MINUTE")
                  : guild.translate("time:MINUTES", {amount : absoluteMinutes})
            : null;
    const s =
        absoluteSeconds
            ? absoluteSeconds === 1
                  ? guild.translate("time:ONE_SECOND")
                  : guild.translate("time:SECONDS", {amount : absoluteSeconds})
            : null;

    const absoluteTime = [];
    if (d)
      absoluteTime.push(d);
    if (h)
      absoluteTime.push(h);
    if (m)
      absoluteTime.push(m);
    if (s)
      absoluteTime.push(s);

    return absoluteTime.join(", ");
  }
};