# Plano: Telas Nativas GIS (Substituir Power BI)

**Data:** 2026-04-08
**Status:** Planejamento
**Milestone:** v2.0 — Native Dashboard Screens

---

## Objetivo

Substituir os dashboards Power BI embeddados (iframes) por **11 telas nativas** construídas em Next.js com Recharts, lendo dados diretamente do Postgres via Go API.

---

## Decisões Já Tomadas

| Decisão | Escolha |
|---------|---------|
| Biblioteca de gráficos | **Recharts** |
| Fonte de dados | **Postgres** (seed via planilha futuramente, fora deste milestone) |
| Cross-filtering entre gráficos | **Sim** — clicar em um gráfico filtra os outros na mesma tela |
| Persistência de filtros | **Sim** — filtros globais persistem entre telas |
| Telas por hospital | **Varia** — se não houver dados, ocultar a opção ou mostrar mensagem de vazio |
| Diagrama hierárquico (CNES) | **Tree/org-chart visual** com nós e conexões |
| Pipeline de ingestão | **Fora de escopo** — seed data é ferramenta de scripting separada |

---

## Inventário de Telas (11 telas)

### Tela 1: Home
**Conceito:** Tela inicial do dashboard por hospital
**Elementos:**
- Menu de navegação centralizado para as demais telas
- Identificação do estabelecimento (nome, CNES, logo)
- Identidade visual GIS
- Disclaimer/aviso legal

**Componentes necessários:**
- `DashboardHome` — layout de navegação com cards/links para cada tela disponível
- `HospitalHeader` — banner com dados do estabelecimento
- `DisclaimerBanner` — aviso legal

**Complexidade:** Baixa

---

### Tela 2: CNES
**Conceito:** Dados cadastrais do estabelecimento (CNES)
**Elementos:**
- 6 botões que abrem modais:
  - **Leitos** — tabela
  - **Instalações** — diagrama hierárquico (tree/org-chart)
  - **Serviços** — diagrama hierárquico (tree/org-chart)
  - **Convênios** — tabela
  - **Especialidades** — tabela
  - **Habilitações** — tabela

**Componentes necessários:**
- `CnesOverview` — grid de botões
- `DataModal` — modal reutilizável
- `DataTable` — tabela genérica para Leitos, Convênios, Especialidades, Habilitações
- `OrgChart` / `TreeDiagram` — visualização hierárquica para Instalações e Serviços

**Tabelas no Postgres:**
- `cnes_leitos` (beds)
- `cnes_instalacoes` (installations hierarchy)
- `cnes_servicos` (services hierarchy)
- `cnes_convenios` (health plans/agreements)
- `cnes_especialidades` (specialties)
- `cnes_habilitacoes` (certifications)

**Complexidade:** Média-Alta (tree diagram + 6 modais)

---

### Tela 3: Resumo Financeiro
**Conceito:** Totais anuais de produção e faturamento — abrange todos os tipos de produção
**Elementos:**
- **Seção "Faturamento total"** (KPI cards):
  - Produção total (quantidade de procedimentos ambulatoriais + hospitalares)
  - Valor total (soma financeira ambulatorial + hospitalar)
- **Seção "Faturamento ambulatorial"** (KPI cards):
  - Atendimentos (quantidade total ambulatorial)
  - Faturamento SIA (valor financeiro ambulatorial)
- **Seção "Faturamento hospitalar"** (KPI cards):
  - AIHs (quantidade de internações)
  - Faturamento SIH (valor financeiro das AIHs)
  - Valor dos serviços profissionais
  - Valor dos serviços hospitalares
  - Atos na internação (procedimentos secundários, OPMEs, procedimentos especiais)
- Segmentador de período (anos)

**Componentes necessários:**
- `KpiCard` — card de indicador reutilizável
- `KpiSection` — agrupamento de KPIs com título de seção
- `PeriodSlicer` — seletor de anos (filtro global)

**Tabelas no Postgres:**
- `resumo_faturamento` (aggregated totals by year: ambulatorial + hospitalar, broken down by category)

**Complexidade:** Baixa (somente KPI cards agrupados em seções, sem gráficos)

---

