import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import styles from "./foxy-theme-editor.module.css";

function extractFontName(fontFamily) {
  const match = fontFamily.match(/["']([^"']+)["']/);
  return match ? match[1] : null;
}

function buildGoogleFontsUrl(fontNames, weights) {
  const unique = [...new Set(fontNames.filter(Boolean))];
  if (unique.length === 0) return null;
  const wStr = weights.sort().join(";");
  const params = unique.map(f => `family=${encodeURIComponent(f)}:wght@${wStr}`).join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

const DEFAULT_TOKENS = {
  fontBody: '"Open Sans", sans-serif',
  fontHeading: '"Open Sans", sans-serif',
  fontWeightNormal: "400",
  fontWeightSemi: "600",
  fontWeightBold: "700",

  pageBackground: "#f8f8f8",
  pageText: "#000000",
  pageTextSecondary: "#666666",
  pageHeadingColor: "#000000",
  radius: "5",
  maxWidth: "1200",

  cardBackground: "#ffffff",
  cardBorder: "#eeeeee",

  buttonPrimaryBackground: "#3d9c9e",
  buttonPrimaryLabel: "#ffffff",
  buttonPrimaryBorder: "#3d9c9e",
  buttonPrimaryHoverBackground: "#217f81",
  buttonPrimaryHoverLabel: "#ffffff",
  buttonPrimaryHoverBorder: "#217f81",
  buttonHeight: "40",

  buttonSecondaryBackground: "transparent",
  buttonSecondaryLabel: "#000000",
  buttonSecondaryBorder: "#000000",
  buttonSecondaryHoverBackground: "#3d9c9e",
  buttonSecondaryHoverLabel: "#ffffff",
  buttonSecondaryHoverBorder: "#3d9c9e",

  inputBackground: "#ffffff",
  inputText: "#000000",
  inputBorder: "#000000",
  inputFocus: "#3d9c9e",

  linkColor: "#3d9c9e",
  linkHover: "#217f81",

  successBackground: "#e8f5e9",
  successBorder: "#c8e6c9",
  successText: "#2e7d32",
  warningBackground: "#fff8e1",
  warningBorder: "#ffecb3",
  warningText: "#e65100",
  infoBackground: "#e3f2fd",
  infoBorder: "#bbdefb",
  infoText: "#0d47a1",
  dangerBackground: "#fdecea",
  dangerBorder: "#f5c6cb",
  dangerText: "#b71c1c",

  discountColor: "#3d9c9e",
  iconColor: "#000000",
  iconColorOnButton: "#ffffff",
};

const DARK_PRESET = {
  ...DEFAULT_TOKENS,
  pageBackground: "#0e0e1a",
  pageText: "#d8d8e3",
  pageTextSecondary: "#8585a0",
  pageHeadingColor: "#ededf2",
  cardBackground: "#1a1a2e",
  cardBorder: "#2a2a42",
  buttonPrimaryBackground: "#4ecdc4",
  buttonPrimaryLabel: "#0e0e1a",
  buttonPrimaryBorder: "#4ecdc4",
  buttonPrimaryHoverBackground: "#45b7af",
  buttonPrimaryHoverLabel: "#0e0e1a",
  buttonPrimaryHoverBorder: "#45b7af",
  buttonSecondaryLabel: "#d8d8e3",
  buttonSecondaryBorder: "#3a3a55",
  buttonSecondaryHoverBackground: "#4ecdc4",
  buttonSecondaryHoverLabel: "#0e0e1a",
  buttonSecondaryHoverBorder: "#4ecdc4",
  inputBackground: "#141428",
  inputText: "#d8d8e3",
  inputBorder: "#2a2a42",
  inputFocus: "#4ecdc4",
  linkColor: "#4ecdc4",
  linkHover: "#7eddd7",
  successBackground: "#0d2818",
  successBorder: "#1a4a2e",
  successText: "#6abf6a",
  warningBackground: "#2a1f0a",
  warningBorder: "#4a3518",
  warningText: "#f0a830",
  infoBackground: "#0a1a2e",
  infoBorder: "#18304a",
  infoText: "#6aafdf",
  dangerBackground: "#2e0a0a",
  dangerBorder: "#4a1818",
  dangerText: "#ef6b6b",
  discountColor: "#4ecdc4",
  iconColor: "#d8d8e3",
  iconColorOnButton: "#0e0e1a",
};

function generateCSS(t) {
  const bodyFont = extractFontName(t.fontBody);
  const headingFont = extractFontName(t.fontHeading);
  const weights = [t.fontWeightNormal, t.fontWeightSemi, t.fontWeightBold];
  const fontsUrl = buildGoogleFontsUrl([bodyFont, headingFont], weights);
  const importLine = fontsUrl ? `@import url('${fontsUrl}');\n\n` : "";

  return `${importLine}#fc {

  /* =========================================== */
  /* 1. FONTS                                   */
  /* The typeface                                */
  /* =========================================== */

  --foxy-font-body:                        ${t.fontBody};
  --foxy-font-heading:                     ${t.fontHeading};
  --foxy-font-weight-normal:               ${t.fontWeightNormal};
  --foxy-font-weight-semi:                 ${t.fontWeightSemi};
  --foxy-font-weight-bold:                 ${t.fontWeightBold};



  /* =========================================== */
  /* 2. PAGE                                     */
  /* The background color and text colors         */
  /* =========================================== */

  --foxy-page-background:                  ${t.pageBackground};
  --foxy-page-text:                        ${t.pageText};
  --foxy-page-text-secondary:              ${t.pageTextSecondary};
  --foxy-page-heading-color:               ${t.pageHeadingColor};
  --foxy-radius:                           ${t.radius}px;
  --foxy-max-width:                        ${t.maxWidth}px;


  /* =========================================== */
  /* 3. CARDS                                    */
  /* The panels that hold content                 */
  /* (checkout form, sidebar, receipt sections)   */
  /* =========================================== */

  --foxy-card-background:                  ${t.cardBackground};
  --foxy-card-border:                      ${t.cardBorder};


  /* =========================================== */
  /* 4. PRIMARY BUTTON                           */
  /* The main action buttons — "Checkout",       */
  /* "Submit Order", "Go!"                       */
  /* =========================================== */

  --foxy-button-primary-background:        ${t.buttonPrimaryBackground};
  --foxy-button-primary-label:             ${t.buttonPrimaryLabel};
  --foxy-button-primary-border:            ${t.buttonPrimaryBorder};
  --foxy-button-primary-hover-background:  ${t.buttonPrimaryHoverBackground};
  --foxy-button-primary-hover-label:       ${t.buttonPrimaryHoverLabel};
  --foxy-button-primary-hover-border:      ${t.buttonPrimaryHoverBorder};
  --foxy-button-height:                    ${t.buttonHeight}px;

  /* =========================================== */
  /* 5. SECONDARY BUTTON                         */
  /* Outline buttons — "Continue Shopping",      */
  /* "Print This Page"                           */
  /* =========================================== */

  --foxy-button-secondary-background:      ${t.buttonSecondaryBackground};
  --foxy-button-secondary-label:           ${t.buttonSecondaryLabel};
  --foxy-button-secondary-border:          ${t.buttonSecondaryBorder};
  --foxy-button-secondary-hover-background:${t.buttonSecondaryHoverBackground};
  --foxy-button-secondary-hover-label:     ${t.buttonSecondaryHoverLabel};
  --foxy-button-secondary-hover-border:    ${t.buttonSecondaryHoverBorder};


  /* =========================================== */
  /* 6. TEXT FIELDS                               */
  /* The boxes where customers type               */
  /* (name, email, postal code, quantity)         */
  /* =========================================== */

  --foxy-input-background:                 ${t.inputBackground};
  --foxy-input-text:                       ${t.inputText};
  --foxy-input-border:                     ${t.inputBorder};
  --foxy-input-focus:                      ${t.inputFocus};
  --foxy-input-highlight:                  0 0 0 2px color-mix(in srgb, var(--foxy-input-focus) 15%, transparent);


  /* =========================================== */
  /* 7. LINKS                                    */
  /* Clickable text throughout the store          */
  /* =========================================== */

  --foxy-link-color:                       ${t.linkColor};
  --foxy-link-hover:                       ${t.linkHover};


  /* =========================================== */
  /* 8. ALERTS & MESSAGES                        */
  /* Banners that appear after actions            */
  /* =========================================== */

  /* Success — "Thank you for your order" */
  --foxy-success-background:               ${t.successBackground};
  --foxy-success-border:                   ${t.successBorder};
  --foxy-success-text:                     ${t.successText};

  /* Warning — "Your card is expiring" */
  --foxy-warning-background:               ${t.warningBackground};
  --foxy-warning-border:                   ${t.warningBorder};
  --foxy-warning-text:                     ${t.warningText};

  /* Info — "Session expired, please try again" */
  --foxy-info-background:                  ${t.infoBackground};
  --foxy-info-border:                      ${t.infoBorder};
  --foxy-info-text:                        ${t.infoText};

  /* Error — "Please fix these fields" */
  --foxy-danger-background:                ${t.dangerBackground};
  --foxy-danger-border:                    ${t.dangerBorder};
  --foxy-danger-text:                      ${t.dangerText};


  /* =========================================== */
  /* 9. EXTRAS                                   */
  /* Discount colors, icons, and highlights       */
  /* =========================================== */

  --foxy-discount-color:                   ${t.discountColor};
  --foxy-icon-color:                       ${t.iconColor};
  --foxy-icon-color-on-button:             ${t.iconColorOnButton};
  --foxy-button-highlight:                 0 0 0 3px color-mix(in srgb, var(--foxy-input-focus) 35%, transparent);
}`;
}

function ColorField({ label, value, tokenKey, onChange }) {
  const isTransparent = value === "transparent";
  return (
    <div className={styles.colorField}>
      <input
        type="color"
        value={isTransparent ? "#ffffff" : value}
        disabled={isTransparent}
        onChange={e => onChange(tokenKey, e.target.value)}
        className={isTransparent ? styles.colorSwatchDisabled : styles.colorSwatch}
        aria-label={`${label} color picker`}
      />
      <span className={styles.colorLabel}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(tokenKey, e.target.value)}
        className={styles.colorHexInput}
        aria-label={`${label} hex value`}
      />
    </div>
  );
}

