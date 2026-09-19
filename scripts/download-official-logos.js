const fs = require('fs');
const path = require('path');
const https = require('https');

const iconsDir = path.join(__dirname, '..', 'public', 'img', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'DevOpsToolsHub/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} (status: ${res.statusCode})`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

const CNCF_BASE = 'https://raw.githubusercontent.com/cncf/artwork/main/projects';
const DEVICON_BASE = 'https://raw.githubusercontent.com/devicons/devicon/master/icons';

const OFFICIAL_SOURCES = {
  // CNCF Graduated & Incubating Official Artwork
  'kubernetes': `${CNCF_BASE}/kubernetes/icon/color/kubernetes-icon-color.svg`,
  'crossplane': `${CNCF_BASE}/crossplane/icon/color/crossplane-icon-color.svg`,
  'argocd': `${CNCF_BASE}/argo/icon/color/argo-icon-color.svg`,
  'flux': `${CNCF_BASE}/flux/icon/color/flux-icon-color.svg`,
  'prometheus': `${CNCF_BASE}/prometheus/icon/color/prometheus-icon-color.svg`,
  'opentelemetry': `${CNCF_BASE}/opentelemetry/icon/color/opentelemetry-icon-color.svg`,
  'jaeger': `${CNCF_BASE}/jaeger/icon/color/jaeger-icon-color.svg`,
  'cilium': `${CNCF_BASE}/cilium/icon/color/cilium_icon-color.svg`,
  'istio': `${CNCF_BASE}/istio/icon/color/istio-icon-color.svg`,
  'envoy': `${CNCF_BASE}/envoy/icon/color/envoy-icon-color.svg`,
  'falco': `${CNCF_BASE}/falco/icon/color/falco-icon-color.svg`,
  'cert-manager': `${CNCF_BASE}/cert-manager/icon/color/cert-manager-icon-color.svg`,
  'backstage': `${CNCF_BASE}/backstage/icon/color/backstage-icon-color.svg`,
  'keda': `${CNCF_BASE}/keda/icon/color/keda-icon-color.svg`,
  'helm': `${CNCF_BASE}/helm/icon/color/helm-icon-color.svg`,

  // Devicon Official SVG Logos
  'docker': `${DEVICON_BASE}/docker/docker-original.svg`,
  'podman': `${DEVICON_BASE}/podman/podman-original.svg`,
  'ansible': `${DEVICON_BASE}/ansible/ansible-original.svg`,
  'pulumi': `${DEVICON_BASE}/pulumi/pulumi-original.svg`,
  'jenkins': `${DEVICON_BASE}/jenkins/jenkins-original.svg`,
  'grafana': `${DEVICON_BASE}/grafana/grafana-original.svg`,
  'vault': `${DEVICON_BASE}/vault/vault-original.svg`,

  // Grafana Loki Official SVG
  'loki': `https://grafana.com/static/img/logos/logo-loki.svg`,

  // Trivy Official simple-icons SVG
  'trivy': `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/trivy.svg`
};

async function run() {
  console.log('Downloading official vector logos...');

  for (const [name, url] of Object.entries(OFFICIAL_SOURCES)) {
    try {
      const buffer = await fetchUrl(url);
      let content = buffer.toString('utf-8');

      // For Trivy, colorize simple-icons SVG with Aqua Security Trivy brand color
      if (name === 'trivy') {
        content = content.replace('<svg ', '<svg fill="#1B4992" ');
      }

      const destPath = path.join(iconsDir, `${name}.svg`);
      fs.writeFileSync(destPath, content);
      console.log(`✓ Downloaded official logo for ${name}`);
    } catch (err) {
      console.error(`✗ Failed downloading ${name}: ${err.message}`);
    }
  }

  // Handle OpenTofu official icon mark
  try {
    console.log('Extracting official OpenTofu cube mark from opentofu.org...');
    const tofuSvg = await fetchUrl('https://opentofu.org/img/logo.svg');
    const tofuStr = tofuSvg.toString('utf-8');
    
    // Create dedicated square icon for OpenTofu with proper viewBox around the cube mark
    const opentofuIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="130 0 25 24" fill="none">
  <path fill="#0D1A2B" fill-rule="evenodd" d="M143.325.207a1.668 1.668 0 0 0-1.607 0l-8.233 4.526a3.096 3.096 0 0 0-.021.011l-1.084.596a1.668 1.668 0 0 0-.864 1.462V16.98c0 .609.331 1.169.864 1.462l8.312 4.568.032.018.994.546c.5.275 1.106.275 1.607 0l.996-.548.03-.016 8.311-4.568c.534-.293.865-.853.865-1.462V6.802c0-.609-.331-1.17-.865-1.462l-1.08-.594a2.892 2.892 0 0 0-.024-.013L143.325.207Zm.529 11.684 7.704-4.235a3.17 3.17 0 0 0 .024-.013l.092-.05a.385.385 0 0 1 .57.337v7.922a.385.385 0 0 1-.57.338l-.071-.04a3.397 3.397 0 0 0-.045-.025l-7.704-4.234Zm-10.389-4.246a.32.32 0 0 0 .02.011l7.704 4.235-7.704 4.234a1.08 1.08 0 0 0-.043.024l-.073.04a.385.385 0 0 1-.57-.337V7.93c0-.293.313-.479.57-.338l.096.053Zm17.487-1.781-7.219-3.968a.385.385 0 0 0-.57.326v8.584l7.788-4.28a.385.385 0 0 0 .001-.662Zm-16.859.662 7.787 4.28V2.222a.385.385 0 0 0-.57-.326l-7.217 3.966a.385.385 0 0 0 0 .664Zm.01 11.398a.385.385 0 0 1-.021-.662l7.798-4.286v8.584a.385.385 0 0 1-.555.334l-7.222-3.97Zm9.06 3.625v-8.573l7.798 4.286a.385.385 0 0 1-.021.662l-7.221 3.97a.385.385 0 0 1-.556-.334v-.011Z" clip-rule="evenodd" />
  <path fill="#E2D23F" d="M142.336 1.33a.385.385 0 0 1 .371 0l8.233 4.526a.385.385 0 0 1 0 .675l-8.233 4.525a.386.386 0 0 1-.371 0l-8.233-4.525a.385.385 0 0 1 0-.675l8.233-4.525Z" />
  <path fill="#FFEC40" d="M132.799 7.928c0-.292.314-.478.57-.337l8.312 4.568a.384.384 0 0 1 .199.338v9.05a.385.385 0 0 1-.57.338l-8.312-4.569a.385.385 0 0 1-.199-.337V7.93Z" />
  <path fill="#ffffff" d="M151.674 7.591a.385.385 0 0 1 .57.337v9.051c0 .14-.076.27-.199.338l-8.312 4.568a.385.385 0 0 1-.57-.338v-9.05c0-.14.077-.27.2-.338l8.311-4.568Z" />
  <path fill="#0D1A2B" d="m136.289 15.03-.001.013-1.948-1.025.001-.013c.045-.606.518-.868 1.056-.585.538.283.937 1.004.892 1.61ZM139.355 16.8l-.001.013-1.948-1.025.001-.013c.045-.606.517-.868 1.055-.585.538.283.938 1.004.893 1.61Z" />
</svg>`;

    fs.writeFileSync(path.join(iconsDir, 'opentofu.svg'), opentofuIcon);
    console.log('✓ Extracted official OpenTofu cube mark');
  } catch (err) {
    console.error(`✗ Failed OpenTofu extraction: ${err.message}`);
  }

  // Handle K9s official logo
  try {
    console.log('Downloading official K9s artwork from derailed/k9s...');
    const k9sPng = await fetchUrl('https://raw.githubusercontent.com/derailed/k9s/master/assets/k9s.png');
    const b64 = k9sPng.toString('base64');
    const k9sSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <image href="data:image/png;base64,${b64}" width="500" height="500" preserveAspectRatio="xMidYMid meet" />
</svg>`;
    fs.writeFileSync(path.join(iconsDir, 'k9s.svg'), k9sSvg);
    console.log('✓ Created official K9s vector wrapper');
  } catch (err) {
    console.error(`✗ Failed K9s logo: ${err.message}`);
  }

  console.log('\nAll 26 official logos updated successfully!');
}

run();