### Tela 4: Ambulatorial
**Conceito:** Detalhamento de atendimentos ambulatoriais
**Elementos:**
- Cards de KPI
- Gráfico de barras horizontais — Produção por subgrupo
- Gráfico de linha — Faturamento ambulatorial
- Gráfico de rosca — Atendimentos por gênero
- Gráfico de barras horizontais — Origem do cidadão
- Gráfico de barras horizontais — Atendimentos por CBO
- Gráfico de barras horizontais — Faturamento por CBO
- Botão toggle BPA Consolidado
- Segmentador de período (anos)
- Cross-filter

**Componentes necessários:**
- `KpiCard` — cards de KPI
- `HorizontalBarChart` — barras horizontais (4 instâncias)
- `LineChart` — gráfico de linha com múltiplas séries
- `DonutChart` — gráfico de rosca
- `PeriodSlicer` — seletor de anos
- `ToggleButton` — toggle BPA Consolidado
- `CrossFilterProvider` — contexto de filtragem cruzada

**Tabelas no Postgres:**
- `producao_ambulatorial` (ambulatory production by procedure subgroup)
- `faturamento_ambulatorial` (ambulatory billing by month/status)
- `atendimentos_genero` (visits by gender)
- `atendimentos_origem` (visits by origin/UF)
- `atendimentos_cbo` (visits by CBO occupation)
- `faturamento_cbo` (billing by CBO occupation)

**Complexidade:** Média (reutiliza componentes da Tela 3)

---

### Tela 5: Hospitalar
**Conceito:** Detalhamento de internações
**Elementos:**
- Cards de KPI (internações, faturamento hospitalar, serviços hosp/profissionais)
- Segmentadores superiores: Caráter de atendimento, Tipo de leito, Resolutividade CID, Complexidade, Período
- Gráfico de linha — Quantidade de AIHs (aprovadas/rejeitadas)
- Gráfico de linha — Valor total das AIHs
- Gráfico de área — Valor dos serviços profissionais
- Gráfico de área — Valor dos serviços hospitalares
- Gráfico de barras horizontais — Grupo de procedimentos
- Gráfico de barras horizontais — Subgrupo de procedimentos
- Gráfico de barras horizontais (ranking) — Procedimentos principais (com rolagem)
- Controles de ordenação (asc/desc)
- Cross-filter

**Componentes necessários:**
- `AreaChart` — gráfico de área (novo)
- `FilterBar` — barra de filtros com dropdowns e botões
- `RankingChart` — barras horizontais com scroll e ordenação
- Reutiliza: `KpiCard`, `LineChart`, `HorizontalBarChart`, `PeriodSlicer`

**Tabelas no Postgres:**
- `internacoes_aih` (hospitalizations by month/status)
- `internacoes_valor` (hospitalization values by month)
- `servicos_profissionais_valor` (professional services values)
- `servicos_hospitalares_valor` (hospital services values)
- `internacoes_grupo_procedimento` (by procedure group)
- `internacoes_subgrupo_procedimento` (by procedure subgroup)
- `internacoes_procedimento_principal` (by main procedure, ranked)

**Complexidade:** Alta (9 gráficos + 5 filtros + ranking com scroll)

---

### Tela 6: Serviços Profissionais
**Conceito:** Atos profissionais nas internações
**Elementos:**
- Cards de KPI (procedimentos secundários, valores financeiros)
- Segmentador de período (anos)
- Gráfico de área — Serviços profissionais (quantidade ao longo do tempo)
- Gráfico de área — Valor dos serviços hospitalares
- Gráfico de barras horizontais — Procedimentos secundários por grupo
- Gráfico de barras horizontais — Procedimentos secundários por subgrupo (com scroll)
- Gráfico de barras horizontais (ranking) — Procedimentos secundários (com scroll + ordenação)
- Cross-filter

**Componentes necessários:** Reutiliza: `KpiCard`, `AreaChart`, `HorizontalBarChart`, `RankingChart`, `PeriodSlicer`

**Tabelas no Postgres:**
- `servicos_profissionais_qtd` (professional services quantity over time)
- `proc_secundarios_grupo` (secondary procedures by group)
- `proc_secundarios_subgrupo` (secondary procedures by subgroup)
- `proc_secundarios_ranking` (secondary procedures ranked)

**Complexidade:** Média (reutiliza componentes existentes)

---

### Tela 7: Alta vs. Faturamento
**Conceito:** Gap temporal entre alta do paciente e faturamento via DATASUS
**Elementos:**
- Card de totais (internações + valor total das altas)
- Gráfico de barras horizontais — Quantidade de AIHs por mês de faturamento
- Gráfico de barras horizontais — Valor das AIHs por mês de faturamento
- Segmentadores: Caráter, Tipo de leito, Resolutividade CID, Complexidade, Período
- Botão "Inverter Lógica" — alterna entre mês de saída e mês de faturamento
- Cross-filter

