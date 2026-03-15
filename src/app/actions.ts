'use server'

import webpush, { type PushSubscription } from 'web-push'

const VAPID_SUBJECT = 'mailto:nggiang141@gmail.com'

webpush.setVapidDetails(
  VAPID_SUBJECT,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

/** Kiểm tra cấu hình VAPID: subject (email) và key đã được set chưa */
export async function getVapidConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const hasPrivateKey = Boolean(process.env.VAPID_PRIVATE_KEY)
  return {
    subject: VAPID_SUBJECT,
    email: VAPID_SUBJECT.replace('mailto:', ''),
    hasPublicKey: Boolean(publicKey),
    hasPrivateKey,
    publicKeyPreview: publicKey
      ? `${publicKey.slice(0, 10)}...${publicKey.slice(-6)}`
      : null,
  }
}

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}