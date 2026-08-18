"""Consumer reference — versioned, auditable proof storage.

Represents the "retain a versioned, auditable receipt on the consumer side"
step of the reference flow. SQLite-backed and deliberately simple: a real
consumer swaps this for their own audit log or data warehouse — this proves
the shape of what needs to be kept (the full contract, the verification
outcome, and the routing decision, all timestamped and keyed by
request_id).
"""

from __future__ import annotations

import sqlite3
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class ConsumerReceipt:
    request_id: str
    schema_version: str
    payload_hash: str
    key_id: str
    hash_match: bool
    signature_valid: bool
    routing_action: str
    routing_reason: str
    received_at: float
    contract_json: str


class ReceiptStore:
    def __init__(self, db_path: str | Path = "rgc_consumer_receipts.db"):
        self._db_path = str(db_path)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self._db_path)

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS receipts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    request_id TEXT NOT NULL,
                    schema_version TEXT NOT NULL,
                    payload_hash TEXT NOT NULL UNIQUE,
                    key_id TEXT NOT NULL,
                    hash_match INTEGER NOT NULL,
                    signature_valid INTEGER NOT NULL,
                    routing_action TEXT NOT NULL,
                    routing_reason TEXT NOT NULL,
                    received_at REAL NOT NULL,
                    contract_json TEXT NOT NULL
                )
                """
            )

    def save(self, receipt: ConsumerReceipt) -> None:
        with self._connect() as conn:
            conn.execute(
                """INSERT OR IGNORE INTO receipts
                   (request_id, schema_version, payload_hash, key_id, hash_match,
                    signature_valid, routing_action, routing_reason, received_at, contract_json)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    receipt.request_id,
                    receipt.schema_version,
                    receipt.payload_hash,
                    receipt.key_id,
                    int(receipt.hash_match),
                    int(receipt.signature_valid),
                    receipt.routing_action,
                    receipt.routing_reason,
                    receipt.received_at,
                    receipt.contract_json,
                ),
            )

    def get(self, request_id: str) -> Optional[ConsumerReceipt]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT request_id, schema_version, payload_hash, key_id, hash_match, "
                "signature_valid, routing_action, routing_reason, received_at, contract_json "
                "FROM receipts WHERE request_id = ? ORDER BY id DESC LIMIT 1",
                (request_id,),
            ).fetchone()
        if row is None:
            return None
        return _row_to_receipt(row)

    def all(self) -> list[ConsumerReceipt]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT request_id, schema_version, payload_hash, key_id, hash_match, "
                "signature_valid, routing_action, routing_reason, received_at, contract_json "
                "FROM receipts ORDER BY id DESC"
            ).fetchall()
        return [_row_to_receipt(r) for r in rows]


def _row_to_receipt(row: tuple) -> ConsumerReceipt:
    return ConsumerReceipt(
        request_id=row[0],
        schema_version=row[1],
        payload_hash=row[2],
        key_id=row[3],
        hash_match=bool(row[4]),
        signature_valid=bool(row[5]),
        routing_action=row[6],
        routing_reason=row[7],
        received_at=row[8],
        contract_json=row[9],
    )
