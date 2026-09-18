#!/usr/bin/env python3
"""Controle local de fidelidade da Bebella Hot Dog.

Registra somente pedidos confirmados. A cada 20 hot dogs elegíveis, cria um
prêmio de um Hot Dog Tradicional. O banco é SQLite para facilitar backup e
consulta mensal sem dependências externas.
"""
from __future__ import annotations

import argparse
import calendar
import secrets
import sqlite3
from datetime import date, datetime, timezone
from pathlib import Path


DEFAULT_DB = Path("/opt/data/bebella-loyalty.sqlite3")


def digits(phone: str) -> str:
    value = "".join(ch for ch in phone if ch.isdigit())
    if len(value) < 10:
        raise ValueError("informe um telefone com DDD")
    return value


def connect(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS customers (
          phone TEXT PRIMARY KEY,
          name TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          external_id TEXT UNIQUE,
          phone TEXT NOT NULL REFERENCES customers(phone),
          confirmed_at TEXT NOT NULL,
          month TEXT NOT NULL,
          eligible_hotdogs INTEGER NOT NULL CHECK (eligible_hotdogs >= 0)
        );
        CREATE TABLE IF NOT EXISTS rewards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone TEXT NOT NULL REFERENCES customers(phone),
          month TEXT NOT NULL,
          earned_at TEXT NOT NULL,
          redeemed_at TEXT,
          code TEXT UNIQUE NOT NULL
        );
        CREATE INDEX IF NOT EXISTS orders_phone_month ON orders(phone, month);
        CREATE INDEX IF NOT EXISTS rewards_phone_redeemed ON rewards(phone, redeemed_at);
        """
    )
    reward_columns = {row["name"] for row in db.execute("PRAGMA table_info(rewards)")}
    if "month" not in reward_columns:
        # Banco criado pela versão anterior: prêmios antigos não podem ser usados
        # no mês corrente e ficam identificados como legado para auditoria.
        db.execute("ALTER TABLE rewards ADD COLUMN month TEXT NOT NULL DEFAULT 'legacy'")
        db.commit()
    return db


def now() -> datetime:
    return datetime.now(timezone.utc)


def ensure_customer(db: sqlite3.Connection, phone: str, name: str | None) -> None:
    stamp = now().isoformat()
    db.execute(
        """INSERT INTO customers(phone, name, created_at, updated_at) VALUES(?,?,?,?)
           ON CONFLICT(phone) DO UPDATE SET name=COALESCE(excluded.name, customers.name), updated_at=excluded.updated_at""",
        (phone, name or None, stamp, stamp),
    )


def record_order(db: sqlite3.Connection, args: argparse.Namespace) -> None:
    phone = digits(args.phone)
    count = int(args.hotdogs)
    if count < 0:
        raise ValueError("a quantidade de hot dogs não pode ser negativa")
    stamp = now()
    month = args.month or stamp.strftime("%Y-%m")
    ensure_customer(db, phone, args.name)
    try:
        db.execute(
            "INSERT INTO orders(external_id, phone, confirmed_at, month, eligible_hotdogs) VALUES(?,?,?,?,?)",
            (args.order_id or None, phone, stamp.isoformat(), month, count),
        )
    except sqlite3.IntegrityError as exc:
        raise ValueError("esse pedido já foi registrado") from exc
    total = db.execute(
        "SELECT COALESCE(SUM(eligible_hotdogs), 0) AS total FROM orders WHERE phone=? AND month=?", (phone, month)
    ).fetchone()["total"]
    earned = total // 20
    redeemed = db.execute(
        "SELECT COUNT(*) AS total FROM rewards WHERE phone=? AND month=? AND redeemed_at IS NOT NULL", (phone, month)
    ).fetchone()["total"]
    for _ in range(max(0, earned - redeemed)):
        code = "LOY-" + stamp.strftime("%Y%m") + "-" + secrets.token_hex(3).upper()
        db.execute("INSERT INTO rewards(phone, month, earned_at, code) VALUES(?,?,?,?)", (phone, month, stamp.isoformat(), code))
    db.commit()
    available = db.execute(
        "SELECT COUNT(*) AS total FROM rewards WHERE phone=? AND month=? AND redeemed_at IS NULL", (phone, month)
    ).fetchone()["total"]
    print(f"Pedido registrado. Cliente {phone}: {total} hot dogs, {available} prêmio(s) disponível(is).")


def balance(db: sqlite3.Connection, args: argparse.Namespace) -> None:
    phone = digits(args.phone)
    month = args.month or date.today().strftime("%Y-%m")
    total = db.execute("SELECT COALESCE(SUM(eligible_hotdogs),0) AS total FROM orders WHERE phone=? AND month=?", (phone, month)).fetchone()["total"]
    available = db.execute("SELECT COUNT(*) AS total FROM rewards WHERE phone=? AND month=? AND redeemed_at IS NULL", (phone, month)).fetchone()["total"]
    monthly = db.execute("SELECT COALESCE(SUM(eligible_hotdogs),0) AS total FROM orders WHERE phone=? AND month=?", (phone, month)).fetchone()["total"]
    print(f"Cliente: {phone}\nHot dogs no mês {month}: {monthly}\nHot dogs válidos para este mês: {total}\nPrêmios disponíveis neste mês: {available}")


def redeem(db: sqlite3.Connection, args: argparse.Namespace) -> None:
    phone = digits(args.phone)
    month = args.month or date.today().strftime("%Y-%m")
    row = db.execute("SELECT id, code FROM rewards WHERE phone=? AND month=? AND redeemed_at IS NULL ORDER BY id LIMIT 1", (phone, month)).fetchone()
    if not row:
        raise ValueError("o cliente ainda não tem prêmio disponível")
    db.execute("UPDATE rewards SET redeemed_at=? WHERE id=?", (now().isoformat(), row["id"]))
    db.commit()
    print(f"Prêmio liberado: {row['code']} — 1 Hot Dog Tradicional grátis.")


def report(db: sqlite3.Connection, args: argparse.Namespace) -> None:
    month = args.month or date.today().strftime("%Y-%m")
    year, month_number = map(int, month.split("-"))
    if not 1 <= month_number <= 12:
        raise ValueError("mês inválido; use AAAA-MM")
    rows = db.execute(
        """SELECT c.phone, c.name, COALESCE(SUM(o.eligible_hotdogs),0) AS hotdogs,
                  COUNT(DISTINCT o.id) AS orders
           FROM customers c LEFT JOIN orders o ON o.phone=c.phone AND o.month=?
           GROUP BY c.phone, c.name ORDER BY hotdogs DESC, c.phone""", (month,)
    ).fetchall()
    print(f"Histórico de fidelidade — {month} ({calendar.month_name[month_number]}/{year})")
    for row in rows:
        print(f"{row['phone']}\t{row['name'] or '-'}\t{row['orders']} pedido(s)\t{row['hotdogs']} hot dog(s)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("record-order", help="registre somente pedido confirmado")
    p.add_argument("--phone", required=True); p.add_argument("--hotdogs", required=True, type=int)
    p.add_argument("--name"); p.add_argument("--order-id"); p.add_argument("--month")
    p.set_defaults(func=record_order)
    p = sub.add_parser("balance"); p.add_argument("--phone", required=True); p.add_argument("--month"); p.set_defaults(func=balance)
    p = sub.add_parser("redeem"); p.add_argument("--phone", required=True); p.add_argument("--month"); p.set_defaults(func=redeem)
    p = sub.add_parser("report"); p.add_argument("--month"); p.set_defaults(func=report)
    args = parser.parse_args()
    with connect(args.db) as db:
        args.func(db, args)


if __name__ == "__main__":
    main()
