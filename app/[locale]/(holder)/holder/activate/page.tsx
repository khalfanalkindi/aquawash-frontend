'use client'

import { useTranslations } from 'next-intl'
import { useStore } from '@/lib/store'
import { useLocalizedName } from '@/hooks/use-localized-name'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToggleRight } from 'lucide-react'
import { getCatalogIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

export default function ActivatePage() {
  const { products, entities, laundryServices, toggleProductActive } = useStore()
  const t = useTranslations('catalog')
  const localize = useLocalizedName()

  const activeCount = products.filter((p) => p.isActive).length

  return (
    <div className="flex flex-col">
      <div className="border-b border-border bg-card/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ToggleRight className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{t('availability')}</h1>
            <p className="text-xs text-muted-foreground">{t('toggleProducts')}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{activeCount} {t('active')}</Badge>
          <Badge variant="outline">{products.length - activeCount} {t('inactive')}</Badge>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-auto p-4 pb-20">
        {products.map((product) => {
          const ProductIcon = getCatalogIcon(product.icon)
          const entity = entities.find((e) => e.id === product.entityId)
          const service = laundryServices.find((s) => s.id === product.serviceId)
          return (
            <Card
              key={product.id}
              className={cn(
                'border-border p-4 transition-all duration-200',
                product.isActive ? 'bg-card shadow-sm' : 'bg-muted/30 opacity-70'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                    product.isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    <ProductIcon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={cn('truncate font-medium', product.isActive ? 'text-foreground' : 'text-muted-foreground')}>
                      {localize(product)}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn('text-sm font-semibold', product.isActive ? 'text-primary' : 'text-muted-foreground')}>
                        {product.price.toFixed(3)} OMR
                      </span>
                      {entity && (
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{localize(entity)}</Badge>
                      )}
                      {service && (
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{localize(service)}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Switch checked={product.isActive} onCheckedChange={() => toggleProductActive(product.id)} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
