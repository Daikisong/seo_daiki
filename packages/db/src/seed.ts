import { prisma } from "./client";
import { seedAffiliateMerchants, seedAffiliateOffersAndPlacements } from "./seedAffiliateRecords";
import { seedArticles, seedEvidencePacks, seedTranslationGroups } from "./seedArticles";
import { seedProducts } from "./seedProducts";

async function main() {
  await clearSeededTables();

  const affiliateSeed = await seedAffiliateMerchants(prisma);
  await seedProducts(prisma);
  await seedEvidencePacks(prisma);
  await seedArticles(prisma);
  await seedTranslationGroups(prisma);
  await seedAffiliateOffersAndPlacements(prisma, affiliateSeed);
}

async function clearSeededTables() {
  await prisma.affiliatePlacement.deleteMany({});
  await prisma.translationVariant.deleteMany({});
  await prisma.publishingJob.deleteMany({});
  await prisma.translationGroup.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.affiliateProgram.deleteMany({});
  await prisma.merchant.deleteMany({});
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded sample products, evidence packs, and articles.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
