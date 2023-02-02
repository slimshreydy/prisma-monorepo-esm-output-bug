import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@prisma-monorepo-output-bug/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) =>
  res.json(await prisma.user.findMany());
