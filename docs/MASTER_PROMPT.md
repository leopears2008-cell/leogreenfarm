# MASTER PROMPT — Leo Green Farm 90+/100 Production Upgrade

## ROLE

Act as a senior full-stack engineer, agricultural technology product designer, QA engineer, and application security reviewer.

Your task is to upgrade the existing Leo Green Farm project into a professional, reliable, responsive, production-ready agricultural intelligence platform for farmers in Tamil Nadu.

Goal: Achieve a verified quality score of at least 90/100 through working code, reliable features, excellent UI/UX, accessibility, security, performance, and documentation.

Do not merely produce a plan, mockup, report, or recommendations. Inspect the existing repository and implement the necessary improvements.

## 1. NON-NEGOTIABLE RULES

- Preserve the existing project identity, useful functionality, and working components.
- Make minimal, purposeful changes rather than rewriting everything unnecessarily.
- Do not claim a feature works until it has been implemented and tested.
- Never invent live weather, market prices, sensor readings, crop diagnoses, or API results.
- Clearly distinguish real data, demo data, estimates, and unavailable services.
- Never expose Gemini API keys or other secrets in frontend code.
- Do not replace real functionality with static screenshots or decorative buttons.
- Do not silence TypeScript errors using "any", blanket suppressions, or disabled checks.
- Do not delete working features merely to make the build pass.
- Use the existing React, TypeScript, Vite, Express, and Gemini architecture unless a verified technical issue requires a change.
- Avoid unnecessary dependencies and visual redesigns unrelated to the objective.
- Use professional, human-readable code with clear naming and sensible component boundaries.

## 2. PHASE ONE — COMPLETE PROJECT AUDIT

Inspect the entire repository before editing.

Review:

