import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@prisma-monorepo-esm-output-bug/package/dist";

export default async (req: NextApiRequest, res: NextApiResponse) =>
  res.json(await prisma.user.findMany());
