# Lumina: Light & Purpose

# LUMINA — SAAS DE GESTÃO DE MÍDIA PARA IGREJAS

Crie uma plataforma web SaaS completa, moderna, responsiva e profissional chamada **Lumina**, focada na **gestão, planejamento, produção, organização e acompanhamento da comunicação e mídia de igrejas**.

O Lumina deve centralizar em um único sistema o planejamento de conteúdo, biblioteca de artes, banco de legendas e versículos, eventos, escala da equipe de mídia, inteligência artificial, indicadores e integração com Instagram.

A plataforma deve ter aparência de **produto SaaS real, premium e pronto para produção**, não apenas uma interface demonstrativa.

---

# 1. IDENTIDADE DA MARCA

Nome oficial do produto:

**Lumina**

Toda a identidade visual da aplicação deve utilizar exclusivamente o nome **Lumina**.

Criar uma identidade visual moderna, tecnológica, minimalista e sofisticada, conectando os conceitos de:

* Luz
* Comunicação
* Propósito
* Igreja
* Criatividade
* Organização
* Evangelismo
* Mídia

Criar também uma **logo visual própria para o Lumina**, utilizando uma estética minimalista e profissional.

## Paleta

* Primária: `#E7FF5E`
* Secundária: `#ECFF96`
* Terceira: `#2F2F2F`
* Sucesso: `#10B981`
* Erro: `#EF4444`
* Background claro: branco / tons neutros
* Dark Mode: fundo escuro sofisticado

A cor primária deve ser utilizada principalmente em:

* CTAs
* Botões principais
* Destaques
* Indicadores
* Elementos ativos
* Gráficos importantes
* Identidade da marca

Evitar excesso de cores.

---

# 2. DIREÇÃO DE DESIGN

A experiência visual deve ser inspirada em produtos como:

* Notion
* Linear
* ClickUp
* Monday
* Meta Business Suite

Porém, **não copiar interfaces**.

Criar uma identidade própria para o Lumina.

Características:

* Clean
* Minimalista
* Premium
* Profissional
* Espaçamento amplo
* Cards modernos
* Bordas suaves
* Ícones modernos
* Microinterações
* Animações suaves
* Hierarquia visual clara
* Excelente UX
* Responsividade completa

Criar:

* Light Mode
* Dark Mode

O usuário deve conseguir alternar entre os dois modos.

---

# 3. ESTRUTURA PRINCIPAL

Criar uma sidebar lateral recolhível.

Menu:

🏠 Dashboard

📅 Planejamento

📝 Conteúdos

🎨 Biblioteca de Artes

📖 Banco de Versículos

✍️ Banco de Legendas

📆 Eventos

👥 Escala

📊 Relatórios

⚙️ Configurações

A sidebar deve mostrar o logo Lumina no topo.

No mobile, transformar a sidebar em menu inferior ou drawer lateral.

---

# 4. DASHBOARD

O Dashboard deve ser o centro de controle da igreja.

Criar cards KPI:

* Conteúdos planejados
* Conteúdos em produção
* Conteúdos agendados
* Conteúdos publicados
* Eventos do mês
* Taxa de conclusão

Todos os cards devem ser clicáveis e direcionar o usuário para a informação correspondente.

## Gráficos

Criar:

### Conteúdos por semana

Gráfico mostrando a quantidade de conteúdos planejados/publicados em cada semana.

### Conteúdos por tipo

Feed
Carrossel
Reels
Stories
Culto
Evento
Devocional
Testemunho
Aviso
Versículo

### Status dos conteúdos

Ideia
Planejamento
Produção
Revisão
Agendado
Publicado
Cancelado

### Desempenho mensal

Comparar:

* Planejados
* Produzidos
* Agendados
* Publicados

---

# 5. INSTAGRAM — INSIGHTS

Criar dentro do Dashboard uma área específica:

**Instagram Insights**

O objetivo é permitir que a igreja visualize o desempenho do Instagram diretamente dentro do Lumina.

Criar:

