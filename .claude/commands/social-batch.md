---
description: Approve drafts, then render, push, and schedule every approved post in scripts/social/queue.yaml
allowed-tools: Bash(python3 scripts/social/render.py:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Bash(curl:*), Bash(sleep:*), Read, Edit, mcp__metricool__*, mcp__claude_ai_Higgsfield__*
---

Run the LuxWeb social batch. Read the "LuxWeb social posts" section of CLAUDE.md first; every rule there applies.

## 0. Approve drafts

Read `scripts/social/queue.yaml`. If any entries have `status: draft` (the weekly demo routine writes its posts this way), show each one before anything else: the id, type, networks, the graphic (template, headline, image), and the base copy with every override, exactly as written. Then ask Kevin which to approve: all, some by id, or none.

For each id Kevin approves, change only that entry's `status:` line to `approved`. Never touch its copy here; if Kevin wants copy changed, he edits it and approves again. Drafts he doesn't approve stay `draft`. If anything was approved, commit it (`git add scripts/social/queue.yaml`, `git commit -m "social: approved <ids>"`); step 4 pushes it.

## 1. Load the queue

Collect entries with `status: approved`, in file order. If there are none, say so and stop. Entries with any other status are not touched.

## 2. Copy check (stop on failure, never rewrite)

For each approved entry, check the base copy and every override against the AI filter in CLAUDE.md: banned words, banned phrases, banned structures (em dashes included). Also check the per-network rules: X under 280 characters, Instagram ends with "link in bio" and 4–5 hashtags, LinkedIn 3 hashtags, Google Business no hashtags and no "link in bio".

Any hit: print the entry id, the network, and the exact offending text, then stop the whole run. Kevin fixes the copy and approves again. This command does not edit copy.

## 3. Graphics

For each entry, by `graphic.template`:

- `text`: `python3 scripts/social/render.py --template text --headline "<headline>" --sub "<sub>" --tag "<tag>" --out <file>`
- `screenshot`: `python3 scripts/social/render.py --template screenshot --headline "<headline>" --image <image> --out <file>`
- `ai`: generate a 1:1 image with the Higgsfield MCP from `graphic.prompt`, wait for the job, download the result, convert to PNG if needed, save as `public/socials/<file>`.

Skip the render if `public/socials/<file>` already exists and the entry says `graphic.keep: true`.

## 4. Push

```
git add public/socials/
git commit -m "social: graphics for <ids>"
git push
```

## 5. Wait for the deploy

For each file, poll `https://luxwebstudio.dev/socials/<file>` with `curl -sI` every 20 seconds until it returns 200, up to 5 minutes. If it never does, stop and report; do not schedule a post whose image isn't live.

## 6. Pick times

Use the Metricool brand `7384487`, timezone `America/New_York`.

1. Call `getScheduledPosts` for the next 14 days to see what's already on the calendar per network.
2. For each network in the entry (`facebook`, `instagram`, `twitter`, `linkedin`, `gmb`), call `getBestTimeToPostByNetwork` for the next 7 days.
3. Choose, per network, the earliest day that (a) is at least 2 hours from now, (b) has no post on that network yet, and (c) keeps that network at three posts or fewer for the week. On that day take the best-scoring hour. If the data is empty for a network, use 10:00 for Google Business and LinkedIn, 12:00 for Facebook and Instagram, 9:00 for X.
4. Entries are scheduled in queue order, so the second approved entry takes the next open day after the first.

Different networks landing on different days or hours for the same entry is fine.

## 7. Schedule

One `createScheduledPost` per network per entry. Media is `https://luxwebstudio.dev/socials/<file>`. Alt text is the graphic's headline and sub joined into one sentence. Text is the override for that network if present, otherwise the base copy.

- facebook: `providers: [{network: facebook}]`, `facebookData: {type: POST}`
- instagram: `instagramData: {type: POST, autoPublish: true, isAiGenerated: false}` (set true if the graphic came from Higgsfield)
- twitter: `twitterData: {type: POST}`
- linkedin: `linkedinData: {type: POST}`
- gmb: `gmbData: {type: publication, buttonType: <gmb_button.type>, buttonLink: <gmb_button.link>}`. If the response echoes back `gmbData` without the button, note it in the summary (Kevin adds it in the planner).

`autoPublish: true`, `draft: false`, `shortener: false`.

## 8. Write back and push

Set the entry to `status: scheduled` and add `result:` with `scheduled_for` per network and the planner URL from each response. Then:

```
git add scripts/social/queue.yaml
git commit -m "social: scheduled <ids>"
git push
```

## 9. Summary

One short block per entry: id, each network with its date and time, the planner link, and any notes (missing button, skipped render, fallback times used). No narration of the steps, just the results.

## Never

- Schedule an entry that isn't `approved`.
- Approve a draft Kevin didn't approve in this run.
- Change approved copy, even to fix a typo. Report it instead.
- Post to TikTok or YouTube from this command.
- Create drafts in Metricool; everything here is real or nothing.
