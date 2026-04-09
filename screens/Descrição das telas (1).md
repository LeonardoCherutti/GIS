# Tela 1: Home

## Conceito:
*Tela inicial do dashboard*

## Descrição/elementos:
- Menu de navegação centralizado com identificação do estabelecimento estudado, botões para demais telas, identidade visual GIS e disclaimer/aviso legal

============================================================

# Tela 2: CNES

## Conceito:
*Dados cadastrais do estabelecimento*

## Descrição/elementos:
- Botões de interação que abrem o modal de cada módulo de informações: Leitos [tabela], Instalações [diagrama hierárquico], Serviços [diagrama hierárquico], Convêncios [tabela], Especialidades [tabela] e Habilitações [tabela]

============================================================

# Tela 3: Resumo Financeiro

## Conceito:
*Totais anuais de quantidade de procedimentos registrados e valores financeiros. Abrange todos os tipos de produção*

## Descrição/elementos: 
### Seção “Faturamento total”  
- **Tipo de elemento:** Cards de KPI.  
- **Tipo de informação:**  
  - Produção total (quantidade de procedimentos ambulatoriais e hospitalares).  
  - Valor total (soma financeira da produção ambulatorial e hospitalar).  
- **Tipos de filtros:** Segmentador de período (anos).  

### Seção “Faturamento ambulatorial”  
- **Tipo de elemento:** Cards de KPI.  
- **Tipo de informação:**  
  - Atendimentos (quantidade total de atendimentos ambulatoriais).  
  - Faturamento SIA (valor financeiro da produção ambulatorial).  
- **Tipos de filtros:** Segmentador de período (anos).  

### Seção “Faturamento hospitalar”  
- **Tipo de elemento:** Cards de KPI.  
- **Tipo de informação:**  
  - AIHs (quantidade de internações hospitalares).  
  - Faturamento SIH (valor financeiro das AIHs).  
  - Valor dos serviços profissionais (fração do faturamento hospitalar).  
  - Valor dos serviços hospitalares (fração do faturamento hospitalar).  
  - Atos na internação (quantidade de procedimentos secundários, OPMEs e procedimentos especiais).  
- **Tipos de filtros:** Segmentador de período (anos).  


# Tela 4: Ambulatorial

## Conceito:
*Detalhamento quantitativo e financeiro dos atendimentos ambulatoriais*

## Descrição/elementos:
### Cards de KPI (Topo)
- **Tipo:** Card (indicador único)
- **Conteúdo:** Métricas agregadas de produção e faturamento ambulatorial
- **Filtro associado:** Dependem dos filtros globais aplicados (ex.: ano)

### Gráfico de barras horizontais – Produção por subgrupo de procedimento
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Quantidade de procedimentos agrupados por subgrupo (ex.: clínicos, cirúrgicos, etc.)
- **Filtro associado:** Filtros globais (período, possíveis segmentações adicionais)

### Gráfico de linha – Faturamento ambulatorial
- **Tipo:** Line chart com múltiplas séries
- **Conteúdo:** Evolução temporal do faturamento, segmentado por status (ex.: aprovado e não aprovado)
- **Filtro associado:** Segmentação por ano (botões/seletores) + filtros globais

### Gráfico de rosca – Atendimentos por gênero
- **Tipo:** Donut chart
- **Conteúdo:** Distribuição percentual e absoluta dos atendimentos por categoria de gênero
- **Filtro associado:** Segmentação por ano + botão de ação (ex.: alternar comportamento relacionado a BPA)

### Gráfico de barras horizontais – Origem do cidadão
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Distribuição de atendimentos por local de origem (UF ou não informado)
- **Filtro associado:** Filtros globais (período e demais segmentações)

### Gráfico de barras horizontais – Atendimentos por CBO
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Quantidade de atendimentos agrupados por ocupação profissional (CBO)
- **Filtro associado:** Filtros globais

