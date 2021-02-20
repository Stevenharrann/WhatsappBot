/*
* "Wahai orang-orang yang beriman, mengapakah kamu mengatakan sesuatu yang tidak kamu kerjakan?
* Amat besar kebencian di sisi Allah bahwa kamu mengatakan apa-apa yang tidak kamu kerjakan."
* (QS ash-Shaff: 2-3).
*/
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const fetch = require('node-fetch') 
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss } = require('./lib/functions')
const { help, snk, info, donate, readme, listChannel } = require('./lib/help')
const { stdout } = require('process')
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess ={
            wait: '[WAIT] In progress⏳ please wait a moment',
            error: {
                St: '[❗] Send images with the caption *! Sticker * or tagged images that have been sent',
                Qm: '[❗] An error occurred, maybe the theme is not available!',
                Yt3: '[❗] An error occurred, unable to convert to mp3!',
                Yt4: '[❗] An error occurred, maybe the error was caused by the system.',
                Ig: '[❗] An error occurred, maybe because the account is private',
                Ki: ` [❗] Bot can't take out the group admin!`,
                Ad: `[❗] Cannot add target, maybe because it's private`,
                Iv: '[❗] The link you submitted is invalid!'
            }
        }
        const apiKey = 'ojEgjhUfw_tTtEq4MBdzPiGEoIjic1fB' // apikey you can get it at https://mhankbarbars.herokuapp.com/api
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
        const ownerNumber = ["79177377"] // replace with your whatsapp number
        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
        switch(command) {
        case '!sticker':
        case '!stiker':
         case '#sticker':
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
        case '!stickergif':
        case '#stickergif':
        case '!sgif':
        case '!sticker':
        case '#animate':
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '[WAIT] Sticker in progress⏳ please wait ± 1 min!', id)
                    const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    })
                } else (
                    client.reply(from, '[❗] Send video with caption *!StickerGif* max 10 sec!', id)
                )
            }
            break
	    case '!stickernobg':
        case '!stikernobg':
	    if (isMedia) {
                try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './media/img/noBg.png'
                    // untuk api key kalian bisa dapatkan pada website remove.bg
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'ojEgjhUfw_tTtEq4MBdzPiGEoIjic1fB', size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
                }
            }
            break
        case '!tts':
             case '#say':
            case '!say':
            if (args.length === 1) return client.reply(from, '*Send command *! Tts "id", "en", "jp", "ar" "text" *, for example *! Tts en hello *')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
	    const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'Baka?', id)
            if (dataText.length > 500) return client.reply(from, 'Text is too long!', id)
            var dataBhs = body.slice(5, 7)
	        if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
	    } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                client.reply(from, 'Enter the language data: "id" for Indonesian, "en" for English, "jp" for Japanese, and "ar" for Arabic, Example: !tts en hi', id)
            }
            break
        case '!creator':
          client.sendLinkWithAutoPreview(from, 'Steven Harran is the Coder of this bot. https://instagram.com/steven_harran')
            break
         case '#hi':
         case '!hi':
            client.sendLinkWithAutoPreview(from, '*Hello*, how are you? Use *!help* to get all the commands list. *Enjoy the bot!*')
