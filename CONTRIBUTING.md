# Contributing to BrackNodes Portfolio CMS

Thank you for your interest in contributing to **BrackNodes Portfolio CMS**! We welcome developer contributions, documentation improvements, issue reports, and feature suggestions.

---

## 🛠️ Development Setup

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/bracknodes/BrackNodes-Portfolio-Web-01.git
   cd BrackNodes-Portfolio-Web-01
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Local Development Server:**
   ```bash
   npm run dev
   ```

4. **Verify TypeScript & Production Build:**
   ```bash
   npm run build
   ```

---

## 💡 Code Guidelines

- **TypeScript Strictness:** Maintain type safety. Never bypass TypeScript checks with arbitrary `any` when explicit types can be modeled.
- **Component Design:** Keep UI components modular with dark cyberpunk design tokens matching CSS variables in `src/styles/globals.css`.
- **Zero AI Footprint:** Do not commit AI tool telemetry, prompts, or automated scratch notes into git commits or documentation.
- **Backwards Compatibility:** Changes to CMS schemas in `src/types/cms.ts` should ensure fallback defaults so existing localStorage and Supabase instances don't crash.

---

## 🤝 Community & Support

- **Discord Community:** Join us at [discord.gg/bracknodes](https://discord.gg/bracknodes)
- **Official Website:** [bracknodes.in](https://bracknodes.in)
- **Support Tickets:** [bracknodes.in](https://bracknodes.in)

Licensed under the [MIT License](LICENSE).