### Gráfico de barras horizontais – Faturamento por CBO
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Valor de faturamento agrupado por ocupação profissional (CBO)
- **Filtro associado:** Filtros globais

### Botão de ação
- **Ação configurada:** alternar inclusão/exclusão de BPA Consolidado
*(BPA consolidado = registros de atendimentos ambulatoriais que não informam sexo do paciente)*

Interações implícitas:
Cross-filter / Cross-highlight
Seleção em um visual impacta os demais (realce ou filtragem)

*Segmentador de período (anos)*
- **Tipo:** Slicer horizontal (botões)
*Seleção de períodos temporais discretos (anos)*
*Atua como filtro global afetando todos os visuais*

============================================================

# Tela 5: Hospitalar

## Conceito:
*Detalhamento quantitativo e financeiro das internações*

## Descrição/elementos:
### Cards de KPI (Topo)
- **Tipo:** Card (indicador único)
- **Conteúdo:** Métricas agregadas relacionadas a internações, faturamento hospitalar e componentes financeiros (serviços hospitalares e profissionais)
- **Filtro associado:** Filtros globais (ex.: período, demais segmentações)

### Segmentadores (filtros superiores)

- **Tipo:** Slicers (dropdown e botões)
- Conteúdo:
-Caráter de atendimento
-Tipo de leito
-Classificação de resolutividade baseada em CID
-Complexidade da internação
-Seleção de período (anos)
- **Filtro associado:** Atuam como filtros globais sobre todos os visuais

### Gráfico de linha – Quantidade de AIHs
- **Tipo:** Line chart com múltiplas séries
- **Conteúdo:** Evolução temporal da quantidade de autorizações de internação hospitalar, segmentada por status (ex.: aprovadas e rejeitadas)
- **Filtro associado:** Segmentadores de período e demais filtros globais

### Gráfico de linha – Valor total das AIHs
- **Tipo:** Line chart com múltiplas séries
- **Conteúdo:** Evolução temporal do valor financeiro das internações, segmentado por status (ex.: aprovado e rejeitado)
- **Filtro associado:** Segmentadores de período e filtros globais

### Gráfico de área – Valor dos serviços profissionais
- **Tipo:** Area chart
- **Conteúdo:** Evolução temporal dos valores relacionados aos serviços profissionais vinculados às internações
- **Filtro associado:** Filtros globais

### Gráfico de área – Valor dos serviços hospitalares
- **Tipo:** Area chart
- **Conteúdo:** Evolução temporal dos valores relacionados aos serviços hospitalares das internações
- **Filtro associado:** Filtros globais

### Gráfico de barras horizontais – Grupo de procedimentos
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Distribuição das internações por grupo de procedimentos principais
- **Filtro associado:** Filtros globais

### Gráfico de barras horizontais – Subgrupo de procedimentos
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Distribuição das internações por subgrupos de procedimentos principais
- **Filtro associado:** Filtros globais

### Gráfico de barras horizontais (ranking) – Procedimentos principais
- **Tipo:** Bar chart horizontal ordenado (ranking com rolagem)
- **Conteúdo:** Lista dos procedimentos principais mais frequentes nas internações, com ordenação por volume
- **Filtro associado:** Filtros globais + interação de ordenação (asc/desc)

### Controles de ordenação (ranking)
- **Tipo:** Botões/ícones de ordenação
- **Conteúdo:** Alternância de ordenação dos dados exibidos no ranking de procedimentos
- **Filtro associado:** Atua apenas no visual específico

### Interações implícitas
- **Tipo:** Cross-filter / Cross-highlight
- **Conteúdo:** Seleções em visuais impactam os demais (filtragem ou destaque cruzado)
- **Filtro associado:** Interações padrão entre os elementos do dashboard

============================================================

# Tela 6: Serviços Profissionais

## Conceito:
*Detalhamento quantitativo e financeiro dos atos profissionais registrados nas internações*