* Seguidores
* Crescimento de seguidores
* Alcance
* Impressões
* Engajamento
* Curtidas
* Comentários
* Compartilhamentos
* Salvamentos
* Visualizações
* Visitas ao perfil
* Cliques
* Melhores conteúdos
* Conteúdos com maior alcance
* Conteúdos com maior engajamento

Criar gráficos de evolução:

* Últimos 7 dias
* Últimos 30 dias
* Últimos 90 dias

Criar ranking dos melhores conteúdos.

Exemplo:

**Top 5 conteúdos**

1. Reel X — 32.500 visualizações
2. Reel Y — 21.400 visualizações
3. Carrossel Z — 8.200 alcance

---

# 6. CONEXÃO COM INSTAGRAM

Criar uma experiência de conexão extremamente simples.

IMPORTANTE:

**Não criar um fluxo complexo de configuração técnica para o usuário final.**

A experiência deve ser semelhante à facilidade de plataformas profissionais como Meta Business Suite.

Criar um botão:

**Conectar Instagram**

Ao clicar:

1. Abrir fluxo oficial de autenticação.
2. Usuário realiza login/autorização.
3. Sistema identifica a conta autorizada.
4. Sistema salva a conexão.
5. Dashboard passa a carregar os dados disponíveis.

Não solicitar ao usuário:

* Tokens manuais
* IDs técnicos
* Access Tokens copiados
* Configurações complexas
* Inserção manual de credenciais técnicas

Utilizar **OAuth / APIs oficiais da Meta/Instagram**, respeitando integralmente as permissões e políticas oficiais da Meta.

IMPORTANTE:

Nunca armazenar senha do Instagram no banco de dados.

Nunca implementar captura ou armazenamento direto da senha.

A experiência deve ser simples para o usuário, mas tecnicamente segura através do fluxo oficial de autenticação da Meta.

Criar estados:

* Instagram não conectado
* Conectando
* Conectado
* Erro de conexão
* Reconectar
* Desconectar

Mostrar a conta conectada.

Exemplo:

**@igrejaexemplo**

🟢 Instagram conectado

---

# 7. PLANEJAMENTO

Criar sistema completo de planejamento editorial.

Visualizações:

* Calendário mensal
* Calendário semanal
* Lista
* Timeline
* Kanban

Botões:

* Novo conteúdo
* Duplicar
* Editar
* Excluir
* Mover data
* Filtrar
* Pesquisar

---

# 8. NOVO CONTEÚDO

Ao clicar em **Novo Conteúdo**, abrir modal completo.

Campos:

* Título
* Tema
* Descrição
* Tipo de conteúdo
* Status
* Data de publicação
* Responsável
* Evento relacionado
* Versículo relacionado
* Legenda
* Arte
* Observações

## Upload de arquivos

Permitir upload de arquivos **diretamente do dispositivo do usuário**.

Não tornar Google Drive obrigatório.

Permitir:

* Upload de imagem
* Upload de vídeo
* Upload de arquivos

Criar drag and drop.

Exemplo:

**Arraste seu arquivo aqui**

ou

**Selecionar arquivo do computador**

Mostrar preview imediatamente após o upload.

---

# 9. BANCO DE CONTEÚDOS

Criar database estruturado:

* ID
* Título
* Tema
* Descrição
* Tipo
* Status
* Data de publicação
* Responsável
* Imagem
* Versículo
* Legenda
* Evento relacionado
* Arte relacionada
* Criado em
* Atualizado em

---

# 10. STATUS

Criar:

* Ideia
* Planejamento
* Produção
* Revisão
* Agendado
* Publicado
* Cancelado

Cada status deve possuir identificação visual própria.

---

# 11. KANBAN

Criar Kanban funcional com Drag & Drop.

Colunas:

Ideia
Produção
Revisão
Agendado
Publicado

Ao mover o card:

* Atualizar automaticamente o status
* Atualizar progresso
* Registrar atividade

---

# 12. CHECKLIST DE PRODUÇÃO

Cada conteúdo deve possuir checklist:

* Tema definido
* Arte criada
* Legenda pronta
* Revisado
* Aprovado
* Agendado
* Publicado

