# Project Proposal & Software Requirements Document (PRD/SRS)

* **Project Name:** FactCheck
* **System Target:** FactCheckMaster AI Studio
* **Document Version:** 1.3
* **Date:** July 2026

---

## Executive Summary

FactCheckMaster AI Studio is an AI-powered fact-checking platform designed to help journalists, media organizations, researchers, government institutions, and fact-checking teams verify viral claims quickly and accurately.

The platform combines Artificial Intelligence, OCR (Optical Character Recognition), Search APIs, Natural Language Processing, and Image Generation to automatically create complete fact-check articles from screenshots, images, videos, and text claims.

Instead of manually writing every article, users simply upload an image or paste a claim, and the system generates a professional fact-check report, social media content, and branded graphics within seconds.

---

## Problem Statement

Every day thousands of misleading posts spread across social media platforms. Current challenges in the fact-checking workflow include:

* **Manual verification is time-consuming:** Investigating claims, tracking down original sources, and cross-referencing information requires significant manual effort.
* **Research overhead:** Drafting professional fact-check articles requires deep research and evidence collection.
* **Design bottleneck:** Creating custom graphic banners, social cards, and stamps consumes additional time.
* **Repetitive publishing:** Distribution and formatting of articles across multiple social media platforms is repetitive.
* **Neglected SEO:** Proper search engine optimization (such as structured Schema tags) is often overlooked due to speed constraints.
* **Scale limitations:** Large editorial teams are required to handle high-volume fact-checking demands.

The proposed solution automates these tasks while keeping human editors in control of the final publication.

---

## Project Objectives

* Reduce article creation time by over 80%.
* Improve fact-checking and source verification efficiency.
* Generate SEO-optimized content automatically.
* Produce consistent branding and graphics with minimal effort.
* Assist journalists with an AI-powered research assistant.
* Build a centralized, searchable fact-check database.
* Increase website traffic through search engine optimized content.
* Streamline and optimize the editorial publishing workflow.

---

## Target Users

* News Organizations & Media Houses
* Government Departments
* Fact-Checking Teams & Journalists
* Digital Agencies
* Researchers & Universities
* NGOs
* Independent Content Creators

---

## System Overview

The platform consists of five major components:

1. **AI Content Generator:** Handles text extraction, claim analysis, metadata categorization, and draft writing.
2. **Verification Engine:** Manages automated queries across official, trusted, and database sources.
3. **Image Generator:** Produces branded fact-check visual banners, stamps, and layout templates.
4. **Publishing System:** Integrates with CMS platforms (e.g., WordPress) and drafts social channel updates.
5. **Analytics Dashboard:** Monitored console tracking traffic, status reviews, popular claims, and AI usage.

---

## Complete Workflow

### Step 1: User Ingestion
The user uploads media or pastes text:
* **Upload Types:** Screenshots, News Images, Facebook Posts, Tweets, WhatsApp Forwards, YouTube Screenshots, Instagram Posts, PDFs, or Video Frames.
* **Manual Input:** The user pastes a text claim manually.

### Step 2: OCR Engine
The OCR engine extracts text from uploaded images.

* **Example Input Image:** A screenshot containing the text *"Pakistan Army suffered 50 casualties."*
* **Example Output Extracted Text:** *"Pakistan Army suffered 50 casualties."*

### Step 3: Claim Detection
The AI identifies semantic entities and metadata from the text:
* Main claim
* Location
* Organization
* Person
* Date
* Event
* Keywords

* **Example Claim:** *"Pakistan Army suffered 50 casualties."*
* **Example Detected Metadata:**
  * **Subject:** Pakistan Army
  * **Event:** Military Operation
  * **Claim:** 50 casualties

### Step 4: Verification Engine
The system checks multiple sources, including:
* Official Government Websites & Press Releases (e.g., ISPR)
* International News Agencies & Trusted News Websites
* Global Fact Checking Databases
* Google Search API queries
* Public Sources & the platform's internal database

### Step 5: AI Analysis
The AI compares the original claim against official information, trusted reports, previous articles, and historical data to determine a verdict.

**Possible Verdicts:**
* True
* False
* Misleading
* Partly False
* Unverified
* Satire
* Manipulated Media
* Out of Context

### Step 6: Automatic Content Generation
The AI generates the final publishable assets:
* **SEO Metadata:** Title, Description, Keywords, URL Slug, Categories, Tags, Read Time, and Featured Image.
* **Article Elements:** Fact-Check Summary, Narrative, Timeline, Evidence, References, and Verdict.
* **Social Media Copy:** Platform-specific captions, Hashtags, FAQs, and Schema Markup.

---

## Article Structure

A generated fact-check article is organized as follows:

