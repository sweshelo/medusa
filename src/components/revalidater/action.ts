'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateUserData = async (tags: string | string[]) => {
  if (Array.isArray(tags)) {
    tags.forEach(revalidateTag)
  } else {
    revalidateTag(tags)
  }
}

export const revalidatePage = async (path: string) => {
  revalidatePath(encodeURIComponent(path))
}
