import { VALORANT } from '../config/valorant.js';
import { parseSensitivity } from './iniParser.js';

const MAX_SEARCH_DEPTH = 5;

export const supportsDirectoryPicker = () => 'showDirectoryPicker' in window;

async function* findSettingsFiles(directory, path, depth = 0) {
  for await (const entry of directory.values()) {
    if (entry.kind === 'file' && entry.name === VALORANT.settingsFileName) {
      yield { file: await entry.getFile(), label: path.join('/') };
    } else if (entry.kind === 'directory' && depth < MAX_SEARCH_DEPTH) {
      yield* findSettingsFiles(entry, [...path, entry.name], depth + 1);
    }
  }
}

async function toProfile(file, label) {
  const sensitivity = parseSensitivity(await file.text());
  return sensitivity && { label, sensitivity, modified: new Date(file.lastModified) };
}

const newestFirst = (a, b) => b.modified - a.modified;

export async function loadProfilesFromDirectory() {
  const root = await window.showDirectoryPicker({ id: 'valorant-config' });
  const profiles = [];
  for await (const { file, label } of findSettingsFiles(root, [root.name])) {
    const profile = await toProfile(file, label);
    if (profile) profiles.push(profile);
  }
  return profiles.sort(newestFirst);
}

export async function loadProfileFromFile(file) {
  const profile = await toProfile(file, file.name);
  return profile ? [profile] : [];
}
