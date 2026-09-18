# Operação da Bebella

## Checklist antes de abrir

- Confirmar `bebella-menu.service` ativo e abrir `https://bebellahotdog.com`.
- Confirmar o gateway Hermes ativo e o WhatsApp conectado.
- Fazer um teste em conversa individual: saudação da Bella, horário, cardápio e disponibilidade.
- Confirmar que uma mensagem em grupo não recebe resposta.

## Testes de atendimento

1. Cliente novo: pedir um hot dog e confirmar quantidades.
2. Adicionar bebida e adicional pelo checkout do site.
3. Escolher entrega: confirmar endereço e localização.
4. Escolher retirada: confirmar o endereço da loja.
5. Escolher Pix: conferir chave `86999312177` e titular Roberto Alves de Araujo.
6. Enviar mensagem fora de segunda a sexta, das 18h às 23h: Bella deve informar que está fechada.
7. Concluir um pedido e enviar nova mensagem: deve começar um novo atendimento.

## Fidelidade

O módulo registra somente pedidos confirmados e mantém o histórico mensal no SQLite.
A cada 20 hot dogs elegíveis, um prêmio de Hot Dog Tradicional fica disponível.

No container Hermes, registre um pedido confirmado usando um identificador único:

```sh
docker exec hermes-agent-g80b-hermes-agent-1 python3 /opt/data/loyalty.py \
  --db /opt/data/bebella-loyalty.sqlite3 record-order \
  --phone 5586999312177 --hotdogs 2 --order-id PEDIDO-123
```

Consulte saldo, resgate um prêmio ou gere o relatório do mês:

```sh
docker exec hermes-agent-g80b-hermes-agent-1 python3 /opt/data/loyalty.py --db /opt/data/bebella-loyalty.sqlite3 balance --phone 5586999312177
docker exec hermes-agent-g80b-hermes-agent-1 python3 /opt/data/loyalty.py --db /opt/data/bebella-loyalty.sqlite3 redeem --phone 5586999312177
docker exec hermes-agent-g80b-hermes-agent-1 python3 /opt/data/loyalty.py --db /opt/data/bebella-loyalty.sqlite3 report --month 2026-09
```

Faça backup do arquivo `bebella-loyalty.sqlite3` junto com os dados do Hermes.

## Emergência

Ver status do site:

```sh
systemctl status bebella-menu.service --no-pager
curl -I https://bebellahotdog.com
```

Ver status do Hermes:

```sh
docker exec hermes-agent-g80b-hermes-agent-1 hermes status
docker exec hermes-agent-g80b-hermes-agent-1 hermes gateway status
```

Se o gateway parar, reinicie:

```sh
docker exec hermes-agent-g80b-hermes-agent-1 hermes gateway restart
```

Se o WhatsApp perder o pareamento, não apague `/opt/data/whatsapp/session`. Execute
`hermes whatsapp` no host e faça um novo pareamento pelo QR code.

## Monitoramento

Verifique diariamente o status do serviço e do gateway. Registre falhas de resposta,
desconexões e pedidos que precisaram de atendimento humano. A integração de mapas não
está ativa; divergências entre endereço e localização devem ser confirmadas manualmente.
