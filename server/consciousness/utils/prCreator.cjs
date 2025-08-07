const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts });
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

function httpRequestJSON(options, payload) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const status = res.statusCode || 0;
        try {
          const body = data ? JSON.parse(data) : {};
          if (status >= 200 && status < 300) return resolve({ status, body });
          return reject(new Error(`HTTP ${status}: ${data || 'empty'}`));
        } catch (e) {
          if (status >= 200 && status < 300) return resolve({ status, body: data });
          return reject(new Error(`HTTP ${status}: ${data || 'empty'} (${e.message})`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(JSON.stringify(payload));
    req.end();
  });
}

async function applyToWorkingTree(targetPath, content, branchName, commitMessage) {
  const repoRoot = process.cwd();
  const absTarget = path.resolve(repoRoot, targetPath);
  await ensureDir(path.dirname(absTarget));
  await fsp.writeFile(absTarget, String(content), 'utf8');

  // Git operations
  const result = { branchName, pushed: false, commit: null };
  try {
    run('git rev-parse --is-inside-work-tree');
    try { run(`git checkout -b ${branchName}`); } catch (_) { run(`git checkout ${branchName}`); }
    run(`git add -- "${absTarget}"`);
    run(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
    result.commit = run('git rev-parse HEAD').trim();
    try {
      run(`git push -u origin ${branchName}`);
      result.pushed = true;
    } catch (pushErr) {
      result.pushError = pushErr.message;
    }
  } catch (e) {
    result.error = e.message;
  }
  return result;
}

async function createGitHubPR({ owner, repo, token, title, head, base = 'main', body }) {
  const payload = { title, head, base, body };
  const options = {
    method: 'POST',
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/pulls`,
    headers: {
      'User-Agent': 'selfcoding-pr-creator',
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    }
  };
  const { body: response } = await httpRequestJSON(options, payload);
  return response;
}

async function createGitLabMR({ projectId, token, title, sourceBranch, targetBranch = 'main', body, host }) {
  const hostname = host || 'gitlab.com';
  const payload = {
    id: projectId,
    title,
    source_branch: sourceBranch,
    target_branch: targetBranch,
    description: body
  };
  const options = {
    method: 'POST',
    hostname,
    path: `/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests`,
    headers: {
      'User-Agent': 'selfcoding-pr-creator',
      'PRIVATE-TOKEN': token,
      'Content-Type': 'application/json'
    }
  };
  const { body: response } = await httpRequestJSON(options, payload);
  return response;
}

async function createPRFromArtifact(artifactDir, opts = {}) {
  const reportPath = path.join(artifactDir, 'REPORT.md');
  const metaPath = path.join(artifactDir, 'metadata.json');
  const genPath = path.join(artifactDir, 'generated.cjs');
  const report = fs.existsSync(reportPath) ? await fsp.readFile(reportPath, 'utf8') : '';
  const meta = fs.existsSync(metaPath) ? JSON.parse(await fsp.readFile(metaPath, 'utf8')) : {};
  const code = fs.existsSync(genPath) ? await fsp.readFile(genPath, 'utf8') : '';

  const request = meta.request || {};
  const targetPath = request.targetPath || opts.defaultTarget || path.join('FlappyJournal', 'server', 'generated', `artifact_${Date.now()}.cjs`);
  const branchName = opts.branchName || `selfcoding/pr-${Date.now()}`;
  const commitMessage = `Self-coding: ${request.purpose || 'improvement'} (${new Date().toISOString()})`;

  const applyRes = await applyToWorkingTree(targetPath, code, branchName, commitMessage);

  const provider = (process.env.AUTO_PR_PROVIDER || '').toLowerCase();
  const result = { branchName, apply: applyRes };

  try {
    if (provider === 'github') {
      const owner = process.env.GITHUB_OWNER || process.env.GITHUB_REPO?.split('/')[0];
      const repo = process.env.GITHUB_REPO?.split('/')[1];
      const token = process.env.GITHUB_TOKEN;
      const base = process.env.GITHUB_BASE || 'main';
      if (!owner || !repo || !token) throw new Error('Missing GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN');
      const pr = await createGitHubPR({ owner, repo, token, title: commitMessage, head: branchName, base, body: report });
      result.pr = pr;
    } else if (provider === 'gitlab') {
      const projectId = process.env.GITLAB_PROJECT_ID;
      const token = process.env.GITLAB_TOKEN;
      const host = process.env.GITLAB_HOST || 'gitlab.com';
      const targetBranch = process.env.GITLAB_TARGET || 'main';
      if (!projectId || !token) throw new Error('Missing GITLAB_PROJECT_ID/GITLAB_TOKEN');
      const mr = await createGitLabMR({ projectId, token, title: commitMessage, sourceBranch: branchName, targetBranch, body: report, host });
      result.pr = mr;
    } else {
      result.note = 'AUTO_PR_PROVIDER not set (github|gitlab); created local branch only.';
    }
  } catch (e) {
    result.prError = e.message;
  }

  return result;
}

module.exports = { createPRFromArtifact };