Criar barra de progresso automática.

Exemplo:

**Produção 71% concluída**

---

# 13. INTELIGÊNCIA ARTIFICIAL

Adicionar um módulo de IA integrado ao Lumina.

A IA deve funcionar como **assistente de conteúdo da igreja**.

Criar botão:

**✨ Assistente Lumina AI**

Funções:

### Gerar legenda

Usuário informa:

* Tema
* Tipo de publicação
* Objetivo
* Tom

A IA gera a legenda.

### Melhorar legenda

Usuário cola uma legenda existente.

A IA:

* Corrige
* Melhora
* Torna mais clara
* Melhora CTA
* Ajusta estrutura

### Criar ideias

Gerar ideias de:

* Reels
* Stories
* Carrosséis
* Posts
* Campanhas
* Conteúdos para cultos
* Conteúdos para eventos
* Conteúdos evangelísticos

### Criar calendário editorial

A IA pode sugerir um planejamento de conteúdo com base em:

* Frequência semanal
* Tipo de culto
* Eventos
* Campanhas
* Público
* Objetivos

### Gerar CTA

Criar chamadas para:

* Comentários
* Compartilhamentos
* Salvamentos
* Participação em cultos
* Eventos
* Evangelismo

---

# 14. BIBLIOTECA DE ARTES

Criar biblioteca visual.

Permitir:

* Upload direto do computador
* Drag and drop
* Upload múltiplo
* Preview
* Download
* Excluir
* Editar informações
* Pesquisar
* Filtrar

Criar pastas:

* Cultos
* Eventos
* Conferências
* Mulheres
* Jovens
* Missões
* Campanhas
* Outros

Criar visualização:

* Grid
* Lista

---

# 15. CORREÇÃO DE PREVIEW DE IMAGENS

IMPORTANTE:

Todas as imagens inseridas no sistema devem possuir preview funcional.

Isso vale para:

* Biblioteca
* Conteúdos
* Eventos
* Escala
* Dashboard
* Modais
* Cards
* Uploads
* Imagens provenientes de URLs

Não mostrar apenas o link da imagem.

Quando houver uma URL válida de imagem:

**Renderizar a imagem visualmente.**

Quando houver upload:

**Renderizar a imagem diretamente através do armazenamento da aplicação.**

Criar fallback visual caso a imagem não carregue.

Nunca tornar Google Drive obrigatório para visualizar ou armazenar imagens.

---

# 16. BANCO DE VERSÍCULOS

Criar tabela:

* Livro
* Capítulo
* Versículo
* Texto
* Tema
* Categoria
* Favorito
* Tags

Recursos:

* Busca instantânea
* Filtros
* Favoritos
* Tags
* Copiar versículo

---

# 17. BANCO DE LEGENDAS

Criar:

* Título
* Texto
* Categoria
* Tipo
* Tags
* Favorito

Botões:

* Copiar
* Editar
* Duplicar
* Excluir
* Usar no conteúdo

Integrar diretamente com a IA.

Criar botão:

**Gerar com IA**

---

# 18. EVENTOS

Criar módulo completo de eventos.

Campos:

* Nome
* Data
* Descrição
* Local
* Líder
* Imagem
* Status

Permitir:

* Criar
* Editar
* Excluir
* Duplicar
* Pesquisar
* Filtrar

Relacionar eventos aos conteúdos.

Exemplo:

**Conferência de Jovens**

Conteúdos relacionados:

* Reel convite
* Story
* Carrossel
* Aviso
* Pós-evento

---

# 19. ESCALA

Criar nova seção no menu:

**Escala**

Objetivo:

Organizar a escala mensal da equipe de mídia da igreja.

Criar calendário mensal.

Cada membro pode possuir uma ou várias funções.

Funções:

* StoryMaker
* VideoMaker
* Fotografia
* Multimídia / Datashow
* Live

---

# 20. CADASTRO DA EQUIPE

Criar database permanente de integrantes.

Campos:

* Nome
* Foto
* Função
* Telefone
* Status
* Observações

IMPORTANTE:

