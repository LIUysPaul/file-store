export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

export interface GitHubRepo {
  default_branch: string;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  download_url: string | null;
}

export interface FileItem {
  path: string;
  name: string;
  sha: string;
  size: number;
  type: string;
  downloadUrl: string;
  uploadedAt: string;
}

const GITHUB_API_BASE = 'https://api.github.com';
const STORAGE_FOLDER = 'files';

export const verifyToken = async (token: string): Promise<GitHubUser> => {
  const response = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Token 无效或已过期');
  }

  return response.json();
};

export const getRepoInfo = async (token: string, repo: string): Promise<GitHubRepo> => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repo}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('仓库不存在，请检查仓库地址格式 (owner/repo)');
    }
    if (response.status === 403) {
      throw new Error('无法访问仓库：Token 没有该仓库的读取权限，请检查 Token 权限设置');
    }
    throw new Error('无法访问仓库，请检查权限');
  }

  return response.json();
};

export const verifyRepoWriteAccess = async (
  token: string,
  repo: string,
  branch: string
): Promise<void> => {
  const testPath = `${STORAGE_FOLDER}/.filestore_test`;
  
  const checkResponse = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${testPath}`,
    {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );

  let existingSha: string | null = null;
  if (checkResponse.ok) {
    const data = await checkResponse.json();
    existingSha = data.sha;
  } else if (checkResponse.status === 403) {
    throw new Error(
      'Token 没有仓库 Contents 的读取权限。请在 Token 设置的 Repository permissions → Contents 中选择 "Read and write"'
    );
  } else if (checkResponse.status !== 404) {
    throw new Error('无法访问仓库内容，请检查 Token 权限');
  }

  const testContent = btoa('test');
  const putResponse = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${testPath}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'FileStore permission test',
        content: testContent,
        branch,
        ...(existingSha ? { sha: existingSha } : {})
      })
    }
  );

  if (!putResponse.ok) {
    if (putResponse.status === 403) {
      throw new Error(
        'Token 没有仓库的写入权限。请在 Token 设置的 Repository permissions → Contents 中选择 "Read and write"'
      );
    }
    throw new Error('无法写入仓库，请检查 Token 权限');
  }

  const putData = await putResponse.json();
  
  const deleteResponse = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${testPath}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'FileStore cleanup test file',
        sha: putData.content.sha,
        branch
      })
    }
  );

  deleteResponse.ok;
};

const getFileFromContent = async (
  token: string,
  repo: string,
  path: string
): Promise<{ content: string; sha: string } | null> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${path}`,
    {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );

  if (response.status === 404) return null;
  if (response.status === 403) {
    throw new Error(
      'Token 没有仓库的读取权限。请在 Token 设置的 Repository permissions → Contents 中选择 "Read and write"'
    );
  }
  if (!response.ok) throw new Error('获取文件失败');

  const data = await response.json();
  if (data.type !== 'file') return null;

  return {
    content: data.content,
    sha: data.sha
  };
};

export const getFiles = async (
  token: string,
  repo: string,
  branch: string = 'main'
): Promise<FileItem[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${STORAGE_FOLDER}?ref=${branch}`,
    {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );

  if (response.status === 404) return [];
  if (response.status === 403) {
    throw new Error(
      'Token 没有仓库的读取权限。请在 Token 设置的 Repository permissions → Contents 中选择 "Read and write"'
    );
  }
  if (!response.ok) throw new Error('获取文件列表失败');

  const data: GitHubFile[] = await response.json();
  
  if (!Array.isArray(data)) return [];

  return data
    .filter(item => item.type === 'file')
    .map(item => ({
      path: item.path,
      name: item.name,
      sha: item.sha,
      size: item.size,
      type: getFileType(item.name),
      downloadUrl: item.download_url || '',
      uploadedAt: new Date().toISOString()
    }));
};

export const uploadFile = async (
  token: string,
  repo: string,
  fileName: string,
  fileContent: string,
  branch: string = 'main'
): Promise<FileItem> => {
  const path = `${STORAGE_FOLDER}/${fileName}`;
  
  const existing = await getFileFromContent(token, repo, path);

  const body: Record<string, string> = {
    message: `Upload ${fileName}`,
    content: fileContent,
    branch
  };

  if (existing) {
    body.sha = existing.sha;
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 403) {
      throw new Error(
        'Token 没有仓库的写入权限。请在 Token 设置的 Repository permissions → Contents 中选择 "Read and write"'
      );
    }
    throw new Error(errorData.message || '上传文件失败');
  }

  const data = await response.json();
  
  return {
    path,
    name: fileName,
    sha: data.content.sha,
    size: data.content.size,
    type: getFileType(fileName),
    downloadUrl: data.content.download_url,
    uploadedAt: new Date().toISOString()
  };
};

export const deleteFile = async (
  token: string,
  repo: string,
  path: string,
  sha: string,
  branch: string = 'main'
): Promise<void> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${repo}/contents/${path}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Delete ${path}`,
        sha,
        branch
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 403) {
      throw new Error(
        'Token 没有仓库的写入权限。请在 Token 设置的 Repository permissions → Contents 中选择 "Read and write"'
      );
    }
    throw new Error(errorData.message || '删除文件失败');
  }
};

const getFileType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const pdfExts = ['pdf'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
  const codeExts = ['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'go', 'rs', 'json', 'md', 'txt'];
  
  if (imageExts.includes(ext || '')) return 'image';
  if (pdfExts.includes(ext || '')) return 'pdf';
  if (archiveExts.includes(ext || '')) return 'archive';
  if (codeExts.includes(ext || '')) return 'code';
  
  return 'file';
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};