# svelte-blog

## Settings

1. Use This Repo as template
2. Customize `src/routes/config.js`
3. Customize `static/favicon.png`, `static/profileImage.png`, `static/wideBackgroundImage.png`
4. Get API KEY from notion [Notion docs / Create your integration in Notion](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)
5. Duplicate this [Notion Template](https://oein.notion.site/12f065b0f5e6804397caed565eafeeb3)
6. !! Create A page that has `about` slug, and `public` status
7. Link your database to your api [Notoin docs / give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)
8. Get KV API Code from [https://keyvalue.immanuel.co/api/KeyVal/GetAppKey](https://keyvalue.immanuel.co/api/KeyVal/GetAppKey)
9. Set env `KVCode` to [Step 8]
10. Set env key (`NOTION_DB_ID`, `NOTION_API_KEY`)
11. Set env `IS_VERCEL` to `true`
12. Set env `AUTH` to random chars(recommend to use lowercase, uppercase, numbers only!)
13. Deploy this repo
14. Get Deploy Hooks URL from vercel

    Vercel > Your Poject > Settings > Git > Deploy Hooks

15. Set `BUILD_HOOK` to `Deploy Hook URL` at vercel project's env
16. At Repo > Settings > Secrets and variables > Actions > Variables, Set `VERCEL_WEBHOOK_URL` to `https://your-blog-domain.com/api/rebuild?auth=AUTH_KEY_YOU_SET_FROM_STEP_12`
