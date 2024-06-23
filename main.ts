import { Application, Router, Context, Status, RouterContext } from "https://deno.land/x/oak/mod.ts"
import "https://deno.land/std@0.159.0/dotenv/load.ts"

const router = new Router()

router.get('/', (ctx: Context) => {
    ctx.response.headers.set("Content-Type", "text/html")
    ctx.response.body = `
        <h1>apple-music-slack-status</h1>
        <p>a way to show people what you're listening to in slack, powered by jxa</p>
        <a href="https://github.com/tildezero/apple-music-slack-status">install instructions</a>
        <p> created by <a href="https://suhas.one">suhas</a></p>
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