break
           case '#nsfw':
            case '!nsfw':
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
            if (!isGroupAdmins) return client.reply(from, 'This command can only be used by the Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Select enable or disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                nsfw_.push(chat.id)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSWF Command has been successfully activated in this group! send command *! nsfwMenu * to find out the menu', id)
            } else if (args[1].toLowerCase() === 'disable') {
                nsfw_.splice(chat.id, 1)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, ' NSFW Command successfully deactivated in this group!', id)
            } else {
                client.reply(from, 'Select enable or disable udin!', id)
            }
            break
        case '!welcome':
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
            if (!isGroupAdmins) return client.reply(from, 'This command can only be used by the Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Select enable or disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'The welcome feature has been successfully activated in this group!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'The welcome feature has been successfully deactivated in this group!', id)
            } else {
                client.reply(from, 'Select enable or disable !', id)
            }
            break
        case '!nsfwmenu':
            if (!isNsfw) return
            client.reply(from, '1. !hentai\n2. !porn\n3. !sex ', id)
        	break
        case '!brainly':
            if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                client.reply(from, `➸ *Question* : ${tanya.split('.')[0]}\n\n➸ *Number of answers* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `➸ *Question* : ${x.pertanyaan}\n\n➸ *Answer* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            client.reply(from, `➸ *Question* : ${x.pertanyaan}\n\n➸ *Answer* : ${x.jawaban.judulJawaban}\n\n➸ *Answer photo link* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                client.reply(from, 'Usage :\n!brainly [question] [.number]\n\nEx : \n!brainly NKRI .2', id)
            }
            break
        case '!wait':
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Searching...', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		client.reply(from, `Sorry, I don't know what anime this is`, id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*I have low faith in this* :\n\n'
                    }
                    teks += `➸ *Title Japanese* : ${title}\n➸ *Title chinese* : ${title_chinese}\n➸ *Title Romaji* : ${title_romaji}\n➸ *Title English* : ${title_english}\n`
                    teks += `➸ *Ecchi* : ${is_adult}\n`
                    teks += `➸ *Eps* : ${episode.toString()}\n`
                    teks += `➸ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', id)
            }
            break
        case '!quotemaker':
            arg = body.trim().split('|')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = encodeURIComponent(arg[1])
                const author = encodeURIComponent(arg[2])
                const theme = encodeURIComponent(arg[3])
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                    })
                })
            } else {
                client.reply(from, `Usage: \n!quotemaker | text |watermark|theme\n\nEx :\n!quotemaker |here's an example | bicit|random`, id)
            }
            break
        case '!linkgroup':
            if (!isBotGroupAdmins) return client.reply(from, 'This command can only be used when the bot becomes admin', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
            	client.reply(from, 'This command can only be used in groups!', id)
            }
            break
        case '!bc':
            if (!isOwner) return client.reply(from, 'This command is for Bot Owners only!', id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `[ STEVEN BOT Broadcast ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', id)
            break
        case '!adminlist':
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break
        case '!ownergroup':
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
        case '!mentionall':
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
            if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Mention All 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 Steven BOT 〙'
            await client.sendTextWithMentions(from, hehe)
            break
        case '!kickall':
            if (!isGroupMsg) return client.reply(from, 'This command can only be used in groups!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, 'This command can only be used by the Owner group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'This command can only be used when the bot becomes admin', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss this is Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            client.reply(from, 'Succes kick all member', id)
            break
        case '!leaveall':
            if (!isOwner) return client.reply(from, 'This order is for Bot Owners only', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Sorry the bot is cleaning, total chat is active : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Success leave all group!', id)
            break
        case '!clearall':
            if (!isOwner) return client.reply(from, 'This order is for Bot Owners only', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Success clear all chat!', id)
            break
        case '!add':
            const orang = args[1]
            if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
            if (args.length === 1) return client.reply(from, 'To use this feature, send the command *! Add * 628xxxxx', id)
            if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
            if (!isBotGroupAdmins) return client.reply(from, 'This command can only be used when the bot becomes admin', id)
            try {
                await client.addParticipant(from,`${orang}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
            case '!kick':
                if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
                if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
                if (!isBotGroupAdmins) return client.reply(from, 'This command can only be used when the bot becomes admin', id)
                if (mentionedJidList.length === 0) return client.reply(from, 'To use this Command, send the command *! Kick * @tagmember', id)
                await client.sendText(from, `Order received, kicking:\n${mentionedJidList.join('\n')}`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                    await client.removeParticipant(groupId, mentionedJidList[i])
                }
            break
        case '!leave':
            if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
            if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
            await client.sendText(from,'Goodbye. I love you.').then(() => client.leaveGroup(groupId))
            break
        case '!promote':
            if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
            if (!isGroupAdmins) return client.reply(from, 'This command can only be used by group admins', id)
            if (!isBotGroupAdmins) return client.reply(from, 'This command can only be used when the bot becomes admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'To use this feature, send the command *! Promote * @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Sorry, this command can only be applied to 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Sorry, the user is already an admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Orders accepted, added@${mentionedJidList[0]} as admin.`)
            break
        case '!demote':
            if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
            if (!isGroupAdmins) return client.reply (from, 'This feature can only be used by group admins', id)
            if (!isBotGroupAdmins) return client.reply (from, 'This feature can only be used when the bot becomes admin', id)
            if (mentionedJidList.length === 0) return client.reply (from, 'To use this feature, send the command *! demote * @tagadmin', id)
            if (!groupAdmins.includes (mentionedJidList [0])) return client.reply (from, 'Sorry, that user is not admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Order received, removing position @${mentionedJidList[0]}.`)
            break
        case '!join':
            //return client.reply(from, 'Jika ingin meng-invite bot ke group anda, silahkan izin ke wa.me/6285892766102', id)
            if (args.length < 2) return client.reply(from, 'Send orders *!join linkgroup key*\n\nEx:\n!join https://chat.whatsapp.com/blablablablablabla', id)
            const link = args[1]
            const key = args[2]
            const tGr = await client.getAllGroups()
            const minMem = 30
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            if (key !== 'lGjYt4zA5SQlTDx9z9Ca') return client.reply(from, '* key * is wrong! please chat the bot owner to get a valid key', id)
            const check = await client.inviteInfo(link)
            if (! isLink) return client.reply (from, 'Is this a link? 👊🤬', id)
            if (tGr.length> 15) return client.reply (from, 'Sorry for the maximum number of groups!', id)
            if (check.size <minMem) return client.reply (from, 'Member group does not exceed 30, bot cannot enter', id)
            if (check.status === 200) {
                await client.joinGroupViaLink (link) .then (() => client.reply (from, 'Bot will be in soon!'))
            } else {
                client.reply (from, 'Invalid group link!', id)
            }
            break
        case '!delete':
            if (!isGroupMsg) return client.reply(from, 'This feature can only be used in groups', id)
            if (! isGroupAdmins) return client.reply (from, 'This feature can only be used by group admins', id)
            if (! quotedMsg) return client.reply (from, 'Wrong !!, send command *! delete [tagpesanbot] *', id)
            if (! quotedMsgObj.fromMe) return client.reply (from, `Wrong !!, Bot can't delete other users' chats!`, id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case '!screenshot':
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', )
            break
        case '!lyrics':
            if (args.length == 1) return client.reply(from, `Send command *! Lyrics "song" *, example *! Lyrics "Dior" *`, id)
            const lagu = body.slice(7)
            const lirik = await liriklagu (lagu)
            client.reply(from, lirik, id)
            break
        case '!chord':
            if (args.length === 1) return client.reply(from, 'Send command *! Chord [query] *, for example *! My chord is not a puppet *', id)
            const query__ = body.slice(7)
            const chord = await get.get(`https://mhankbarbar.herokuapp.com/api/chord?q=${query__}&apiKey=${apiKey}`).json()
            if (chord.error) return client.reply(from, chord.error, id)
            client.reply(from, chord.result, id)
            break
        case '!listblock':
            let hih = `This is list of blocked number\nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, hih, id)
            break
        case '!listchannel':
            client.reply(from, listChannel, id)
            break
        case '!husbu':
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
        case '!hentai':
            if (isGroupMsg) {
         if (!isNsfw) return client.reply(from, 'Command / Command NSFW not activated in this group!', id)
            let number = Math.floor(Math.random() * 75) + 1;

            if(number === 1){
             client.sendFile(from, './media/hentai/5.jpg', '5.jpg')
            } else  if(number === 2){
                client.sendFile(from, './media/hentai/13.jpg', '13.jpg' )            
            } else  if(number === 3){
                client.sendFile(from, './media/hentai/images.jpg', 'images.jpg' )
            } else  if(number === 4){
                client.sendFile(from, './media/hentai/8.jpg', '8.jpg' )                                        
            } else  if(number === 5){
                client.sendFile(from, './media/hentai/download (1).jpg', 'download (1).jpg' )
            } else  if(number === 6){
                client.sendFile(from, './media/hentai/download (2).jpg', 'download (2).jpg' ) 
            } else  if(number === 7){
                client.sendFile(from, './media/hentai/download (3).jpg', 'download (3).jpg' )
            } else  if(number === 8){
                client.sendFile(from, './media/hentai/download (4).jpg', 'download (4).jpg' ) 
            } else  if(number === 9){
                client.sendFile(from, './media/hentai/download (5).jpg', 'download (5).jpg' )
            } else  if(number === 10){
                client.sendFile(from, './media/hentai/download (6).jpg', 'download (6).jpg' )  
            } else  if(number === 11){
                client.sendFile(from, './media/hentai/download (7).jpg', 'download (7).jpg' )
            } else  if(number === 12){
                client.sendFile(from, './media/hentai/download (8).jpg', 'download (8).jpg' ) 
            } else  if(number === 13){
                client.sendFile(from, './media/hentai/download (9).jpg', 'download (9).jpg' )  
            } else  if(number === 14){
                client.sendFile(from, './media/hentai/download (10).jpg', 'download (10).jpg' )
            } else  if(number === 15){
                client.sendFile(from, './media/hentai/download (11).jpg', 'download (11).jpg' ) 
            } else  if(number === 16){
                client.sendFile(from, './media/hentai/download (12).jpg', 'download (12).jpg' )
            } else  if(number === 17){
                client.sendFile(from, './media/hentai/download (13).jpg', 'download (13).jpg' ) 
            } else  if(number === 18){
                client.sendFile(from, './media/hentai/download (14).jpg', 'download (14).jpg' ) 
            } else  if(number === 19){
                client.sendFile(from, './media/hentai/download.jpg', 'download.jpg' )
            } else  if(number === 20){
                client.sendFile(from, './media/hentai/images (1).jpg', 'images (1).jpg' )
            } else  if(number === 21){
                client.sendFile(from, './media/hentai/images (2).jpg', 'images (2).jpg' )  
            } else  if(number === 22){
                client.sendFile(from, './media/hentai/images (3).jpg', 'images (3).jpg' )  
            } else  if(number === 23){
                client.sendFile(from, './media/hentai/images (4).jpg', 'images (4).jpg' )
            } else  if(number === 24){
                client.sendFile(from, './media/hentai/images (5).jpg', 'images (5).jpg' ) 
            } else  if(number === 25){
                client.sendFile(from, './media/hentai/images (6).jpg', 'images (6).jpg' )
            } else  if(number === 26){
                client.sendFile(from, './media/hentai/images (7).jpg', 'images (7).jpg' ) 
            } else  if(number === 27){
                client.sendFile(from, './media/hentai/images (8).jpg', 'images (8).jpg' ) 
            } else  if(number === 28){
                client.sendFile(from, './media/hentai/images (9).jpg', 'images (9).jpg' )
            } else  if(number === 29){
                client.sendFile(from, './media/hentai/images (10).jpg', 'images (10).jpg' ) 
            } else  if(number === 30){
                client.sendFile(from, './media/hentai/images (11).jpg', 'images (11).jpg' ) 
            } else  if(number === 31){
                client.sendFile(from, './media/hentai/images (12).jpg', 'images (12).jpg' )
            } else  if(number === 32){
                client.sendFile(from, './media/hentai/images (13).jpg', 'images (13).jpg' ) 
            } else  if(number === 33){
                client.sendFile(from, './media/hentai/images (14).jpg', 'images (14).jpg' )
            } else  if(number === 34){
                client.sendFile(from, './media/hentai/images (15).jpg', 'images (15).jpg' )
            } else  if(number === 35){
                client.sendFile(from, './media/hentai/images (16).jpg', 'images (16).jpg' ) 
            } else  if(number === 36){
                client.sendFile(from, './media/hentai/images (17).jpg', 'images (17).jpg' )            
            } else  if(number === 37){
                client.sendFile(from, './media/hentai/images (18).jpg', 'images (18).jpg' ) 
            } else  if(number === 38){
                client.sendFile(from, './media/hentai/images (19).jpg', 'images (19).jpg' )
            } else  if(number === 39){
                client.sendFile(from, './media/hentai/images (20).jpg', 'images (20).jpg' )
            } else  if(number === 40){
                client.sendFile(from, './media/hentai/images (21).jpg', 'images (21).jpg' ) 
            } else  if(number === 41){
                client.sendFile(from, './media/hentai/images (22).jpg', 'images (22).jpg' )  
            } else  if(number === 42){
                client.sendFile(from, './media/hentai/images (23).jpg', 'images (23).jpg' )  
            } else  if(number === 43){
                client.sendFile(from, './media/hentai/images (24).jpg', 'images (24).jpg' )  
            } else  if(number === 44){
                client.sendFile(from, './media/hentai/images (25).jpg', 'images (25).jpg' )    
            } else  if(number === 45){
                client.sendFile(from, './media/hentai/images (26).jpg', 'images (26).jpg' )   
            } else  if(number === 46){
                client.sendFile(from, './media/hentai/images (27).jpg', 'images (27).jpg' ) 
            } else  if(number === 47){
                client.sendFile(from, './media/hentai/images (28).jpg', 'images (28).jpg' ) 
            } else  if(number === 48){
                client.sendFile(from, './media/hentai/images (29).jpg', 'images (29).jpg' )
            } else  if(number === 49){
                client.sendFile(from, './media/hentai/images (30).jpg', 'images (30).jpg' ) 
            } else  if(number === 50){
                client.sendFile(from, './media/hentai/images (31).jpg', 'images (31).jpg' )
            } else  if(number === 51){
                client.sendFile(from, './media/hentai/images (32).jpg', 'images (32).jpg' )
            } else  if(number === 52){
                client.sendFile(from, './media/hentai/images (33).jpg', 'images (33).jpg' ) 
            } else  if(number === 53){
                client.sendFile(from, './media/hentai/images (34).jpg', 'images (34).jpg' )  
            } else  if(number === 54){
                client.sendFile(from, './media/hentai/images (35).jpg', 'images (35).jpg' )              
            } else  if(number === 55){
                client.sendFile(from, './media/hentai/images (34).jpg', 'images (34).jpg' )
            } else  if(number === 56){
                client.sendFile(from, './media/hentai/images (35).jpg', 'images (35).jpg' )  
            } else  if(number === 57){
                client.sendFile(from, './media/hentai/images (36).jpg', 'images (36).jpg' ) 
            } else  if(number === 58){
                client.sendFile(from, './media/hentai/images (37).jpg', 'images (30).jpg' )
            } else  if(number === 59){
                client.sendFile(from, './media/hentai/images (38).jpg', 'images (38).jpg' )
            } else  if(number === 60){
                client.sendFile(from, './media/hentai/images (39).jpg', 'images (39).jpg' ) 
            } else  if(number === 61){
                client.sendFile(from, './media/hentai/images (40).jpg', 'images (40).jpg' )
            } else  if(number === 62){
                client.sendFile(from, './media/hentai/images (41).jpg', 'images (41).jpg' )
            } else  if(number === 63){
                client.sendFile(from, './media/hentai/images (43).jpg', 'images (43).jpg' )             
            } else  if(number === 64){
                client.sendFile(from, './media/hentai/images (44).jpg', 'images (44).jpg' )
            } else  if(number === 65){
                client.sendFile(from, './media/hentai/images (45).jpg', 'images (45).jpg' )
            } else  if(number === 66){
                client.sendFile(from, './media/hentai/images (46).jpg', 'images (46).jpg' )
            } else  if(number === 67){
                client.sendFile(from, './media/hentai/images (47).jpg', 'images (47).jpg' )
            } else  if(number === 68){
                client.sendFile(from, './media/hentai/images (48).jpg', 'images (48).jpg' )
            } else  if(number === 69){
                client.sendFile(from, './media/hentai/images (49).jpg', 'images (49).jpg' )
            } else  if(number === 70){
                client.sendFile(from, './media/hentai/images (50).jpg', 'images (50).jpg' ) 
            } else  if(number === 71){
                client.sendFile(from, './media/hentai/images (51).jpg', 'images (51).jpg' )
            } else  if(number === 72){
                client.sendFile(from, './media/hentai/images (52).jpg', 'images (52).jpg' )
            } else  if(number === 73){
                client.sendFile(from, './media/hentai/images (53).jpg', 'images (53).jpg' )
            } else  if(number === 74){
                client.sendFile(from, './media/hentai/images (54).jpg', 'images (54).jpg' )
            } else  if(number === 75){
                client.sendFile(from, './media/hentai/images (55).jpg', 'images (55).jpg' )  
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        
                break}
 
        case '!porn':
        case '!sex':
        case '!nudes':            
        if (isGroupMsg) {
            if (!isNsfw) return client.reply(from, 'Command / Command NSFW not activated in this group!', id) }
           let number = Math.floor(Math.random() * 183) + 1;

           if(number === 1){
            client.sendFile(from, './media/porn/daddysteven.jpg', 'daddysteven.jpg')
           } else  if(number === 2){
            client.sendFile(from, './media/porn/sexxx.gif', 'sexxx.gif' )
           } else  if(number === 3){
            client.sendFile(from, './media/porn/8000D484.gif', '8000D484.gif')
           }
             else if(number === 4){
            client.sendFile(from, './media/porn/1849.gif', '1849.gif')
           } else  if(number === 5){
            client.sendFile(from, './media/porn/1.jpg', '1.jpg')   
           } else  if(number === 6){
            client.sendFile(from, './media/porn/2.jpg', '2.jpg') 
           } else  if(number === 7){
            client.sendFile(from, './media/porn/3.jpg', '3.jpg')
           } else  if(number === 8){
            client.sendFile(from, './media/porn/4.jpg', '4.jpg') 
           } else  if(number === 10){
            client.sendFile(from, './media/porn/5.jpg', '5.jpg')
           } else  if(number === 11){
            client.sendFile(from, './media/porn/6.jpg', '6.jpg')
           } else if(number === 12){
            client.sendFile(from, './media/porn/7.gif', '7.gif')
           } else  if(number === 13){
            client.sendFile(from, './media/porn/8.jpg', '8.jpg')   
           } else  if(number === 14){
            client.sendFile(from, './media/porn/9.jpg', '9.jpg') 
           } else  if(number === 15){
            client.sendFile(from, './media/porn/10.jpg', '10.jpg')
           } else  if(number === 16){
            client.sendFile(from, './media/porn/11.jpg', '11.jpg') 
           } else  if(number === 17){
            client.sendFile(from, './media/porn/12.jpg', '12.jpg')
           } else  if(number === 18){
            client.sendFile(from, './media/porn/13.jpg', '13.jpg') 
           } else  if(number === 19){
            client.sendFile(from, './media/porn/14.jpg', '14.jpg')   
           } else  if(number === 20){
            client.sendFile(from, './media/porn/15.jpg', '15.jpg') 
           } else  if(number === 21){
            client.sendFile(from, './media/porn/16.jpg', '16.jpg')
           } else  if(number === 22){
            client.sendFile(from, './media/porn/17.jpg', '17.jpg') 
           } else  if(number === 23){
            client.sendFile(from, './media/porn/18.jpg', '18.jpg')
           } else  if(number === 24){
            client.sendFile(from, './media/porn/19.jpg', '19.jpg')
           } else if(number === 25){
            client.sendFile(from, './media/porn/20.gif', '20.gif')
           } else  if(number === 26){
            client.sendFile(from, './media/porn/21.jpg', '21.jpg')   
           } else  if(number === 27){
            client.sendFile(from, './media/porn/22.jpg', '22.jpg') 
           } else  if(number === 28){
            client.sendFile(from, './media/porn/23.jpg', '23.jpg')
           } else  if(number === 29){
            client.sendFile(from, './media/porn/24.jpg', '24.jpg') 
           } else  if(number === 30){
            client.sendFile(from, './media/porn/25.jpg', '25.jpg')
           } else  if(number === 31){
            client.sendFile(from, './media/porn/26.jpg', '26.jpg')  
           } else  if(number === 32){
         client.sendFile(from, './media/porn/27.jpg', '27.jpg') 
           } else  if(number === 33){
         client.sendFile(from, './media/porn/28.jpg', '28.jpg')
           } else  if(number === 34){
         client.sendFile(from, './media/porn/29.jpg', '29.jpg') 
           } else  if(number === 35){
         client.sendFile(from, './media/porn/30.jpg', '30.jpg')
           } else  if(number === 36){
         client.sendFile(from, './media/porn/31.jpg', '31.jpg')
           } else if(number === 37){
         client.sendFile(from, './media/porn/32.gif', '32.gif')
           } else  if(number === 39){
         client.sendFile(from, './media/porn/33.jpg', '33.jpg')   
           } else  if(number === 40){
         client.sendFile(from, './media/porn/34.jpg', '34.jpg') 
           } else  if(number === 41){
         client.sendFile(from, './media/porn/35.jpg', '35.jpg')
           } else  if(number === 42){
         client.sendFile(from, './media/porn/36.jpg', '36.jpg') 
           } else  if(number === 43){
         client.sendFile(from, './media/porn/37.jpg', '37.jpg')
           } else  if(number === 44){
         client.sendFile(from, './media/porn/38.jpg', '38.jpg') 
           } else  if(number === 45){
         client.sendFile(from, './media/porn/39.jpg', '39.jpg')   
           } else  if(number === 46){
         client.sendFile(from, './media/porn/40.jpg', '40.jpg') 
           } else  if(number === 47){
         client.sendFile(from, './media/porn/41.jpg', '41.jpg')
           } else  if(number === 48){
         client.sendFile(from, './media/porn/42.jpg', '42.jpg') 
           } else  if(number === 49){
         client.sendFile(from, './media/porn/43.jpg', '43.jpg')
           } else  if(number === 50){
         client.sendFile(from, './media/porn/44.jpg', '44.jpg')
           } else if(number === 51){
         client.sendFile(from, './media/porn/45.gif', '45.gif')
           } else  if(number === 52){
         client.sendFile(from, './media/porn/46.jpg', '46.jpg')   
           } else  if(number === 53){
         client.sendFile(from, './media/porn/47.jpg', '47.jpg') 
           } else  if(number === 54){
         client.sendFile(from, './media/porn/48.jpg', '48.jpg')
           } else  if(number === 55){
         client.sendFile(from, './media/porn/49.jpg', '49.jpg') 
           } else  if(number === 56){
         client.sendFile(from, './media/porn/50.jpg', '50.jpg')
           } else  if(number === 57){
         client.sendFile(from, './media/porn/51.jpg', '51.jpg')
           } else  if(number === 58){
            client.sendFile(from, './media/porn/52.jpg', '52.jpg')   
           } else  if(number === 59){
            client.sendFile(from, './media/porn/53.jpg', '53.jpg') 
           } else  if(number === 60){
            client.sendFile(from, './media/porn/54.jpg', '54.jpg')
           } else  if(number === 61){
            client.sendFile(from, './media/porn/55.jpg', '55.jpg') 
           } else  if(number === 62){
            client.sendFile(from, './media/porn/56.jpg', '56.jpg')
           } else  if(number === 63){
            client.sendFile(from, './media/porn/57.jpg', '57.jpg')
           } else if(number === 64){
            client.sendFile(from, './media/porn/58.gif', '58.gif')
           } else  if(number === 65){
            client.sendFile(from, './media/porn/59.jpg', '59.jpg')   
           } else  if(number === 66){
            client.sendFile(from, './media/porn/60.jpg', '60.jpg') 
           } else  if(number === 67){
            client.sendFile(from, './media/porn/61.jpg', '61.jpg')
           } else  if(number === 68){
            client.sendFile(from, './media/porn/62.jpg', '62.jpg') 
           } else  if(number === 69){
            client.sendFile(from, './media/porn/63.jpg', '63.jpg')
           } else  if(number === 70){
            client.sendFile(from, './media/porn/64.jpg', '64.jpg') 
           } else  if(number === 71){
            client.sendFile(from, './media/porn/65.jpg', '65.jpg')   
           } else  if(number === 72){
            client.sendFile(from, './media/porn/66.jpg', '66.jpg') 
           } else  if(number === 73){
            client.sendFile(from, './media/porn/67.jpg', '67.jpg')
           } else  if(number === 74){
            client.sendFile(from, './media/porn/68.jpg', '68.jpg') 
           } else  if(number === 75){
            client.sendFile(from, './media/porn/69.jpg', '69.jpg')
           } else  if(number === 76){
            client.sendFile(from, './media/porn/70.jpg', '70.jpg')
           } else if(number === 77){
            client.sendFile(from, './media/porn/71.gif', '71.gif')
           } else  if(number === 78){
            client.sendFile(from, './media/porn/72.jpg', '72.jpg')   
           } else  if(number === 79){
            client.sendFile(from, './media/porn/73.jpg', '73.jpg') 
           } else  if(number === 80){
            client.sendFile(from, './media/porn/74.jpg', '74.jpg')
           } else  if(number === 81){
            client.sendFile(from, './media/porn/75.jpg', '75.jpg') 
           } else  if(number === 82){
            client.sendFile(from, './media/porn/76.jpg', '76.jpg')
           } else  if(number === 83){
            client.sendFile(from, './media/porn/77.jpg', '77.jpg')  
           } else  if(number === 84){
         client.sendFile(from, './media/porn/78.jpg', '78.jpg') 
           } else  if(number === 85){
         client.sendFile(from, './media/porn/79.jpg', '79.jpg')
           } else  if(number === 86){
         client.sendFile(from, './media/porn/80.jpg', '80.jpg') 
           } else  if(number === 87){
         client.sendFile(from, './media/porn/81.jpg', '81.jpg')
           } else  if(number === 88){
         client.sendFile(from, './media/porn/82.jpg', '82.jpg')
           } else if(number === 89){
         client.sendFile(from, './media/porn/83.gif', '83.gif')
           } else  if(number === 90){
         client.sendFile(from, './media/porn/84.jpg', '84.jpg')   
           } else  if(number === 91){
         client.sendFile(from, './media/porn/85.jpg', '85.jpg') 
           } else  if(number === 92){
         client.sendFile(from, './media/porn/90.jpg', '90.jpg')
           } else  if(number === 93){
         client.sendFile(from, './media/porn/91.jpg', '91.jpg') 
           } else  if(number === 94){
         client.sendFile(from, './media/porn/92.jpg', '92.jpg')
           } else  if(number === 95){
         client.sendFile(from, './media/porn/93.jpg', '93.jpg') 
           } else  if(number === 96){
         client.sendFile(from, './media/porn/94.jpg', '94.jpg')   
           } else  if(number === 97){
         client.sendFile(from, './media/porn/95.jpg', '95.jpg') 
           } else  if(number === 98){
         client.sendFile(from, './media/porn/96.jpg', '96.jpg')
           } else  if(number === 99){
         client.sendFile(from, './media/porn/97.jpg', '97.jpg') 
           } else  if(number === 100){
         client.sendFile(from, './media/porn/98.jpg', '98.jpg')
           } else  if(number === 101){
         client.sendFile(from, './media/porn/99.jpg', '99.jpg')
           } else if(number === 102){
         client.sendFile(from, './media/porn/100.gif', '100.gif')
           } else  if(number === 103){
         client.sendFile(from, './media/porn/101.jpg', '101.jpg')   
           } else  if(number === 104){
         client.sendFile(from, './media/porn/102.jpg', '102.jpg') 
           } else  if(number === 105){
         client.sendFile(from, './media/porn/103.jpg', '103.jpg')
           } else  if(number === 106){
         client.sendFile(from, './media/porn/104.jpg', '104.jpg') 
           } else  if(number === 107){
         client.sendFile(from, './media/porn/105.jpg', '105.jpg')
           } else  if(number === 108){
         client.sendFile(from, './media/porn/106.jpg', '106.jpg')
           } else  if(number === 109){
            client.sendFile(from, './media/porn/107.jpg', '107.jpg') 
           } else  if(number === 110){
            client.sendFile(from, './media/porn/108.jpg', '108.jpg')
           } else  if(number === 111){
            client.sendFile(from, './media/porn/109.jpg', '109.jpg') 
           } else  if(number === 112){
            client.sendFile(from, './media/porn/110.jpg', '110.jpg')
           } else  if(number === 113){
            client.sendFile(from, './media/porn/111.jpg', '111.jpg')
           } else if(number === 114){
            client.sendFile(from, './media/porn/112.gif', '112.gif')
           } else  if(number === 115){
            client.sendFile(from, './media/porn/113.jpg', '113.jpg')   
           } else  if(number === 116){
            client.sendFile(from, './media/porn/114.jpg', '114.jpg') 
           } else  if(number === 117){
            client.sendFile(from, './media/porn/115.jpg', '115.jpg')
           } else  if(number === 118){
            client.sendFile(from, './media/porn/116.jpg', '116.jpg') 
           } else  if(number === 119){
            client.sendFile(from, './media/porn/117.jpg', '117.jpg')
           } else  if(number === 120){
            client.sendFile(from, './media/porn/118.jpg', '118.jpg')  
           } else  if(number === 121){
         client.sendFile(from, './media/porn/119.jpg', '119.jpg') 
           } else  if(number === 122){
         client.sendFile(from, './media/porn/120.jpg', '120.jpg')
           } else  if(number === 123){
         client.sendFile(from, './media/porn/121.jpg', '122.jpg') 
           } else  if(number === 124){
         client.sendFile(from, './media/porn/123.jpg', '123.jpg')
           } else  if(number === 125){
         client.sendFile(from, './media/porn/124.jpg', '124.jpg')
           } else if(number === 126){
         client.sendFile(from, './media/porn/125.gif', '125.gif')
           } else  if(number === 127){
         client.sendFile(from, './media/porn/126.jpg', '126.jpg')   
           } else  if(number === 128){
         client.sendFile(from, './media/porn/127.jpg', '127.jpg') 
           } else  if(number === 129){
         client.sendFile(from, './media/porn/128.jpg', '128.jpg')
           } else  if(number === 130){
         client.sendFile(from, './media/porn/129.jpg', '129.jpg') 
           } else  if(number === 131){
         client.sendFile(from, './media/porn/130.jpg', '130.jpg')
           } else  if(number === 132){
         client.sendFile(from, './media/porn/131.jpg', '131.jpg') 
           } else  if(number === 133){
         client.sendFile(from, './media/porn/132.jpg', '132.jpg')   
           } else  if(number === 134){
         client.sendFile(from, './media/porn/133.jpg', '133.jpg') 
           } else  if(number === 135){
         client.sendFile(from, './media/porn/134.jpg', '134.jpg')
           } else  if(number === 136){
         client.sendFile(from, './media/porn/135.jpg', '135.jpg') 
           } else  if(number === 137){
         client.sendFile(from, './media/porn/136.jpg', '136.jpg')
           } else  if(number === 138){
         client.sendFile(from, './media/porn/137.jpg', '137.jpg')
           } else if(number === 139){
         client.sendFile(from, './media/porn/138.gif', '138.gif')
           } else  if(number === 140){
         client.sendFile(from, './media/porn/139.jpg', '139.jpg')   
           } else  if(number === 141){
         client.sendFile(from, './media/porn/140.jpg', '140.jpg') 
           } else  if(number === 142){
         client.sendFile(from, './media/porn/141.jpg', '141.jpg')
           } else  if(number === 143){
         client.sendFile(from, './media/porn/142.jpg', '142.jpg') 
           } else  if(number === 144){
         client.sendFile(from, './media/porn/143.jpg', '143.jpg')
           } else  if(number === 145){
         client.sendFile(from, './media/porn/144.jpg', '144.jpg')
        } else  if(number === 146){
            client.sendFile(from, './media/porn/145.jpg', '145.jpg')   
           } else  if(number === 147){
            client.sendFile(from, './media/porn/146.jpg', '146.jpg') 
           } else  if(number === 148){
            client.sendFile(from, './media/porn/147.jpg', '147.jpg')
           } else  if(number === 149){
            client.sendFile(from, './media/porn/148.jpg', '148.jpg') 
           } else  if(number === 150){
            client.sendFile(from, './media/porn/149.jpg', '149.jpg')
           } else  if(number === 151){
            client.sendFile(from, './media/porn/150.jpg', '150.jpg')
           } else if(number === 152){
            client.sendFile(from, './media/porn/151.gif', '151.gif')
           } else  if(number === 153){
            client.sendFile(from, './media/porn/152.jpg', '152.jpg')   
           } else  if(number === 154){
            client.sendFile(from, './media/porn/153.jpg', '153.jpg') 
           } else  if(number === 155){
            client.sendFile(from, './media/porn/154.jpg', '154.jpg')
           } else  if(number === 156){
            client.sendFile(from, './media/porn/155.jpg', '155.jpg') 
           } else  if(number === 157){
            client.sendFile(from, './media/porn/156.jpg', '156.jpg')
           } else  if(number === 158){
            client.sendFile(from, './media/porn/157.jpg', '157.jpg') 
           } else  if(number === 159){
            client.sendFile(from, './media/porn/158.jpg', '158.jpg')   
           } else  if(number === 160){
            client.sendFile(from, './media/porn/159.jpg', '159.jpg') 
           } else  if(number === 161){
            client.sendFile(from, './media/porn/160.jpg', '160.jpg')
           } else  if(number === 162){
            client.sendFile(from, './media/porn/161.jpg', '161.jpg') 
           } else  if(number === 163){
            client.sendFile(from, './media/porn/162.jpg', '162.jpg')
           } else  if(number === 164){
            client.sendFile(from, './media/porn/163.jpg', '163.jpg')
           } else if(number === 165){
            client.sendFile(from, './media/porn/164.gif', '164.gif')
           } else  if(number === 166){
            client.sendFile(from, './media/porn/165.jpg', '165.jpg')   
           } else  if(number === 167){
            client.sendFile(from, './media/porn/166.jpg', '166.jpg') 
           } else  if(number === 168){
            client.sendFile(from, './media/porn/167.jpg', '167.jpg')
           } else  if(number === 169){
            client.sendFile(from, './media/porn/168.jpg', '168.jpg') 
           } else  if(number === 170){
            client.sendFile(from, './media/porn/169.jpg', '169.jpg')
           } else  if(number === 171){
            client.sendFile(from, './media/porn/170.jpg', '170.jpg')  
           } else  if(number === 172){
         client.sendFile(from, './media/porn/171.jpg', '171.jpg') 
           } else  if(number === 173){
         client.sendFile(from, './media/porn/172.jpg', '172.jpg')
           } else  if(number === 174){
         client.sendFile(from, './media/porn/173.jpg', '173.jpg') 
           } else  if(number === 175){
         client.sendFile(from, './media/porn/174.jpg', '174.jpg')
           } else  if(number === 176){
         client.sendFile(from, './media/porn/175.jpg', '175.jpg')
           } else if(number === 177){
         client.sendFile(from, './media/porn/176.gif', '176.gif')
           } else  if(number === 178){
         client.sendFile(from, './media/porn/177.jpg', '177.jpg')   
           } else  if(number === 179){
         client.sendFile(from, './media/porn/178.jpg', '178.jpg') 
           } else  if(number === 180){
         client.sendFile(from, './media/porn/179.jpg', '170.jpg')
           } else  if(number === 181){
         client.sendFile(from, './media/porn/180.jpg', '180.jpg') 
           } else  if(number === 182){
         client.sendFile(from, './media/porn/181.jpg', '181.jpg')
           } else  if(number === 183){
         client.sendFile(from, './media/porn/182.jpg', '182.jpg') 

            }
            break 
      case '!lebanon':            
     
        client.sendFile(from, './media/lebanon/lebanon.png', 'lebanon.png')
        client.sendFile(from, './media/lebanon/lebanese.mp3', 'lebanese.mp3')
        client.sendLinkWithAutoPreview(from,'https://helplebanon.carrd.co')      
          
        break 
        case '!salim':            
     
        client.sendFile(from, './media/salim/1.png', '1.png','SEXY DADDY SALIM')
        client.sendFile(from, './media/salim/2.png', '2.png')
        client.sendFile(from, './media/salim/Salim.mp3', 'Salim.mp3')
        
        break

        case '!donate' :
         case '!donation' :
        client.sendLinkWithAutoPreview(from,'https://helplebanon.carrd.co','https://supportlrc.app/donate') 
       break
       case '!kessemmak' :
        client.sendLinkWithAutoPreview(from,'kess emme')
        break
        case '!lonely' :
            client.sendLinkWithAutoPreview(from,'*Hey you! Talk to me privately here* https://wa.me/message/4DV4R5J63ELYI1')
        break
        case 'daddy' :
        case '!daddy' :
          client.sendLinkWithAutoPreview(from,'daddy chill') 
          client.sendFile(from, './media/wpoff/daddy.mp3', 'daddy.mp3 ')
          break
          case '!israel' :
          case 'israel' :
            client.sendLinkWithAutoPreview(from,'*ayre b Israel*','You mean *Palestine*')             
        break 
      
        case '!cmc':            
     
        client.sendFile(from, './media/cmc/cmc.jpg', 'jpg.png')
        client.sendFile(from, './media/cmc/cmc.mp3', 'cmc.mp3')

        break

        case '!wpoff':            
        case '!kelkonmaslahjiyye':     
        case '!kelkonmaslahjiye':
        client.sendLinkWithAutoPreview(from,'wp off🥀11:11 ØfF🥀mahada yehkine💔kelkon maslahjiyye❌❌💔🥀😈عند المصالح تأتي الكلاب مشتاقة🥀🥀😍you are my best wish🥰👻🌹✨nightsssss🌚🌚🖤')     
        client.sendFile(from, './media/wpoff/3.mp3', '3.mp3')
        client.sendFile(from, './media/wpoff/1.mp3', '1.mp3')
        client.sendFile(from, './media/wpoff/4.mp3', '4.mp3')
        client.sendFile(from, './media/wpoff/5.mp3', '5.mp3')
        
        break

        case '!ayrefik':
        case '!ayrefike':
        case '!erfik':
        case '!erfike':
          client.sendLinkWithAutoPreview(from,'say less')
        client.sendFile(from, './media/wpoff/Er.mp3', 'Er.mp3')
 
        break

      case '!nfo5o':
      case '!nfokho':
        client.sendLinkWithAutoPreview(from,'yalla jeye enf5o')

        break

        case '!skye':
            case '!skye':
                client.sendFile(from, './media/skye/skye.mp3', 'skye.mp3')
                client.sendFile(from, './media/skye/skye.png', 'skye.png')
                client.sendFile(from, './media/skye/skye1.png', 'skye1.png') 
                client.sendFile(from, './media/skye/skye2.png', 'skye2.png')  
                client.sendLinkWithAutoPreview(from,'*ANH*')                                   
              break
              case '!nabil':
                case '!nabilob':
                    client.sendFile(from, './media/nabil/nabil.mp4', 'nabil.mp4')
                    client.sendFile(from, './media/nabil/nabil.png', 'nabil.png', '*ANH*')
                    break
                    case '!berger':
                        case '!bergersalamon':
                            case '!bergersalmon':
                                case '!salmonberger':
                        client.sendFile(from, './media/nabil/nabil.mp4', 'nabil.mp4')
                        client.sendFile(from, './media/berger/berger.mp4', 'berger.mp4')
                        break
                    case '!chapo':
                            client.sendFile(from, './media/chapo/chapo.png', 'chapo.png')
                            client.sendFile(from, './media/chapo/chapo2.png', 'chapo2.png')
                            client.sendFile(from, './media/chapo/chapo3.png', 'chapo3.png')
                            client.sendFile(from, './media/chapo/chapo4.png', 'chapo4.png')
                            client.sendLinkWithAutoPreview(from,'*ANH*')    
                            break                    
        case '!randomanime':
        case '!anime': 
            const nime = await randomNimek('anime') 
            if (nime.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
            break
        case '!dog':
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg')
            break
        case '!cat':
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png')
            break
        case '!sendto':
            client.sendFile(from, './msgHndlr.js', 'msgHndlr.js')
            break
            case '!memes':     
            case '!meme': 
            case '#meme': 
        client.sendLinkWithAutoPreview(from, '*Memes command is still unavailable.* Working on it, *Coming soon...*')
            break  
        case '!help':
        case '!menu':
        case '#menu':
        case '#help':                        
            client.sendText(from, help)
            break
        case '!readme':
            client.reply(from, readme, id)
            break
        case '!info':
            client.sendLinkWithAutoPreview(from, 'Steven Harran is the Coder of this bot. https://instagram.com/steven_harran', info)
            break
        case '!snk':
            client.reply(from, snk, id)
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
