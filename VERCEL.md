# RSVP delivery on Vercel

Vercel builds the Vite frontend and deploys `api/rsvp.ts` as a Node function.
The development Express server is not required for this deployment. The function
writes directly to the configured Google Apps Script webhook and does not write
to the deployment filesystem. The existing local JSON registry, listing, and CSV
export endpoints are not deployed by this change; use Google Sheets for the
central attendee list and export.

Set `GOOGLE_SHEET_WEBHOOK_URL` in the Vercel project's Production environment
variables to the deployed Apps Script web app URL ending in `/exec`. Redeploy
after changing it. Do not use the spreadsheet URL or a `VITE_` variable.

The Apps Script web app must accept unauthenticated server requests, run as its
owner, parse the JSON POST body, and return JSON **after** writing the row:
`{"success":true}` or `{"status":"success"}`. A login page or an error response
is rejected. Review the existing script before changing it; do not replace its
sheet selection or column mapping blindly.

The JSON payload contains timestamp, fullName, tier, guestCount, passCode, email,
phone, seatingZone, prayerIntentions, and status. Consider upserting by passCode
in Apps Script so retries cannot duplicate the same RSVP. A timeout can occur
after a row was written, so check the sheet before retrying an uncertain save.

Deployment uses Node 24 and `npm ci` with the committed npm lockfile. The stale
Bun lockfile has been removed. Local `/api/rsvp` calls use the same handler as
Vercel; local list/export/settings endpoints have been removed; use Google Sheets.

Before public launch:
- Configure the webhook in Production and in Preview only if previews should write
  to a separate test sheet. Never point preview tests at the production sheet.
- Enable a Vercel Firewall rate limit for POST `/api/rsvp` (for example 5 requests
  per minute per IP; adjust for shared parish networks). Input limits do not
  prevent bots. Do not implement an in-memory counter in a serverless function.
- Make the Apps Script write idempotent with a script lock and upsert by passCode.
  `scripts/rsvp-webhook.example.gs` demonstrates this for a new dedicated sheet.
  Adapt the existing script's mapping instead of deploying the example blindly.
- Include `api/rsvp.ts`, `vercel.json`, `package-lock.json`, and the frontend
  changes in the release commit. Untracked files are absent from Git deployments.

Reservation IDs are UUIDs retained across retries and reloads within a browser
tab. Repeated submissions update that reservation when the upstream implements
upserts. A new tab creates a new reservation. Photos stay in the flyer and are
not transmitted to the RSVP function. The API accepts at most 16 KiB of JSON,
20 guests, and bounded text fields. It does not verify admission or payment.

Verification: `npm run lint`, `npm run build`, then deploy and check Vercel's
function logs for `/api/rsvp`. A GET to `/api/rsvp` must return JSON with HTTP 405,
not an HTML page or 404. Finally submit one identifiable test RSVP and confirm
that its row appears in the intended Google Sheet. Local mocked webhook checks
do not establish live Google Sheets delivery.