* **Title:** Compelling headline, e.g., *FACT CHECK: Viral Claim About Pakistan Army Casualties Is False*
* **Verdict:** Clear rating label, e.g., *FALSE (with color-coded visual indicator)*
* **Summary:** A 2-3 sentence overview explaining the claim and the outcome of the investigation.
* **Background:** Details on where the claim originated, who shared it, and why it went viral.
* **Investigation:** Narrative explanation of the verification process, sources consulted, and evidence collected.
* **Evidence:** Attached documentation, such as official statements, screenshots, and reports.
* **Reality:** The verified, objective facts.
* **Verdict Details:** A final conclusion and summary of the decision rationale.

---

## AI Image Generator

The system automatically generates branded graphic assets:
* **Graphic Assets:** Fact Check Banners, Stamps (True, False, Misleading, Partly False), Breaking News Style layouts, and FactCheckMaster branding/logos.
* **Social Formats:** Customized templates optimized for thumbnails and social media posts.

### Layout Templates:

* **Template 1: Standard Card**
  * Top: Brand Logo and Headline
  * Center: Claim text, Reality text, and Verdict Stamp
  * Bottom: Footer branding and website link

* **Template 2: Split Screen**
  * Left side: Claim visual with warning border
  * Right side: Reality visual with verified border
  * Bottom: Whitelist of verified sources consulted

* **Template 3: Minimal Card**
  * Centered large Verdict stamp
  * Headline and brief summary block
  * Small branding footer logo

---

## Social Media Generator

The platform generates platform-specific social media copy:
* **Supported Platforms:** Facebook, Instagram, Twitter/X, LinkedIn, Threads, Telegram, WhatsApp, and YouTube Community.
* **YouTube Content Generation:**
  * Video Title suggestions
  * Search-optimized descriptions
  * Keywords and tags lists
  * Relevant hashtags
  * Text overlays for video thumbnails

---

## SEO Module & Optimization Checks

### SEO Outputs:
* Search Engine Title and Meta Description
* Optimized URL Slugs and Keywords list
* Structured JSON-LD Schema markup (ClaimReview)
* Open Graph and Twitter Card tags
* Image Alt Text and Estimated Reading Time

### Automatic Quality Checks:
* **Keyword Density:** Check for optimal keyword usage and density.
* **Readability:** Sentence length, readability index, and transition words analysis.
* **Heading Structure:** Verify hierarchy and heading usage.
* **Grammar & Style:** Passive voice warnings and sentence flow.
* **Image Optimization:** Dimension, format, and size validation.
* **Link Integrity:** Ensure internal and external link connections are active.

---

## Long-Form Articles Module

In addition to short-form fact-check cards, the platform includes a long-form article system for publishing investigative reports, educational content, and general news updates. 
* **Drafting Workflow:** Supports saving draft columns, setting author details, assigning cover images, and calculating reading times before moving to a published state.
* **Content Feed:** Highlights featured articles separate from core fact-checks on the homepage grid.

---

## Public Comments System

To support public media literacy and engagement, the platform provides an interactive public commenting workspace.
* **Article Discussion:** Readers can post comments, identify issues, or discuss evidence on individual fact-check pages.
* **Feedback Moderation:** Comments are tracked on the admin panel where editorial teams can review, delete, or flag messages to prevent spam.

---

## Platform Security & Approved Devices

To secure the integrity of published content, FactCheck enforces a strict authorization model for administrative mutations.
* **Device Authentication:** Restricts editor access to pre-approved browsers. Unknown devices must submit a validation request to existing administrators.
* **One-Time Passwords (OTP):** Admins can trigger secure OTP verification emails during critical operations to confirm identity.
* **Data Guardrails:** Strict data access control restricts database modifications exclusively to server-mediated administrative routes. Direct frontend modifications to database tables are systematically blocked.

---

## SMTP Connectivity & Notification Engine

The application integrates with SMTP mailing channels to handle automated team communications and public alerts.
* **Newsletter Subscriptions:** Readers can subscribe to alerts using their emails. Once a new fact-check is published, the platform automatically drafts and broadcasts notification emails containing the verdict and summary.
* **Inquiry Updates:** Users who submit contact or feedback inquiries are automatically notified by email whenever an administrator posts a response to their messages.
* **System Resilience:** If mail servers are unreachable, the platform logs the issue and ensures core editor publishing workflows continue running without interruption.

---

## Admin Broadcasting & Newsletter Tool

Editors have access to a dedicated newsletter campaign dashboard to communicate directly with signed-up readers.
* **Subscriber Management:** Interactive directory listing all active emails with the option to manually remove or unsubscribe entries.
* **Provider Filtering:** Filters subscriber lists by provider (e.g., standard email signup vs Google signup) to partition target groups.
* **Email Campaign Editor:** A simple composing workspace to write custom subject lines and announcement bodies and broadcast them to selected segments instantly via SMTP.

---

