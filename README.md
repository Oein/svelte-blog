# svelte-blog

## Settings

1. Use This Repo as template
2. Customize `src/routes/config.ts`
3. Get API KEY from notion [Notion docs / Create your integration in Notion](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)
4. Duplicate this [Notion Template](https://morethanmin.notion.site/12c38b5f459d4eb9a759f92fba6cea36?v=2e7962408e3842b2a1a801bf3546edda)
5. !! Create A page that has `about` slug, and `public` status
6. Link your database to your api [Notoin docs / give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)
7. Setup env key (NOTION_DB_ID, NOTION_API_KEY)
8. Deploy this repo

   You need `Vercel upstash-kv` Linked to your project.
   You can link upstash-kv after deploying first time
   Vercel > Your Project > Storage > Add New > Upstash > KV Storage

9. Get Deploy Hooks URL from vercel

   Vercel > Your Poject > Settings > Git > Deploy Hooks

10. Go to Repo > Settings > Secrets and variables > Actions > Variables
11. Add VERCEL_WEBHOOK_URL as `Step 8`
