# svelte-blog

## Settings

1. Clone This Repo
2. Customize `src/routes/config.ts`
3. Get API KEY from notion
4. Duplicate this [Notion Template](https://morethanmin.notion.site/12c38b5f459d4eb9a759f92fba6cea36?v=2e7962408e3842b2a1a801bf3546edda)
5. Link your database to your api [Notoin docs / give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)
6. Setup env key (NOTION_DB_ID, NOTION_API_KEY)
7. Deploy this repo

   You need `Vercel upstash-kv` Linked to your project.
   You can link upstash-kv after deploying first time
   Vercel > Your Project > Storage > Add New > Upstash > KV Storage

8. Get Deploy Hooks URL from vercel

   Vercel > Your Poject > Settings > Git > Deploy Hooks

9. Go to Repo > Settings > Secrets and variables > Actions > Variables
10. Add VERCEL_WEBHOOK_URL as `Step 8`