- package.json and lockfiles
- src/App.tsx and every imported component
- src/LanguageContext.tsx and translations
- src/components/*
- src/index.css and src/main.tsx
- server.ts and vite.config.ts
- .env.example and .gitignore
- README.md
- implementation_plan.md

Create an internal issue checklist and classify each issue as critical, high, medium, or low priority.

Identify missing imports, broken routes, incorrect API contracts, dependency conflicts, unused code, dead buttons, placeholder features, accessibility problems, security risks, and misleading data.

## 3. PHASE TWO — FIX BUILD AND RUNTIME ERRORS

Start with the actual source of every compilation error.

Specifically inspect App.tsx imports for:

- BotanicalInspector
- WeatherDashboard
- DiseaseDetector
- CropPlanner
- MandiMarketWatch
- IrrigationCalc
- AIAssistant
- CinematicCropBackdrop
- LandingPage

Compare every import with the actual filesystem.

If a component is missing:

1. Determine whether an equivalent existing component already provides the required functionality.
2. Reuse and adapt that component when appropriate.
3. Otherwise implement the missing component with working functionality.
4. Update imports consistently.
5. Do not create duplicate components that perform the same job.

Check React component exports, TypeScript types, CSS classes, Vite configuration, server startup, package scripts, and lockfile consistency.

Run the real installation and build commands supported by the repository. Fix the root cause of each error and rerun the checks.

## 4. PHASE THREE — PROFESSIONAL UI/UX

Maintain the established Leo Green Farm identity.

Design direction:

- Deep forest green and olive surfaces.
- Restrained emerald accents.
- Natural photography and botanical visuals.
- Clean typography and strong visual hierarchy.
- Subtle, purposeful animations.
- Professional agricultural dashboard rather than a generic AI-generated template.

Landing page:

- Clear value proposition for farmers.
- Strong primary dashboard action.
- Feature explanations with useful examples.
- Tamil Nadu agricultural context.
- Responsive navigation and meaningful footer links.

Dashboard:

- Clear overview and farm profile.
- Weather and rainfall.
- Crop health and disease detection.
- Crop planning and seasonal reminders.
- Irrigation calculator.
- Mandi market information.
- AI agricultural assistant.
- Notifications and settings.

Improve loading states, empty states, error messages, responsive layouts, form validation, and confirmation messages.

Every interactive element must perform its advertised action.

Do not add decorative graphs or fake real-time indicators. Use clearly labeled sample data only when necessary for demonstration.

## 5. PHASE FOUR — MAKE FEATURES ACTUALLY WORK

### Weather

- Connect to a documented weather provider if credentials are configured.
- Validate API responses and handle timeouts.
- Display location, forecast dates, units, and last-updated time.
- Provide an honest unavailable state when live data cannot be retrieved.

### Crop disease detection

- Support image selection, preview, validation, and upload.
- Connect to the existing server-side Gemini integration.
- Validate file types and sizes.
- Return structured results with suspected condition, confidence where justified, uncertainty, and practical next steps.
- Never treat an AI diagnosis as definitive.
- Recommend a qualified agricultural officer or KVK when identification is uncertain or treatment risks are significant.

### AI agricultural assistant

- Keep model calls on the server.
- Validate user input and structure model output.
- Support Tamil, English, and Hindi.
- Handle missing API keys, provider errors, timeouts, and rate limits.
- Give regionally relevant advice without inventing local observations.
- Avoid unsafe or unsupported pesticide recommendations.

### Irrigation calculator

- Validate inputs and units.
- Use documented formulas and explain assumptions.
- Display results with appropriate units.
- Add tests for normal, boundary, and invalid inputs.

### Crop planner

- Allow users to select a crop, planting date, and relevant growing conditions.
- Generate editable milestones based on documented agricultural guidance.
- Make clear that timing depends on crop variety, location, season, and field conditions.

### Mandi market

- Use an authoritative data source when available.
- Display market, commodity, unit, source, and timestamp.
- Never present hardcoded prices as current prices.
- Clearly label sample data and service unavailability.

### Farm profile and notifications

- Validate profile inputs.
- Persist settings only through a deliberately selected storage solution.
- Do not imply data is saved permanently when it exists only in memory.
- Provide functional notification and settings controls.

## 6. PHASE FIVE — SECURITY

Inspect and fix:

- Exposed secrets and accidental credential tracking.
- Unsafe environment-variable handling.
- Missing server-side input validation.
- Oversized or invalid image uploads.
- Unhandled provider exceptions.
- Excessive request rates and expensive AI calls.
- Unnecessary disclosure of internal errors.
- Unsafe rendering of user-supplied content.
- Missing CORS restrictions where required.
- Insecure HTTP configuration and deployment assumptions.

Add reasonable rate limiting, request timeouts, payload limits, and structured error handling.

Keep credentials in server-side environment variables. Maintain a clean .env.example containing placeholders only.

Do not print secrets in logs or commit real credentials.

Document remaining risks honestly. Do not claim a security audit is complete merely because the build succeeds.

## 7. PHASE SIX — PERFORMANCE AND ACCESSIBILITY

- Remove unused imports and unnecessary dependencies where safe.
- Avoid unnecessary re-renders and expensive repeated operations.
- Optimize image sizes and loading.
- Respect reduced-motion preferences.
- Ensure mobile layouts work at narrow screen widths.
- Support keyboard navigation and visible focus.
- Provide accessible names for controls.
- Maintain readable contrast and meaningful form labels.
- Add suitable loading indicators and error recovery.
- Avoid large animations that interfere with dashboard usability.

Test the landing page and all major dashboard views on desktop and mobile layouts.

## 8. PHASE SEVEN — AUTOMATED TESTING

Add appropriate tests for the actual project architecture.

At minimum:

- Component rendering.
- Navigation between landing page and dashboard.
- Language switching.
- Irrigation calculation correctness.
- Form validation.
- API success and failure responses.
- Crop image upload validation.
- Missing API key behavior.
- Error handling and loading states.
- Responsive and accessible critical interactions where test tooling supports them.

Run the available checks, including:

1. Dependency installation.
2. TypeScript checking using an appropriate type-check command.
3. Linting if configured.
4. Automated tests if configured.
5. Production frontend and server build.
6. Startup and smoke tests.
7. Manual browser checks for all major user flows.

If a command is unavailable, configure the appropriate tool only when justified, or report the limitation. Never report a test as passed if it was not executed.

## 9. PHASE EIGHT — DOCUMENTATION

Rewrite README.md to accurately describe Leo Green Farm.

Include:

- Project overview and feature list.
- Technology stack.
- Prerequisites.
- Installation and development commands.
- Environment variable setup.
- API endpoint documentation.
- Testing and production build instructions.
- Deployment configuration.
- Data sources and limitations.
- Security practices.
- Troubleshooting steps.

Ensure every command and environment variable matches the actual source code.

Remove obsolete descriptions that no longer match the implementation.

## 10. REQUIRED FINAL VERIFICATION

After implementation:

- Run every relevant automated check.
- Fix newly introduced regressions.
- Confirm all component imports resolve.
- Confirm the production build succeeds.
- Test all available primary user flows.
- Inspect the final diff for accidental deletions and unrelated changes.
- Check that no secrets have been committed.
- Document any integration that still needs credentials or external configuration.

Do not stop after producing a plan. Continue through implementation, testing, and final review.

## 11. HONEST QUALITY SCORING

Evaluate the final project out of 100 using this rubric:

- Build correctness and code quality: 20 points.
- Functional features and reliability: 20 points.
- UI/UX and responsive design: 20 points.
- Security and input validation: 15 points.
- Automated testing and verification: 15 points.
- Documentation and maintainability: 10 points.

Total: 100 points.

Award points only for demonstrated evidence.

For each category, report:

- Score awarded.
- Evidence supporting the score.
- Tests actually executed.
- Outstanding defects.
- Recommended next steps.

A successful build alone does not establish a 90/100 quality score.

If the verified result is below 90, identify the remaining blockers and continue fixing them where possible. Never fabricate test results or award points for planned but unfinished features.

## FINAL DELIVERABLES

Provide:

1. The updated working project.
2. The list of files created, modified, or removed.
3. Root causes fixed.
4. Commands executed and their actual results.
5. Feature-by-feature test status.
6. Final quality score with evidence.
7. Remaining limitations and required API credentials.
8. Exact commands to run the project locally and build for deployment.

Begin by inspecting the existing repository, then implement the highest-priority fixes first. Do not stop at analysis or planning.
