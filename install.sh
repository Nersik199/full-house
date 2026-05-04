#!/bin/bash

repositories=(
    "frontend|git@github.com:Koryun-V/full.git"
    "frontend-admin|git@github.com:Koryun-V/full-admin.git"
)


git pull

branch=$(git rev-parse --abbrev-ref HEAD)

for item in "${repositories[@]}"; do
    IFS="|" read -r repo url <<< "$item"

    echo "Processing $repo on branch $branch"

    if [ ! -d "$repo" ]; then
        echo "Directory $repo does not exist. Cloning..."
        git clone "$url" "$repo"
    fi

    if [ ! -d "$repo/.git" ]; then
        echo "Directory $repo is broken. Re-cloning..."
        rm -rf "$repo"
        git clone "$url" "$repo"
    fi

    cd "$repo" || exit 1

    git fetch
    git checkout "$branch"
    git pull origin "$branch"

    cd ..
done

cd ../
