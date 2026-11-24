import { formatCharge } from "@/lib/notation";

/** Notació ᴬ_Z X amb A i Z apilats a l'esquerra del símbol. */
export default function IsotopeNotation(props: {
  symbol: string;
  a: number;
  z: number;
  charge?: number;
}) {
  const { symbol, a, z, charge = 0 } = props;
  return (
    <span className="inline-flex items-center font-bold" aria-label={`${symbol}, A = ${a}, Z = ${z}`}>
      <span className="mr-0.5 inline-flex flex-col items-end text-[0.5em] leading-[1.1] tabular-nums">
        <span>{a}</span>
        <span>{z}</span>
      </span>
      <span>{symbol}</span>
      {charge !== 0 && (
        <span className="self-start text-[0.5em] leading-none">{formatCharge(charge)}</span>
      )}
    </span>
  );
}
