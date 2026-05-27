import { articleTranslationGroups, articles, evidencePacks } from "@global-import-lab/content";
import type { Article } from "@global-import-lab/types";
import {
  seedArticleCreateData,
  seedEvidencePackCreateData,
  seedTranslationGroupCreateData
} from "./seedArticleRecords";
import type { SeedDbClient } from "./seedTypes";

type SeedEvidencePack = (typeof evidencePacks)[number];
type SeedTranslationGroup = (typeof articleTranslationGroups)[number];

export async function seedEvidencePacks(db: SeedDbClient, packs: SeedEvidencePack[] = evidencePacks) {
  await db.evidencePack.deleteMany({});
  for (const pack of packs) {
    await db.evidencePack.create({
      data: seedEvidencePackCreateData(pack)
    });
  }
}

export async function seedArticles(db: SeedDbClient, seedArticles: Article[] = articles) {
  await db.article.deleteMany({});
  for (const article of seedArticles) {
    await db.article.create({
      data: seedArticleCreateData(article)
    });
  }
}

export async function seedTranslationGroups(
  db: SeedDbClient,
  groups: SeedTranslationGroup[] = articleTranslationGroups
) {
  for (const group of groups) {
    await db.translationGroup.create({
      data: seedTranslationGroupCreateData(group)
    });
  }
}

export {
  seedArticleCreateData,
  seedEvidencePackCreateData,
  seedTranslationGroupCreateData
} from "./seedArticleRecords";