## Descrição/elementos:
### Cards de KPI (Topo)
- **Tipo:** Card (indicador único)
- **Conteúdo:** Métricas agregadas relacionadas a procedimentos secundários e valores financeiros (serviços hospitalares e serviços profissionais)
- **Filtro associado:** Filtros globais (ex.: período)

- **Segmentador de período (anos)
- **Tipo:** Slicer horizontal (botões)
- **Conteúdo:** Seleção de períodos temporais discretos (anos)
- **Filtro associado:** Atua como filtro global para todos os visuais

### Gráfico de área – Serviços profissionais
- **Tipo:** Area chart
- **Conteúdo:** Evolução temporal da quantidade de serviços profissionais (procedimentos secundários) ao longo dos períodos
- **Filtro associado:** Segmentador de período + filtros globais

### Gráfico de área – Valor dos serviços hospitalares
- **Tipo:** Area chart
- **Conteúdo:** Evolução temporal dos valores financeiros associados aos serviços hospitalares vinculados às internações
- **Filtro associado:** Segmentador de período + filtros globais

### Gráfico de barras horizontais – Procedimentos secundários por grupo
- **Tipo:** Bar chart horizontal
- **Conteúdo:** Distribuição dos procedimentos secundários agrupados por grupo de procedimentos
- **Filtro associado:** Filtros globais

### Gráfico de barras horizontais – Procedimentos secundários por subgrupo
- **Tipo:** Bar chart horizontal com rolagem
- **Conteúdo:** Distribuição dos procedimentos secundários detalhados por subgrupos de procedimentos
- **Filtro associado:** Filtros globais + rolagem interna do visual

### Gráfico de barras horizontais (ranking) – Procedimentos secundários
- **Tipo:** Bar chart horizontal ordenado (ranking com rolagem)
- **Conteúdo:** Lista dos procedimentos secundários mais frequentes, ordenados por volume
- **Filtro associado:** Filtros globais + ordenação e rolagem interna

### Interações implícitas
- **Tipo:** Cross-filter / Cross-highlight
- **Conteúdo:** Seleções em qualquer visual impactam os demais (filtragem ou destaque cruzado)
- **Filtro associado:** Interações padrão entre os elementos do dashboard

============================================================

# Tela 7: Alta vs. Faturamento

## Conceito:
*Análise do gap temporal entre a alta do paciente e o faturamento da conta da sua internação via DATASUS*

## Descrição/elementos:
### Card de Totais  
- **Tipo de elemento:** Card (indicador único).  
- **Tipo de informação:** Total de internações e valor total das altas.  
- **Tipos de filtros:** Filtros globais de período e segmentações aplicadas nos slicers superiores.  

### Gráfico de Barras Horizontais – Quantidade de AIHs  
- **Tipo de elemento:** Bar chart horizontal.  
- **Tipo de informação:** Quantidade de autorizações de internação hospitalar (AIHs) agrupadas por mês de faturamento, considerando o mês de saída selecionado.  
- **Tipos de filtros:** Segmentadores de período (anos) e filtros globais de caráter de atendimento, tipo de leito, resolutividade e complexidade.  

### Gráfico de Barras Horizontais – Valor das AIHs  
- **Tipo de elemento:** Bar chart horizontal.  
- **Tipo de informação:** Valor financeiro das AIHs agrupado por mês de faturamento, condicionado ao mês de saída selecionado.  
- **Tipos de filtros:** Segmentadores de período e filtros globais de atendimento e leito.  

### Segmentadores Superiores  
- **Tipo de elemento:** Slicers (botões e dropdowns).  
- **Tipo de informação:**  
  - Caráter de atendimento  
  - Tipo de leito  
  - Resolutividade do CID  
  - Complexidade da internação  
  - Período (anos)  
- **Tipos de filtros:** Atuam como filtros globais sobre todos os visuais da tela.  

