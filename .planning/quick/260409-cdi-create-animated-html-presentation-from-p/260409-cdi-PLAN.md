---
phase: quick
plan: 260409-cdi
type: execute
wave: 1
depends_on: []
files_modified:
  - screens/apresentacao-telas-nativas.html
autonomous: true
requirements: []
must_haves:
  truths:
    - "Client can open a single HTML file in browser and see a polished slide presentation"
    - "All 11 screens are represented as visual cards with chart/element mockups"
    - "Navigation architecture is shown as a visual tree diagram"
    - "Component reuse is shown as a matrix/diagram"
    - "Complexity summary is shown as a visual chart"
    - "Arrow keys and click navigate between slides with animated transitions"
    - "All content is in Portuguese (pt-BR)"
    - "GIS branding color #16AEA6 is the primary color throughout"
  artifacts:
    - path: "screens/apresentacao-telas-nativas.html"
      provides: "Complete self-contained animated HTML presentation"
      min_lines: 500
  key_links: []
---

<objective>
Create a single self-contained animated HTML presentation from screens/PLANO-TELAS-NATIVAS.md that visually communicates the v2.0 Native Dashboard Screens plan to a non-technical client.

Purpose: Enable client stakeholder presentation of the 11-screen plan with visual mockups, architecture diagrams, and complexity overview — all in a polished, navigable slide format.
Output: screens/apresentacao-telas-nativas.html
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@screens/PLANO-TELAS-NATIVAS.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build the complete animated HTML presentation</name>
  <files>screens/apresentacao-telas-nativas.html</files>
  <action>
Create a single self-contained HTML file (screens/apresentacao-telas-nativas.html) with all CSS and JS inline. Only external dependencies allowed: Google Fonts CDN (Roboto) and optionally Material Icons CDN.

**Structure — approximately 15-18 slides:**

1. **Capa / Title slide**: "Telas Nativas GIS — Plano v2.0", subtitle "Substituir Power BI por dashboards nativos", GIS branding, date
2. **Objetivo**: Brief overview — why native screens, what they replace (Power BI iframes → Next.js + Recharts)
3. **Visao Geral das 11 Telas**: Grid of 11 cards showing screen name, complexity badge (Baixa/Media/Alta), and icon representing each screen type
4-14. **One slide per screen (Tela 1-11)**: Each slide shows:
   - Screen title and concept description
   - A VISUAL MOCKUP: Use CSS/SVG to create a schematic wireframe showing the layout of charts, KPI cards, filters, tables, etc. that the screen will contain. For example, Tela 4 (Ambulatorial) should show placeholder rectangles labeled "Grafico de Barras Horizontais — Producao por subgrupo", "Grafico de Rosca — Genero", etc. arranged in a realistic dashboard layout. Use colored rectangles, rounded boxes, and labels to simulate the dashboard appearance.
   - List of key elements/components below the mockup
   - Complexity indicator
15. **Arquitetura de Navegacao**: Visual tree diagram using CSS (flexbox/grid + borders/lines) showing the /hospital/{cnes}/ route hierarchy with all 11 routes as leaf nodes
16. **Componentes Reutilizaveis**: Visual matrix/diagram showing the ~15 reusable components on the left and which screens (T1-T11) use them — use colored dots or checkmarks in a grid. Highlight that component reuse reduces development effort.
17. **Resumo de Complexidade**: Visual horizontal bar chart (pure CSS) showing each screen's complexity (number of charts + filters), color-coded by complexity level (Baixa=#4CAF50, Media=#FF9800, Alta=#F44336). Include totals: ~28 chart instances, ~25 filter instances, ~35 new DB tables, ~15-20 new API endpoints.
18. **Encerramento / Next Steps**: Summary of what's needed (backend: tables + endpoints, frontend: components + screens), toolkit (Recharts, TanStack Table), timeline readiness.

**Styling:**
- Primary color: #16AEA6 (GIS teal)
- Secondary: #0D7377 (darker teal for contrast)
- Accent: #E8F8F5 (light teal background)
- Background: #FFFFFF slides on #F0F4F5 body
- Font: Roboto from Google Fonts (weights 300, 400, 500, 700)
- Slides should be 16:9 aspect ratio, centered in viewport
- Subtle box shadows on slides
- Slide counter in bottom-right corner ("3 / 18")

**Navigation:**
- Arrow keys (left/right) to navigate
- Click on left/right edges of slide to navigate
- Smooth CSS transitions between slides (slide-in from right/left, ~400ms ease)
- Optional: small dot indicators at bottom showing current position

**Visual mockup style for screen slides:**
- Use CSS grid/flexbox to create schematic layouts
- Colored rectangles with rounded corners representing chart areas
- Small icons or emoji to differentiate chart types (bars, lines, donuts, tables)
- Labels inside each rectangle describing what chart/element it represents
- KPI cards shown as small colored cards with "R$ ---" placeholder values
- Filter bars shown as a row of rounded pill buttons at top
- Use opacity and subtle gradients to make mockups feel professional, not just wireframes

**Code quality:**
- All CSS in a single style tag in head
- All JS in a single script tag before closing body
- No external JS libraries
- Clean, well-structured HTML with semantic elements
- Total file should be roughly 1500-3000 lines (rich visual content)
  </action>
  <verify>
    <automated>test -f D:/gitlab/GIS/screens/apresentacao-telas-nativas.html && echo "File exists" && wc -l D:/gitlab/GIS/screens/apresentacao-telas-nativas.html</automated>
  </verify>
  <done>
- File exists at screens/apresentacao-telas-nativas.html
- Opens in browser showing polished slide presentation
- All 11 screens represented with visual mockups
- Navigation tree, component reuse diagram, and complexity chart are present
- Arrow keys and click navigation work with animated transitions
- All text in Portuguese (pt-BR)
- GIS branding (#16AEA6) used throughout
- No external dependencies except CDN fonts
  </done>
</task>

</tasks>

<verification>
- Open screens/apresentacao-telas-nativas.html in browser
- Verify slide navigation with arrow keys and click
- Verify all 11 screens have visual mockups
- Verify architecture diagram, component matrix, and complexity chart are present
- Verify GIS branding colors throughout
- Verify all content is in Portuguese
</verification>

<success_criteria>
A non-technical client can open the HTML file in any modern browser and navigate through a professional, visually rich presentation that clearly communicates what 11 native dashboard screens will be built, how they relate to each other, what components are reused, and the overall scope/complexity of the project.
</success_criteria>

<output>
After completion, create `.planning/quick/260409-cdi-create-animated-html-presentation-from-p/260409-cdi-SUMMARY.md`
</output>
