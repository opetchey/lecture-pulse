#!/bin/bash
# Double-click (Mac) to test Lecture Pulse locally. Close this Terminal window to stop.
cd "$(dirname "$0")"
PORT=8000
echo "Lecture Pulse test server: http://localhost:$PORT"
echo "Close this window (or press Ctrl+C) to stop it."
( sleep 1
  open "http://localhost:$PORT/present.html?local"
  sleep 1
  open "http://localhost:$PORT/index.html?local&r=bio144"
  open "http://localhost:$PORT/index.html?local&r=bio144" ) &
python3 -m http.server $PORT