### Botão “Inverter Lógica”  
- **Tipo de elemento:** Botão de ação interativa.  
- **Tipo de informação:** Alterna a lógica de filtragem entre **mês de saída** e **mês de faturamento**.  
- **Função técnica:** Quando ativado, o filtro de período passa a atuar sobre o mês de faturamento, e os gráficos passam a exibir os resultados por mês de saída, invertendo a relação padrão entre os dois eixos temporais.  

### Interações Implícitas  
- **Tipo de elemento:** Cross-filter / Cross-highlight.  
- **Tipo de informação:** Seleções em qualquer visual afetam os demais, aplicando filtragem ou destaque cruzado.  
- **Tipos de filtros:** Interações padrão entre os elementos do dashboard.

============================================================

# Tela 8: Taxa de Evolução

## Conceito:
*Percentual de evolução mês a mês, ano a ano (%MoM e %YoY) em cada segmento*

## Descrição/elementos: 
### Gráfico de Linha – Faturamento Ambulatorial (%MoM)  
- **Tipo de elemento:** Line chart com marcadores de ponto.  
- **Tipo de informação:** Variação percentual mês a mês do faturamento ambulatorial em relação ao mês anterior (%MoM).  
- **Tipos de filtros:** Segmentadores de período (anos) e botões de seleção de tipo de dado abaixo do gráfico.  

### Botões de Seleção de Métrica  
- **Tipo de elemento:** Botões interativos (toggle buttons).  
- **Tipo de informação:** Definem qual métrica será exibida no gráfico de variação mensal (%MoM). As opções incluem:  
  - Faturamento Ambulatorial  
  - Faturamento Hospitalar  
  - Valor Médio das Diárias YoY%  
  - Valor Médio das Diárias MoM%  
- **Tipos de filtros:** Cada botão atua como filtro exclusivo, alterando a série de dados apresentada no gráfico principal.  

### Segmentadores Superiores  
- **Tipo de elemento:** Slicers horizontais (botões de seleção).  
- **Tipo de informação:** Seleção de período (anos) e categoria de origem dos dados (CNES, tipo de produção).  
- **Tipos de filtros:** Filtros globais que afetam todos os visuais da página.  

### Título e Subtítulo do Gráfico  
- **Tipo de elemento:** Texto dinâmico.  
- **Tipo de informação:** Indica o tipo de dado selecionado e o cálculo exibido (evolução em relação ao mês anterior).  
- **Tipos de filtros:** Atualiza conforme o botão de seleção de métrica e o período ativo.  

### Interações Implícitas  
- **Tipo de elemento:** Cross-filter / Cross-highlight.  
- **Tipo de informação:** Seleções em botões ou períodos afetam o gráfico principal e o texto de cabeçalho.  
- **Tipos de filtros:** Interações padrão entre os elementos do dashboard.

============================================================

# Tela 9: Especialidades

## Conceito:
*Detalhamento de todos os segmentos da produção extratificando e comparando por especialidade médica*

## Descrição/elementos:

### Título e Cabeçalho  
- **Tipo de elemento:** Texto fixo (header).  
- **Tipo de informação:** Identificação da página e contexto analítico (“Análise por Especialidade”).  
- **Tipos de filtros:** Nenhum filtro direto; atua como referência visual para os demais elementos.  

### Segmentadores Superiores  
- **Tipo de elemento:** Slicers horizontais (botões e dropdowns).  
- **Tipo de informação:** Seleção de parâmetros analíticos, incluindo:  
  - Período (ano e mês)  
  - Grupo de tipo de serviço (tOS)  
  - Especialidade médica  
  - Categoria de atendimento  
- **Tipos de filtros:** Filtros globais que afetam todos os visuais da tela.  

### Card de Indicadores  
- **Tipo de elemento:** Card (indicador único).  
- **Tipo de informação:** Valor médio das AIHs por especialidade, expresso em moeda.  
- **Tipos de filtros:** Segmentadores superiores de período e especialidade.  

