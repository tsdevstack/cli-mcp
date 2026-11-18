/**
 * Trim a CLI command's output for an MCP tool result: no terminal color or
 * cursor codes, no Terraform progress lines, and at most
 * COMMAND_OUTPUT_MAX_CHARS. Longer output keeps its start and its end, with
 * a line between them that says how many lines were left out.
 */

import {
  COMMAND_OUTPUT_HEAD_CHARS,
  COMMAND_OUTPUT_MAX_CHARS,
  TERRAFORM_PROGRESS_LINE,
} from '../constants/index.js';

// eslint-disable-next-line no-control-regex
const TERMINAL_CODE = /\u001b\[[0-9;?]*[A-Za-z]/g;

export function trimCommandOutput(output: string): string {
  const text = output
    .replace(TERMINAL_CODE, '')
    .split('\n')
    .filter((line) => !TERRAFORM_PROGRESS_LINE.test(line))
    .join('\n');

  if (text.length <= COMMAND_OUTPUT_MAX_CHARS) {
    return text;
  }

  // Whole lines only: the start up to its last line break, the end from its
  // first one
  const headEnd = text.lastIndexOf('\n', COMMAND_OUTPUT_HEAD_CHARS);
  const tailStart = text.indexOf(
    '\n',
    text.length - (COMMAND_OUTPUT_MAX_CHARS - COMMAND_OUTPUT_HEAD_CHARS),
  );
  const head = text.slice(0, Math.max(headEnd, 0));
  const tail = text.slice(tailStart + 1);
  const leftOut = text.slice(head.length, tailStart + 1).split('\n').length - 2;

  return `${head}\n[${leftOut} lines left out. Run the command in a terminal to see all of it.]\n${tail}`;
}
