# iMessage AI Assistant Beta Landing Page

A simple, polished, mobile-friendly static landing page for an invite-only beta AI assistant accessible through iMessage.

## Files

- `index.html` — landing page markup and signup form
- `styles.css` — responsive design system and layout
- `script.js` — lightweight client-side validation

## Form setup

The form currently uses a Formspree placeholder endpoint:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

Before sharing the page, replace `YOUR_FORM_ID` with your real Formspree form ID.

Alternative options:

1. Google Forms: create a Google Form with the questions below, then link the CTA to the form or embed it in place of the HTML form.
2. Netlify Forms: add `data-netlify="true"` to the form and deploy on Netlify instead of GitHub Pages.
3. Custom backend: replace the `action` URL with your own endpoint.

This static page does not store signup data locally beyond normal form submission.

## Deploy to GitHub Pages

### Option A: Deploy from the root of a repository

1. Create a new GitHub repository.
2. Add these files to the repository root:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`
3. Commit and push:

```bash
git init
git add index.html styles.css script.js README.md
git commit -m "Add beta landing page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

4. In GitHub, go to Settings → Pages.
5. Under Build and deployment, choose:
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/root`
6. Save. GitHub will publish the site after the Pages build completes.

### Option B: Deploy from `/docs`

If this sits inside an existing repo, move the files into a `docs/` folder and choose `main` / `docs` in GitHub Pages settings.

## Pre-launch checklist

- Confirm `Contact@domij.info` is the right founder/beta contact email.
- Replace the Formspree placeholder endpoint.
- Publish a dedicated privacy page before sharing widely.
- Test the page on mobile.
- Submit one test signup and confirm the data lands in the chosen form backend.

## Suggested Google Form questions

Required:

1. Name — short answer
2. iMessage account / phone number — short answer
3. Email — short answer with email validation
4. How did you hear about this beta? — short answer
5. What would you most likely use this for? — multiple choice
   - Daily AI assistant
   - Weather / news / stock lookup
   - Emergency contact / escalation plan
   - Productivity / memory / reminders
   - Family / caregiver support
   - Other
6. Are you comfortable receiving proactive messages for onboarding, feedback, and beta improvement? — multiple choice
   - Yes
   - No
7. Consent — checkbox, required
   - I understand this is an invite-only beta. Access requires manual approval. I may receive a confirmation message if approved. I understand this service is experimental and should not replace emergency services, medical advice, legal advice, or financial advice.

Optional:

8. What problem would you most like this assistant to solve for you? — paragraph

## Beta approval message template

Hi {{name}} — you’re approved for the iMessage AI assistant beta.

This is an experimental invite-only beta, so rough edges are expected. You can use it for lightweight help like weather, news, stocks, emergency contacts, emergency emails, and setting up an emergency escalation plan.

To get started, reply here with what you want to try first. If something feels confusing or broken, send feedback directly in this thread.