### Gráfico de Barras Verticais – Valor Médio de AIH  
- **Tipo de elemento:** Bar chart vertical.  
- **Tipo de informação:** Valor médio das autorizações de internação hospitalar (AIH) agrupado por especialidade.  
- **Tipos de filtros:** Segmentadores superiores e filtros globais de grupo de tipo de serviço.  

### Gráfico de Barras Verticais – Média de Permanência  
- **Tipo de elemento:** Bar chart vertical.  
- **Tipo de informação:** Média de dias de permanência hospitalar por especialidade.  
- **Tipos de filtros:** Segmentadores superiores e filtros globais de grupo de tipo de serviço.  

### Botões de Navegação Inferiores  
- **Tipo de elemento:** Botões interativos.  
- **Tipo de informação:** Alternam entre páginas ou grupos de análise dentro do conjunto de dashboards (ex.: “Grupo de tOS”, “Páginas”).  
- **Tipos de filtros:** Não aplicam filtros diretos; servem para navegação entre telas analíticas.  

### Interações Implícitas  
- **Tipo de elemento:** Cross-filter / Cross-highlight.  
- **Tipo de informação:** Seleções em qualquer gráfico afetam os demais, aplicando filtragem cruzada entre especialidades e métricas.  
- **Tipos de filtros:** Interações padrão entre os elementos do dashboard.

============================================================

# Tela 10: Análise de Reprocessamento

## Conceito:
*Linha do tempo do reprocessamento das AIHs rejeitadas e status atual, com descrição de erros e valores rejeitados e aprovados*

## Descrição/elementos:
### Dashboard “Linha do Tempo de Processamento das AIHs” — Descrição Técnica dos Elementos  

### Cabeçalho e Identificação
- **Tipo de elemento:** Texto fixo (header).  
- **Tipo de informação:** Título principal do relatório e identificação da instituição (“Hospital Center Clínicas”).  
- **Tipos de filtros:** Nenhum filtro direto; serve como referência visual e contextual.  

### Segmentadores Superiores
- **Tipo de elemento:** Slicers horizontais (botões).  
- **Tipo de informação:** Seleção de período (anos) e alternância entre visões (“Relatório geral” e “Detalhamento”).  
- **Tipos de filtros:** Filtros globais que afetam todos os visuais da página conforme o ano e o modo de exibição selecionado.  

### Gráfico de Barras Horizontais – Erros Mais Frequentes
- **Tipo de elemento:** Bar chart horizontal.  
- **Tipo de informação:** Classificação dos tipos de erro mais recorrentes no processamento das AIHs, exibindo categorias de bloqueio, incompatibilidade ou auditoria.  
- **Tipos de filtros:** Segmentadores de período e modo de exibição (Relatório geral ou Detalhamento).  

### Gráfico de Rosca – Situação Geral do Processamento das AIHs
- **Tipo de elemento:** Donut chart.  
- **Tipo de informação:** Proporção de AIHs reprocessadas e não reprocessadas, com total de internações ao centro.  
- **Tipos de filtros:** Segmentadores superiores de período e modo de exibição.  

### Botões de Navegação
- **Tipo de elemento:** Botões interativos.  
- **Tipo de informação:** Alternam entre páginas do relatório (“Relatório geral” e “Detalhamento”).  
- **Tipos de filtros:** Atuam sobre o contexto de exibição dos gráficos, sem alterar os dados filtrados.  

### Interações Implícitas  
- **Tipo de elemento:** Cross-filter / Cross-highlight.
- **Tipo de informação:** Seleções em qualquer gráfico afetam os demais, aplicando filtragem cruzada entre categorias de erro e situação de processamento.

============================================================

# Tela 11: Detalhamento de Registro

## Conceito:
*Dar liberdade ao usuário de acessar as tabelas da fonte de dados para eventuais dúvidas*

## Descrição/elementos:
- Menu central para os modais das tabelas PA, RD e SP com colunas relevantes