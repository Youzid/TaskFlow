import { createApi } from "unsplash-js";

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSLPASH_ACCESS_KEY!,
  fetch: fetch,
});
