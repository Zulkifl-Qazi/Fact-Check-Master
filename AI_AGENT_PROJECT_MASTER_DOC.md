# AI Agent Master Project Specification & Multi-App Roadmap

> **Target Audience**: AI Coding Assistants (Gemini, Claude, Antigravity AI) & Engineering Team  
> **System Architecture**: Decoupled Multi-App Ecosystem  
> **Last Updated**: July 2026  

---

## 1. System Overview & Core Objective

The **FactCheck Platform** is an enterprise AI-assisted news verification ecosystem designed for journalists, media houses, ISPR media desks, and fact-checking teams. 

To ensure maximum performance, maintainability, and clean separation of concerns, the system is architected into **two independent applications**:

```
                              ┌─────────────────────────────────────────┐
                              │           ISPR FactCheck System         │
                              └────────────────────┬────────────────────┘
                                                   │
                 ┌─────────────────────────────────┴─────────────────────────────────┐
                 ▼                                                                   ▼
┌─────────────────────────────────┐                                 ┌─────────────────────────────────┐
│     1. Fact-Check Master        │                                 │     2. AI Post Generation       │
│  (News & Publishing Platform)   │                                 │    (Standalone AI Studio App)   │
└────────────────┬────────────────┘                                 └────────────────┬────────────────┘
                 │                                                                   │
                 ▼                                                                   ▼
  Repository: Fact-Check-Master                                      Repository: AI_POST_GENERATION
  Live: www.factcheckmaster.com                                      Live: Vercel Independent Project
```

---

## 2. Repositories & Deployment Mapping

### App 1: Fact Check Master (News & Publishing Portal)
* **Local Directory**: `C:\Users\qzulk\Desktop\ISPR\Fact Check Master`
* **GitHub Repository**: [`https://github.com/Zulkifl-Qazi/Fact-Check-Master`](https://github.com/Zulkifl-Qazi/Fact-Check-Master)
* **Production URL**: `https://www.factcheckmaster.com`
* **Role**: Public-facing fact-check portal, category filters, live news feeds, admin management dashboard, comments, and subscriber notifications.

### App 2: AI Post Generation (Standalone AI Studio & Overlay Generator)
* **Local Directory**: `C:\Users\qzulk\Desktop\ISPR\AI_POST_GENERATION`
* **GitHub Repository**: [`https://github.com/Zulkifl-Qazi/AI_POST_GENERATION`](https://github.com/Zulkifl-Qazi/AI_POST_GENERATION)
* **Role**: Standalone minimalist Chrome/Arc-inspired studio for multimodal AI post generation, device image uploads, premade verdict stamps (`VERIFIED`, `FALSE`, `MISLEADING`, etc.), PNG export, and social media copy generation.

---

## 3. Detailed Weekly Implementation Roadmap

```
  Week 1: Standalone Studio & Premade Image Stamp Canvas  ──────► [COMPLETED]
  Week 2: Independent Supabase & API Bridge Integration   ──────► [IN PROGRESS]
  Week 3: Multimodal Vision, OCR & Reverse Image Verification ─► [UPCOMING]
  Week 4: Automated Social Media Publishing & Notification Alerts ─► [UPCOMING]
```

### Week 1: Standalone Studio & Premade Image Stamp Canvas (COMPLETED)
- Created independent Vite + React application in `C:\Users\qzulk\Desktop\ISPR\AI_POST_GENERATION`.
- Reverted inline AI code from `Fact-Check-Master` to keep the main portal lightweight.
- Built **Device Image Uploader**: Drag-and-drop file upload from computer + URL support.
- Built **Premade Verdict Stamp Overlay Canvas**:
  - Stamps: `VERIFIED` (Green), `FALSE / FAKE` (Red), `MISLEADING` (Yellow), `DISPUTED` (Purple), `INVESTIGATING` (Blue), `BREAKING NEWS` (Red/White).
  - Overlay Positions: Center Slanted, Top Right Badge, Bottom Banner, Top Header Banner.
  - One-click high-resolution PNG image download (`html-to-image`).
- Built **Multimodal AI Article & Social Post Engine**:
  - Full fact-check article narrative (Headline, Summary, Background, Evidence, Reality, Verdict).
  - Social media caption generator for **Twitter / X**, **Facebook**, and **Instagram**.
  - Multi-provider fallback cascade: Pollinations AI (free, unlimited) → OpenRouter → Google Gemini → Smart Local Generator.
- Pushed clean codebase to `https://github.com/Zulkifl-Qazi/AI_POST_GENERATION`.

### Week 2: Independent Supabase & API Bridge (CURRENT PHASE)
- **Separate Database Setup**: Deploy `supabase-schema.sql` on a dedicated Supabase project.
- **`ai_posts` Table**: Save generated articles, verdict stamps, confidence scores, and social captions.
- **API Bridge**: Provide a secure export endpoint from `AI_POST_GENERATION` to push verified posts into `Fact-Check-Master`'s main database.

### Week 3: Advanced Vision, OCR & Claim Extraction (UPCOMING)
- Add Tesseract / Gemini Vision OCR to automatically extract text from uploaded screenshot images.
- Reverse image search reference matching for viral claims.
- Automated claim entity detection (speakers, locations, organizations).

### Week 4: One-Click Social Publishing & Subscriber Alerts (UPCOMING)
- Automatic posting to Twitter/X API and Facebook Page API upon verdict approval.
- Subscriber email notifications via Gmail SMTP (`contact@factcheckmaster.com`).

---

## 4. Technical Guidelines for AI Assistants

When modifying either repository, AI agents MUST follow these rules:

1. **Keep Applications Decoupled**:
   - Do NOT mix main portal code with the standalone AI studio app.
   - Edit `Fact Check Master` inside `C:\Users\qzulk\Desktop\ISPR\Fact Check Master`.
   - Edit `AI Post Generation` inside `C:\Users\qzulk\Desktop\ISPR\AI_POST_GENERATION`.

2. **Git & Deployment Rules**:
   - Always test local build (`npm run build`) before committing.
   - Commit and push `Fact Check Master` to `https://github.com/Zulkifl-Qazi/Fact-Check-Master`.
   - Commit and push `AI Post Generation` to `https://github.com/Zulkifl-Qazi/AI_POST_GENERATION`.

3. **Styling & Aesthetics**:
   - Maintain modern, clean aesthetics (Vanilla CSS, Plus Jakarta Sans font, smooth dark mode, glassmorphic cards).
