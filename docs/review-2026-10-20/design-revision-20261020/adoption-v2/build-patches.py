from pathlib import Path
import subprocess, json, hashlib, tarfile, io, shutil, os, datetime
root=Path(__file__).resolve().parents[4]
package=Path(__file__).resolve().parent
review=package.parent.parent
baseline=json.loads((review/'baseline-inventory.json').read_text())
original=Path(baseline['source'])
fixture=package/'.fixture-generator'
check=package/'.fixture-check'
for p in [fixture,check]:
    if p.exists():raise SystemExit(f'Refusing to overwrite existing fixture: {p}')

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def run(args,cwd,**kw):
    return subprocess.run(args,cwd=cwd,capture_output=True,**kw)
def git(cwd,*args,check_result=True,env=None):
    r=run(['git',*args],cwd,env=env)
    if check_result and r.returncode:raise RuntimeError(r.stderr.decode())
    return r
fixture_env={**os.environ,'GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':'/dev/null'}
def init(p):
    p.mkdir();git(p,'init','--quiet',env=fixture_env)
def commit(p,message):
    git(p,'-c','user.name=Codex Packaging Fixture','-c','user.email=codex-packaging@localhost','-c','commit.gpgsign=false','-c','core.hooksPath=/dev/null','commit','--quiet','-m',message,env=fixture_env)
    return git(p,'rev-parse','HEAD',env=fixture_env).stdout.decode().strip()
def archive_to(source,ref,destination):
    raw=git(source,'archive',ref).stdout
    with tarfile.open(fileobj=io.BytesIO(raw)) as tar:tar.extractall(destination,filter='data')
def copy_files(names,destination):
    for name in names:
        src=root/name;dest=destination/name
        dest.parent.mkdir(parents=True,exist_ok=True)
        if src.exists():shutil.copy2(src,dest)
        elif dest.exists():dest.unlink()
def apply_result(p,patch,check_only=True):
    args=['apply']+(['--check'] if check_only else [])+[str(patch)]
    r=git(p,*args,check_result=False,env=fixture_env if p!=original else None)
    result={'directory':str(p),'command':['git','apply']+(['--check'] if check_only else [])+[patch.name],'exit_code':r.returncode,'stdout':r.stdout.decode(),'stderr':r.stderr.decode(),'check_only':check_only,'files_written':False if check_only else 'disposable fixture only','original_mutated':False}
    if r.returncode:raise RuntimeError(json.dumps(result))
    return result

# Snapshot the user's existing dirty source and all screenshot evidence before packaging.
source_before={'head':git(original,'rev-parse','HEAD').stdout.decode().strip(),'status':git(original,'status','--porcelain=v1','--untracked-files=all').stdout.decode(),'hashes':{name:sha(original/name) for name in baseline['copied_files']}}
assert source_before['head']==baseline['head']
assert source_before['hashes']==baseline['copied_files'],'Original dirty baseline changed; do not guess a new patch base.'
screenshots={str(p.relative_to(root)):sha(p) for p in (review/'screenshots').rglob('*') if p.is_file()}
changed=git(root,'ls-files','--modified','--others','--exclude-standard').stdout.decode().splitlines()
draft_names={
 'src/components/DraftDocument.astro','src/pages/support/notilog.astro',
 'src/pages/drafts/notilog-privacy.astro','src/styles/document-draft.css',
 'scripts/verify-notilog-drafts.mjs',
}
candidates={p for p in changed if p.startswith(('src/','public/','Assets/')) or p in {'scripts/verify-portfolio.mjs','scripts/verify-portfolio-v2.mjs','scripts/verify-name-reveal-v2.mjs'} or p=='docs/review-2026-10-20/start-preview.sh'}

init(fixture);archive_to(original,baseline['head'],fixture)
git(fixture,'add','--all',env=fixture_env);committed_fixture=commit(fixture,'Disposable fixture: committed website baseline')
results={'copied_baseline_on_clean_head':apply_result(fixture,review/'copied-local-baseline.patch')}
apply_result(fixture,review/'copied-local-baseline.patch',False)
git(fixture,'add','--all',env=fixture_env);owner_fixture=commit(fixture,'Disposable fixture: preserved owner dirty baseline')
portfolio=sorted(p for p in candidates-draft_names if not (fixture/p).exists() or not (root/p).exists() or (root/p).read_bytes()!=(fixture/p).read_bytes())
copy_files(portfolio,fixture)
git(fixture,'add','--intent-to-add','--',*portfolio,env=fixture_env)
portfolio_patch=package/'portfolio-fixes.patch'
portfolio_patch.write_bytes(git(fixture,'diff','--binary','--full-index','HEAD','--',*portfolio,env=fixture_env).stdout)
assert portfolio_patch.stat().st_size>0
# This is the only check run against the actual user's dirty checkout: read-only.
results['portfolio_on_actual_original_dirty_baseline']=apply_result(original,portfolio_patch)
git(fixture,'add','--all','--',*portfolio,env=fixture_env);portfolio_fixture=commit(fixture,'Disposable fixture: portfolio changes only')
copy_files(sorted(draft_names),fixture)
git(fixture,'add','--intent-to-add','--',*sorted(draft_names),env=fixture_env)
draft_patch=package/'notilog-drafts.patch'
draft_patch.write_bytes(git(fixture,'diff','--binary','--full-index','HEAD','--',*sorted(draft_names),env=fixture_env).stdout)

