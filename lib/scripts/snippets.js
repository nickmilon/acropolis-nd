/* eslint-disable no-unused-vars */
import path from 'path';
import { fileURLToPath } from 'url';

/**
 *
 * returns a filepath relative to current module
 * @param {string} relativePath path relative to current
 * @returns { string } file path
 */
const pathRelative = (relativePath) => path.join(path.dirname(fileURLToPath(import.meta.url)), relativePath);
