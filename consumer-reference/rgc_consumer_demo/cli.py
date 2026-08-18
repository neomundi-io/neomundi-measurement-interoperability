"""Consumer reference — runnable end-to-end demo.

Usage:
    # Fully offline (the two public example contracts under examples/,
    # the public schema under schema/, and the production public JWKS
    # bundled in fixtures/ — zero network calls, zero live server needed):
    python -m rgc_consumer_demo.cli --offline

    # Live, against a running NeoMundi instance, for an already-emitted
    # contract (fetched schema/jwks over the network):
    python -m rgc_consumer_demo.cli --base-url https://api.neomundi.io --contract-file my_contract.json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .connector import ContractRejected, process_contract
from .storage import ReceiptStore

_PKG_DIR = Path(__file__).resolve().parent
_FIXTURES_DIR = _PKG_DIR / "fixtures"
# consumer-reference/rgc_consumer_demo/cli.py -> repo root -> examples/ | schema/
_REPO_ROOT = _PKG_DIR.parent.parent
_EXAMPLES_DIR = _REPO_ROOT / "examples"
_SCHEMA_PATH = _REPO_ROOT / "schema" / "contract-v0.1.schema.json"
_JWKS_PATH = _FIXTURES_DIR / "public_jwks.json"


def _read_json(path: Path) -> dict:
    # utf-8-sig: real NeoMundi-emitted contract files may carry a UTF-8 BOM
    # (observed on the published examples); plain utf-8 would fail to parse
    # them. This does not touch contract content in any way.
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _load_offline_examples() -> list[dict]:
    return [_read_json(p) for p in sorted(_EXAMPLES_DIR.glob("*.json"))]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="NeoMundi Measurement Interoperability Contract v0.1 — consumer reference demo")
    parser.add_argument(
        "--base-url", default="http://localhost:8000",
        help="NeoMundi base URL (public endpoints only, no API key)",
    )
    parser.add_argument(
        "--offline", action="store_true",
        help="Run fully offline: bundled public examples + local schema/JWKS, no network",
    )
    parser.add_argument("--contract-file", help="Path to a single contract JSON file to process")
    parser.add_argument("--schema-file", help="Local JSON Schema file (skip fetching from base-url)")
    parser.add_argument("--jwks-file", help="Local JWKS file (skip fetching from base-url)")
    parser.add_argument("--db", default="rgc_consumer_receipts.db", help="Receipt store path")
    args = parser.parse_args(argv)

    store = ReceiptStore(args.db)

    if args.offline:
        contracts = _load_offline_examples()
        schema = _read_json(_SCHEMA_PATH)
        jwks = _read_json(_JWKS_PATH)
        base_url = None
    elif args.contract_file:
        contracts = [_read_json(Path(args.contract_file))]
        schema = _read_json(Path(args.schema_file)) if args.schema_file else None
        jwks = _read_json(Path(args.jwks_file)) if args.jwks_file else None
        base_url = args.base_url
    else:
        parser.error("Pass --offline, or --contract-file <path> to a real emitted contract.")
        return 2

    exit_code = 0
    for contract in contracts:
        rid = contract.get("identity", {}).get("request_id", "?")
        try:
            result = process_contract(
                contract, base_url=base_url, schema=schema, jwks=jwks, store=store
            )
            print(
                f"[OK] {rid}: hash_match={result.receipt.hash_match} "
                f"signature_valid={result.receipt.signature_valid} "
                f"-> routing={result.routing.action.value} ({result.routing.reason})"
            )
        except ContractRejected as exc:
            exit_code = 1
            print(f"[REJECTED] {rid}: {exc}")

    print(f"\n{len(store.all())} receipt(s) stored in {args.db}")
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