**Componentes necessários:**
- `InvertLogicToggle` — toggle de inversão de lógica temporal (específico)
- Reutiliza: `KpiCard`, `HorizontalBarChart`, `FilterBar`, `PeriodSlicer`

**Tabelas no Postgres:**
- `alta_faturamento` (discharge date vs billing date by AIH, with values)

**Complexidade:** Média (lógica de inversão temporal é o diferencial)

---

### Tela 8: Taxa de Evolução
**Conceito:** %MoM e %YoY por segmento
**Elementos:**
- Gráfico de linha — Variação percentual mensal (com marcadores)
- Botões toggle de métrica: Faturamento Ambulatorial, Faturamento Hospitalar, Valor Médio Diárias YoY%, Valor Médio Diárias MoM%
- Segmentadores superiores (anos, categoria de origem)
- Título/subtítulo dinâmico (muda conforme métrica selecionada)
- Cross-filter

**Componentes necessários:**
- `MetricToggleGroup` — grupo de botões exclusivos para selecionar métrica
- `DynamicTitle` — título que reflete seleção ativa
- Reutiliza: `LineChart`, `PeriodSlicer`, `FilterBar`

**Tabelas no Postgres:**
- `evolucao_faturamento_ambulatorial` (ambulatory billing MoM%)
- `evolucao_faturamento_hospitalar` (hospital billing MoM%)
- `evolucao_diarias` (daily rates YoY%/MoM%)

**Complexidade:** Média (lógica de cálculo MoM/YoY + toggle de métricas)

---

### Tela 9: Especialidades
**Conceito:** Produção e internação por especialidade médica
**Elementos:**
- Segmentadores: Período (ano/mês), Grupo tOS, Especialidade, Categoria de atendimento
- Card de indicador — Valor médio das AIHs por especialidade
- Gráfico de barras verticais — Valor médio de AIH por especialidade
- Gráfico de barras verticais — Média de permanência por especialidade
- Botões de navegação inferior (páginas/grupos)
- Cross-filter

**Componentes necessários:**
- `VerticalBarChart` — barras verticais (novo)
- `SubPageNavigator` — navegação entre sub-páginas/grupos
- Reutiliza: `KpiCard`, `FilterBar`, `PeriodSlicer`

**Tabelas no Postgres:**
- `especialidades_aih` (AIH values/stays by specialty)
- `especialidades_tos` (type of service groups)

**Complexidade:** Média

---

### Tela 10: Análise de Reprocessamento
**Conceito:** Timeline de reprocessamento das AIHs rejeitadas
**Elementos:**
- Segmentadores: Período (anos), Visão (Relatório geral / Detalhamento)
- Gráfico de barras horizontais — Erros mais frequentes
- Gráfico de rosca — Situação geral (reprocessadas vs. não reprocessadas, total ao centro)
- Botões de navegação entre "Relatório geral" e "Detalhamento"
- Cross-filter

**Componentes necessários:**
- `ViewModeToggle` — alterna entre visões (relatório geral / detalhamento)
- Reutiliza: `HorizontalBarChart`, `DonutChart`, `PeriodSlicer`

**Tabelas no Postgres:**
- `reprocessamento_erros` (error types and frequency)
- `reprocessamento_situacao` (processing status: reprocessed/not)
- `reprocessamento_timeline` (detailed reprocessing timeline)

**Complexidade:** Média

---

### Tela 11: Detalhamento de Registro
**Conceito:** Acesso direto às tabelas-fonte de dados
**Elementos:**
- Menu central com 3 botões que abrem modais:
  - **PA** (Produção Ambulatorial) — tabela com colunas relevantes
  - **RD** (Registro de Internação) — tabela com colunas relevantes
  - **SP** (Serviços Profissionais) — tabela com colunas relevantes

**Componentes necessários:**
- `RawDataModal` — modal com tabela paginada e busca
- `DataTable` (reutilizado da Tela 2, expandido com paginação/busca)

**Tabelas no Postgres:**
- `dados_pa` (ambulatory production raw data)
- `dados_rd` (hospitalization raw data)
- `dados_sp` (professional services raw data)

