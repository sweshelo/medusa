'use server'

import { revalidateTag } from 'next/cache'

export const revalidateUserData = async (tags: string | string[]) => {
  if (Array.isArray(tags)) {
    tags.forEach(revalidateTag)
  } else {
    revalidateTag(tags)
  }
}
