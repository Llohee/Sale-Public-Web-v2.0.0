// import NextLink from 'next/link'
// import { Error404 } from '@/share/icons'
// import { Button } from '@/share/ui/button'
// import {
//   Empty,
//   EmptyContent,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyTitle,
// } from '@/share/ui/empty'
// import FullPageLayout from './layout'
// import { useTranslations } from 'next-intl'

// type NotFound404Props = {
//   message?: string
//   code?: string
// }

// export default function NotFound404(props?: NotFound404Props) {
//   const messageProp = props?.message
//   const codeProp = props?.code
//   const t = useTranslations('common')

//   return (
//     <FullPageLayout>
//       <Empty>
//         <EmptyHeader>
//           <Error404 className="size-[144px]" />
//         </EmptyHeader>
//         <EmptyContent>
//           <EmptyTitle>{t('error.title')}</EmptyTitle>
//           <EmptyDescription>
//             {messageProp ?? t('error.description')}
//           </EmptyDescription>
//           <EmptyDescription className="text-grey-6">
//             {t('error.code')}: {codeProp ?? '404'}
//           </EmptyDescription>
//         </EmptyContent>
//         <Button variant="default" size="sm" rounded asChild>
//           <NextLink href="/">{t('btn.got_it')}</NextLink>
//         </Button>
//       </Empty>
//     </FullPageLayout>
//   )
// }
