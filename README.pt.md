# Plugin de servidor MCP para Cocos Creator

🌐 [简体中文](README.md) · [English](README.EN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · **Português** · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md)

Um plugin de servidor MCP (Model Context Protocol) abrangente para o Cocos Creator 3.8+, que permite que assistentes de IA interajam com o editor Cocos Creator por meio de um protocolo padronizado. Instalação e uso em um clique, eliminando toda a complexidade de ambiente e configuração. Já testado com o cliente Claude, o Claude CLI e o Cursor; outros editores, em teoria, também devem funcionar perfeitamente.

**🚀 Agora com 50 ferramentas poderosas e integradas, alcançando 99% de controle do editor!**

## A versão PRO já foi atualizada para a 1.7.8

| Tipo | Link |
|------|------|
| **Prévia em vídeo** | [Vídeo no Bilibili](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **Teste gratuito** | [Link de teste do VberAI Cocos Creator MCP Pro (versão 3.x)](https://www.vberai.com/game-engines/cocos) |
| **Teste gratuito** | [Link de teste do VberAI Cocos Creator MCP Pro (versão 2.x)](https://www.vberai.com/game-engines/cocos2x) |
| **Canvas de design com IA** | [VberAI Studio — a primeira plataforma de design nativa em IA para jogos do mundo](https://studio.vberai.com) |
| **Site oficial** | [Site oficial da VberAI vberai.com](https://www.vberai.com) |

## Recursos da versão Cocos MCP 3.x Pro

> 🚀 A versão Pro é desenvolvida e mantida continuamente pela **VberAI** — [Experimente a versão Pro agora](https://www.vberai.com/game-engines/cocos) ｜ [Assista à demonstração em vídeo](https://www.bilibili.com/video/BV1rTAXzuEH3/)

Um plugin MCP (Model Context Protocol) de nível profissional, criado especificamente para o **Cocos Creator 3.8.6+**, que permite que assistentes de IA controlem o editor diretamente por meio de um protocolo padronizado. **16 ferramentas de nível de intenção** cobrem **231 operações**, abrangendo **12 grandes módulos de capacidade** e percorrendo todo o fluxo de desenvolvimento do Cocos Creator 3.x. Utiliza o protocolo Streamable HTTP, com um design otimizado de Token que economiza mais Token e torna as chamadas mais estáveis, além de suportar configuração em um clique para os principais clientes de IA (Cursor, Claude, Windsurf, etc.).

| Ferramentas de nível de intenção | Operações cobertas | Módulos cobertos | Protocolo de comunicação |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 grandes módulos** | **Streamable HTTP** |

### Doze grandes módulos de capacidade

| Módulo | Nº de operações | Descrição |
|------|---:|------|
| Gerenciamento de cenas | 24 | Abertura, salvamento, criação e troca de cenas, consulta de hierarquia e snapshots, com suporte a desfazer operações e execução de scripts. |
| Operações de nós | 18 | CRUD completo de nós, com suporte a modificações em lote, anexação de scripts, detecção de tipo de nó e operações de área de transferência. |
| Sistema de componentes | 8 | Adição, remoção, consulta e modificação de componentes, além da definição de propriedades, com suporte a vinculação de eventos de clique e configuração de eventos em lote. |
| Sistema de prefabs | 13 | Criação, instanciação e alternância do modo de edição de prefabs, com suporte a aplicar/reverter alterações e validação de prefabs. |
| Gerenciamento de ativos | 19 | Consulta, busca, CRUD e importação de ativos, com suporte a análise de dependências e conversão entre UUID e caminho. |
| Controle do editor | 33 | Operações de nível de editor como configurações do projeto, logs, preferências, build e preview. |
| Visualização de cena | 32 | Gizmo, câmera, grid e imagem de referência, oferecendo contexto de viewport e controle com percepção de limites. |
| Construção de UI e templates | 13 | Criação de componentes de UI em um clique, construção de hierarquias completas de nós a partir de árvores JSON, com diversos templates de UI integrados. |
| Sistema de animação | 39 | Edição de keyframes, ajuste de curvas, eventos de animação, aplicação de presets e gerenciamento de animação de esqueleto Spine. |
| Consulta à base de conhecimento | 8 | Base de conhecimento integrada com propriedades de componentes, regras de design de UI, padrões de layout e melhores práticas, permitindo que a IA auxilie no desenvolvimento com precisão. |
| Validação e snapshots | 6 | Verificação de layout de cena, validação de referências de ativos, análise de hierarquia, com verificação de regressão apoiada em snapshots de cena. |
| Fontes e Label | 9 | Gerenciamento de recursos de fontes e operações de Label com rich text, cobrindo as configurações de composição tipográfica. |

#### Recursos inteligentes

- **Resolução inteligente de caminho** — Todos os parâmetros de nó aceitam UUID, caminho (como `Canvas/Panel/Button`) ou nome, com resolução automática
- **Detecção automática de UI** — Adiciona automaticamente `cc.UITransform` ao criar nós sob um nó pai de UI
- **Contexto de viewport** — Retorna a resolução de design e a área visível ao criar/modificar nós, com aviso automático quando ultrapassa os limites
- **Base de conhecimento integrada** — A IA pode consultar a tabela de propriedades de componentes, regras do sistema de coordenadas, padrões de layout e outros conhecimentos
- **Construtor de cena** — Descreva a hierarquia completa de UI em JSON e construa tudo com uma única chamada, com tratamento automático de Canvas/Camera/configuração de componentes
- **Sistema de imagens de referência** — Sobrepõe o mockup de design de UI na visualização de cena, permitindo que a IA monte a interface olhando para o design
- **Cache da árvore de nós** — Cache com TTL de 2 segundos evita consultas repetidas, invalidado automaticamente após operações de alteração
- **Operações atômicas** — builder/composite utilizam mecanismo de snapshot, com rollback automático em caso de falha

### Versão Pro vs. versão open source

| Funcionalidade | Versão open source | Versão Pro |
|------|:---:|:---:|
| Protocolo de comunicação | Protocolo HTTP | **Streamable HTTP** |
| Otimização de Token | Design básico | Design otimizado, mais economia de Token e mais estabilidade |
| Método de código de operação | ✕ | ✅ |
| Configuração em um clique | ✕ | ✅ |
| Personalização de ferramentas | ✕ | ✅ |
| Ferramentas de nível de reconhecimento de intenção | Ferramentas básicas | 16 tipos, cobrindo 231 operações |
| Criação de cena de uma só vez | ✕ | ✅ |
| Base de conhecimento integrada | ✕ | ✅ |
| Sistema de animação / Spine | ✕ | ✅ 39 operações de animação |

---

## 🌐 Sobre a VberAI — Plataforma de produtividade para jogos nativa em IA

A **VberAI** é uma **plataforma de produtividade para jogos nativa em IA** voltada para desenvolvedores de jogos, equipes de arte e equipes de conteúdo, além de ser a desenvolvedora e mantenedora da versão Pro deste plugin Cocos MCP. A VberAI é atualmente a **única fornecedora que oferece plugins MCP simultaneamente para os três principais motores — Unity, Godot e Cocos Creator**, construindo três linhas de produtos em torno da missão de "fazer a IA realmente se integrar ao pipeline de produção de jogos":

- **🎮 Plugins MCP para motores de jogos** — Executa o serviço MCP dentro do editor do motor, permitindo que clientes de IA como Claude Desktop, Claude Code, Cursor, Windsurf e Cline leiam e operem diretamente cenas, componentes, ativos, animações e scripts.
- **🎨 AI Studio** — Um canvas de design de jogos nativo em IA que importa, de um lado, PSD / Figma / projetos de motor, e exporta, do outro lado, cenas e prefabs para Unity / Cocos / Godot.
- **✂️ AI Super Matting (recorte de imagem com IA)** — Recorte de imagem em um clique direto no navegador, com precisão a nível de fio de cabelo e saída de canal Alpha real, cobrado por uso.

### Família de plugins MCP para motores

| Plugin | Descrição |
|------|------|
| **Unity MCP** | Plugin MCP de nível empresarial, cobrindo cena / GameObject / componente / prefab / material / animação / Shader, com suporte a Unity 2022.3+ e Unity 6 |
| **Cocos MCP 3.x Pro** | A versão Pro deste projeto, 16 ferramentas de nível de intenção / 231 operações, Cocos Creator 3.8.6+, Streamable HTTP |
| **Cocos MCP 2.x Pro** | Criado sob medida para projetos antigos em Cocos Creator 2.4.x+ (projetos 2.x ainda em operação) |
| **Godot MCP** | Totalmente gratuito, open source sob licença MIT, mais de 100 comandos de ferramentas cobrindo 21 sistemas, Godot 4.x, compatível com GDScript e C# |


---

## 🎨 VberAI Studio — A primeira plataforma de design nativa em IA para jogos do mundo

> **Uma plataforma de design nativa em IA criada para jogos.** Compatível desde a base com os motores Unity, Cocos e Godot, com uma grande quantidade de ferramentas de IA de alta frequência e fluxos automatizados, permitindo geração de arte, troca de skin em um clique, gerenciamento de ativos e entrega integrada do design ao motor, além do retorno reverso ao motor — conectando completamente todo o pipeline de desenvolvimento "design com IA → IA no motor de jogo".
>
> 👉 **[Acesse o AI Studio agora](https://studio.vberai.com)** ｜ [Saiba mais](https://www.vberai.com/studio)


### Pipeline de produção completo

**Importação de design e ativos do projeto → Geração e edição de alta frequência com IA → Entrega componentizada ao motor → Sincronização em tempo real com o motor via Engine MCP → Retorno reverso do motor**

Em conjunto com este plugin Cocos MCP, depois que o AI Studio grava de volta cenas, prefabs, componentes e ativos de arte no projeto, o Engine MCP permite que a IA continue no Cocos Creator com scripts, configuração de componentes, gerenciamento de ativos e depuração, formando um ciclo de desenvolvimento fechado de ponta a ponta — aumentando enormemente a eficiência da equipe e permitindo que uma única pessoa seja uma equipe inteira.

**🔗 Links relacionados**: [Site oficial da VberAI](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [AI Super Matting](https://www.vberai.com/ai-studio/bg-removal) ｜ [Preços da plataforma](https://www.vberai.com/pricing) ｜ Contato de suporte: support@vberai.com

---


## Changelog da versão open source

## 🚀 Atualização importante v1.5.4

## Demonstração em vídeo da versão open source atual

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **Simplificação e refatoração de ferramentas**: As mais de 150 ferramentas originais foram condensadas em 50 ferramentas essenciais de alta reutilização e alta cobertura, eliminando todo o código redundante e inválido, o que melhora enormemente a usabilidade e a manutenibilidade.
- **Unificação dos códigos de operação**: Todas as ferramentas adotam o padrão "código de operação + parâmetros", simplificando enormemente o fluxo de chamadas da IA, aumentando a taxa de sucesso das chamadas, reduzindo o número de chamadas necessárias e diminuindo em 50% o consumo de Token.
- **Atualização completa das funcionalidades de prefab**: Corrigidas e aprimoradas por completo todas as funções principais de prefab — criação, instanciação, sincronização e referências — com suporte a relações de referência complexas, 100% alinhado ao formato oficial.
- **Vinculação de eventos e complemento de funcionalidades antigas**: Adicionadas e implementadas a vinculação de eventos e outras funcionalidades legadas de nós/componentes/ativos, com todos os métodos totalmente alinhados à implementação oficial.
- **Otimização de interfaces**: Todos os parâmetros de interface estão mais claros, a documentação está mais completa, tornando mais fácil para a IA entender e realizar chamadas.
- **Otimização do painel do plugin**: Interface do painel mais limpa e operações mais intuitivas.
- **Melhoria de desempenho e compatibilidade**: Arquitetura geral mais eficiente, compatível com todas as versões do Cocos Creator 3.8.6 e superiores.


## Sistema de ferramentas e códigos de operação

- Todas as ferramentas são nomeadas no padrão "categoria_operação", com parâmetros usando um Schema unificado, com suporte à alternância entre múltiplos códigos de operação (action), aumentando enormemente a flexibilidade e a extensibilidade.
- As 50 ferramentas essenciais cobrem todas as operações do editor: cena, nó, componente, prefab, ativo, projeto, depuração, preferências, servidor, transmissão de mensagens, entre outras.
- Exemplo de chamada de ferramenta:

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "MyNode",
    "parentUuid": "parent-uuid",
    "nodeType": "2DNode"
  }
}
```

---

## Principais categorias de funcionalidades (exemplos parciais)

- **scene_management**: Gerenciamento de cenas (obter/abrir/salvar/criar/fechar cena)
- **node_query / node_lifecycle / node_transform**: Consulta, criação, exclusão e alteração de propriedades de nós
- **component_manage / component_script / component_query**: Adição/remoção de componentes, anexação de scripts, informações de componentes
- **prefab_browse / prefab_lifecycle / prefab_instance**: Navegação, criação, instanciação e sincronização de prefabs
- **asset_manage / asset_analyze**: Importação e exclusão de ativos, análise de dependências
- **project_manage / project_build_system**: Execução, build e informações de configuração do projeto
- **debug_console / debug_logs**: Gerenciamento de console e logs
- **preferences_manage**: Preferências
- **server_info**: Informações do servidor
- **broadcast_message**: Transmissão de mensagens


### v1.4.0 - 26 de julho de 2025

#### 🎯 Correções importantes de funcionalidades
- **Correção completa da funcionalidade de criação de prefabs**: Resolvido definitivamente o problema de perda de referências de tipo componente/nó/ativo durante a criação de prefabs
- **Tratamento correto de referências**: Implementado um formato de referência totalmente consistente com prefabs criados manualmente
  - **Referências internas**: Referências de nós e componentes dentro do prefab convertidas corretamente para o formato `{"__id__": x}`
  - **Referências externas**: Referências de nós e componentes fora do prefab definidas corretamente como `null`
  - **Referências de ativos**: Referências a prefabs, texturas, sprite frames e outros ativos preservam integralmente o formato UUID
- **Padronização da API de remoção de componentes/scripts**: Agora, ao remover um componente/script, é obrigatório informar o cid do componente (campo type), não sendo permitido usar o nome do script ou da classe. A IA e os usuários devem primeiro usar getComponents para obter o campo type (cid) e então passá-lo para removeComponent. Isso garante a remoção 100% precisa de todos os tipos de componentes e scripts, com compatibilidade com todas as versões do Cocos Creator.

#### 🔧 Melhorias principais
- **Otimização da ordem de índices**: Ajustada a ordem de criação dos objetos do prefab para garantir consistência com o formato padrão do Cocos Creator
- **Suporte a tipos de componentes**: Detecção de referências de componentes ampliada para suportar todos os tipos de componentes com prefixo cc. (Label, Button, Sprite, etc.)
- **Mecanismo de mapeamento de UUID**: Aprimorado o sistema de mapeamento de UUID interno para índice, garantindo o estabelecimento correto das relações de referência
- **Padronização do formato de propriedades**: Corrigidos a ordem e o formato das propriedades de componentes, eliminando erros de análise do motor

#### 🐛 Correções de erros
- **Correção de erro de importação de prefab**: Resolvido o erro `Cannot read properties of undefined (reading '_name')`
- **Correção de compatibilidade do motor**: Resolvido o erro `placeHolder.initDefault is not a function`
- **Correção de sobrescrita de propriedades**: Evitada a sobrescrita de propriedades críticas como `_objFlags` pelos dados dos componentes
- **Correção de perda de referências**: Garantido que todos os tipos de referência sejam salvos e carregados corretamente

#### 📈 Aprimoramentos de funcionalidades
- **Preservação completa das propriedades de componentes**: Todas as propriedades de componentes, incluindo propriedades privadas (como _group, _density, etc.)
- **Suporte à estrutura de nós filhos**: Processamento correto da estrutura hierárquica do prefab e das relações entre nós filhos
- **Processamento de propriedades de transformação**: Preservação da posição, rotação, escala e informações de camada do nó
- **Otimização das informações de depuração**: Adicionados logs detalhados de processamento de referências, facilitando o rastreamento de problemas

#### 💡 Avanços técnicos
- **Identificação do tipo de referência**: Distinção inteligente entre referências internas e externas, evitando referências inválidas
- **Compatibilidade de formato**: Os prefabs gerados são 100% compatíveis com o formato de prefabs criados manualmente
- **Integração com o motor**: Os prefabs podem ser anexados normalmente às cenas, sem nenhum erro em tempo de execução
- **Otimização de desempenho**: Fluxo de criação de prefabs otimizado, melhorando a eficiência de processamento de prefabs grandes

**🎉 Agora a funcionalidade de criação de prefabs está totalmente operacional, com suporte a relações complexas de referência de componentes e estruturas completas de prefab!**

### v1.3.0 - 25 de julho de 2024

#### 🆕 Novas funcionalidades
- **Painel integrado de gerenciamento de ferramentas**: Adicionada funcionalidade abrangente de gerenciamento de ferramentas diretamente no painel de controle principal
- **Sistema de configuração de ferramentas**: Implementada a ativação/desativação seletiva de ferramentas, com suporte a configuração persistente
- **Carregamento dinâmico de ferramentas**: Aprimorada a funcionalidade de descoberta de ferramentas, capaz de carregar dinamicamente todas as 158 ferramentas disponíveis no servidor MCP
- **Gerenciamento em tempo real do estado das ferramentas**: Adicionada atualização em tempo real da contagem e do estado das ferramentas, refletindo imediatamente quando uma ferramenta individual é alternada
- **Persistência de configuração**: Salvamento e carregamento automático das configurações de ferramentas entre sessões do editor

#### 🔧 Melhorias
- **Interface de painel unificada**: Gerenciamento de ferramentas incorporado ao painel principal do servidor MCP como uma aba, eliminando a necessidade de um painel separado
- **Configurações de servidor aprimoradas**: Melhorado o gerenciamento de configuração do servidor, com melhor persistência e carregamento
- **Integração com Vue 3**: Atualizado para a Composition API do Vue 3, proporcionando melhor reatividade e desempenho
- **Melhor tratamento de erros**: Adicionado tratamento abrangente de erros, incluindo mecanismo de rollback para operações com falha
- **UI/UX aprimorados**: Design visual aprimorado, com separadores adequados, estilos de bloco distintos e fundos de modal não transparentes

#### 🐛 Correções de erros
- **Correção da persistência do estado das ferramentas**: Resolvido o problema de reinicialização do estado das ferramentas ao trocar de aba ou reabrir o painel
- **Correção do carregamento de configuração**: Corrigidos problemas de carregamento das configurações do servidor e de registro de mensagens
- **Correção da interação com checkboxes**: Resolvido o problema de desmarcação de checkboxes e melhorada a responsividade
- **Correção da rolagem do painel**: Garantida a funcionalidade correta de rolagem no painel de gerenciamento de ferramentas
- **Correção da comunicação IPC**: Resolvidos diversos problemas de comunicação IPC entre o frontend e o backend

#### 🏗️ Melhorias técnicas
- **Arquitetura simplificada**: Removida a complexidade de múltiplas configurações, com foco no gerenciamento de uma única configuração
- **Melhor segurança de tipos**: Aprimoradas as definições de tipos e interfaces do TypeScript
- **Sincronização de dados aprimorada**: Melhor sincronização entre o estado da UI do frontend e o gerenciador de ferramentas do backend
- **Depuração aprimorada**: Adicionados recursos abrangentes de registro de logs e depuração

#### 📊 Estatísticas
- **Total de ferramentas**: Aumentado de 151 para 158 ferramentas
- **Categorias**: 13 categorias de ferramentas, com cobertura abrangente
- **Controle do editor**: Alcançada uma cobertura de 98% das funcionalidades do editor

### v1.2.0 - Versão anterior
- Lançamento inicial, com 151 ferramentas
- Funcionalidade básica de servidor MCP
- Operações de cena, nó, componente e prefab
- Ferramentas de controle de projeto e depuração



## Uso rápido

**Configuração do Claude CLI:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp（use o número de porta que você configurou）
```

**Configuração do cliente Claude:**

```
{

  "mcpServers": {

		"cocos-creator": {

 		"type": "http",

		"url": "http://127.0.0.1:3000/mcp"

		 }

	  }

}
```

**Configuração de MCP para Cursor ou ferramentas similares de VS**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## Funcionalidades

### 🎯 Operações de cena (scene_*)
- **scene_management**: Gerenciamento de cenas - Obter a cena atual, abrir/salvar/criar/fechar cenas, com suporte a consulta de lista de cenas
- **scene_hierarchy**: Hierarquia de cena - Obter a estrutura completa da cena, com suporte à inclusão de informações de componentes
- **scene_execution_control**: Controle de execução - Executar métodos de componentes, scripts de cena, sincronização de prefabs

### 🎮 Operações de nós (node_*)
- **node_query**: Consulta de nós - Buscar nós por nome/padrão, obter informações do nó, detectar tipo 2D/3D
- **node_lifecycle**: Ciclo de vida do nó - Criar/excluir nós, com suporte a pré-instalação de componentes e instanciação de prefabs
- **node_transform**: Transformação de nós - Modificar nome, posição, rotação, escala, visibilidade e outras propriedades do nó
- **node_hierarchy**: Hierarquia de nós - Mover, copiar, colar nós, com suporte a operações de estrutura hierárquica
- **node_clipboard**: Área de transferência de nós - Operações de copiar/colar/recortar nós
- **node_property_management**: Gerenciamento de propriedades - Redefinir propriedades do nó, propriedades de componentes e propriedades de transformação

### 🔧 Operações de componentes (component_*)
- **component_manage**: Gerenciamento de componentes - Adicionar/remover componentes do motor (cc.Sprite, cc.Button, etc.)
- **component_script**: Componentes de script - Anexar/remover componentes de script personalizados
- **component_query**: Consulta de componentes - Obter lista de componentes, informações detalhadas, tipos de componentes disponíveis
- **set_component_property**: Definição de propriedades - Definir o valor de uma ou várias propriedades de componentes

### 📦 Operações de prefab (prefab_*)
- **prefab_browse**: Navegação de prefabs - Listar prefabs, visualizar informações, validar arquivos
- **prefab_lifecycle**: Ciclo de vida do prefab - Criar prefab a partir de um nó, excluir prefab
- **prefab_instance**: Instâncias de prefab - Instanciar na cena, desvincular, aplicar alterações, restaurar o original
- **prefab_edit**: Edição de prefab - Entrar/sair do modo de edição, salvar prefab, testar alterações

### 🚀 Controle de projeto (project_*)
- **project_manage**: Gerenciamento de projeto - Executar projeto, compilar projeto, obter informações e configurações do projeto
- **project_build_system**: Sistema de build - Controlar o painel de build, verificar o status do build, gerenciar o servidor de preview

### 🔍 Ferramentas de depuração (debug_*)
- **debug_console**: Gerenciamento de console - Obter/limpar logs do console, com suporte a filtragem e limitação
- **debug_logs**: Análise de logs - Ler/buscar/analisar arquivos de log do projeto, com suporte a correspondência de padrões
- **debug_system**: Depuração do sistema - Obter informações do editor, estatísticas de desempenho, informações do ambiente

### 📁 Gerenciamento de ativos (asset_*)
- **asset_manage**: Gerenciamento de ativos - Importação/exclusão de ativos em lote, salvar metadados, gerar URL
- **asset_analyze**: Análise de ativos - Obter relações de dependência, exportar lista de ativos
- **asset_system**: Sistema de ativos - Atualizar ativos, consultar o status do banco de dados de ativos
- **asset_query**: Consulta de ativos - Consultar ativos por tipo/pasta, obter informações detalhadas
- **asset_operations**: Operações de ativos - Criar/copiar/mover/excluir/salvar/reimportar ativos

### ⚙️ Preferências (preferences_*)
- **preferences_manage**: Gerenciamento de preferências - Obter/definir as preferências do editor
- **preferences_global**: Configurações globais - Gerenciar configurações globais e do sistema

### 🌐 Servidor e transmissão (server_* / broadcast_*)
- **server_info**: Informações do servidor - Obter o status do servidor, detalhes do projeto, informações do ambiente
- **broadcast_message**: Transmissão de mensagens - Escutar e transmitir mensagens personalizadas

### 🖼️ Imagens de referência (referenceImage_*)
- **reference_image_manage**: Gerenciamento de imagens de referência - Adicionar/remover/gerenciar imagens de referência na visualização de cena
- **reference_image_view**: Visualização de imagens de referência - Controlar a exibição e edição de imagens de referência

### 🎨 Visualização de cena (sceneView_*)
- **scene_view_control**: Controle da visualização de cena - Controlar ferramentas Gizmo, sistema de coordenadas, modos de visualização
- **scene_view_tools**: Ferramentas da visualização de cena - Gerenciar as diversas ferramentas e opções da visualização de cena

### ✅ Ferramentas de validação (validation_*)
- **validation_scene**: Validação de cena - Validar a integridade da cena, verificar ativos ausentes
- **validation_asset**: Validação de ativos - Validar referências de ativos, verificar a integridade dos ativos

### 🛠️ Gerenciamento de ferramentas
- **Sistema de configuração de ferramentas**: Ativação/desativação seletiva de ferramentas, com suporte a múltiplos conjuntos de configuração
- **Persistência de configuração**: Salvamento e carregamento automático das configurações de ferramentas
- **Importação/exportação de configuração**: Suporte à importação e exportação das configurações de ferramentas
- **Gerenciamento de estado em tempo real**: Atualização e sincronização em tempo real do estado das ferramentas

### 🚀 Principais vantagens
- **Unificação dos códigos de operação**: Todas as ferramentas seguem a nomenclatura "categoria_operação", com Schema de parâmetros unificado
- **Alta reutilização**: 50 ferramentas essenciais cobrem 99% das funcionalidades do editor
- **Amigável para IA**: Parâmetros claros, documentação completa, chamadas simples
- **Otimização de desempenho**: Redução de 50% no consumo de Token, aumento da taxa de sucesso das chamadas de IA
- **Total compatibilidade**: 100% alinhado com a API oficial do Cocos Creator

## ⚠️ Leia antes de instalar (importante)

> **Antes da primeira instalação ou de uma atualização, é imprescindível excluir os dois arquivos `mcp-server.json` e `tool-manager.json` do diretório `settings/` do seu projeto atual; caso contrário, a exibição da lista de ferramentas do plugin apresentará anomalias!**
>
> Caminho dos arquivos: `seu-projeto/settings/mcp-server.json` e `seu-projeto/settings/tool-manager.json`
> Após excluir esses dois arquivos, basta reabrir o painel do plugin para que tudo volte ao normal.

## Instruções de instalação

### 1. Copie os arquivos do plugin

Copie a pasta `cocos-mcp-server` inteira para o diretório `extensions` do seu projeto Cocos Creator; você também pode importar o projeto diretamente pelo gerenciador de extensões:

```
seu-projeto/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- coloque o plugin aqui
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. Instale as dependências

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. Compile o plugin

```bash
npm run build
```

### 4. Ative o plugin

1. Reinicie o Cocos Creator ou atualize as extensões
2. O plugin aparecerá no menu de extensões
3. Clique em `Extensão > Cocos MCP Server` para abrir o painel de controle

## Como usar

### Iniciar o servidor

1. Abra o painel do servidor MCP em `Extensão > Cocos MCP Server`
2. Configure as opções:
   - **Porta**: Porta do servidor HTTP (padrão: 3000)
   - **Início automático**: Inicia o servidor automaticamente quando o editor é aberto
   - **Log de depuração**: Ativa logs detalhados para depuração durante o desenvolvimento
   - **Número máximo de conexões**: Número máximo de conexões simultâneas permitidas

3. Clique em "Iniciar servidor" para começar a aceitar conexões

### Conectar assistentes de IA

O servidor disponibiliza um endpoint HTTP em `http://localhost:3000/mcp` (ou na porta que você configurou).

Assistentes de IA podem se conectar usando o protocolo MCP e acessar todas as ferramentas disponíveis.


## Desenvolvimento

### Estrutura do projeto
```
cocos-mcp-server/
├── source/                    # Arquivos-fonte TypeScript
│   ├── main.ts               # Ponto de entrada do plugin
│   ├── mcp-server.ts         # Implementação do servidor MCP
│   ├── settings.ts           # Gerenciamento de configurações
│   ├── types/                # Definições de tipos TypeScript
│   ├── tools/                # Implementação das ferramentas
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (integrado a node-tools.ts e scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # Implementação dos painéis de UI
│   └── test/                 # Arquivos de teste
├── dist/                     # Saída JavaScript compilada
├── static/                   # Recursos estáticos (ícones, etc.)
├── i18n/                     # Arquivos de internacionalização
├── package.json              # Configuração do plugin
└── tsconfig.json             # Configuração do TypeScript
```

### Compilando a partir do código-fonte

```bash
# Instalar dependências
npm install

# Compilação de desenvolvimento (modo de observação)
npm run watch

# Compilação de produção
npm run build
```

### Adicionando novas ferramentas

1. Crie uma nova classe de ferramenta em `source/tools/`
2. Implemente a interface `ToolExecutor`
3. Adicione a ferramenta à inicialização em `mcp-server.ts`
4. A ferramenta será automaticamente exposta através do protocolo MCP

### Suporte a TypeScript

O plugin é totalmente escrito em TypeScript e conta com:
- Verificação estrita de tipos habilitada
- Definições de tipos abrangentes para todas as APIs
- Suporte a IntelliSense durante o desenvolvimento
- Compilação automática para JavaScript

## Solução de problemas

### Problemas comuns

1. **O servidor não inicia**: Verifique a disponibilidade da porta e as configurações do firewall
2. **As ferramentas não funcionam**: Certifique-se de que a cena esteja carregada e que os UUIDs sejam válidos
3. **Erros de build**: Execute `npm run build` para verificar erros de TypeScript
4. **Problemas de conexão**: Verifique a URL HTTP e o status do servidor

### Modo de depuração

Ative o log de depuração no painel do plugin para obter registros detalhados das operações.

### Usando ferramentas de depuração

```json
{
  "tool": "debug_get_console_logs",
  "arguments": {"limit": 50, "filter": "error"}
}
```

```json
{
  "tool": "debug_validate_scene",
  "arguments": {"checkMissingAssets": true}
}
```

## Requisitos do sistema

- Cocos Creator 3.8.6 ou superior
- Node.js (incluído com o Cocos Creator)
- TypeScript (instalado como dependência de desenvolvimento)

## Licença

Este plugin destina-se ao uso em projetos Cocos Creator, e o código-fonte é distribuído junto com ele, podendo ser usado para fins de estudo e troca de conhecimento. Não há criptografia. Ele pode ser usado como base para seu próprio desenvolvimento e otimização secundários; porém, nenhum código deste projeto ou código derivado dele pode ser usado para fins comerciais ou revenda. Caso precise de uso comercial, entre em contato comigo.

## Entre em contato para participar do grupo
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
