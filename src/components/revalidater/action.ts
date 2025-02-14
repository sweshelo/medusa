'use server'

import { revalidateTag } from 'next/cache'

export const revalidateUserData = async (user: string) => {
  revalidateTag(user)
}
