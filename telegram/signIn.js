import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const resolve = require('path').resolve

const { TelegramClient } = require('telegram')
const { StringSession } = require('telegram/sessions')
const input = require('input') // npm i input

const apiId = 4792862
const apiHash = '1db38acb41a7c8794aaf203564281b12'
const fs = require('fs');

let stringSession = new StringSession(''); // fill this later with the value from session.save()


async function signIn () {
    console.log('Loading interactive example...')
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })
    await client.start({
        phoneNumber: async () => await input.text('number ?'),
        password: async () => await input.text('password?'),
        phoneCode: async () => await input.text('Code ?'),
        onError: (err) => console.log(err),
    });
    console.log('You should now be connected.')
    console.log(client.session.save()) // Save this string to avoid logging in again
    stringSession = client.session.save()
    fs.writeFile('session.txt', stringSession, function (err) {
        if (err) return console.log(err);
    });
    await client.sendMessage('me', { message: 'Hello!' });
}