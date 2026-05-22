# Reachify

## Visão Geral

O **Reachify** é uma plataforma SaaS de automação comercial, atendimento inteligente e gestão de relacionamento com clientes. O projeto foi pensado para empresas que precisam centralizar o atendimento, organizar contatos, acompanhar cobranças e automatizar processos com apoio de Inteligência Artificial.

A proposta é reunir, em um único sistema:

- atendimento multiusuário via WhatsApp;
- CRM para contatos, leads e oportunidades;
- cobranças automáticas por WhatsApp e e-mail;
- gestão de produtos e serviços;
- histórico completo por cliente;
- automações operacionais e comerciais;
- recursos de IA aplicados ao atendimento e à comunicação.

## Propósito do Projeto

O Reachify existe para ajudar empresas a:

- vender mais com organização comercial;
- atender melhor com histórico centralizado;
- reduzir tarefas repetitivas com automação;
- acompanhar cobranças e inadimplência com mais controle;
- usar IA para ganhar produtividade no atendimento.

## Objetivos Principais

- Criar uma base SaaS multiempresa com isolamento de dados por cliente.
- Oferecer uma operação centralizada de atendimento e relacionamento.
- Estruturar um CRM simples, prático e escalável.
- Automatizar comunicações de cobrança e relacionamento.
- Adicionar recursos de IA úteis para a rotina comercial.
- Disponibilizar gestão de planos, usuários e permissões.

## Decisão Oficial de IA

Para manter consistência técnica no desenvolvimento do produto, o **Reachify adotará a OpenAI como provider oficial de Inteligência Artificial**.

Essa decisão vale, neste momento, para:

- agentes de atendimento criados pelos clientes;
- chatbots de cobrança automática;
- geração de respostas;
- resumos de conversa;
- classificação de intenção;
- automações baseadas em IA.

### Diretriz para o time de desenvolvimento

- A integração principal de IA deve ser construída sobre a API da OpenAI.
- A arquitetura deve permitir abstração futura por provider, mas a implementação inicial deve priorizar OpenAI.
- Prompts, tools, regras de negócio e logs de execução devem ser pensados para agentes multiempresa.
- Fluxos sensíveis, como cobrança automática, devem usar regras explícitas e trilha de auditoria.

## Como Funcionará a Criação de Agentes

No Reachify, cada empresa poderá criar, configurar e gerenciar seus próprios agentes de atendimento conforme sua operação, setor, tom de voz e regras comerciais.

O objetivo é permitir que o usuário monte agentes especializados para diferentes contextos, como:

- vendas;
- pré-atendimento;
- suporte;
- cobrança;
- qualificação de leads;
- recuperação de clientes;
- atendimento técnico;
- setores específicos, como cibersegurança, saúde, educação, serviços ou varejo.

### Observação importante

A divisão em vários agentes será **opcional**.

Se o usuário quiser operar com **apenas um único agente**, isso também deverá ser suportado pelo sistema. Nesse caso, um único agente poderá concentrar várias funções ao mesmo tempo, como:

- atendimento inicial;
- resposta comercial;
- qualificação de leads;
- suporte básico;
- cobrança;
- transferência para humano quando necessário.

Ou seja, o Reachify deve permitir tanto:

- um único agente geral para fazer todo o atendimento;
- quanto vários agentes separados por setor, objetivo, canal ou etapa da operação.

### Estrutura base de cada agente

Cada agente deverá possuir uma configuração própria no sistema.

#### 1. Nome do agente

Identifica o agente dentro da operação da empresa.

**Exemplo**

- `Agente Cibersegurança`
- `Agente Cobrança`
- `Agente Pré-vendas`

#### 2. Objetivo do agente

Define com clareza o que aquele agente deve fazer.

**Exemplo**

- vender produtos de cibersegurança;
- responder dúvidas comerciais;
- cobrar clientes inadimplentes;
- qualificar leads antes de transferir ao time humano.

#### 3. Base de conhecimento

Cada agente poderá utilizar uma base de conhecimento própria para responder, orientar ou vender com mais precisão.

**Fontes previstas**

- PDFs;
- textos;
- links;
- FAQs;
- catálogo de produtos;
- políticas comerciais;
- scripts internos;
- documentos institucionais.

