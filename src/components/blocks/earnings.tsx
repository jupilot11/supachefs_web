import { Reveal } from "@/components/motion/reveal";
import type { BlockData, Settings } from "@/lib/cms/schemas";
import { isFeeRow, parseAmount, receiveAmount } from "./earnings-math";
import { Section, SectionHeader } from "./shared";

const peso = (n: number) =>
  `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-sand-light py-3.5">
      <dt className="text-secondary">{label}</dt>
      <dd
        className={
          strong
            ? "text-xl font-extrabold text-primary"
            : "font-bold text-primary"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function Earnings({
  id,
  data,
  settings,
}: {
  id: string;
  data: BlockData<"earnings">;
  settings: Settings;
}) {
  const pct = settings.platform_fee_percent;
  // The first row is the worked example. The fee row's "[XX%]" comes from settings, and its
  // amount and the net are derived from the live fee.
  const example = parseAmount(data.rows[0]?.value ?? "");
  const calc = example === null ? null : receiveAmount(example, pct);

  return (
    <Section
      id={id}
      className="bg-off-white"
      inner="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-20"
    >
      <SectionHeader
        eyebrow={data.eyebrow}
        title={data.title}
        body={data.body}
      />
      <Reveal className="rounded-2xl border border-sand-light bg-white p-5 lg:p-8">
        <dl>
          {data.rows.map((r, idx) =>
            isFeeRow(r.label) ? (
              <Row
                key={`${idx}-${r.label}`}
                label={r.label.replace(/\[XX%\]/, `(${pct}%)`)}
                value={calc ? `−${peso(calc.fee)}` : r.value}
              />
            ) : (
              <Row key={`${idx}-${r.label}`} label={r.label} value={r.value} />
            ),
          )}
          {calc && (
            <div className="flex items-baseline justify-between gap-4 pt-4">
              <dt className="font-bold text-primary">You receive</dt>
              <dd className="text-2xl font-extrabold text-orange-dark">
                {peso(calc.net)}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-5 text-sm text-secondary">
          Payouts: {data.payout_schedule} to your {data.payout_method}.
        </p>
      </Reveal>
    </Section>
  );
}
