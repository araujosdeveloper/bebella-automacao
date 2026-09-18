# Bebella — Cardápio digital

Aplicação Next.js com produtos, combos, bebidas, adicionais e taxas de entrega.
Os botões abrem o WhatsApp com uma mensagem de pedido; não existe confirmação
automática, carrinho ou registro de pedidos no servidor.

## Desenvolvimento

Utilize Node.js 22 e npm.

```sh
npm ci
npm run dev
```

O catálogo e o número público do WhatsApp ficam em `lib/menu-data.ts`.

## Verificação

```sh
npm run lint
npm run build
npm audit --omit=dev
```

O build utiliza Webpack e gera saída standalone em `.next-build/standalone`.
O antigo patch de filesystem não é carregado pelo comando de build.

## VPS

Código-fonte: `/root/bebella-automacao`.
Runtime: `/opt/bebella/current`, apontando para uma release em `/opt/bebella/releases`.
Serviço: `bebella-menu.service`, com usuário temporário do systemd e porta
`127.0.0.1:3010`. A configuração está em `deploy/bebella-menu.service`.

Uma release precisa conter a saída standalone, `public` e
`.next-build/static`. O diretório `.next-build/cache` da release deve apontar
para `/var/cache/bebella-menu`, criado pelo systemd.

Após validar lint e build, instale uma release com `sudo sh deploy/install-release.sh`.
O instalador preserva as releases anteriores e reinicia somente o serviço Bebella.

```sh
systemctl status bebella-menu
journalctl -u bebella-menu -n 50 --no-pager
curl -I http://127.0.0.1:3010
```

Publicado em https://bebellahotdog.com e https://www.bebellahotdog.com.
O virtual host `/etc/nginx/sites-available/bebellahotdog.com` aponta para essa
porta, redireciona HTTP para HTTPS e utiliza certificado renovado pelo Certbot.
`deploy/bebellahotdog.com.nginx.conf` é apenas o bootstrap HTTP: não sobrescreva
a configuração ativa com ele após a emissão do certificado.

## Atendimento

Hermes Hostinger: container `hermes-agent-g80b-hermes-agent-1`, com dados
persistidos em `/docker/hermes-agent-g80b/data` (dentro do container: `/opt/data`).

`automation/business.json` contém as regras comerciais e campos ainda pendentes.
`automation/instructions.md` define a preparação de pedidos com confirmação humana.
Execute `node scripts/export-hermes.mjs` após mudar o cardápio ou as regras para
regenerar `automation/generated/catalog.json` e `automation/generated/SOUL.md`.
Esses arquivos são snapshots: mudanças no site não atualizam o Hermes automaticamente.

`automation/install-hermes.py` prepara a instalação inicial dentro do container,
com backup, personalidade Bebella e catálogo. A configuração do WhatsApp fica
desativada, sem ferramentas de administração e sem comandos administrativos
para clientes. O marcador de administrador é deliberadamente um identificador
que não corresponde a um telefone; administração permanece local.

Antes da ativação ainda são necessários: provedor de IA autenticado, pareamento
do WhatsApp e confirmação do número.
Horários definidos: segunda a sexta-feira, das 18h às 23h (horário de Timon-MA).
Pagamentos definidos: espécie, Pix e cartão.
Fluxo humano definido: a automação conduz o atendimento; uma pessoa só atua em
último caso, nas exceções previstas nas instruções.
A configuração de `enabled` e da política de mensagens precisa ser
atualizada nessa etapa. A preparação não registra nem confirma pedidos em um
sistema, não notifica a cozinha e não oferece transferência automática a uma pessoa.
Não foram realizados testes de resposta do modelo ou mensagens reais.

Provedor de IA conectado: OpenAI (ChatGPT), usando o modelo `gpt-5.5` no Hermes.
A conexão foi validada com uma resposta de teste; a chave permanece armazenada
no ambiente do Hermes e não é registrada no Git.

Configure credenciais pelo painel do Hermes/Hostinger ou pelo gerenciador de
segredos no servidor, nunca pelo Git ou pelo chat.
