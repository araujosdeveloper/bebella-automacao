#!/usr/bin/env python3
"""Livro de pedidos da Bebella e confirmação para a fidelidade."""
from __future__ import annotations

import argparse
import secrets
import sqlite3
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

DB = Path("/opt/data/bebella-orders.sqlite3")
LOYALTY_DB = Path("/opt/data/bebella-loyalty.sqlite3")
STATUSES = {"aguardando_cliente", "aguardando_loja", "confirmado", "cancelado"}


def phone(value: str) -> str:
    result = "".join(ch for ch in value if ch.isdigit())
    if len(result) < 10:
        raise ValueError("informe um telefone com DDD")
    return result


def db(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS orders (
          code TEXT PRIMARY KEY,
          phone TEXT NOT NULL,
          customer_name TEXT,
          summary TEXT NOT NULL,
          eligible_hotdogs INTEGER NOT NULL CHECK (eligible_hotdogs >= 0),
          month TEXT NOT NULL,
          status TEXT NOT NULL CHECK(status IN ('aguardando_cliente','aguardando_loja','confirmado','cancelado')),
          created_at TEXT NOT NULL,
          customer_confirmed_at TEXT,
          store_confirmed_at TEXT,
          cancelled_at TEXT
        );
        CREATE INDEX IF NOT EXISTS orders_phone_status ON orders(phone, status);
        CREATE INDEX IF NOT EXISTS orders_month ON orders(month);
        """
    )
    return conn


def stamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_code() -> str:
    return "BEB-" + datetime.now().strftime("%Y%m%d") + "-" + secrets.token_hex(2).upper()


def create(conn: sqlite3.Connection, args: argparse.Namespace) -> None:
    if args.hotdogs < 0:
        raise ValueError("a quantidade de hot dogs não pode ser negativa")
    code = new_code()
    now = datetime.now(timezone.utc)
    conn.execute(
        "INSERT INTO orders(code, phone, customer_name, summary, eligible_hotdogs, month, status, created_at) VALUES(?,?,?,?,?,?,?,?)",
        (code, phone(args.phone), args.name, args.summary, args.hotdogs, args.month or now.strftime("%Y-%m"), "aguardando_cliente", now.isoformat()),
    )
    conn.commit()
    print(f"Pedido criado: {code}\nStatus: aguardando_cliente\nO cliente deve responder: CONFIRMO {code}")


def customer_confirm(conn: sqlite3.Connection, args: argparse.Namespace) -> None:
    row = conn.execute("SELECT status FROM orders WHERE code=?", (args.code.upper(),)).fetchone()
    if not row:
        raise ValueError("pedido não encontrado")
    if row["status"] != "aguardando_cliente":
        raise ValueError(f"pedido está em {row['status']}")
    conn.execute("UPDATE orders SET status='aguardando_loja', customer_confirmed_at=? WHERE code=?", (stamp(), args.code.upper()))
    conn.commit()
    print(f"{args.code.upper()} aguardando confirmação da loja.")


def store_confirm(conn: sqlite3.Connection, args: argparse.Namespace) -> None:
    code = args.code.upper()
    row = conn.execute("SELECT * FROM orders WHERE code=?", (code,)).fetchone()
    if not row:
        raise ValueError("pedido não encontrado")
    if row["status"] != "aguardando_loja":
        raise ValueError(f"pedido está em {row['status']}")
    confirmed = stamp()
    conn.execute("UPDATE orders SET status='confirmado', store_confirmed_at=? WHERE code=?", (confirmed, code))
    conn.commit()
    loyalty_script = Path(__file__).with_name("loyalty.py")
    result = subprocess.run(
        [sys.executable, str(loyalty_script), "--db", str(args.loyalty_db), "record-order",
         "--phone", row["phone"], "--hotdogs", str(row["eligible_hotdogs"]), "--order-id", code,
         "--name", row["customer_name"] or "", "--month", row["month"]],
        check=True, capture_output=True, text=True,
    )
    print(f"{code} confirmado. Fidelidade atualizada.\n{result.stdout.strip()}")


def cancel(conn: sqlite3.Connection, args: argparse.Namespace) -> None:
    code = args.code.upper()
    row = conn.execute("SELECT status FROM orders WHERE code=?", (code,)).fetchone()
    if not row:
        raise ValueError("pedido não encontrado")
    if row["status"] in {"confirmado", "cancelado"}:
        raise ValueError(f"pedido está em {row['status']}")
    conn.execute("UPDATE orders SET status='cancelado', cancelled_at=? WHERE code=?", (stamp(), code))
    conn.commit()
    print(f"{code} cancelado.")


def show(conn: sqlite3.Connection, args: argparse.Namespace) -> None:
    row = conn.execute("SELECT * FROM orders WHERE code=?", (args.code.upper(),)).fetchone()
    if not row:
        raise ValueError("pedido não encontrado")
    for key in row.keys():
        print(f"{key}: {row[key]}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DB)
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("create"); p.add_argument("--phone", required=True); p.add_argument("--summary", required=True); p.add_argument("--hotdogs", required=True, type=int); p.add_argument("--name"); p.add_argument("--month"); p.set_defaults(func=create)
    p = sub.add_parser("customer-confirm"); p.add_argument("--code", required=True); p.set_defaults(func=customer_confirm)
    p = sub.add_parser("store-confirm"); p.add_argument("--code", required=True); p.add_argument("--loyalty-db", type=Path, default=LOYALTY_DB); p.set_defaults(func=store_confirm)
    p = sub.add_parser("cancel"); p.add_argument("--code", required=True); p.set_defaults(func=cancel)
    p = sub.add_parser("show"); p.add_argument("--code", required=True); p.set_defaults(func=show)
    args = parser.parse_args()
    with db(args.db) as conn:
        args.func(conn, args)


if __name__ == "__main__":
    main()