Ao cadastrar um integrante, **salvar permanentemente o nome da pessoa na equipe**.

Esses integrantes devem aparecer como opções reutilizáveis ao montar futuras escalas.

Não exigir que o usuário digite novamente o nome todos os meses.

Criar seleção:

**Selecionar integrante**

Exemplo:

João
Maria
Pedro
Ana
Lucas

---

# 21. ESCALA MENSAL

Criar calendário mensal.

Cada dia pode possuir:

* Culto
* Evento
* Horário
* Integrantes
* Funções

Exemplo:

### Domingo — 30/08

**StoryMaker**
Maria

**VideoMaker**
João

**Fotografia**
Ana

**Multimídia**
Pedro

**Live**
Lucas

---

# 22. MULTIPLAS DATAS PARA O MESMO INTEGRANTE

IMPORTANTE:

Ao criar uma escala, permitir selecionar **mais de uma data simultaneamente para a mesma pessoa**.

Exemplo:

Selecionar:

☑ 02/09
☑ 09/09
☑ 16/09
☑ 23/09

Integrante:

João

Função:

VideoMaker

Resultado:

João será automaticamente inserido nos quatro dias selecionados.

Também permitir:

* Seleção individual
* Seleção múltipla
* Copiar escala
* Duplicar escala
* Editar escala
* Remover escala

---

# 23. CONFLITOS DE ESCALA

Criar validação automática.

Se uma pessoa já estiver escalada para determinado horário/data:

Mostrar alerta:

**Este integrante já possui uma escala neste horário.**

Permitir que o administrador confirme ou altere.

---

# 24. RELACIONAMENTOS

Criar database relacional.

Conteúdo ↔ Evento

Conteúdo ↔ Legenda

Conteúdo ↔ Versículo

Conteúdo ↔ Arte

Evento ↔ Conteúdo

Escala ↔ Integrante

Escala ↔ Evento

Todos os relacionamentos devem funcionar de forma bidirecional.

---

# 25. FÓRMULA DE PRODUÇÃO

Calcular automaticamente:

Ideia = 0%

Planejamento = 20%

Produção = 40%

Revisão = 60%

Agendado = 80%

Publicado = 100%

---

# 26. INDICADORES

Criar:

**Taxa de conclusão**

Conteúdos publicados ÷ conteúdos planejados × 100

Criar indicadores de:

* Conteúdos publicados
* Conteúdos planejados
* Conteúdos atrasados
* Conteúdos em produção
* Eventos realizados

---

# 27. RELATÓRIOS

Filtros:

* Hoje
* Semana
* Mês
* Ano
* Período personalizado

Mostrar:

* Conteúdos criados
* Conteúdos publicados
* Conteúdos por categoria
* Conteúdos por responsável
* Eventos realizados
* Taxa de conclusão
* Produção da equipe
* Desempenho do Instagram

Permitir gráficos e exportação quando aplicável.

---

# 28. ATIVIDADES

Criar histórico de atividades.

Registrar:

* Conteúdo criado
* Conteúdo editado
* Conteúdo publicado
* Escala criada
* Evento criado
* Arte adicionada
* Legenda criada
* Usuário adicionado

Exemplo:

**João criou um novo conteúdo**

há 15 minutos.

---

# 29. CONFIGURAÇÕES

Criar:

### Usuários

Gerenciar usuários da igreja.

### Equipe

Gerenciar integrantes.

### Permissões

Criar níveis:

**Administrador**

Acesso total.

**Editor**

Pode criar e editar conteúdos.

**Visualizador**

Pode visualizar informações.

**Equipe de mídia**

Acesso aos conteúdos e escalas relacionados.

**Equipe pastoral**

Acesso para visualizar/aprovar conteúdos.

---

# 30. CORREÇÃO DO BOTÃO EDITAR

Garantir que todos os botões de edição funcionem corretamente.

Especialmente:

* Usuários
* Equipe
* Conteúdos
* Eventos
* Legendas
* Versículos
* Artes
* Escalas

Ao clicar em editar:

Abrir modal preenchido com os dados existentes.

