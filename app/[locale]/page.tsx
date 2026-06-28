import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Shirt, Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/language-switcher'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const tc = await getTranslations('common')

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
      <div className="absolute top-4 end-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <Shirt className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
            <Link href="/holder/login" className="block">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                  <Smartphone className="w-7 h-7 text-accent" />
                </div>
                <CardTitle>{t('holderTitle')}</CardTitle>
                <CardDescription>{t('holderDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t('holderFeature1')}</li>
                  <li>{t('holderFeature2')}</li>
                  <li>{t('holderFeature3')}</li>
                </ul>
                <Button className="mt-4 w-full" variant="outline">
                  {t('holderCta')}
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
            <Link href="/admin/login" className="block">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Monitor className="w-7 h-7 text-primary" />
                </div>
                <CardTitle>{t('adminTitle')}</CardTitle>
                <CardDescription>{t('adminDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t('adminFeature1')}</li>
                  <li>{t('adminFeature2')}</li>
                  <li>{t('adminFeature3')}</li>
                </ul>
                <Button className="mt-4 w-full">{t('adminCta')}</Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {tc('demoCredentials')}: <code className="bg-muted px-2 py-1 rounded">demo / demo</code>
        </p>
      </div>
    </main>
  )
}