#### 4. Tom de atendimento

O usuário poderá definir como o agente deve se comunicar.

**Exemplos**

- formal;
- consultivo;
- direto;
- técnico;
- amigável;
- comercial;
- acolhedor.

#### 5. Regras do agente

Cada agente poderá seguir regras específicas de negócio e comportamento.

**Exemplos**

- `Não oferecer desconto acima de 10%.`
- `Sempre coletar nome, telefone e e-mail.`
- `Se o cliente pedir proposta, transferir para humano.`
- `Não confirmar prazos sem consultar a política comercial.`
- `Encerrar atendimento de cobrança com link de pagamento quando disponível.`

#### 6. Canal de atuação

O agente poderá ser configurado para atuar em canais específicos da operação.

**Canais previstos**

- WhatsApp;
- e-mail;
- site;
- formulário;
- CRM.

#### 7. Gatilhos de ativação

O agente poderá ser ativado por palavras-chave, categorias, origem do contato ou contexto da conversa.

**Exemplos**

- palavras como `preço`, `orçamento`, `proposta`;
- intenção identificada como `cobrança`;
- lead vindo de formulário comercial;
- cliente entrando em uma fila específica do atendimento.

## Gestão dos Agentes pelo Usuário

O Reachify será pensado para que o próprio usuário da plataforma consiga configurar seus agentes com autonomia, sem depender do time técnico para cada ajuste operacional.

### O que o usuário poderá gerenciar

- nome e descrição do agente;
- objetivo principal;
- setor ou tipo de atendimento;
- base de conhecimento;
- estilo de comunicação;
- regras e limitações;
- canal onde o agente atua;
- gatilhos de ativação;
- momento de transferir para humano;
- mensagens iniciais e instruções operacionais.

### Visão de produto

Na prática, isso significa que uma mesma empresa poderá escolher entre dois modelos:

- operar com um único agente central;
- operar com vários agentes especializados.

#### Exemplo com um único agente

- um agente geral que atende, responde dúvidas, qualifica leads, envia cobranças e transfere para humano quando necessário.

#### Exemplo com vários agentes

- um agente comercial para captar leads;
- um agente de cobrança para inadimplência;
- um agente de suporte para perguntas frequentes;
- um agente técnico para linhas de produto específicas.

Quando houver mais de um agente, cada um deles terá comportamento, objetivo, conhecimento e regras próprias.

### Diretriz para o time de desenvolvimento

- O sistema deve permitir um único agente por empresa ou múltiplos agentes por empresa.
- A divisão por setores ou tipos de atendimento deve ser opcional.
- Cada agente deve possuir configuração isolada.
- A base de conhecimento deve ser vinculada por agente.
- Regras e instruções devem ser persistidas de forma estruturada.
- O fluxo deve permitir ativação por canal, gatilho e contexto.
- Deve existir possibilidade de transferência para atendimento humano.
- A modelagem precisa suportar futura expansão para agentes mais complexos, com ferramentas, memória e automações por etapa.

## Serviços de Terceiros Oficiais do Projeto

Para o MVP e para a evolução da plataforma, o Reachify adotará os seguintes serviços de terceiros como padrão inicial:

- **OpenAI** para agentes, automações e recursos de Inteligência Artificial;
- **Z-API** para conexão inicial com WhatsApp via QR Code no MVP;
- **Resend** para e-mails transacionais;
- **Asaas** para cobranças, assinaturas e operações financeiras.

### Diretriz para o time de desenvolvimento

- A integração principal de IA deve usar OpenAI.
- A integração principal de WhatsApp no MVP deve usar Z-API.
- E-mails transacionais devem ser planejados para uso com Resend.
- Cobranças, links de pagamento e assinaturas devem ser planejados para uso com Asaas.
- A arquitetura deve manter abstrações para permitir substituição futura de integrações críticas.

## Estratégia de WhatsApp do Projeto

O Reachify **usará Z-API no MVP** para acelerar a entrega da funcionalidade de conexão de números por QR Code e operação por instâncias.

### Fluxo esperado no MVP

