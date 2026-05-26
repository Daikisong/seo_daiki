import type { Locale, MarketRisk } from "@global-import-lab/types";

export function MarketRiskMatrix({ risks, locale }: { risks: MarketRisk[]; locale: Locale }) {
  const visible = risks.filter((risk) => risk.locale === locale || risk.locale === "en");
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Market risk by country</h2>
      <div className="mt-3 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Plug</th>
              <th>Customs</th>
              <th>Certification</th>
              <th>Return</th>
              <th>Local note</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((risk) => (
              <tr key={risk.id}>
                <td>{risk.country ?? risk.locale}</td>
                <td>{risk.plugRisk ?? "unknown"}</td>
                <td>{risk.customsRisk ?? "unknown"}</td>
                <td>{risk.certificationRisk ?? "unknown"}</td>
                <td>{risk.returnRisk ?? "unknown"}</td>
                <td>{risk.localAlternativeNote ?? "No local note yet."}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
