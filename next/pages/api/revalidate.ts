import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: never, res: NextApiResponse) {
  try {
    await res.unstable_revalidate("/");
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