1. O usuário entra no Reachify.
2. O usuário clica em `Conectar WhatsApp`.
3. O backend cria uma nova instância na Z-API.
4. A Z-API retorna os dados de conexão da instância, incluindo QR Code e token de integração.
5. O usuário escaneia o QR Code pelo WhatsApp.
6. O número conectado passa a aparecer no painel.
7. As mensagens recebidas passam a alimentar `Dashboard > Conversas`.

### Motivos para usar Z-API no MVP

- conexão por QR Code;
- operação por instâncias;
- token de integração por instância;
- uso de webhooks;
- envio e recebimento de mensagens;
- suporte a mídia;
- boa adaptação para integrações SaaS.

### Estratégia de evolução

Embora a Z-API seja a escolha inicial do MVP, a direção oficial do produto é **migrar depois para a WhatsApp Cloud API oficial da Meta**, ou oferecer essa opção como integração profissional/oficial da plataforma.

### Diretriz para o time de desenvolvimento

- O módulo de WhatsApp deve nascer com abstração por provider.
- A implementação inicial deve priorizar Z-API.
- O contrato interno do sistema não deve ficar acoplado ao formato específico da Z-API.
- Sessões, mensagens, webhooks, anexos e status devem ser modelados pensando em futura compatibilidade com a API oficial da Meta.
- A migração futura para a Cloud API da Meta deve exigir o mínimo possível de refatoração no domínio da aplicação.

## Principais Módulos do Sistema

### 1. Autenticação e Acesso

Responsável pelo controle de entrada no sistema e pela segurança de acesso.

**Funcionalidades previstas**

- login;
- cadastro de usuários;
- recuperação de senha;
- controle de sessão;
- permissões por perfil.

**Perfis iniciais**

- Administrador SaaS;
- Dono da empresa;
- Gestor;
- Atendente;
- Financeiro.

### 2. Empresas e Workspaces

Cada cliente do Reachify deve possuir seu próprio ambiente de trabalho, com dados isolados e regras definidas pelo plano contratado.

**Funcionalidades previstas**

- cadastro da empresa;
- configurações da empresa;
- vínculo de usuários;
- limites por plano;
- separação de dados por empresa.

### 3. CRM

Módulo voltado à organização de contatos, leads e oportunidades comerciais.

**Funcionalidades previstas**

- cadastro de contatos;
- cadastro de leads;
- histórico do cliente;
- anotações internas;
- etiquetas;
- status do cliente;
- funil de vendas;
- kanban comercial.

### 4. Multiatendimento via WhatsApp

Módulo de atendimento compartilhado para equipes comerciais e de suporte.

**Funcionalidades previstas**

- conexão inicial via Z-API no MVP;
- conexão com número de WhatsApp;
- caixa de entrada compartilhada;
- atribuição de atendente;
- transferência de atendimento;
- mensagens rápidas;
- histórico de conversa;
- status da conversa;
- filtros por atendente, etiqueta e situação.

### 5. Cobranças

Módulo dedicado ao controle financeiro e ao acompanhamento de cobranças por cliente.

**Funcionalidades previstas**

- cadastro de cobranças;
- controle de parcelas;
- vencimentos;
- status de pagamento;
- clientes inadimplentes;
- lembretes por WhatsApp;
- lembretes por e-mail;
- link de pagamento;
- histórico financeiro por cliente.

**Status iniciais**

- Pendente;
- Pago;
- Atrasado;
- Cancelado.

### 6. Inteligência Artificial

Camada de apoio para acelerar o atendimento, padronizar respostas e automatizar tarefas de comunicação.

**Recursos previstos**

- sugestão de respostas para atendentes;
- resumo automático de conversas;
- classificação da intenção do cliente;
- geração de mensagens de cobrança;
- geração de mensagens comerciais;
- atendimento inicial automatizado;
- base de conhecimento da empresa.

## Tecnologias Principais

### Frontend

- React.js
- Vite
- React Icons

### Backend

- PHP
- MySQL
- XAMPP
- API REST
- Z-API
- Resend
- Asaas

## Estrutura Inicial de Pastas

```text
Reachify/
|-- Frontend/
|   |-- public/
|   |-- src/
|   |   |-- assets/
|   |   |-- App.css
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .gitignore
|   |-- index.html
|   |-- package-lock.json
|   |-- package.json
|   |-- vite.config.js
|   `-- eslint.config.js
|-- Backend/
`-- README.md
```

