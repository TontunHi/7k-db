import { getAllHeroes } from '@/lib/stage-actions'

export default async function sitemap() {
  const baseUrl = 'https://7k-db.com'

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/heroes',
    '/raid',
    '/castle-rush',
    '/total-war',
    '/advent',
    '/arena',
    '/guild-war',
    '/dungeon',
    '/about',
    '/privacy',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Dynamic Hero Routes
  const heroes = await getAllHeroes()
  const heroRoutes = heroes.map((hero) => ({
    url: `${baseUrl}/heroes/${hero.filename.replace(/\.[^/.]+$/, '')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // 3. Dynamic Raid Routes
  const raidKeys = ['destroyer_gaze', 'ox_king', 'iron_devourer']
  const raidRoutes = raidKeys.map((key) => ({
    url: `${baseUrl}/raid/${key}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 4. Dynamic Castle Rush Routes
  const crKeys = ['rachael', 'jave', 'eileene', 'rudy', 'dellons', 'spike', 'kris']
  const crRoutes = crKeys.map((key) => ({
    url: `${baseUrl}/castle-rush/${key}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 5. Dynamic Total War Routes
  const totalWarTiers = ['1', '2', '3', '4']
  const totalWarRoutes = totalWarTiers.map((tier) => ({
    url: `${baseUrl}/total-war/${tier}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 6. Dynamic Advent Routes
  const adventKeys = ['ae_teo', 'ae_kyle', 'ae_yeonhee', 'ae_karma', 'ae_god_of_destruction']
  const adventRoutes = adventKeys.map((key) => ({
    url: `${baseUrl}/advent/${key}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...heroRoutes,
    ...raidRoutes,
    ...crRoutes,
    ...totalWarRoutes,
    ...adventRoutes,
  ]
}
