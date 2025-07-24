POST_ID=$1

echo "[`date +%T`] Starting writer..."
node scripts/writer.js $POST_ID &

sleep 1

echo "[`date +%T`] Starting reader..."
node scripts/reader.js $POST_ID