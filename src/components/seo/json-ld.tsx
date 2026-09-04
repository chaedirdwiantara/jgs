type Props = {
  /** One schema.org object, or several to emit in a single script block. */
  data: object | object[];
};

/**
 * `<script type="application/ld+json">` for structured data.
 *
 * `<` is escaped so no string inside the payload can close the script tag
 * early — the precaution the Next.js JSON-LD guide recommends, cheap enough
 * to apply even though every payload here is developer-authored.
 */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
