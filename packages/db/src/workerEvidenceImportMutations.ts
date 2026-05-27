export type WorkerEvidenceChildDelegate = {
  create(args: any): Promise<unknown>;
  deleteMany(args: any): Promise<unknown>;
};

export type WorkerEvidenceTransaction = {
  product: {
    upsert(args: any): Promise<unknown>;
  };
  variant: WorkerEvidenceChildDelegate;
  sellerClaim: WorkerEvidenceChildDelegate;
  verifiedClaim: WorkerEvidenceChildDelegate;
  reviewSignal: WorkerEvidenceChildDelegate;
  priceSnapshot: WorkerEvidenceChildDelegate;
  marketRisk: WorkerEvidenceChildDelegate;
  evidencePack: WorkerEvidenceChildDelegate;
};

export async function upsertWorkerProduct(
  tx: WorkerEvidenceTransaction,
  productId: string,
  productData: Record<string, unknown>
) {
  await tx.product.upsert({
    where: { id: productId },
    update: productData,
    create: {
      id: productId,
      ...productData
    }
  });
}

export async function clearWorkerEvidenceForProduct(tx: WorkerEvidenceTransaction, productId: string) {
  await tx.variant.deleteMany({ where: { productId } });
  await tx.sellerClaim.deleteMany({ where: { productId } });
  await tx.verifiedClaim.deleteMany({ where: { productId } });
  await tx.reviewSignal.deleteMany({ where: { productId } });
  await tx.priceSnapshot.deleteMany({ where: { productId } });
  await tx.marketRisk.deleteMany({ where: { productId } });
  await tx.evidencePack.deleteMany({ where: { productId } });
}
