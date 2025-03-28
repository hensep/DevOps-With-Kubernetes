# Exercise 3.05: Project v1.4.2
Finally, create a new workflow so that deleting a branch deletes the environment.

```
name: Delete Environment from GKE

on:
  delete:

env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-b

jobs:
  delete-environment:
    name: Delete Kubernetes Environment
    runs-on: ubuntu-latest

    steps:
    - uses: google-github-actions/auth@v2
      with:
        credentials_json: '${{ secrets.GKE_SA_KEY }}'

    - name: 'Set up Cloud SDK'
      uses: google-github-actions/setup-gcloud@v2

    - name: 'Use gcloud CLI'
      run: gcloud info

    - name: 'Get GKE credentials'
      uses: 'google-github-actions/get-gke-credentials@v2'
      with:
        cluster_name: '${{ env.GKE_CLUSTER }}'
        project_id: '${{ env.PROJECT_ID }}'
        location: '${{ env.GKE_ZONE }}'

    - name: Delete Namespace
      run: |
        BRANCH_NAME="${{ github.event.ref }}"
          echo "Deleting namespace for branch: $BRANCH_NAME"
          kubectl delete namespace "$BRANCH_NAME"
```