**Complexidade:** Média (tabelas grandes com paginação server-side)

---

## Resumo de Componentes Reutilizáveis

| Componente | Usado em | Tipo |
|------------|----------|------|
| `KpiCard` | T3, T4, T5, T6, T7, T8, T9 | Card indicador |
| `KpiSection` | T3 | Agrupamento de KPIs |
| `HorizontalBarChart` | T4, T5, T6, T7, T10 | Gráfico |
| `VerticalBarChart` | T9 | Gráfico |
| `LineChart` | T4, T5, T8 | Gráfico |
| `AreaChart` | T5, T6 | Gráfico |
| `DonutChart` | T4, T10 | Gráfico |
| `RankingChart` | T5, T6 | Gráfico + scroll |
| `DataTable` | T2, T11 | Tabela |
| `OrgChart` / `TreeDiagram` | T2 | Visualização |
| `PeriodSlicer` | T3-T10 | Filtro |
| `FilterBar` | T5, T7, T8, T9 | Filtros compostos |
| `CrossFilterProvider` | T3-T10 | Context/state |
| `DataModal` | T2, T11 | Modal |
| `MetricToggleGroup` | T8 | Seletor |
| `ToggleButton` | T4, T7 | Toggle |

**Total de componentes únicos:** ~15 componentes reutilizáveis

---

## Resumo de Tabelas no Postgres (Novas)

| Categoria | Tabelas | Telas |
|-----------|---------|-------|
| CNES | 6 tabelas (leitos, instalacoes, servicos, convenios, especialidades, habilitacoes) | T2 |
| Resumo Financeiro | 1 tabela/view (totais agregados por ano) | T3 |
| Ambulatorial | ~6 tabelas (producao, faturamento, genero, origem, CBO) | T4 |
| Hospitalar | ~7 tabelas (AIH, valores, serviços, procedimentos) | T5 |
| Serviços Profissionais | ~4 tabelas (quantidade, grupos, subgrupos, ranking) | T6 |
| Alta vs. Faturamento | 1 tabela | T7 |
| Evolução | ~3 tabelas (ambulatorial, hospitalar, diárias) | T8 |
| Especialidades | ~2 tabelas | T9 |
| Reprocessamento | ~3 tabelas | T10 |
| Dados Brutos | 3 tabelas (PA, RD, SP) | T11 |

**Total estimado:** ~35 novas tabelas/views no Postgres
**Total de migrations:** ~10-15 migration files (agrupando por domínio)

---

## Resumo de Endpoints no Go API (Novos)

Cada tela precisa de endpoints REST que suportem filtros via query params:

| Endpoint Pattern | Telas | Filtros |
|-----------------|-------|---------|
| `GET /hospitals/{cnes}/cnes/*` | T2 | — |
| `GET /hospitals/{cnes}/resumo-financeiro` | T3 | year, bpa_consolidado |
| `GET /hospitals/{cnes}/ambulatorial` | T4 | year, bpa_consolidado |
| `GET /hospitals/{cnes}/hospitalar` | T5 | year, carater, tipo_leito, resolutividade, complexidade |
| `GET /hospitals/{cnes}/servicos-profissionais` | T6 | year |
| `GET /hospitals/{cnes}/alta-faturamento` | T7 | year, carater, tipo_leito, resolutividade, complexidade, inverter |
| `GET /hospitals/{cnes}/evolucao` | T8 | year, metrica |
| `GET /hospitals/{cnes}/especialidades` | T9 | year, month, grupo_tos, especialidade, categoria |
| `GET /hospitals/{cnes}/reprocessamento` | T10 | year, visao |
| `GET /hospitals/{cnes}/dados/{tipo}` | T11 | page, limit, search |

**Total estimado:** ~15-20 novos endpoints

---

## Arquitetura de Navegação

```
/hospital/{cnes}/
  ├── /              → Tela 1: Home (navigation hub)
  ├── /cnes          → Tela 2: CNES
  ├── /resumo        → Tela 3: Resumo Financeiro
  ├── /ambulatorial   → Tela 4: Ambulatorial
  ├── /hospitalar     → Tela 5: Hospitalar
  ├── /servicos       → Tela 6: Serviços Profissionais
  ├── /alta           → Tela 7: Alta vs. Faturamento
  ├── /evolucao       → Tela 8: Taxa de Evolução
  ├── /especialidades → Tela 9: Especialidades
  ├── /reprocessamento → Tela 10: Análise de Reprocessamento
  └── /registros      → Tela 11: Detalhamento de Registro
```

