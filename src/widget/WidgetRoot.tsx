import { useMemo, useState } from "react";
import { calculate } from "../core/calculate";
import type { Country } from "../core/types";
import { useLiveRate } from "./hooks/useLiveRate";

const toNumber = (s: string) => (s.trim() === "" ? 0 : Number(s));

export function WidgetRoot() {
  const [country, setCountry] = useState<Country>("KR");

  // inputs stored as string (so user can clear the field)
  const [drop, setDrop] = useState<string>("0.6");
  const [tax, setTax] = useState<string>("5000");

  const [showExtra, setShowExtra] = useState(false);
  const [shippingOverseas, setShippingOverseas] = useState<string>("");
  const [takers, setTakers] = useState<string>("");
  const [otherFee, setOtherFee] = useState<string>("");

  const [rateTouched, setRateTouched] = useState(false);

  // live rate hook
  const live = useLiveRate();

  // initial default rate (optional): keep your old behavior
  // set starting rate string if empty and country is KR
  // (you can remove this if you want blank by default)
  if (country === "KR" && live.rate === "") {
    if (!rateTouched) live.setRate("11.7");
  }

  const onChangeCountry = (c: Country) => {
    setCountry(c);

    // tax defaults (user can set 0 if included)
    if (c === "KR") setTax("5000");
    if (c === "CN") setTax("6000");
    if (c === "JP") setTax("6000");

    // JP doesn't need rate
    if (c === "JP") return;

    // auto fetch rate on change unless user manually set rate
    if (!rateTouched) {
      live.setRate("");
      live.fetchRate(c);
    }
  };

  const result = useMemo(() => {
    return calculate({
      country,
      drop: toNumber(drop),
      rate: country === "JP" ? null : toNumber(live.rate),
      tax: toNumber(tax),
      shippingOverseas: showExtra ? toNumber(shippingOverseas) : 0,
      takers: showExtra ? toNumber(takers) : 0,
      otherFee: showExtra ? toNumber(otherFee) : 0,
      rounding: "none", // keep your calculate signature if still expects rounding
    } as any);
  }, [
    country,
    drop,
    tax,
    showExtra,
    shippingOverseas,
    takers,
    otherFee,
    live.rate,
  ]);

  const formatIDR = (n: number) =>
    "Rp " +
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
      Math.round(n)
    );

  return (
    <div className="go-root">
      <h2 className="go-title">GO Calculator</h2>

      <div className="go-field">
        <label className="go-label">Country</label>
        <select
          className="go-select"
          value={country}
          onChange={(e) => onChangeCountry(e.target.value as Country)}
        >
          <option value="KR">🇰🇷 Korea</option>
          <option value="CN">🇨🇳 China</option>
          <option value="JP">🇯🇵 Japan</option>
        </select>
      </div>

      <div className="go-field">
        <label className="go-label">Drop</label>
        <input
          className="go-input"
          type="number"
          value={drop}
          step={country === "KR" ? "0.1" : "1"}
          onChange={(e) => setDrop(e.target.value)}
        />
      </div>

      {country !== "JP" && (
        <div className="go-field">
          <div className="go-row">
            <div style={{ flex: 1 }}>
              <label className="go-label">Rate</label>
              <input
                className="go-input"
                type="number"
                value={live.rate}
                step="0.01"
                onChange={(e) => {
                  setRateTouched(true);
                  live.setRate(e.target.value);
                }}
              />
            </div>

            <button
              className="go-btn"
              type="button"
              onClick={() => live.fetchRate(country)}
              disabled={live.loading}
            >
              {live.loading ? "Loading..." : "Get Live Rate"}
            </button>
          </div>

          <span className="go-hint">Used to convert currency into IDR.</span>

          {live.error && <div className="go-error">{live.error}</div>}
        </div>
      )}

      <div className="go-field">
        <label className="go-label">Tax</label>
        <input
          className="go-input"
          type="number"
          value={tax}
          step="1000"
          onChange={(e) => setTax(e.target.value)}
        />
        <span className="go-hint">
          Set to 0 if tax is already included in the drop price.
        </span>
      </div>

      <label className="go-toggle">
        <input
          type="checkbox"
          checked={showExtra}
          onChange={(e) => setShowExtra(e.target.checked)}
        />
        Extra Costs (Shipping & Fees)
      </label>

      {showExtra && (
        <div className="go-field">
          <label className="go-label">Total Overseas Shipping</label>
          <input
            className="go-input"
            type="number"
            value={shippingOverseas}
            onChange={(e) => setShippingOverseas(e.target.value)}
          />

          <div style={{ height: 10 }} />

          <label className="go-label">Takers</label>
          <input
            className="go-input"
            type="number"
            value={takers}
            onChange={(e) => setTakers(e.target.value)}
          />
          <span className="go-hint">
            Total participants sharing overseas shipping.
          </span>

          <div style={{ height: 10 }} />

          <label className="go-label">Other Fee (per item)</label>
          <input
            className="go-input"
            type="number"
            value={otherFee}
            onChange={(e) => setOtherFee(e.target.value)}
          />
        </div>
      )}

      <div className="go-card">
        <div>Base: {formatIDR(result.base)}</div>
        <div>Tax: {formatIDR(result.tax)}</div>
        <div>Shipping Share: {formatIDR(result.shippingShare)}</div>
        <div>Other Fee: {formatIDR(result.otherFee)}</div>
        <div className="go-divider" />
        <div className="go-final">Final: {formatIDR(result.total)}</div>
      </div>

      <div className="go-note">
        <div className="go-note-title">⚠ Estimated Calculation</div>
        <div>Actual payment amount may differ slightly.</div>
        <div>
          Exchange rate source: open.er-api.com
          {live.updatedAt && (
            <>
              <br />
              Last updated: {live.updatedAt}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
