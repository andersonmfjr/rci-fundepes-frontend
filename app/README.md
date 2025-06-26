# RCI Manager Frontend

Sistema de gestão de contratos de Ressarcimento de Custos Indiretos (RCI) para instituições de ensino e pesquisa.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.11-06B6D4?logo=tailwindcss&logoColor=white)

## 📋 Sobre o Projeto

O RCI Manager é uma aplicação web moderna para gestão de contratos de Ressarcimento de Custos Indiretos, desenvolvida para facilitar o controle e acompanhamento de:

- **Contratos de Pesquisa**: Gestão completa de contratos com financiadores
- **Distribuição RCI**: Controle da distribuição de recursos entre unidades acadêmicas
- **Transferências Bancárias**: Acompanhamento de transferências de RCI
- **Aditivos Contratuais**: Histórico de alterações e aditivos nos contratos
- **Hierarquia Institucional**: Estrutura hierárquica de unidades acadêmicas

## 🚀 Tecnologias Utilizadas

### Core

- **React 18.3.1** - Biblioteca principal para interface
- **TypeScript 5.5.3** - Tipagem estática
- **Vite 5.4.1** - Build tool e dev server
- **React Router DOM 6.26.2** - Roteamento

### UI/UX

- **Tailwind CSS 3.4.11** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de interface baseados em Radix UI
- **Lucide React** - Biblioteca de ícones
- **Next Themes** - Suporte a tema escuro/claro

### Formulários e Validação

- **React Hook Form 7.53.0** - Gerenciamento de formulários
- **Zod 3.23.8** - Validação de esquemas
- **@hookform/resolvers** - Integração RHF + Zod

### Estado e Dados

- **TanStack Query 5.56.2** - Gerenciamento de estado do servidor
- **React Dropzone** - Upload de arquivos

### Desenvolvimento

- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (Shadcn/UI)
│   │   ├── auth/           # Componentes de autenticação
│   │   ├── layout/         # Componentes de layout
│   │   ├── project/        # Componentes de projeto
│   │   ├── project-detail/ # Componentes de detalhes
│   │   └── projects/       # Componentes de listagem
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários e configurações
│   │   └── projects/       # Lógica específica de projetos
│   ├── pages/              # Páginas da aplicação
│   ├── types/              # Definições de tipos TypeScript
│   └── utils/              # Funções utilitárias
├── public/                 # Arquivos estáticos
└── docker/                 # Configurações Docker
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd rci-ufal-frontend
   ```

2. **Instale as dependências**

   ```bash
   cd app
   npm install
   ```

3. **Execute o ambiente de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:8080
   ```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run build:dev    # Build para desenvolvimento
npm run preview      # Preview do build

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas automaticamente
```

## 🏗️ Arquitetura

### Modelagem de Dados

O sistema utiliza uma estrutura hierárquica de dados baseada na nova modelagem:

- **Unidades Acadêmicas**: Estrutura hierárquica (instituições → faculdades → institutos)
- **Contratos**: Vinculados diretamente às unidades acadêmicas
- **Financiadores**: Categorizados por tipo (público/privado)
- **Transferências**: Conectadas às distribuições RCI específicas

### Componentes Principais

- **Layout**: Header, Sidebar, Layout principal
- **Projects**: Listagem e filtros de contratos
- **ProjectDetail**: Visualização detalhada com abas
- **Forms**: Formulários com validação robusta
- **UI Components**: Biblioteca de componentes reutilizáveis

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores**: Paleta de cores CSS variables
- **Tipografia**: Sistema tipográfico responsivo
- **Espaçamento**: Grid system do Tailwind
- **Componentes**: Shadcn/UI com customizações