Ao salvar:

Atualizar o banco imediatamente.

Mostrar feedback:

**Alterações salvas com sucesso.**

---

# 31. BANCO DE DADOS

Criar estrutura relacional real.

Entidades principais:

* Users
* Teams
* Contents
* Events
* Verses
* Captions
* Assets
* Schedules
* InstagramAccounts
* InstagramInsights
* Activities

Criar relacionamentos e foreign keys adequadamente.

Garantir persistência real dos dados.

Não utilizar apenas dados mockados.

---

# 32. AUTENTICAÇÃO

Criar:

* Login
* Cadastro
* Recuperação de senha
* Logout
* Controle de sessão

Cada igreja deve possuir seu próprio ambiente.

IMPORTANTE:

Criar arquitetura **multi-tenant**.

Uma igreja não pode acessar dados de outra igreja.

Todos os dados devem possuir associação com o respectivo workspace/igreja.

---

# 33. EXPERIÊNCIA DO USUÁRIO

Todos os botões devem funcionar.

Não criar elementos puramente decorativos.

Todos os formulários devem possuir:

* Validação
* Loading
* Mensagem de sucesso
* Mensagem de erro
* Feedback visual

Criar:

* Toasts
* Skeleton loading
* Empty states
* Error states
* Confirmation dialogs

---

# 34. RESPONSIVIDADE

O Lumina deve funcionar perfeitamente em:

* Desktop
* Notebook
* Tablet
* Mobile

No mobile:

* Sidebar adaptada
* Calendários responsivos
* Cards adaptados
* Kanban com scroll horizontal
* Upload de arquivos pelo dispositivo
* Modais responsivos

---

# 35. PRINCÍPIO CENTRAL DO PRODUTO

O Lumina não deve parecer apenas um calendário.

Ele deve parecer um **sistema operacional da equipe de mídia da igreja**.

A experiência ideal deve permitir:

**Planejar → Criar → Produzir → Revisar → Escalar → Publicar → Analisar**

Tudo dentro do mesmo ambiente.

O sistema deve reduzir a necessidade de:

* Planilhas
* Trello
* Notion
* Google Drive
* WhatsApp para organização
* Ferramentas separadas para calendário
* Ferramentas separadas para escala

---

# 36. DASHBOARD FINAL

Ao entrar no Lumina, o usuário deve visualizar imediatamente:

**Bom dia, [Nome].**

**Aqui está o panorama da mídia da sua igreja.**

KPIs:

Conteúdos este mês
Em produção
Agendados
Publicados
Eventos
Taxa de conclusão

Depois:

### Próximos conteúdos

### Próximos eventos

### Escala de hoje

### Pendências

### Instagram Insights

### Últimas atividades

Criar uma experiência visual limpa e altamente funcional.

---

# 37. QUALIDADE FINAL

Antes de finalizar, verificar toda a aplicação.

Garantir que:

* Nenhum botão esteja sem função.
* Nenhum formulário esteja quebrado.
* Todos os dados sejam persistidos.
* Todos os uploads funcionem.
* Todas as imagens possuam preview.
* URLs de imagens possuam preview quando válidas.
* Google Drive não seja obrigatório.
* Escalas sejam persistidas.
* Integrantes cadastrados permaneçam disponíveis.
* Seleção de múltiplas datas funcione.
* Instagram utilize autenticação oficial.
* Não exista armazenamento de senha do Instagram.
* Dashboard seja atualizado com dados reais disponíveis.
* IA esteja integrada aos módulos de conteúdo.
* Dark Mode funcione.
* Mobile funcione.
* Desktop funcione.
* Permissões funcionem.
* Multi-tenant esteja funcionando.

O resultado final deve parecer um **SaaS profissional, premium, escalável e pronto para comercialização para igrejas**, com o Lumina sendo apresentado como uma plataforma central para organizar toda a operação de mídia e comunicação da igreja.

**Prioridade máxima: funcionalidade real + excelente UX + design premium + simplicidade de uso.**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lumina-church-media.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c1fa3837-78fe-4420-8a7e-87943689fe04).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
