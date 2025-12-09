#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)/docker-compose.yml"
COMPOSE_CMD=(docker-compose -f "$COMPOSE_FILE")

ELASTIC_URL="http://localhost:9200/_cluster/health"
KIBANA_URL="http://localhost:5601/api/status"
LOGSTASH_HEALTH="http://localhost:9600/_node/health?pretty"
LOGSTASH_HOST=localhost
LOGSTASH_PORT=5044

log() { printf "[elk-test] %s\n" "$*"; }

wait_for_url() {
  local url="$1"; shift
  local retries="${1:-30}"; shift || true
  local delay="${1:-5}"; shift || true
  for i in $(seq 1 "$retries"); do
    if curl -sSf "$url" >/dev/null; then
      return 0
    fi
    sleep "$delay"
  done
  return 1
}

wait_for_tcp() {
  local host="$1" port="$2" retries="${3:-30}" delay="${4:-2}"
  for i in $(seq 1 "$retries"); do
    if bash -c "</dev/tcp/$host/$port" 2>/dev/null; then
      return 0
    fi
    sleep "$delay"
  done
  return 1
}

log "Starting Elasticsearch, Logstash, Kibana"
"${COMPOSE_CMD[@]}" up -d elasticsearch logstash kibana

log "Waiting for Elasticsearch health"
wait_for_url "$ELASTIC_URL" 40 5

log "Waiting for Logstash TCP port"
wait_for_tcp "$LOGSTASH_HOST" "$LOGSTASH_PORT" 40 2

log "Waiting for Kibana status"
wait_for_url "$KIBANA_URL" 40 5

SMOKE_PAYLOAD=$(cat <<'JSON'
{"message":"elk smoke test","logger":"elk.smoke","level":"INFO","service":"elk-smoke","ts":"REPLACEME"}
JSON
)
SMOKE_PAYLOAD=${SMOKE_PAYLOAD/REPLACEME/$(date -Iseconds)}

log "Sending synthetic log to Logstash on $LOGSTASH_HOST:$LOGSTASH_PORT"
if ! printf '%s\n' "$SMOKE_PAYLOAD" > "/dev/tcp/$LOGSTASH_HOST/$LOGSTASH_PORT"; then
  log "Failed to send payload to logstash"
  exit 1
fi

log "Waiting for ingestion"
sleep 5

log "Querying Elasticsearch for the smoke event"
QUERY_URL="http://localhost:9200/app-logs-*/_search?q=service:elk-smoke&size=1"
RESP=$(curl -s "$QUERY_URL")

if echo "$RESP" | python3 -c "import json, sys; resp = json.load(sys.stdin); hits = resp.get('hits', {}).get('total', {}).get('value', 0); print(f'Found {hits} hit(s)'); sys.exit(0 if hits > 0 else 1)"; then
  log "ELK logging smoke test succeeded"
else
  log "Smoke test failed: no hits found in Elasticsearch"
  exit 1
fi

if [[ "${KEEP_ELK:-0}" != "1" ]]; then
  log "Stopping ELK stack (set KEEP_ELK=1 to keep running)"
  "${COMPOSE_CMD[@]}" stop elasticsearch logstash kibana
fi
