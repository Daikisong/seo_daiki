import type { Article } from "@global-import-lab/types";
import { indexStatuses, publishStatuses } from "@/lib/admin/admin-section-config";
import { RecordActionForm } from "./AdminForms";

export function ArticlesSection({ articles }: { articles: Article[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Article</th>
          <th>Locale</th>
          <th>Type</th>
          <th>Index status</th>
          <th>Publish status</th>
          <th>Update</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.id}>
            <td>{article.title}</td>
            <td>{article.locale}</td>
            <td>{article.type}</td>
            <td>{article.indexStatus}</td>
            <td>{article.publishStatus}</td>
            <td>
              <form action="/api/admin/article-status" className="grid min-w-80 gap-2" method="post">
                <input name="id" type="hidden" value={article.id} />
                <input name="returnTo" type="hidden" value="/admin/articles/" />
                <input
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                  name="adminToken"
                  placeholder="Admin token"
                  type="password"
                />
                <div className="grid gap-2 md:grid-cols-3">
                  <select
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                    defaultValue={article.indexStatus}
                    name="indexStatus"
                  >
                    {indexStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                    defaultValue={article.publishStatus}
                    name="publishStatus"
                  >
                    {publishStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                    defaultValue={article.qualityScore}
                    max={100}
                    min={0}
                    name="qualityScore"
                    type="number"
                  />
                </div>
                <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
                  Save
                </button>
              </form>
            </td>
            <td>
              <RecordActionForm entityId={article.id} entityType="article" returnTo="/admin/articles/" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
