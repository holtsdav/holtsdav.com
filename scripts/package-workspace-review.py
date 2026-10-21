"""Export local review sources and a patch relative to the copied owner baseline.
Only disposable temporary Git indices/checkouts are modified.
"""
import hashlib, json, pathlib, shutil, subprocess, tarfile, tempfile

root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'docs/review-2026-10-21'
baseline = json.loads((out / 'baseline-inventory.json').read_text())
original = pathlib.Path(baseline['original'])
def git(cwd, *args, **kwargs):
    return subprocess.check_output(['git', '-C', str(cwd), *args], **kwargs)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

preserved = {name: {'expected': expected, 'actual': sha(original/name)}
             for name, expected in baseline['copied_owner_files'].items()}
assert all(v['expected'] == v['actual'] for v in preserved.values())
assert git(original, 'rev-parse', 'HEAD').decode().strip() == baseline['head']
assert not git(root, 'diff', '--cached', '--name-only').strip()
status = git(original, 'status', '--short', '--untracked-files=all').decode().splitlines()
assert status == baseline['original_status']
t3 = pathlib.Path('/Users/holtsdav/.t3/worktrees/holtsdav.com/t3-18579d59')
assert not git(t3, 'status', '--porcelain').strip()
implementation_head = git(root, 'rev-parse', 'HEAD').decode().strip()
owner_only = [name for name, expected in baseline['copied_owner_files'].items()
              if sha(root/name) == expected]
(out/'final-preservation.json').write_text(json.dumps({
    'original': str(original), 'head': baseline['head'], 'status': status,
    'seven_copied_files_unchanged': preserved, 'website_t3_clean': True,
    'new_worktree': str(root), 'branch': git(root,'branch','--show-current').decode().strip(),
    'new_worktree_staged_paths': [], 'original_untracked_settings_copied': False,
    'implementation_head': implementation_head,
    'copied_owner_only_paths_left_unstaged': owner_only,
    'scope': 'Website checkout and website T3 only; native projects are owned by parallel work.'
}, indent=2)+'\n')

with tempfile.TemporaryDirectory(prefix='portfolio-review-') as tmp:
    fixture = pathlib.Path(tmp)/'baseline'; fixture.mkdir()
    archive = pathlib.Path(tmp)/'baseline.tar'
    archive.write_bytes(git(original,'archive',baseline['head']))
    with tarfile.open(archive) as tar: tar.extractall(fixture, filter='data')
    subprocess.run(['git','init','-q',str(fixture)],check=True)
    subprocess.run(['git','-C',str(fixture),'apply',str(out/'copied-owner-baseline.patch')],check=True)
    git(fixture,'add','-A')
    tree = git(fixture,'write-tree').decode().strip()
    for directory in ['src','Assets','public']:
        shutil.rmtree(fixture/directory)
        shutil.copytree(root/directory, fixture/directory)
    git(fixture,'add','-A')
    patch=out/'portfolio-improvement-from-owner-baseline.patch'
    patch.write_bytes(git(fixture,'diff','--cached','--binary',tree))
    # Restore the disposable fixture to baseline; validate patch applicability there.
    git(fixture,'read-tree','--reset','-u',tree)
    subprocess.run(['git','-C',str(fixture),'apply','--check',str(patch)],check=True)

paths = []
for directory in ['src','Assets','public']:
    paths += [p for p in (root/directory).rglob('*') if p.is_file() and p.name != '.DS_Store']
for name in ['AGENTS.md','DESIGN.md','README.md','package.json','package-lock.json',
             '.nvmrc','tsconfig.json','astro.config.mjs','.gitignore']:
    if (root/name).is_file(): paths.append(root/name)
paths += [root/p for p in git(root,'ls-files','workers').decode().splitlines()]
bundle=out/'portfolio-product-source.tar.gz'
with tarfile.open(bundle,'w:gz') as tar:
    for path in sorted(set(paths)):
        relative=path.relative_to(root)
        assert not any(x in relative.parts for x in ['.git','.claude','.codex','.wrangler','node_modules'])
        assert not path.name.startswith(('.env','.dev.vars'))
        tar.add(path,arcname=str(relative),recursive=False)
manifest={str(p.relative_to(root)): sha(p) for p in sorted(set(paths))}
committed_exports = {}
if implementation_head != baseline['head']:
    assert git(root, 'rev-parse', 'HEAD^').decode().strip() == baseline['head']
    clean_bundle = out/'portfolio-committed-source.tar.gz'
    clean_bundle.write_bytes(git(root, 'archive', '--format=tar.gz', 'HEAD', '--',
        'src', 'Assets', 'public', 'workers', 'AGENTS.md', 'README.md',
        'package.json', 'package-lock.json', '.nvmrc', 'tsconfig.json',
        'astro.config.mjs', '.gitignore'))
    commit_patch = out/'portfolio-implementation-commit.patch'
    commit_patch.write_bytes(git(root, 'format-patch', '-1', '--stdout', '--binary', 'HEAD'))
    committed_exports = {'implementation_commit': implementation_head,
        'committed_source_archive_sha256': sha(clean_bundle),
        'implementation_commit_patch_sha256': sha(commit_patch),
        'committed_source_excludes_copied_owner_only_changes': True}
(out/'source-package-manifest.json').write_text(json.dumps({
    'files': manifest, 'source_archive_sha256': sha(bundle),
    'improvement_patch_sha256': sha(patch), 'improvement_patch_apply_check': 'passed in disposable owner-baseline fixture',
    'baseline_head': baseline['head'], 'includes_copied_owner_baseline': True,
    'excludes': ['secrets','dependencies','build output','local settings','review images and logs'],
    **committed_exports,
},indent=2)+'\n')
print('Original website, seven dirty-file hashes and clean website T3 preserved.')
print('Product source archive and owner-baseline-relative patch exported; apply --check passed in disposable fixture.')