### Observação sobre a estrutura

- O `Frontend/` será iniciado com a base padrão do React + Vite.
- O `Backend/` permanecerá vazio por enquanto, até a definição da primeira camada da API.
- As subpastas avançadas do frontend e backend serão criadas conforme a implementação evoluir.

## Modelo Inicial de Banco de Dados

### Tabelas sugeridas

- `users`
- `companies`
- `plans`
- `subscriptions`
- `contacts`
- `conversations`
- `messages`
- `tickets`
- `tags`
- `kanban_columns`
- `deals`
- `products`
- `services`
- `charges`
- `payments`
- `ai_logs`
- `automation_rules`
- `whatsapp_sessions`
- `email_templates`

## Rotas Iniciais da API

### Autenticação

```http
POST /api/login
POST /api/register
POST /api/logout
GET  /api/me
```

### Empresas

```http
GET    /api/companies
POST   /api/companies
GET    /api/companies/{id}
PUT    /api/companies/{id}
DELETE /api/companies/{id}
```

### Contatos

```http
GET    /api/contacts
POST   /api/contacts
GET    /api/contacts/{id}
PUT    /api/contacts/{id}
DELETE /api/contacts/{id}
```

### Conversas

```http
GET  /api/conversations
GET  /api/conversations/{id}
POST /api/conversations/{id}/messages
```

### Cobranças

```http
GET    /api/charges
POST   /api/charges
GET    /api/charges/{id}
PUT    /api/charges/{id}
DELETE /api/charges/{id}
```

### Inteligência Artificial

```http
POST /api/ai/suggest-response
POST /api/ai/summarize-conversation
POST /api/ai/generate-charge-message
```

## Padrão de Resposta da API

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso.",
  "data": {}
}
```

### Erro

```json
{
  "success": false,
  "message": "Erro ao realizar operação.",
  "errors": []
}
```

## Instalação do Frontend

```bash
cd Frontend
npm install
npm install react-icons
npm run dev
```

## Configuração do Backend

O diretório `Backend/` será mantido vazio nesta fase inicial. A estrutura do backend será definida depois da base do frontend e da primeira especificação da API.

## Roadmap Inicial

### Fase 1. Base do SaaS

- estrutura de pastas;
- configuração do frontend;
- configuração do backend;
- conexão com banco de dados;
- sistema de login;
- cadastro de empresas;
- cadastro de usuários.

### Fase 2. CRM

- cadastro de contatos;
- histórico do cliente;
- etiquetas;
- anotações;
- funil em kanban.

### Fase 3. Atendimento

- tela de conversas;
- caixa de entrada;
- gestão de atendentes;
- status de atendimento;
- mensagens rápidas.

### Fase 4. Cobranças

- cadastro de cobranças;
- parcelas;
- vencimentos;
- mensagens automáticas;
- integração com meio de pagamento.

### Fase 5. IA

- sugestão de resposta;
- resumo de conversa;
- mensagens automáticas;
- classificação de atendimento.

### Fase 6. Planos SaaS

- planos Free, Pro e Premium;
- limites por plano;
- assinaturas;
- controle de uso.

## Direção do Produto

O Reachify deve seguir uma identidade moderna, clara e profissional, com foco em simplicidade operacional.

**Diretrizes**

- interface clara;
- dashboard objetivo;
- cards com cantos arredondados;
- cores suaves;
- boa separação entre módulos;
- experiência simples para usuários não técnicos.

**Páginas iniciais sugeridas**

- Login;
- Cadastro;
- Dashboard;
- Contatos;
- Conversas;
- CRM;
- Cobranças;
- Automações;
- IA;
- Configurações;
- Planos.

## Nome do Projeto

**Reachify** representa a ideia de ampliar o alcance da empresa, melhorar o relacionamento com clientes e automatizar interações de forma inteligente.

## Status do Projeto

- Fase atual: estruturação inicial;
- IA oficial do projeto: OpenAI;
- WhatsApp oficial do MVP: Z-API;
- Estratégia futura de WhatsApp: migração para API oficial da Meta;
- Frontend inicial: React + Vite + React Icons;
- Backend inicial: pasta reservada, ainda sem implementação;
- Versão inicial: `0.1.0`.
