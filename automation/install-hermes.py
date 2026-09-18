"""Run inside the Hermes container; prepares WhatsApp without enabling it."""
from pathlib import Path
from datetime import datetime, timezone
import os
import re
import shutil
import yaml

from hermes_cli.tools_config import _get_platform_tools, _get_plugin_toolset_keys
from gateway.slash_access import policy_from_extra

source = Path(__file__).parent
home = Path('/opt/data')
config_path = home / 'config.yaml'
original = config_path.read_text()
config = yaml.safe_load(original)
marker = '# BEBELLA ATTENDANCE CONFIG'
if marker in original:
    raise SystemExit('Already prepared; review existing config before applying again.')
if config.get('platforms') or config.get('known_plugin_toolsets'):
    raise SystemExit('Existing platform settings need a merge; no changes made.')

extra = {
    'reply_prefix': 'Bella • Bebella Hot Dog\n',
    'dm_policy': 'disabled',
    'group_policy': 'disabled',
    'allow_admin_from': ['bebella-local-admin-only'],
    'group_allow_admin_from': ['bebella-local-admin-only'],
    'user_allowed_commands': [],
    'group_user_allowed_commands': [],
}
addition = {
    'known_plugin_toolsets': {'whatsapp': sorted(_get_plugin_toolset_keys())},
    'platforms': {'whatsapp': {'enabled': False, 'extra': extra}},
}
updated, count = re.subn(r'(?m)^  whatsapp: \[hermes-whatsapp\]\s*$',
                         '  whatsapp: [no_mcp]', original)
if count != 1:
    raise SystemExit('Unexpected WhatsApp toolset config; no changes made.')
updated += '\n' + marker + '\n' + yaml.safe_dump(addition, allow_unicode=True, sort_keys=False)
candidate = yaml.safe_load(updated)
resolved = _get_platform_tools(candidate, 'whatsapp')
if resolved:
    raise SystemExit(f'Unexpected WhatsApp toolsets: {sorted(resolved)}; no changes made.')
for scope in ['dm', 'group']:
    policy = policy_from_extra(extra, scope)
    assert policy.enabled
    for command in ['terminal', 'model', 'personality', 'tools', 'cron', 'config']:
        assert not policy.can_run('5586000000000', command)

stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
backup = home / 'backups' / ('bebella-' + stamp)
backup.mkdir(mode=0o700)
for name in ['config.yaml', 'SOUL.md']:
    if (home / name).exists():
        shutil.copy2(home / name, backup / name)
uid, gid = config_path.stat().st_uid, config_path.stat().st_gid
os.chown(backup, uid, gid)
for path in backup.iterdir():
    os.chown(path, uid, gid)
payloads = {
    'config.yaml': updated,
    'SOUL.md': (source / 'generated/SOUL.md').read_text(),
    'bebella-catalog.json': (source / 'generated/catalog.json').read_text(),
    'marketing.json': (source / 'marketing.json').read_text(),
    'loyalty.json': (source / 'loyalty.json').read_text(),
}
for name, content in payloads.items():
    temp = home / ('.bebella-' + name)
    temp.write_text(content)
    os.chmod(temp, 0o600 if name == 'config.yaml' else 0o644)
    os.chown(temp, uid, gid)
    temp.replace(home / name)
print('Bebella instructions and catalog installed. Backup:', backup)
print('WhatsApp tools: none. Customer administrative commands: denied.')
print('WhatsApp remains disabled pending provider, pairing and business rules.')