## Social Ingestion & Live Streams Feed

The platform supports live-synced ingestion interfaces that import official broadcasts and social content automatically.
* **Meta Page Sync:** Connects to Facebook and Instagram page webhooks. When updates are published on official social channels, the backend automatically logs and synchronizes them into the system.
* **Live Broadcast Theater:** Resolves YouTube handles (e.g., `@ISPROfficial`) to channel IDs, checks every 60 seconds if the channel is currently broadcasting a live stream, and displays the active stream inside a dashboard theater.
* **Briefing Archives:** Displays a feed of recent press briefings and videos if no active live stream is detected.

---

## Admin Dashboard

The dashboard provides a high-level view of platform activity:
* **Volume Metrics:** Total Articles, Today's Articles, Published Fact Checks, and Pending Reviews.
* **Audience Analytics:** Web traffic, trending topics, and most viewed articles.
* **Operations:** Popular claims, top contributing authors, and editorial publishing status.
* **Usage Statistics:** AI engine utilization and monthly operational statistics.

---

## User Roles

* **Administrator:** Manage system configurations, integrations, credentials, and user permissions.
* **Editor:** Review AI-generated copy, manage publishing queues, and make final editorial updates.
* **Journalist:** Submit claims, initiate AI verification runs, and draft reports.
* **Graphic Designer:** Review and adjust AI-generated visual cards, thumbnails, and stamp layouts.
* **Viewer:** Read published articles and search the database.

---

## AI Models Configuration

* **Content Generation:** Long-form article drafts, narrative reports, translation, and summary synthesis.
* **SEO Copywriting:** Title generation, tag metadata, and schema markup structure.
* **Image Processing:** Optical Character Recognition (OCR) and visual content parsing.
* **Extraction Services:** Named entity recognition (NER) for locations, organizations, dates, and claims.
* **Visual Synthesis:** Generation of branded banners, custom overlays, and graphic templates.

---

## Technology Stack

* **Frontend:** React, Next.js, Tailwind CSS
* **Backend:** Node.js Express, Python FastAPI (for AI and OCR services)
* **Database:** PostgreSQL (Supabase), MongoDB, SQLite
* **Storage:** AWS S3, Cloudinary
* **Authentication:** JWT, OAuth, Google Login
* **Hosting:** AWS, DigitalOcean, Vercel, Cloudflare
* **Integrations:** WordPress CMS, social media APIs (Facebook, Instagram, Twitter/X, LinkedIn, Telegram, YouTube), Google Vision API, OpenAI/Gemini APIs, SMTP services.

---

## Future Features

* **AI Video Fact Check:** Automated analysis of video clips for edits and alterations.
* **Deepfake Detection:** Machine learning checks for simulated faces or voice cloning.
* **Voice Verification:** Audio signature validation for recorded claims.
* **Real-Time Monitoring:** Live feeds scanning news channels and social networks.
* **Automatic Claim Detection:** Automated discovery of viral claims on social media platforms.
* **Multilingual Support:** Multi-language processing (Arabic, English, Urdu, Hindi, French, Spanish).

---

## Benefits

* **Reduce draft writing times by up to 90%**, increasing output capacity.
* **Maintain consistent branding** across visual templates and distribution feeds.
* **Improve search engine visibility** through automated schemas and SEO audits.
* **Accelerate publish rates** to capture breaking news traffic.
* **Empower newsrooms** with AI-assisted drafting while keeping editors in charge.
* **Create a structured database** of verified information.

---

## Development Timeline

* **Phase 1 (Weeks 1-3): Foundation & Core UI**
  * UI/UX Design, Admin Dashboard templates, and authentication flows.
  * Database schema setup and OCR engine integration.
* **Phase 2 (Weeks 4-6): AI & Verification Engine**
  * AI content generation pipeline, fact verification module, SEO generator, and draft editor interface.
* **Phase 3 (Weeks 7-9): Visuals & Integrations**
  * Canvas image generator, social media copy scheduler, WordPress API hooks, and analytics reporting.
* **Phase 4 (Weeks 10-12): QA & Deployment**
  * End-to-end testing, security audits, database indexing, caching strategies, and live production release.

---

## Expected Outcomes

* Fast, AI-assisted fact-check article generation.
* Centralized, searchable repository of verified digital claims.
* Branded visual graphics created automatically with minimal design effort.
* Search-ready, SEO-optimized articles with embedded Schema markups.
* Fast social media publication drafts across major networks.
* Elevated editorial consistency and workflow efficiency.

---

## Conclusion

FactCheckMaster AI Studio is designed to modernize the fact-checking workflow by combining AI-assisted research, structured content generation, SEO optimization, branded visual creation, and publishing tools into a single platform. The system is intended to support—not replace—human editors by producing high-quality drafts that can be reviewed, refined, and published efficiently.
