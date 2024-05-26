#!/bin/bash

# Define the options and their corresponding variables
while getopts ":b:m:p:" opt; do
    case $opt in
        b) base_dir="$OPTARG";;
        m) manifest_dir="$OPTARG";;
        p) publicmodels_dir="$OPTARG";;
        \?) echo "Invalid option: -$OPTARG"; exit 1;;
    esac
done

# Base directories
base_dir=${base_dir:-~/.ollama/models}
manifest_dir=${manifest_dir:-$base_dir/manifests/registry.ollama.ai}
blob_dir=$base_dir/blobs
publicmodels_dir=${publicmodels_dir:-~/publicmodels/mattw/lmstudio}

# Remove all existing symbolic links from publicmodels directory
find "$publicmodels_dir" -type l -exec rm {} +

# Create publicmodels directory if it doesn't exist
mkdir -p "$publicmodels_dir/"

# Use find to get all files under the 'model' directories
find "$manifest_dir" -type f -mindepth 3 -maxdepth 3 | while IFS= read -r file; do
    user=$(basename "$(dirname "$(dirname "$file")")" | sed 's/^registry\.ollama\.ai/ollama/')
    model=$(basename "$(dirname "$file")")
    tag=$(basename "$file")

    digest=$(jq -r '.layers[] | select(.mediaType == "application/vnd.ollama.image.model") | .digest | split(":") | join("-")' "$file")

    # Create symbolic link
    ln "$blob_dir/$digest" "$publicmodels_dir/$user-$model-$tag.gguf"

    # Print the user, model, and tag
    echo "$user - $model:$tag // $digest"
done