**Filtros globais** (year, period) persistem em React Context e se mantêm ao navegar entre telas.

---

## O Que Precisa Ser Feito (Resumo Executivo)

### Backend (Go API + Postgres)
1. **~35 novas tabelas** no Postgres com migrations
2. **~15-20 novos endpoints** no Go API com filtros
3. **Seed data** realista para desenvolvimento/testes
4. **Repositório/Service pattern** para cada domínio de dados

### Frontend (Next.js + Recharts)
1. **~15 componentes reutilizáveis** de gráficos e UI
2. **11 telas** (pages) com layouts responsivos
3. **Cross-filter system** — React Context para filtragem cruzada entre gráficos
4. **Global filter persistence** — filtros mantidos ao navegar entre telas
5. **Roteamento** — 11 novas rotas sob `/hospital/{cnes}/`
6. **i18n** — todas as novas strings em pt-BR message files
7. **Tratamento de dados vazios** — ocultar telas sem dados ou mostrar mensagem

### Complexidade por Tela

| Tela | Complexidade | Gráficos | Filtros |
|------|-------------|----------|---------|
| 1. Home | Baixa | 0 | 0 |
| 2. CNES | Média-Alta | 0 (tree diagram) | 0 |
| 3. Resumo Financeiro | Baixa | 0 (KPI cards) | 1 |
| 4. Ambulatorial | Média | 7 | 2 |
| 5. Hospitalar | Alta | 9 | 5 |
| 6. Serviços Profissionais | Média | 5 | 1 |
| 7. Alta vs. Faturamento | Média | 2 | 6 |
| 8. Taxa de Evolução | Média | 1 | 3 |
| 9. Especialidades | Média | 2 | 4 |
| 10. Reprocessamento | Média | 2 | 2 |
| 11. Registros | Média | 0 (tabelas) | 1 |

**Total de gráficos:** ~28 instâncias de gráficos (T3 agora é só KPI cards)
**Total de componentes de filtro:** ~25 instâncias

---

## Toolkit de Visualização de Dados

### Biblioteca Principal: Recharts

Recharts é composável — cada gráfico é montado com sub-componentes declarativos. Todos os nossos chart components são wrappers sobre primitivos Recharts com theming via `palette.css`.

### Mapeamento: Componente GIS → Recharts Primitivo

| Componente GIS | Recharts Primitivo | Props Chave | Usado em |
|----------------|-------------------|-------------|----------|
| `HorizontalBarChart` | `<BarChart layout="vertical">` + `<Bar>` | `layout="vertical"`, `dataKey`, `fill` | T4, T5, T6, T7, T10 |
| `VerticalBarChart` | `<BarChart>` + `<Bar>` | `dataKey`, `fill`, `barSize` | T9 |
| `LineChart` | `<LineChart>` + `<Line>` (múltiplas séries) | `type="monotone"`, `stroke`, `dot` | T4, T5, T8 |
| `AreaChart` | `<AreaChart>` + `<Area>` | `type="monotone"`, `fill`, `fillOpacity` | T5, T6 |
| `DonutChart` | `<PieChart>` + `<Pie>` | `innerRadius`, `outerRadius`, `paddingAngle` | T4, T10 |
| `RankingChart` | `<BarChart layout="vertical">` em container com scroll | `layout="vertical"` + CSS `overflow-y: auto` | T5, T6 |
| `KpiCard` | Sem Recharts — componente React puro | `value`, `label`, `trend`, `format` | T3-T9 |

### Elementos Compartilhados do Recharts

Todos os gráficos usam estes sub-componentes:

| Sub-componente Recharts | Função | Configuração |
|------------------------|--------|-------------|
| `<Tooltip>` | Hover com dados detalhados | Custom formatter para pt-BR (moeda, percentual) |
| `<Legend>` | Legenda de séries | Posição bottom ou right conforme layout |
| `<ResponsiveContainer>` | Container responsivo | `width="100%" height={300}` (ajustável) |
| `<CartesianGrid>` | Grade de fundo | `strokeDasharray="3 3"`, cor de `palette.css` |
| `<XAxis>` / `<YAxis>` | Eixos | Labels em pt-BR, tick formatters para moeda/número |
| `<Brush>` | Zoom/scroll em séries longas | Opcional, para gráficos com muitos pontos temporais |
| `<Cell>` | Cores por segmento | Usado no DonutChart para cores diferentes por fatia |

