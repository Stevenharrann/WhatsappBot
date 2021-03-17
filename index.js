const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')

const startServer = async (client) => {
    global.sclient = client
        console.log('[SERVER] Server Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage((async (message) => {
            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })
            msgHandler(client, message)
        }))

        client.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(client, heuh)
            //left(client, heuh)
            }))
        
        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (!totalMem === 30) {
        } else {
            client.sendText(chat.groupMetadata.id, `Hello *${chat.contact.name}*, Thanks for adding me. Use *!help* to see the menu. Enjoy the bot!`)
        }
    })
   
    // listening on Incoming Call 
    ,client.onIncomingCall((call) => {
          client.sendText(call.peerJid, '*Please stop calling! Call = Block*')
            client.contactBlock(call.peerJid)
            ban.push(call.peerJid)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
        })
        )}

create({"headless": true,
        "cacheEnabled": false,
        "useChrome": true,
        "chromiumArgs": [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--aggressive-cache-discard",
            "--disable-cache",
            "--disable-application-cache",
            "--disable-offline-load-stale-cache",
            "--disk-cache-size=0"
        ]
    })
    
   .then(async (client) => startServer(client))
    .catch((error) => console.log(error))
