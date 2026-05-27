import assert from "node:assert/strict";
import { mapDbArticle as directArticleMapper } from "../packages/db/src/contentRepositoryArticleMapper";
import { mapDbEvidencePack as directEvidenceMapper } from "../packages/db/src/contentRepositoryEvidenceMapper";
import { mapDbProduct as directProductMapper } from "../packages/db/src/contentRepositoryProductMapper";
import {
  mapDbArticle,
  mapDbEvidencePack,
  mapDbProduct
} from "../packages/db/src/contentRepositoryMappers";

assert.strictEqual(mapDbArticle, directArticleMapper);
assert.strictEqual(mapDbProduct, directProductMapper);
assert.strictEqual(mapDbEvidencePack, directEvidenceMapper);

console.log("Content repository mapper module export tests passed");
