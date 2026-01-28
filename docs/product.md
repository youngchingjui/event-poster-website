# Event Poster Generator

A tool for quickly creating event posters, especially for recurring events like AI Breakfast.

## What it does

**Create posters fast.** Fill in event details (title, date, time, venue) and download a ready-to-share image. The poster looks good on phones and works well for WeChat/social media.

**Remember your settings.** When you come back, your venue, address, and other recurring details are still there. You only change what's different each time (date, topic, episode number).

**Use AI to help.** Eventually, just tell the app what the event is in plain English: "AI Breakfast #28 next Thursday, topic is Claude and computer use." The AI fills in the rest.

**Bring your own images.** Upload background images or QR codes. They're saved for you so you can reuse them later.

**Pull images from the web.** Search Unsplash or other sources for background images without leaving the app.

## How people use it

1. Open the app
2. Adjust the details that changed since last time
3. Click download
4. Share the poster

For new users or one-off events:

1. Fill in all the event details
2. Upload or pick a background image
3. Optionally add a QR code for registration
4. Download and share

## What we save

- **Your event details** - so you don't retype them every time
- **Your uploaded images** - so they're there when you come back (even years later)
- **Event history** - so the AI knows your patterns and can help better

## UX Principles

We follow the ui-ux-pro-max skill (see `.agents/skills/ui-ux-pro-max/SKILL.md`) for general design guidelines. Below are project-specific UX decisions.

### Core Philosophy: Minimize Surprises

Every interaction should feel intuitive. If a user has to stop and think "what just happened?" or "how do I undo this?", we've failed.

### Naming and Defaults

- **Use filename as default name** - When users upload files (images, QR codes, etc.), auto-populate the display name from the original filename. This is the least surprising behavior.
- **Names are always editable** - After upload, show the name in an editable field so users can refine it.
- **Preserve file extension context** - Show meaningful names like "event-photo.jpg" not just "Uploaded image".

### Image Picker Behavior

The image picker should support both presets (pre-loaded images) and user uploads:

1. **Presets display as a grid** - Each preset shows a thumbnail with its name overlaid.
2. **Upload button is always visible** - The "+" upload button should NEVER disappear or be replaced. It remains clickable even after uploading an image.
3. **Uploaded images appear as new tiles** - When a user uploads, add it to the grid as a new selectable option (like presets), don't replace the upload button.
4. **Selection is separate from upload** - Clicking the upload button triggers file selection. Clicking an uploaded image tile selects it.
5. **Preview updates immediately** - The poster preview must reflect the newly selected image without requiring any additional action.
6. **Names can be edited inline** - Each uploaded image tile shows its name (from filename) with an edit affordance.

### State Management

- **Props should flow down** - When a parent passes new data, children must reflect it. Don't cache props in local state that won't update.
- **Optimistic updates** - Show changes immediately while async operations complete in the background.
- **Clear loading states** - Use spinners or skeletons during uploads, never leave users wondering if something is happening.
