#!/bin/sh
set -e

# Start the SSH service in the background
/usr/sbin/sshd

echo $VITE_API_URL

# Start Nginx in the foreground
nginx -g "daemon off;"
