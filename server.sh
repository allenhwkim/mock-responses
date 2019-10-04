set -x
node_modules/.bin/kill-port 9300
nohup ts-node -r tsconfig-paths/register src/main.ts \
  --db-path=./mock-responses.sql \
  --port=9300 \
  --cookie='PLAY_SESSION=ACCTNBR=123456789; Path=/' &