# Reconstruct a second clean baseline. Actual application happens only here.
init(check);archive_to(fixture,owner_fixture,check)
results['portfolio_on_reconstructed_dirty_baseline']=apply_result(check,portfolio_patch)
apply_result(check,portfolio_patch,False)
results['notilog_after_portfolio_on_disposable_copy']=apply_result(check,draft_patch)
apply_result(check,draft_patch,False)
all_features=portfolio+sorted(draft_names)
file_checks={p:{'sha256':sha(root/p),'reconstructed_sha256':sha(check/p),'matches':sha(root/p)==sha(check/p),'mode':oct((root/p).stat().st_mode&0o777)} for p in all_features}
assert all(v['matches'] for v in file_checks.values())
source_after={'head':git(original,'rev-parse','HEAD').stdout.decode().strip(),'status':git(original,'status','--porcelain=v1','--untracked-files=all').stdout.decode(),'hashes':{name:sha(original/name) for name in baseline['copied_files']}}
assert source_before==source_after,'Original changed while packaging; inspect before adoption.'
assert all(sha(root/p)==h for p,h in screenshots.items())

manifest={
 'created_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'worktree':str(root),'branch':git(root,'branch','--show-current').stdout.decode().strip(),'head':git(root,'rev-parse','HEAD').stdout.decode().strip(),
 'implementation_state':'Uncommitted; no feature commit exists on this branch. Fixture commits are disposable and unrelated to the original repository history.',
 'intended_baseline':{'repository':str(original),'head':baseline['head'],'owner_dirty_files':baseline['copied_files'],'do_not_reapply_copied_baseline_to_current_original':True,'untracked_tool_settings_copied':False},
 'ownership':{'copied_owner_baseline':sorted(baseline['copied_files']),'portfolio_changes':portfolio,'notilog_drafts':sorted(draft_names),'overlap':['src/layouts/BaseLayout.astro'],'note':'BaseLayout has both copied owner changes and additional portfolio changes. The portfolio patch records only the delta after the copied baseline.'},
 'patches':{p.name:{'sha256':sha(p),'bytes':p.stat().st_size,'files':portfolio if p==portfolio_patch else sorted(draft_names)} for p in [portfolio_patch,draft_patch]},
 'copied_baseline_patch':{'path':'../copied-local-baseline.patch','sha256':sha(review/'copied-local-baseline.patch'),'ownership':'Pre-existing owner edits, not newly authored portfolio work.'},
 'apply_checks':results,'reconstructed_feature_files':file_checks,
 'preservation':{'original_before':source_before,'original_after':source_after,'unchanged':source_before==source_after,'screenshots':screenshots,'screenshot_hashes_unchanged':True},
 'fixture':{'generator':str(fixture),'preview_checkout':str(check),'dependencies_copied':False,'archive_contains_no_untracked_settings_or_ignored_secrets':True,'note':'Owned temporary directories; remove only these after startup validation. No patch was applied to an original checkout.'}
}
(package/'adoption-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(package/'screenshots-sha256.txt').write_text(''.join(f'{h}  {p}\n' for p,h in sorted(screenshots.items())))
(package/'changed-code-files.txt').write_text('COPIED OWNER BASELINE (not our authored changes)\n'+''.join(p+'\n' for p in sorted(baseline['copied_files']))+'\nPORTFOLIO PATCH\n'+''.join(p+'\n' for p in portfolio)+'\nNOTILOG DRAFT PATCH\n'+''.join(p+'\n' for p in sorted(draft_names)))
print(json.dumps({'package':str(package),'portfolio_files':len(portfolio),'draft_files':len(draft_names),'patches':{p.name:p.stat().st_size for p in [portfolio_patch,draft_patch]},'checks':{k:v['exit_code'] for k,v in results.items()},'original_unchanged':source_before==source_after,'screenshots_preserved':len(screenshots),'preview_fixture':str(check)},indent=2))
