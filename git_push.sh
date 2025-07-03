#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# This is a reliable way to get the script's directory, regardless of how it's called.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

cd "$SCRIPT_DIR"

# Check if we are in a git repository before proceeding
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Error: Not a git repository in '$SCRIPT_DIR'. Aborting."
  exit 1
fi

echo "Adding all changes to git..."
git add .

# Only commit if there are actual changes
if git diff-index --quiet HEAD --; then
    echo "No changes to commit. Working tree clean."
else
    echo "Committing with a fixed message..."
    git commit -m ":zap: [auto-push]"
fi

echo "Pushing to the remote repository..."
git push

echo "Auto-push complete!"
