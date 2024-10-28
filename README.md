# svelte-blog

## Settings

1. Use This Repo as template
2. Customize `src/routes/config.js`
3. Customize `static/favicon.png`, `static/profileImage.png`, `static/wideBackgroundImage.png`
4. Get API KEY from notion [Notion docs / Create your integration in Notion](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)
5. Duplicate this [Notion Template](https://morethanmin.notion.site/12c38b5f459d4eb9a759f92fba6cea36?v=2e7962408e3842b2a1a801bf3546edda)
6. !! Create A page that has `about` slug, and `public` status
7. Link your database to your api [Notoin docs / give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)
8. Setup env key (NOTION_DB_ID, NOTION_API_KEY)
9. Set env `IS_VERCEL` to `true`
10. Deploy this repo
11. Get Deploy Hooks URL from vercel

    Vercel > Your Poject > Settings > Git > Deploy Hooks

12. Go to Repo > Settings > Secrets and variables > Actions > Variables
13. Add VERCEL_WEBHOOK_URL as `Step 8`
