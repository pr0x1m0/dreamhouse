#!/usr/bin/env node
/**
 * .claude/hooks/org-guard.js
 * PreToolUse guard for Salesforce CLI commands.
 *
 * Policy (deck's Layer 3, scaled to one org):
 *   - A command that explicitly targets an ALLOWED org  -> allow.
 *   - A command that explicitly targets any OTHER org    -> deny.
 *   - An org-touching command with NO explicit target    -> deny (fail closed).
 *   - Everything else (non-sf, or sf utility commands)   -> allow.
 *
 * Blocking is done with exit code 2 + a reason on stderr, which Claude Code
 * enforces before the tool runs — regardless of permission mode.
 */

const ALLOWED_ORGS = ['ai-poc']; // the only org this environment may touch

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
    let payload;
    try {
        payload = JSON.parse(input || '{}');
    } catch {
        process.exit(0); // can't parse -> not our concern
    }

    if (payload.tool_name !== 'Bash') process.exit(0);
    const cmd = (payload.tool_input && payload.tool_input.command) || '';

    // Only govern Salesforce CLI commands.
    if (!/\b(sf|sfdx)\b/.test(cmd)) process.exit(0);

    const deny = (reason) => {
        console.error(`Org guard: ${reason}`);
        process.exit(2); // blocks the tool call and shows this reason to Claude
    };

    // Extract an explicitly named target org: --target-org / -o / --target-dev-hub / -v
    // (supports "flag value" and "flag=value", with optional quotes).
    const m = cmd.match(
        /(?:--target-org|--target-dev-hub|-o|-v)[=\s]+("[^"]+"|'[^']+'|\S+)/i
    );
    const target = m ? m[1].replace(/^['"]|['"]$/g, '') : null;

    if (target) {
        if (ALLOWED_ORGS.includes(target)) process.exit(0);
        return deny(
            `target org "${target}" is not permitted. Only ${ALLOWED_ORGS.join(
                ', '
            )} may be used from this environment.`
        );
    }

    // No explicit target. Fail closed on commands that actually touch an org.
    const orgTouching =
        /\b(deploy|retrieve|apex\s+run|apex\s+get|data\s+(query|import|export|upsert|create|update|delete|get|tree)|source\s+(push|pull)|org\s+(open|delete))\b/i.test(
            cmd
        );

    if (orgTouching) {
        return deny(
            `this command touches an org but names no target. Org commands must explicitly target an allowed org (e.g. --target-org ${ALLOWED_ORGS[0]}). Failing closed.`
        );
    }

    process.exit(0); // sf utility command (version / plugins / config / org list) -> allow
});
