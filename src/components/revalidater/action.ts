'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateUserData = async (tags: string | string[]) => {
  if (Array.isArray(tags)) {
    tags.forEach((tag) => {
      revalidateTag(tag, 'max')
    })
  } else {
    revalidateTag(tags, 'max')
  }
}

export const revalidatePage = async (path: string) => {
  revalidatePath(path)
}