### Formatação pt-BR

Todos os gráficos usam formatadores consistentes:

```
Moeda:     R$ 1.234.567,89  → Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
Número:    1.234.567         → Intl.NumberFormat('pt-BR')
Percentual: 12,5%            → Intl.NumberFormat('pt-BR', { style: 'percent' })
Período:   Jan/2024          → custom formatter mês abreviado + ano
```

### Paleta de Cores dos Gráficos

Derivada de `palette.css` para suportar light/dark mode:

| Variável CSS | Uso |
|-------------|-----|
| `--chart-primary` | Série principal / barras padrão |
| `--chart-secondary` | Segunda série (ex: não aprovado) |
| `--chart-tertiary` | Terceira série |
| `--chart-success` | Valores positivos / aprovados |
| `--chart-danger` | Valores negativos / rejeitados |
| `--chart-neutral` | Séries neutras / background |
| `--chart-palette-1..8` | Paleta sequencial para gráficos com muitas categorias (rosca, barras por UF) |

### Visualizações Não-Recharts

| Componente | Biblioteca | Motivo |
|-----------|-----------|--------|
| `OrgChart` / `TreeDiagram` | **react-organizational-chart** ou **d3-hierarchy** + SVG custom | Recharts não suporta tree/org-chart nativamente. Opções: (1) `react-organizational-chart` para visual simples com CSS, (2) `d3-hierarchy` + `d3-tree` para controle total com SVG |
| `DataTable` | **@tanstack/react-table** | Tabela headless com sorting, pagination, search. Renderiza com nossos componentes UI. Server-side pagination para tabelas grandes (T11) |
| `KpiCard` | React puro (sem lib) | Card simples com valor, label, ícone de tendência |

### Componentes de Filtro/Interação

| Componente | Implementação | Comportamento |
|-----------|--------------|--------------|
| `PeriodSlicer` | Botões horizontais (anos) | Click seleciona ano, atualiza `CrossFilterContext` |
| `FilterBar` | Dropdowns (`<select>` ou Radix `<Select>`) | Múltiplos filtros lado a lado, valores em query params |
| `ToggleButton` | Botão com estado on/off | Ex: BPA Consolidado, Inverter Lógica |
| `MetricToggleGroup` | Radio group visual (botões exclusivos) | Seleciona qual métrica exibir no gráfico |
| `CrossFilterProvider` | React Context + `useReducer` | Estado centralizado de filtros; clicar em um gráfico dispara `dispatch({ type: 'FILTER', payload })` que atualiza os demais |

### Cross-Filtering: Como Funciona

```
┌──────────────────────────────────────────────────┐
│  CrossFilterProvider (React Context)              │
│                                                   │
│  state: {                                         │
│    year: 2024,                                    │
│    selectedBar: { field: 'subgrupo', value: X },  │
│    selectedSlice: { field: 'genero', value: Y },  │
│  }                                                │
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ BarChart │→ │ Donut   │→ │ Line    │          │
│  │ onClick  │  │ filters │  │ filters │          │
│  │ dispatch │  │ by bar  │  │ by bar  │          │
│  └─────────┘  └─────────┘  └─────────┘          │
│                                                   │
│  Click em barra "Clínicos" →                      │
│    dispatch({ field: 'subgrupo', value: 'Clín.'})│
│    → Donut filtra por subgrupo 'Clín.'           │
│    → LineChart filtra por subgrupo 'Clín.'       │
│    → KPIs recalculam para subgrupo 'Clín.'       │
│                                                   │
│  Click novamente → limpa filtro (toggle)          │
└──────────────────────────────────────────────────┘
```

### Dependências NPM Novas

| Pacote | Versão | Finalidade |
|--------|--------|-----------|
| `recharts` | ^2.15+ | Gráficos (bar, line, area, pie) |
| `@tanstack/react-table` | ^8.x | Tabelas com sorting, pagination, search |
| `react-organizational-chart` | ^2.x | Diagrama hierárquico CNES (T2) |
| `d3-hierarchy` | ^3.x | Alternativa para tree layout (se react-org-chart não atender) |

### Dependências Go (API)

Nenhuma dependência nova prevista — o Go API atual com `chi` router e `pgx` driver já suporta os novos endpoints e queries.

---

*Documento criado: 2026-04-08*