function NumberField({ label, value, tokenKey, onChange, unit = "px" }) {
  return (
    <div className={styles.numberField}>
      <div className={styles.fieldSpacer} />
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.numberInputGroup}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(tokenKey, e.target.value)}
          className={styles.numberInput}
          aria-label={label}
        />
        {unit && <span className={styles.numberUnit}>{unit}</span>}
      </div>
    </div>
  );
}

function TextField({ label, value, tokenKey, onChange }) {
  return (
    <div className={styles.textField}>
      <div className={styles.fieldSpacer} />
      <span className={styles.fieldLabel}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(tokenKey, e.target.value)}
        className={styles.textInput}
        aria-label={label}
      />
    </div>
  );
}

function Section({ title, subtitle, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.sectionWrapper}>
      <button onClick={() => setOpen(!open)} className={styles.sectionButton} aria-expanded={open}>
        <span className={`${styles.sectionArrow} ${open ? styles.sectionArrowOpen : ""}`}>
          &#9654;
        </span>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.sectionSubtitle}>{subtitle}</span>
      </button>
      {open && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
}

function Preview({ t }) {
  const r = parseInt(t.radius) || 5;
  const bh = parseInt(t.buttonHeight) || 40;

  return (
    <div
      className={styles.preview}
      style={{
        background: t.pageBackground,
        maxWidth: parseInt(t.maxWidth) || 1200,
        fontFamily: t.fontBody,
        /* CSS custom properties for dynamic hover/focus states */
        "--pri-bg": t.buttonPrimaryBackground,
        "--pri-label": t.buttonPrimaryLabel,
        "--pri-border": t.buttonPrimaryBorder,
        "--pri-hover": t.buttonPrimaryHoverBackground,
        "--pri-hover-label": t.buttonPrimaryHoverLabel,
        "--pri-hover-border": t.buttonPrimaryHoverBorder,
        "--sec-bg": t.buttonSecondaryBackground,
        "--sec-label": t.buttonSecondaryLabel,
        "--sec-border": t.buttonSecondaryBorder,
        "--sec-hover-bg": t.buttonSecondaryHoverBackground,
        "--sec-hover-label": t.buttonSecondaryHoverLabel,
        "--sec-hover-border": t.buttonSecondaryHoverBorder,
        "--input-focus": t.inputFocus,
        "--input-focus-ring": `${t.inputFocus}26`,
        "--icon-on-btn": t.iconColorOnButton,
      }}
    >
      <div
        className={styles.previewHeading}
        style={{ color: t.pageHeadingColor, fontFamily: t.fontHeading }}
      >
        Checkout Preview
      </div>
      <div className={styles.previewSubheading} style={{ color: t.pageTextSecondary }}>
        See your changes live as you edit
      </div>

      <div className={styles.previewGrid}>
        <div style={{ background: t.cardBackground, borderRadius: r }}>
          <div className={styles.previewCard}>
            <div
              className={styles.previewCardHeading}
              style={{ color: t.pageHeadingColor, fontFamily: t.fontHeading }}
            >
              Shipping Details
            </div>

            <div className={styles.previewFieldGroup}>
              <label className={styles.previewFieldLabel} style={{ color: t.pageTextSecondary }}>
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Jane Doe"
                className={styles.previewInput}
                style={{
                  background: t.inputBackground,
                  color: t.inputText,
                  borderColor: t.inputBorder,
                  borderRadius: r,
                }}
              />
            </div>

            <div className={styles.previewFieldGroup}>
              <label className={styles.previewFieldLabel} style={{ color: t.pageTextSecondary }}>
                Email
              </label>
              <input
                type="text"
                defaultValue="jane@example.com"
                readOnly
                className={styles.previewInput}
                style={{
                  background: t.inputBackground,
                  color: t.inputText,
                  borderColor: t.inputBorder,
                  borderRadius: r,
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label className={styles.previewFieldLabel} style={{ color: t.pageTextSecondary }}>
                Country
              </label>
              <select
                className={styles.previewSelect}
                style={{
                  background: t.inputBackground,
                  color: t.inputText,
                  borderColor: t.inputBorder,
                  borderRadius: r,
                }}
              >
                <option>United States</option>
              </select>
            </div>

            <a
              href="#"
              onClick={e => e.preventDefault()}
              className={styles.previewLink}
              style={{ color: t.linkColor }}
            >
              Use a different address
            </a>

            <div className={styles.previewButtonRow} style={{ borderTopColor: t.cardBorder }}>
              <button className={styles.previewPrimaryBtn} style={{ borderRadius: r, height: bh }}>
                Submit Order
                <svg
                  className={styles.previewIcon}
                  viewBox="0 0 20 20"
                  fill="var(--icon-on-btn)"
                  aria-hidden="true"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </button>
              <button
                className={styles.previewSecondaryBtn}
                style={{ borderRadius: r, height: bh }}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div
          className={styles.previewSidebar}
          style={{ background: t.cardBackground, borderRadius: r }}
        >
          <div
            className={styles.previewSidebarHeading}
            style={{ color: t.pageHeadingColor, fontFamily: t.fontHeading }}
          >
            <svg
              className={styles.previewIcon}
              viewBox="0 0 20 20"
              fill={t.iconColor}
              aria-hidden="true"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zm13 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Order Summary
          </div>
          {[
            ["Narwhal Tee", "$24.99"],
            ["Shark Hoodie", "$39.99"],
          ].map(([name, price]) => (
            <div
              key={name}
              className={styles.previewLineItem}
              style={{ borderBottomColor: t.cardBorder }}
            >
              <div className={styles.previewItemName} style={{ color: t.pageText }}>
                {name}
              </div>
              <div className={styles.previewItemQty} style={{ color: t.pageTextSecondary }}>
                Qty: 1
              </div>
              <div className={styles.previewItemPrice} style={{ color: t.pageText }}>
                {price}
              </div>
            </div>
          ))}
          <div className={styles.previewSummaryRow}>
            <span className={styles.previewSummaryLabel} style={{ color: t.pageTextSecondary }}>
              Subtotal
            </span>
            <span className={styles.previewSummaryValue} style={{ color: t.pageText }}>
              $64.98
            </span>
          </div>
          <div className={styles.previewSummaryRow}>
            <span className={styles.previewSummaryLabel} style={{ color: t.discountColor }}>
              Discount
            </span>
            <span className={styles.previewSummaryValue} style={{ color: t.discountColor }}>
              -$5.00
            </span>
          </div>
          <div className={styles.previewTotalRow} style={{ borderTopColor: t.cardBorder }}>
            <span className={styles.previewTotalLabel} style={{ color: t.pageText }}>
              Total
            </span>
            <span className={styles.previewTotalValue} style={{ color: t.pageText }}>
              $59.98
            </span>
          </div>
        </div>
      </div>

      <div className={styles.previewAlertGrid}>
        {[
          ["Order confirmed", t.successBackground, t.successBorder, t.successText],
          ["Fix these fields", t.dangerBackground, t.dangerBorder, t.dangerText],
          ["Card expiring soon", t.warningBackground, t.warningBorder, t.warningText],
          ["Session expired", t.infoBackground, t.infoBorder, t.infoText],
        ].map(([msg, bg, bd, txt]) => (
          <div
            key={msg}
            className={styles.previewAlert}
            style={{ background: bg, borderColor: bd, borderRadius: r }}
          >
            <span className={styles.previewAlertText} style={{ color: txt }}>
              {msg}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.previewFooter} style={{ color: t.pageTextSecondary }}>
        by{" "}
        <a
          href="https://foxy.io"
          className={styles.previewFooterLink}
          style={{ color: t.linkColor }}
        >
          Foxy
        </a>
      </div>
    </div>
  );
}

export default function FoxyThemeEditor() {
  const [tokens, setTokens] = useState({ ...DEFAULT_TOKENS });
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const codeRef = useRef(null);
  const fileInputRef = useRef(null);

  const update = useCallback((key, value) => {
    setTokens(prev => ({ ...prev, [key]: value }));
  }, []);

  const css = useMemo(() => generateCSS(tokens), [tokens]);

  useEffect(() => {
    const bodyFont = extractFontName(tokens.fontBody);
    const headingFont = extractFontName(tokens.fontHeading);
    const weights = [tokens.fontWeightNormal, tokens.fontWeightSemi, tokens.fontWeightBold];
    const url = buildGoogleFontsUrl([bodyFont, headingFont], weights);

    let link = document.getElementById("foxy-google-fonts");
    if (!url) {
      if (link) link.remove();
      return;
    }
    if (!link) {
      link = document.createElement("link");
      link.id = "foxy-google-fonts";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [
    tokens.fontBody,
    tokens.fontHeading,
    tokens.fontWeightNormal,
    tokens.fontWeightSemi,
    tokens.fontWeightBold,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
      }
      setShowCode(true);
      setCopyFallback(true);
      setTimeout(() => setCopyFallback(false), 4000);
    }
  };

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "foxy-theme.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [tokens]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        setTokens({ ...DEFAULT_TOKENS, ...imported });
      } catch {
        alert("Invalid JSON file — please export a theme first and use that format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <div>
          <h1 className={styles.editorTitle}>Foxy Theme Editor</h1>
          <p className={styles.editorSubtitle}>
            Customize your template styles, then copy the CSS into your Foxy custom header.
          </p>
        </div>
        <div className={styles.headerButtons}>
          <button
            onClick={() => setTokens({ ...DEFAULT_TOKENS })}
            className={styles.presetButton}
            style={{ background: "#3d9c9e", borderColor: "#3d9c9e", color: "#fff" }}
          >
            Teal
          </button>
          <button
            onClick={() => setTokens({ ...DARK_PRESET })}
            className={styles.presetButton}
            style={{ background: "#1a1a2e", borderColor: "#1a1a2e", color: "#4ecdc4" }}
          >
            Dark
          </button>
          <button onClick={handleExport} className={styles.exportButton}>
            Export
          </button>
          <button onClick={handleImport} className={styles.importButton}>
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: "none" }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className={styles.editorGrid}>
        <div className={styles.controlsPanel}>
          <Section title="Fonts" subtitle="Typefaces & weights">
            <TextField
              label="Body font"
              value={tokens.fontBody}
              tokenKey="fontBody"
              onChange={update}
            />
            <TextField
              label="Heading font"
              value={tokens.fontHeading}
              tokenKey="fontHeading"
              onChange={update}
            />
            <NumberField
              label="Weight normal"
              value={tokens.fontWeightNormal}
              tokenKey="fontWeightNormal"
              onChange={update}
              unit=""
            />
            <NumberField
              label="Weight semi"
              value={tokens.fontWeightSemi}
              tokenKey="fontWeightSemi"
              onChange={update}
              unit=""
            />
            <NumberField
              label="Weight bold"
              value={tokens.fontWeightBold}
              tokenKey="fontWeightBold"
              onChange={update}
              unit=""
            />
          </Section>

          <Section title="Page" subtitle="Background & text">
            <ColorField
              label="Background"
              value={tokens.pageBackground}
              tokenKey="pageBackground"
              onChange={update}
            />
            <ColorField
              label="Text"
              value={tokens.pageText}
              tokenKey="pageText"
              onChange={update}
            />
            <ColorField
              label="Text secondary"
              value={tokens.pageTextSecondary}
              tokenKey="pageTextSecondary"
              onChange={update}
            />
            <ColorField
              label="Heading color"
              value={tokens.pageHeadingColor}
              tokenKey="pageHeadingColor"
              onChange={update}
            />
            <NumberField
              label="Border radius"
              value={tokens.radius}
              tokenKey="radius"
              onChange={update}
            />
            <NumberField
              label="Max width"
              value={tokens.maxWidth}
              tokenKey="maxWidth"
              onChange={update}
            />
          </Section>

          <Section title="Cards" subtitle="Panels & containers">
            <ColorField
              label="Background"
              value={tokens.cardBackground}
              tokenKey="cardBackground"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.cardBorder}
              tokenKey="cardBorder"
              onChange={update}
            />
          </Section>

          <Section title="Primary button" subtitle="Checkout, Submit, Go!">
            <ColorField
              label="Background"
              value={tokens.buttonPrimaryBackground}
              tokenKey="buttonPrimaryBackground"
              onChange={update}
            />
            <ColorField
              label="Label"
              value={tokens.buttonPrimaryLabel}
              tokenKey="buttonPrimaryLabel"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.buttonPrimaryBorder}
              tokenKey="buttonPrimaryBorder"
              onChange={update}
            />
            <ColorField
              label="Hover fill"
              value={tokens.buttonPrimaryHoverBackground}
              tokenKey="buttonPrimaryHoverBackground"
              onChange={update}
            />
            <ColorField
              label="Hover label"
              value={tokens.buttonPrimaryHoverLabel}
              tokenKey="buttonPrimaryHoverLabel"
              onChange={update}
            />
            <ColorField
              label="Hover border"
              value={tokens.buttonPrimaryHoverBorder}
              tokenKey="buttonPrimaryHoverBorder"
              onChange={update}
            />
            <NumberField
              label="Height"
              value={tokens.buttonHeight}
              tokenKey="buttonHeight"
              onChange={update}
            />
          </Section>

          <Section title="Secondary button" subtitle="Continue Shopping, Print">
            <ColorField
              label="Background"
              value={tokens.buttonSecondaryBackground}
              tokenKey="buttonSecondaryBackground"
              onChange={update}
            />
            <ColorField
              label="Label"
              value={tokens.buttonSecondaryLabel}
              tokenKey="buttonSecondaryLabel"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.buttonSecondaryBorder}
              tokenKey="buttonSecondaryBorder"
              onChange={update}
            />
            <ColorField
              label="Hover fill"
              value={tokens.buttonSecondaryHoverBackground}
              tokenKey="buttonSecondaryHoverBackground"
              onChange={update}
            />
            <ColorField
              label="Hover label"
              value={tokens.buttonSecondaryHoverLabel}
              tokenKey="buttonSecondaryHoverLabel"
              onChange={update}
            />
            <ColorField
              label="Hover border"
              value={tokens.buttonSecondaryHoverBorder}
              tokenKey="buttonSecondaryHoverBorder"
              onChange={update}
            />
          </Section>

          <Section title="Text fields" subtitle="Inputs, selects, quantity">
            <ColorField
              label="Background"
              value={tokens.inputBackground}
              tokenKey="inputBackground"
              onChange={update}
            />
            <ColorField
              label="Text"
              value={tokens.inputText}
              tokenKey="inputText"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.inputBorder}
              tokenKey="inputBorder"
              onChange={update}
            />
            <ColorField
              label="Focus color"
              value={tokens.inputFocus}
              tokenKey="inputFocus"
              onChange={update}
            />
          </Section>

          <Section title="Links" subtitle="Clickable text">
            <ColorField
              label="Color"
              value={tokens.linkColor}
              tokenKey="linkColor"
              onChange={update}
            />
            <ColorField
              label="Hover"
              value={tokens.linkHover}
              tokenKey="linkHover"
              onChange={update}
            />
          </Section>

          <Section title="Alerts" subtitle="Success, warning, info, error">
            <div className={styles.sectionSubheading}>Success</div>
            <ColorField
              label="Background"
              value={tokens.successBackground}
              tokenKey="successBackground"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.successBorder}
              tokenKey="successBorder"
              onChange={update}
            />
            <ColorField
              label="Text"
              value={tokens.successText}
              tokenKey="successText"
              onChange={update}
            />
            <div className={styles.sectionSubheadingSpaced}>Warning</div>
            <ColorField
              label="Background"
              value={tokens.warningBackground}
              tokenKey="warningBackground"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.warningBorder}
              tokenKey="warningBorder"
              onChange={update}
            />
            <ColorField
              label="Text"
              value={tokens.warningText}
              tokenKey="warningText"
              onChange={update}
            />
            <div className={styles.sectionSubheadingSpaced}>Info</div>
            <ColorField
              label="Background"
              value={tokens.infoBackground}
              tokenKey="infoBackground"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.infoBorder}
              tokenKey="infoBorder"
              onChange={update}
            />
            <ColorField
              label="Text"
              value={tokens.infoText}
              tokenKey="infoText"
              onChange={update}
            />
            <div className={styles.sectionSubheadingSpaced}>Error</div>
            <ColorField
              label="Background"
              value={tokens.dangerBackground}
              tokenKey="dangerBackground"
              onChange={update}
            />
            <ColorField
              label="Border"
              value={tokens.dangerBorder}
              tokenKey="dangerBorder"
              onChange={update}
            />
            <ColorField
              label="Text"
              value={tokens.dangerText}
              tokenKey="dangerText"
              onChange={update}
            />
          </Section>

          <Section title="Extras" subtitle="Discounts, icons">
            <ColorField
              label="Discount color"
              value={tokens.discountColor}
              tokenKey="discountColor"
              onChange={update}
            />
            <ColorField
              label="Icon color"
              value={tokens.iconColor}
              tokenKey="iconColor"
              onChange={update}
            />
            <ColorField
              label="Icon on button"
              value={tokens.iconColorOnButton}
              tokenKey="iconColorOnButton"
              onChange={update}
            />
          </Section>
        </div>

        <div>
          <Preview t={tokens} />

          <div className={styles.codeSection}>
            <div className={styles.codeButtonRow}>
              <button
                onClick={handleCopy}
                className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ""}`}
              >
                {copied ? "Copied to clipboard!" : "Copy CSS to clipboard"}
              </button>
              <button onClick={() => setShowCode(!showCode)} className={styles.toggleCodeButton}>
                {showCode ? "Hide" : "Show"} CSS
              </button>
            </div>
            {copyFallback && (
              <div className={styles.copyFallbackMsg}>
                Auto-copy not available — the CSS is selected above. Press Ctrl+C (or Cmd+C) to
                copy.
              </div>
            )}
            {showCode && (
              <pre ref={codeRef} className={styles.codeBlock}>
                {css}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
