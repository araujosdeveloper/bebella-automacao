#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
test -f "$project_dir/.next-build/standalone/server.js"
test -d "$project_dir/.next-build/static"
test -x /usr/local/bin/node

install -d -m 755 /opt/bebella/releases
release_dir=$(mktemp -d /opt/bebella/releases/release-XXXXXXXX)
cp -R "$project_dir/.next-build/standalone/." "$release_dir/"
cp -R "$project_dir/public" "$release_dir/public"
cp -R "$project_dir/.next-build/static" "$release_dir/.next-build/static"
if [ -e "$release_dir/.next-build/cache" ]; then
  mv "$release_dir/.next-build/cache" "$release_dir/.next-build/build-cache"
fi
ln -s /var/cache/bebella-menu "$release_dir/.next-build/cache"
chmod -R a+rX "$release_dir"

install -m 644 "$project_dir/deploy/bebella-menu.service" /etc/systemd/system/bebella-menu.service
ln -s "$release_dir" /opt/bebella/current-next
mv -Tf /opt/bebella/current-next /opt/bebella/current
systemctl daemon-reload
systemctl enable bebella-menu.service
systemctl restart bebella-menu.service
systemctl is-active bebella-menu.service
