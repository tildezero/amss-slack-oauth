import { Application, Router, Context, Status, RouterContext } from "https://deno.land/x/oak/mod.ts"
import "https://deno.land/std@0.159.0/dotenv/load.ts"

const router = new Router()

router.get('/', (ctx: Context) => {
    ctx.response.headers.set("Content-Type", "text/html")
    ctx.response.body = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
    />
    <title>Hello world!</title>
  </head>
  <body>
    <main class="container">
      <h1>apple-music-slack-status</h1>
      <p>
        A way to show people what you're listening to on Apple Music in slack
      </p>
      <p>Note: <b>macos only</b> (for now)</p>
      <h2>Features</h2>
      <ul>
        <li>runs on-device</li>
        <li>free</li>
        <li>decently easy to install</li>
        <li>open source</li>
      </ul>
      <h2>Installing</h2>
      <ul>
        <li>Install <a href="https://deno.com">Deno</a></li>
        <li>
          Clone the
          <a href="https://github.com/tildezero/apple-music-slack-status"
            >git repo</a
          >
        </li>
        <li>
          run the <code>./scripts/install.sh</code> script, and follow the
          instructions
        </li>
        <li>profit!</li>
      </ul>
      <h2>Notes and links</h2>
      <ul>
        <li>Link to actually add the bot (don't worry about doing this now since this happens during the install script): <a href="https://suhas.url.lol/amss">suhas.url.lol/amss</a></li>
        <li>
          Source code:
          <a href="https://github.com/tildezero/apple-music-slack-status"
            >github.com/tildezero/apple-music-slack-status</a
          >
        </li>
        <li>
          Heavily inspired by
          <a href="https://github.com/NextFire/apple-music-discord-rpc"
            >NextFire's apple-music-discord-rpc project</a
          >
          on github
        </li>
        <li>created by <a href="https://suhas.one">Suhas</a></li>
        <li>for support: <a href="https://discord.gg/nG6ZyB9sH3">discord server</a></li>
      </ul>
    </main>
  </body>
</html>
    `
})

router.get('/slack-redir', async (ctx: Context) => {
    const code = ctx.request.url.searchParams.get('code')
    const body = new URLSearchParams({'code': code, 'client_id': Deno.env.get('SLACK_CLIENT_ID'), 'client_secret': Deno.env.get('SLACK_CLIENT_SECRET')})
    const req = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        body: body
    })
    const res = await req.json()
    ctx.response.headers.set("Content-Type", "text/html")
    ctx.response.body = `Paste this into the install script: ${res.authed_user.access_token}`
})
const app = new Application;

app.use(router.routes());

app.listen();
