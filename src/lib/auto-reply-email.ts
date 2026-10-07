import { siteConfig } from "@/lib/site-config";

export const AUTO_REPLY_SUBJECT = "Thank you for contacting Anchor Mill Group";

export const AUTO_REPLY_BODY =
  "Thank you so much for your inquiry to work with Anchor Mill Group. We take privacy, security, and your legacy very seriously. A team leader will be in touch with you shortly and we look forward to continuing our discovery of if working together is a good fit.";

/** PNG (not webp) so Outlook and older clients render it. Served from /public. */
export const EMAIL_LOGO_URL = `${siteConfig.url}/email/amg-logo.png`;

const SERIF_STACK = "Georgia, 'Times New Roman', Times, serif";
const BRAND_GOLD = "#8b7d5e";
const INK = "#1f1d1a";
const MUTED = "#6b665c";

const websiteLabel = siteConfig.url.replace(/^https?:\/\//, "");

export const AUTO_REPLY_TEXT = [
  AUTO_REPLY_BODY,
  "",
  "Warm regards,",
  "",
  "Anchor Mill Group",
  "Resilience · Protection · Performance",
  websiteLabel,
  siteConfig.email,
].join("\n");

/** Table-based, inline-styled markup for broad email-client support. */
export const AUTO_REPLY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${AUTO_REPLY_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
<tr><td align="left" style="padding:32px 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="font-family:${SERIF_STACK};font-size:16px;line-height:1.7;color:${INK};padding-bottom:24px;">
${AUTO_REPLY_BODY}
</td></tr>
<tr><td style="font-family:${SERIF_STACK};font-size:16px;line-height:1.7;color:${INK};padding-bottom:28px;">
Warm regards,
</td></tr>
<tr><td style="border-top:1px solid ${BRAND_GOLD};padding-top:20px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td valign="middle" style="padding-right:16px;">
<img src="${EMAIL_LOGO_URL}" width="64" height="64" alt="Anchor Mill Group" style="display:block;border:0;outline:none;text-decoration:none;width:64px;height:64px;">
</td>
<td valign="middle" style="border-left:1px solid ${BRAND_GOLD};padding-left:16px;font-family:${SERIF_STACK};">
<div style="font-size:15px;letter-spacing:2px;text-transform:uppercase;color:${INK};font-weight:bold;">Anchor Mill Group</div>
<div style="font-size:12px;letter-spacing:1px;color:${BRAND_GOLD};font-style:italic;padding-top:2px;">Resilience &middot; Protection &middot; Performance</div>
<div style="font-size:13px;color:${MUTED};padding-top:8px;">
<a href="${siteConfig.url}" style="color:${MUTED};text-decoration:none;">${websiteLabel}</a>
&nbsp;|&nbsp;
<a href="mailto:${siteConfig.email}" style="color:${MUTED};text-decoration:none;">${siteConfig.email}</a>
</div>
</td>
</tr>
</table>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
